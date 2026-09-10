import React from 'react';
import { 
  Activity, 
  Wind, 
  Droplets, 
  Globe2, 
  Compass, 
  Sliders, 
  RotateCcw,
  Info,
  ChevronRight
} from 'lucide-react';
import { ClimateIndices, HistoricalScenario } from '../types';
import { HISTORICAL_SCENARIOS } from '../data/historicalScenarios';

interface TeleconnectionPanelProps {
  indices: ClimateIndices;
  setIndices: React.Dispatch<React.SetStateAction<ClimateIndices>>;
  selectedScenario: HistoricalScenario;
  onSelectScenario: (scenario: HistoricalScenario) => void;
}

export const TeleconnectionPanel: React.FC<TeleconnectionPanelProps> = ({
  indices,
  setIndices,
  selectedScenario,
  onSelectScenario
}) => {
  const handleIndexChange = (key: keyof ClimateIndices, val: number) => {
    setIndices(prev => ({ ...prev, [key]: val }));
  };

  const resetToNormal = () => {
    const defaultScenario = HISTORICAL_SCENARIOS[0];
    onSelectScenario(defaultScenario);
  };

  // Determine ENSO state
  const ensoState = indices.nino34 >= 0.5 
    ? { label: 'El Niño (Active Warming)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' }
    : indices.nino34 <= -0.5 
      ? { label: 'La Niña (Active Cooling)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
      : { label: 'ENSO Neutral', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' };

  // Determine IOD state
  const iodState = indices.iodDmi >= 0.3 
    ? { label: 'Positive IOD (+DMI)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
    : indices.iodDmi <= -0.3 
      ? { label: 'Negative IOD (-DMI)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' }
      : { label: 'Neutral IOD', color: 'text-slate-300', bg: 'bg-slate-800/80 border-slate-700' };

  // Determine MJO state
  const mjoState = (indices.mjoPhase === 2 || indices.mjoPhase === 3)
    ? { label: 'Phase 2-3 (Equatorial Indian Ocean - Favorable)', color: 'text-emerald-400' }
    : (indices.mjoPhase === 5 || indices.mjoPhase === 6)
      ? { label: 'Phase 5-6 (West Pacific - Suppressive)', color: 'text-amber-400' }
      : { label: `Phase ${indices.mjoPhase} (Neutral/Transitional)`, color: 'text-slate-300' };

  return (
    <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Global Climate Teleconnections
            </h2>
            <p className="text-xs text-slate-400">
              Live atmospheric teleconnections feeding the hybrid Bayesian downscaling model
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="reset-indices-btn"
            onClick={resetToNormal}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            title="Reset to climatological baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" /> Baseline Climatology
          </button>
        </div>
      </div>

      {/* Scenario Quick Selector Cards */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-indigo-400" /> Historical Benchmark & Stress Scenarios:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {HISTORICAL_SCENARIOS.map(scenario => {
            const isSelected = selectedScenario.id === scenario.id;
            return (
              <button
                key={scenario.id}
                id={`scenario-btn-${scenario.id}`}
                onClick={() => onSelectScenario(scenario)}
                className={`text-left p-2.5 rounded-xl border transition text-xs flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-md ring-1 ring-indigo-500/40' 
                    : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-200 truncate">{scenario.year}: {scenario.title.split(':')[1] || scenario.title}</div>
                <div className="text-[10px] text-slate-400 truncate mt-1">{scenario.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Teleconnection Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0F172A] p-4 rounded-xl border border-slate-800">
        
        {/* 1. ENSO (Niño 3.4) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span>ENSO (Niño 3.4 SST)</span>
            </label>
            <span className={`text-xs font-mono font-bold ${indices.nino34 > 0 ? 'text-amber-400' : indices.nino34 < 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
              {indices.nino34 > 0 ? `+${indices.nino34.toFixed(2)}` : indices.nino34.toFixed(2)} °C
            </span>
          </div>

          <input
            id="slider-nino34"
            type="range"
            min="-2.5"
            max="2.5"
            step="0.05"
            value={indices.nino34}
            onChange={(e) => handleIndexChange('nino34', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-2.5°C (La Niña)</span>
            <span>0.0°C</span>
            <span>+2.5°C (El Niño)</span>
          </div>

          <div className={`text-[11px] px-2 py-1 rounded border ${ensoState.bg} ${ensoState.color} font-medium`}>
            {ensoState.label}
          </div>
        </div>

        {/* 2. IOD (Dipole Mode Index) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Indian Ocean Dipole (DMI)</span>
            </label>
            <span className={`text-xs font-mono font-bold ${indices.iodDmi > 0 ? 'text-emerald-400' : indices.iodDmi < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {indices.iodDmi > 0 ? `+${indices.iodDmi.toFixed(2)}` : indices.iodDmi.toFixed(2)} °C
            </span>
          </div>

          <input
            id="slider-iod-dmi"
            type="range"
            min="-1.2"
            max="1.5"
            step="0.05"
            value={indices.iodDmi}
            onChange={(e) => handleIndexChange('iodDmi', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-1.2°C (-IOD)</span>
            <span>0.0°C</span>
            <span>+1.5°C (+IOD)</span>
          </div>

          <div className={`text-[11px] px-2 py-1 rounded border ${iodState.bg} ${iodState.color} font-medium`}>
            {iodState.label}
          </div>
        </div>

        {/* 3. MJO Phase & Amplitude */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>MJO Phase & Amplitude</span>
            </label>
            <span className="text-xs font-mono text-indigo-300 font-bold">
              Ph {indices.mjoPhase} | {indices.mjoAmplitude.toFixed(1)} A
            </span>
          </div>

          {/* MJO Phase Pills */}
          <div className="grid grid-cols-8 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(phase => {
              const isSelected = indices.mjoPhase === phase;
              const isFav = phase === 2 || phase === 3;
              return (
                <button
                  key={phase}
                  id={`mjo-phase-btn-${phase}`}
                  onClick={() => handleIndexChange('mjoPhase', phase)}
                  className={`py-1 text-[11px] font-mono rounded font-bold transition ${
                    isSelected 
                      ? isFav ? 'bg-emerald-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md'
                      : isFav ? 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                  title={isFav ? 'Phase 2-3: Favorable Indian Ocean' : `Phase ${phase}`}
                >
                  {phase}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">Amp:</span>
            <input
              id="slider-mjo-amplitude"
              type="range"
              min="0.2"
              max="2.8"
              step="0.1"
              value={indices.mjoAmplitude}
              onChange={(e) => handleIndexChange('mjoAmplitude', parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          <div className="text-[11px] px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 font-medium truncate">
            <span className={mjoState.color}>{mjoState.label}</span>
          </div>
        </div>

        {/* 4. Tropospheric Low Level Jet & PWV */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-indigo-400" />
              <span>850 hPa Jet & PWV</span>
            </label>
            <span className="text-xs font-mono text-indigo-300 font-bold">
              {indices.lljSpeedKnots} kts | {indices.pwvMm} mm
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-8">Jet:</span>
              <input
                id="slider-llj-speed"
                type="range"
                min="15"
                max="45"
                step="1"
                value={indices.lljSpeedKnots}
                onChange={(e) => handleIndexChange('lljSpeedKnots', parseInt(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none accent-indigo-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-8">PWV:</span>
              <input
                id="slider-pwv-mm"
                type="range"
                min="30"
                max="70"
                step="1"
                value={indices.pwvMm}
                onChange={(e) => handleIndexChange('pwvMm', parseInt(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none accent-indigo-400"
              />
            </div>
          </div>

          <div className="text-[11px] px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 font-medium truncate">
            {indices.lljSpeedKnots >= 28 && indices.pwvMm >= 50 
              ? '🟢 Strong Arabian Sea moisture flux' 
              : '🟡 Sub-optimal tropospheric moisture'}
          </div>
        </div>

      </div>

      {/* Explainer Callout */}
      <div className="mt-3.5 bg-[#0F172A] border border-indigo-900/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-200">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-indigo-300">Downscaling Mechanism: </span>
          <span className="text-slate-300">
            {selectedScenario.description} The hybrid engine downscales these global circulation anomalies onto block-level historical climatology (<span className="font-mono text-indigo-300">Priors</span>) using empirical Bayesian Gaussian distributions.
          </span>
        </div>
      </div>
    </div>
  );
};
