import { BlockInfo, ClimateIndices, ForecastHorizon, ProbabilisticForecast } from '../types';

/**
 * Helper to compute standard Gaussian CDF approximation (Abramowitz and Stegun)
 */
function normalCDF(x: number, mean: number, stdDev: number): number {
  const z = (x - mean) / stdDev;
  if (z < -8) return 0;
  if (z > 8) return 1;
  
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (z >= 0) {
    const t = 1.0 / (1.0 + p * z);
    return 1.0 - c * Math.exp(-z * z / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * z);
    return c * Math.exp(-z * z / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

/**
 * Normal PDF
 */
function normalPDF(x: number, mean: number, stdDev: number): number {
  const factor = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exp = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  return factor * exp;
}

/**
 * Convert Day of Year (approx for June 1 = 152 in non-leap or 153) to formatted date string
 */
export function dayOfYearToDateStr(doy: number): string {
  // Simple mapping for June/July (June has 30 days, DOY 152 = June 01)
  if (doy <= 151) {
    const day = Math.max(1, 31 - (151 - doy));
    return `May ${day < 10 ? '0' + day : day}`;
  } else if (doy <= 181) {
    const day = doy - 151;
    return `June ${day < 10 ? '0' + day : day}`;
  } else if (doy <= 212) {
    const day = doy - 181;
    return `July ${day < 10 ? '0' + day : day}`;
  } else {
    const day = doy - 212;
    return `August ${day < 10 ? '0' + day : day}`;
  }
}

/**
 * Core Hybrid Statistical + Downscaled Prediction Model
 */
export function calculateProbabilisticForecast(
  block: BlockInfo,
  indices: ClimateIndices,
  horizon: ForecastHorizon = 1
): ProbabilisticForecast {
  const { climatology } = block;

  // 1. ENSO Influence (Niño 3.4 anomaly)
  // Documented physical relationship: Warm anomaly (>0.5°C) suppresses Indian monsoon trough; cooling (La Niña) enhances.
  let ensoShiftDays = 0;
  let ensoBreakRiskDelta = 0;
  if (indices.nino34 > 0) {
    ensoShiftDays = indices.nino34 * 4.8; // e.g. +1.5C -> +7.2 days delay
    ensoBreakRiskDelta = indices.nino34 * 16; // +24% break risk
  } else {
    ensoShiftDays = indices.nino34 * 2.8; // e.g. -1.0C -> -2.8 days earlier
    ensoBreakRiskDelta = indices.nino34 * 10; // -10% break risk
  }

  // 2. IOD Influence (Dipole Mode Index)
  // Positive IOD accelerates Arabian Sea moisture flux; negative IOD enhances Maritime Continent convection at India's expense.
  const iodShiftDays = -indices.iodDmi * 4.2; // +1.0 DMI -> -4.2 days earlier onset
  const iodBreakRiskDelta = -indices.iodDmi * 15; // +1.0 DMI -> -15% break risk

  // 3. MJO Influence (Phase 1-8 + Amplitude)
  // Phases 2 & 3: Indian Ocean convective center (favorable for onset and bursts)
  // Phases 5, 6: Maritime continent / Pacific convective center (suppresses Indian monsoon)
  let mjoShiftDays = 0;
  let mjoBreakRiskDelta = 0;
  let mjoHeavyRainDelta = 0;

  const amp = Math.max(0.2, Math.min(3.0, indices.mjoAmplitude));
  if (indices.mjoPhase === 2 || indices.mjoPhase === 3) {
    mjoShiftDays = -2.8 * amp;
    mjoBreakRiskDelta = -14 * amp;
    mjoHeavyRainDelta = 18 * amp;
  } else if (indices.mjoPhase === 1) {
    mjoShiftDays = -1.0 * amp;
    mjoBreakRiskDelta = -5 * amp;
    mjoHeavyRainDelta = 8 * amp;
  } else if (indices.mjoPhase === 4) {
    mjoShiftDays = 1.5 * amp;
    mjoBreakRiskDelta = 8 * amp;
    mjoHeavyRainDelta = -4 * amp;
  } else if (indices.mjoPhase === 5 || indices.mjoPhase === 6) {
    mjoShiftDays = 3.6 * amp;
    mjoBreakRiskDelta = 18 * amp;
    mjoHeavyRainDelta = -12 * amp;
  } else {
    // Phases 7, 8
    mjoShiftDays = 1.0 * amp;
    mjoBreakRiskDelta = 4 * amp;
    mjoHeavyRainDelta = 0;
  }

  // 4. Regional Atmospheric Downscaling (Findlater Jet + PWV)
  // Normal LLJ is ~28 knots; normal PWV is ~52 mm.
  const lljAnomaly = indices.lljSpeedKnots - 28; // -13 to +17
  const pwvAnomaly = indices.pwvMm - 52; // -22 to +23

  const atmosphericShiftDays = -(lljAnomaly * 0.18 + pwvAnomaly * 0.14);
  const atmosphericBreakRiskDelta = -(lljAnomaly * 0.7 + pwvAnomaly * 0.6);
  const atmosphericHeavyRainDelta = (lljAnomaly * 0.9 + pwvAnomaly * 0.85);

  // 5. Total Combined Onset Shift & Uncertainty Spread
  const totalShiftDays = ensoShiftDays + iodShiftDays + mjoShiftDays + atmosphericShiftDays;
  const expectedOnsetDOY = Math.round(climatology.normalOnsetDayOfYear + totalShiftDays);
  const expectedOnsetDate = dayOfYearToDateStr(expectedOnsetDOY);

  // Uncertainty funnel expands with forecast lead-time horizon
  // Week 1 (7-day): ~1.0x stdDev, Week 4 (28-day): ~1.65x stdDev
  const horizonUncertaintyMultiplier = Math.sqrt(1 + 0.32 * (horizon - 1));
  const effectiveStdDev = climatology.stdDevDays * horizonUncertaintyMultiplier;
  const confidenceSpreadDays = Math.round(effectiveStdDev * 1.645 * 10) / 10; // 90% confidence interval half-width

  // 6. Cumulative Onset Probability for current simulation window (assuming current reference is around June 12 / DOY 163)
  const referenceSimulationDay = 163;
  const onsetProbCumulative = Math.round(normalCDF(referenceSimulationDay + (horizon - 1) * 7, expectedOnsetDOY, effectiveStdDev) * 100);

  // 7. Probability Density Curve for Visualization (-15 to +20 days around normal onset)
  const onsetDistribution = [];
  const startDay = climatology.normalOnsetDayOfYear - 14;
  const endDay = climatology.normalOnsetDayOfYear + 22;

  for (let d = startDay; d <= endDay; d += 2) {
    const pdf = normalPDF(d, expectedOnsetDOY, effectiveStdDev);
    const cdf = normalCDF(d, expectedOnsetDOY, effectiveStdDev);
    onsetDistribution.push({
      dayOffset: d - climatology.normalOnsetDayOfYear,
      dateStr: dayOfYearToDateStr(d),
      probabilityDensity: Math.round(pdf * 1000) / 10, // scaled %
      cumulativeProbability: Math.round(cdf * 100)
    });
  }

  // 8. Break-Monsoon Risk (5+ consecutive dry days during Kharif)
  const horizonBreakDecay = (horizon - 1) * 3.5; // Lead-time dispersion
  let rawBreakRisk = climatology.historicalBreakProbabilityPct 
    + ensoBreakRiskDelta 
    + iodBreakRiskDelta 
    + mjoBreakRiskDelta 
    + atmosphericBreakRiskDelta
    + horizonBreakDecay;

  const breakRiskPct = Math.max(5, Math.min(95, Math.round(rawBreakRisk)));
  
  let breakRiskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' = 'LOW';
  if (breakRiskPct >= 65) breakRiskCategory = 'SEVERE';
  else if (breakRiskPct >= 45) breakRiskCategory = 'HIGH';
  else if (breakRiskPct >= 25) breakRiskCategory = 'MODERATE';

  // Expected dry spell duration
  const breakDurationExpectedDays = breakRiskPct > 60 
    ? Math.round(7 + (breakRiskPct - 60) * 0.25)
    : breakRiskPct > 35 
      ? Math.round(4 + (breakRiskPct - 35) * 0.12)
      : 2;

  // 9. Heavy Rainfall Hazard (>65 mm/day or 115mm/week)
  const baseHeavyRainProb = climatology.annualRainfallMm > 800 ? 24 : 14;
  let rawHeavyRainRisk = baseHeavyRainProb + mjoHeavyRainDelta + atmosphericHeavyRainDelta - (ensoBreakRiskDelta * 0.3);
  const heavyRainRiskPct = Math.max(4, Math.min(92, Math.round(rawHeavyRainRisk)));
  
  let heavyRainCategory: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  if (heavyRainRiskPct >= 50) heavyRainCategory = 'HIGH';
  else if (heavyRainRiskPct >= 28) heavyRainCategory = 'MODERATE';

  // 10. Weekly Rainfall Projection Plumes (P10, P50, P90)
  const baselineWeeklyMean = climatology.kharifRainfallMm / 16; // ~30 to 55 mm/week
  const climateModulation = 1.0 - (totalShiftDays / 25) + (indices.iodDmi * 0.2) + (lljAnomaly * 0.015);
  const adjustedMean = Math.max(8, baselineWeeklyMean * Math.max(0.3, climateModulation));

  const p50 = Math.round(adjustedMean * (1 - (breakRiskPct - 30) * 0.007));
  const p10 = Math.max(0, Math.round(p50 * (0.35 - (breakRiskPct / 300))));
  const p90 = Math.round(p50 * (1.85 + (heavyRainRiskPct / 100)));

  // 11. Soil Moisture Deficit
  const normalStorage = climatology.waterHoldingCapacityMm;
  const estimatedRainInfiltration = p50 * 0.75;
  const deficitMm = Math.max(0, normalStorage * 0.65 - estimatedRainInfiltration);
  const soilMoistureDeficitPct = Math.min(98, Math.max(4, Math.round((deficitMm / normalStorage) * 100)));

  // 12. Teleconnection Driver Explanations
  const teleconnectionDrivers = [
    {
      factor: 'ENSO (Niño 3.4)',
      impact: indices.nino34 > 0.5 
        ? `El Niño (+${indices.nino34.toFixed(2)}°C) suppresses monsoon trough, delaying onset by ~${ensoShiftDays.toFixed(1)}d & raising break risk +${Math.round(ensoBreakRiskDelta)}%`
        : indices.nino34 < -0.5 
          ? `La Niña (${indices.nino34.toFixed(2)}°C) accelerates tropical easterly wave flux, advancing onset by ${Math.abs(ensoShiftDays).toFixed(1)}d`
          : 'Neutral ENSO conditions with minimal anomalous Pacific damping',
      weight: Math.round(indices.nino34 * 35) / 100,
      direction: (indices.nino34 > 0.4 ? 'unfavorable' : indices.nino34 < -0.4 ? 'favorable' : 'neutral') as 'favorable' | 'unfavorable' | 'neutral'
    },
    {
      factor: 'Indian Ocean Dipole (IOD)',
      impact: indices.iodDmi > 0.3 
        ? `Positive IOD (+${indices.iodDmi.toFixed(2)}°C) bolsters Arabian Sea cross-equatorial moisture flux by ~${Math.abs(iodShiftDays).toFixed(1)}d`
        : indices.iodDmi < -0.3 
          ? `Negative IOD (${indices.iodDmi.toFixed(2)}°C) steers convective moisture east towards Indonesia, intensifying dry spells`
          : 'Neutral IOD mode with standard zonal sea-surface gradient',
      weight: Math.round(indices.iodDmi * 40) / 100,
      direction: (indices.iodDmi > 0.25 ? 'favorable' : indices.iodDmi < -0.25 ? 'unfavorable' : 'neutral') as 'favorable' | 'unfavorable' | 'neutral'
    },
    {
      factor: `MJO (Phase ${indices.mjoPhase}, Amp ${indices.mjoAmplitude.toFixed(1)})`,
      impact: (indices.mjoPhase === 2 || indices.mjoPhase === 3)
        ? `Active MJO over Equatorial Indian Ocean promotes deep convective cloud clusters and monsoon onset surges`
        : (indices.mjoPhase === 5 || indices.mjoPhase === 6)
          ? `MJO centered over Western Pacific induces dry subsidence and suppresses regional rainfall over Central India`
          : `Moderate tropical wave propagation in phase ${indices.mjoPhase}`,
      weight: (indices.mjoPhase === 2 || indices.mjoPhase === 3) ? 0.45 : (indices.mjoPhase === 5 || indices.mjoPhase === 6) ? -0.45 : 0.05,
      direction: ((indices.mjoPhase === 2 || indices.mjoPhase === 3) ? 'favorable' : (indices.mjoPhase === 5 || indices.mjoPhase === 6) ? 'unfavorable' : 'neutral') as 'favorable' | 'unfavorable' | 'neutral'
    },
    {
      factor: 'Tropospheric Jet & Moisture',
      impact: `850 hPa Findlater Jet at ${indices.lljSpeedKnots} knots with ${indices.pwvMm} mm PWV ${indices.pwvMm > 48 ? 'guarantees robust moisture supply' : 'indicates shallow dry-air capping'}`,
      weight: Math.round((indices.pwvMm - 50) * 1.5) / 100,
      direction: (indices.pwvMm > 48 && indices.lljSpeedKnots >= 24 ? 'favorable' : 'unfavorable') as 'favorable' | 'unfavorable' | 'neutral'
    }
  ];

  // 13. Model Confidence Score
  const baseConfidence = 96;
  const leadPenalty = (horizon - 1) * 9;
  const extremeIndexPenalty = Math.abs(indices.nino34) > 1.5 ? 6 : 0;
  const modelConfidenceScorePct = Math.max(54, Math.round(baseConfidence - leadPenalty - extremeIndexPenalty));

  return {
    blockId: block.id,
    horizonWeeks: horizon,
    expectedOnsetDate,
    expectedOnsetDayOfYear: expectedOnsetDOY,
    onsetProbabilityPct: onsetProbCumulative,
    onsetDelayShiftDays: Math.round(totalShiftDays * 10) / 10,
    onsetConfidenceIntervalDays: confidenceSpreadDays,
    onsetDistribution,
    breakRiskPct,
    breakRiskCategory,
    breakDurationExpectedDays,
    heavyRainRiskPct,
    heavyRainCategory,
    projectedWeeklyRainfallMm: { p10, p50, p90 },
    soilMoistureDeficitPct,
    teleconnectionDrivers,
    modelConfidenceScorePct
  };
}
