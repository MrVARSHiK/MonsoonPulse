import { HistoricalScenario } from '../types';

export const HISTORICAL_SCENARIOS: HistoricalScenario[] = [
  {
    id: 'live_norm',
    year: 2026,
    title: 'Current Teleconnection State (Live Forecast)',
    subtitle: 'ENSO Neutral / Developing Weak La Niña + Moderate Positive IOD',
    description: 'Active MJO passing over Equatorial Indian Ocean (Phase 2) with robust 28-knot Findlater Low-Level Jet. Favorable early Kharif conditions.',
    indices: {
      nino34: -0.35,
      iodDmi: +0.28,
      mjoPhase: 2,
      mjoAmplitude: 1.45,
      lljSpeedKnots: 28,
      pwvMm: 52
    },
    groundTruth: {
      actualOnsetDate: 'June 09 (Forecasted Normal)',
      actualOnsetDayOfYear: 160,
      delayDays: 0,
      breakEventDescription: 'Low probability of extended dry spell in Weeks 1-2. Ideal early sowing window for Soybean and Cotton.',
      seasonRainfallPctOfLPA: 104,
      cropImpactSummary: 'Timely land preparation and regular seed treatment recommended. Good root-zone moisture anticipated.'
    },
    keyTakeaway: 'Balanced global teleconnections support a near-normal onset with low early-break risk.'
  },
  {
    id: 'year_2023_el_nino_break',
    year: 2023,
    title: '2023: Modoki El Niño & Record August Break',
    subtitle: 'Niño 3.4 (+1.4°C) | Delayed Onset + 22-Day Historic Dry Spell',
    description: 'A classic El Niño year where monsoon onset over Central Maharashtra stalled for 11 days. Later in August, an unprecedented 3-week break devastated rainfed Soybean in vegetative stage.',
    indices: {
      nino34: 1.42,
      iodDmi: -0.15,
      mjoPhase: 6, // Western Pacific (suppressed over India)
      mjoAmplitude: 1.80,
      lljSpeedKnots: 18, // Weakened Findlater jet
      pwvMm: 38 // Suppressed moisture column
    },
    groundTruth: {
      actualOnsetDate: 'June 23 (Delayed by +11 days in Vidarbha/Nashik)',
      actualOnsetDayOfYear: 174,
      delayDays: +11,
      breakEventDescription: 'Severe break spell: 23 consecutive dry days from Aug 4 to Aug 27 with 68% rainfall deficit across Central Maharashtra.',
      seasonRainfallPctOfLPA: 86,
      cropImpactSummary: 'Unwarned farmers who sowed prematurely on June 12 false showers lost 60%+ seedlings. Re-sowing costs exceeded ₹4,500/acre.'
    },
    keyTakeaway: 'MonsoonPulse successfully outputs >78% break risk and warns farmers to hold off sowing by 10-12 days.'
  },
  {
    id: 'year_2019_super_iod',
    year: 2019,
    title: '2019: Super Positive IOD (+1.15°C) Arabian Surge',
    subtitle: 'Record Positive IOD Overpowered Lingering Weak El Niño',
    description: 'One of the strongest positive Indian Ocean Dipole events on modern record. Warmer western Indian Ocean generated a phenomenal Arabian Sea moisture pipeline, triggering late surge.',
    indices: {
      nino34: 0.65,
      iodDmi: 1.15, // Historic positive IOD
      mjoPhase: 3, // East Indian Ocean active
      mjoAmplitude: 2.10,
      lljSpeedKnots: 36, // Exceptionally strong moisture jet
      pwvMm: 64 // High atmospheric moisture
    },
    groundTruth: {
      actualOnsetDate: 'June 21 (Delayed start, followed by extreme deluge)',
      actualOnsetDayOfYear: 172,
      delayDays: +9,
      breakEventDescription: 'Zero breaks after July 10; intense continuous rain spells caused waterlogging in heavy soils.',
      seasonRainfallPctOfLPA: 128,
      cropImpactSummary: 'Delayed sowing needed due to late onset, but drainage channels (Broad Bed Furrow) were vital to prevent root rot in July.'
    },
    keyTakeaway: 'Highlights the crucial role of IOD: positive DMI overrides mild El Niño suppressing effects.'
  },
  {
    id: 'year_2014_false_onset',
    year: 2014,
    title: '2014: False Onset Trap & Severe June Dry Spell',
    subtitle: 'El Niño (+0.8°C) + Negative IOD (-0.42°C) Dual Suppression',
    description: 'Monsoon made a pseudo-advance on June 10, then completely collapsed for 21 days until July 4. Millions of acres of newly germinated soybean in Marathwada & Vidarbha wilted.',
    indices: {
      nino34: 0.85,
      iodDmi: -0.42,
      mjoPhase: 5, // Maritime continent
      mjoAmplitude: 1.60,
      lljSpeedKnots: 17,
      pwvMm: 36
    },
    groundTruth: {
      actualOnsetDate: 'July 05 (False onset June 10, real sustained onset July 5)',
      actualOnsetDayOfYear: 186,
      delayDays: +23,
      breakEventDescription: 'Deadly 22-day dry spell right after initial sowing showers (June 12-July 03).',
      seasonRainfallPctOfLPA: 79,
      cropImpactSummary: 'Catastrophic seedling failure across 3.8 million hectares. Widespread farm distress due to re-sowing debt.'
    },
    keyTakeaway: 'MonsoonPulse rule engine triggers CRITICAL "DO NOT SOW" despite isolated pre-monsoon showers.'
  },
  {
    id: 'year_2020_la_nina',
    year: 2020,
    title: '2020: Robust La Niña & Early Kharif Onset',
    subtitle: 'La Niña (-1.25°C) + Active MJO Phase 2-3 Convective Pulse',
    description: 'Cooling central Pacific enhanced the monsoon trough and low-level moisture convergence. Onset arrived 4 days ahead of normal with well-spaced rainfall pulses.',
    indices: {
      nino34: -1.25,
      iodDmi: 0.18,
      mjoPhase: 2,
      mjoAmplitude: 1.75,
      lljSpeedKnots: 33,
      pwvMm: 58
    },
    groundTruth: {
      actualOnsetDate: 'June 07 (Advanced by -4 days)',
      actualOnsetDayOfYear: 158,
      delayDays: -4,
      breakEventDescription: 'Ideal 3-to-4 day rain-dry cycles; no damaging break (>7 days) recorded through July.',
      seasonRainfallPctOfLPA: 112,
      cropImpactSummary: 'Early sowing successful; bumper harvest for Soybean and Cotton in Vidarbha and Nashik.'
    },
    keyTakeaway: 'Shows how La Niña + active MJO creates an optimal window for accelerated sowing.'
  }
];
