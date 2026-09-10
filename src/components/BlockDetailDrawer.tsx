import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';
import { BlockInfo, ForecastHorizon, ProbabilisticForecast, Language } from '../types';
import { TRANSLATIONS, LOCALIZED_DISTRICTS } from '../data/translations';
import { 
  Calendar, 
  AlertCircle, 
  TrendingUp, 
  Droplet, 
  ShieldCheck, 
  Sprout, 
  ArrowRight,
  Info,
  Clock,
  Gauge
} from 'lucide-react';

interface BlockDetailDrawerProps {
  block: BlockInfo;
  forecast: ProbabilisticForecast;
  horizon: ForecastHorizon;
  onNavigateToCropAdvisory: (blockId: string) => void;
  language?: Language;
}

export const BlockDetailDrawer: React.FC<BlockDetailDrawerProps> = ({
  block,
  forecast,
  horizon,
  onNavigateToCropAdvisory,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language];
  const localizedDistrict = LOCALIZED_DISTRICTS[block.districtId]?.[language] || block.districtName;

  // Chart Data preparation
  const chartData = forecast.onsetDistribution.map(item => ({
    date: item.dateStr,
    pdf: item.probabilityDensity,
    cdf: item.cumulativeProbability,
    isNormal: item.dayOffset === 0,
    isExpected: item.dateStr === forecast.expectedOnsetDate
  }));

  const rainfallData = [
    { metric: `Dry (P10)`, rainfallMm: forecast.projectedWeeklyRainfallMm.p10, fill: '#f87171' },
    { metric: `Median (P50)`, rainfallMm: forecast.projectedWeeklyRainfallMm.p50, fill: '#38bdf8' },
    { metric: `Wet (P90)`, rainfallMm: forecast.projectedWeeklyRainfallMm.p90, fill: '#34d399' }
  ];

  return (
    <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between pb-3.5 border-b border-slate-800 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {block.name}
            </h3>
            <span className="text-xs bg-[#0F172A] text-slate-300 font-devanagari px-2 py-0.5 rounded border border-slate-700">
              {block.nameMr} / {block.nameHi}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {localizedDistrict} {t.districtLabel}, {block.state} • {block.climatology.soilType}
          </p>
          {block.climatology.dominantCrops && block.climatology.dominantCrops.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold">Crops in this Subdivision:</span>
              {block.climatology.dominantCrops.map((c, i) => (
                <span key={i} className="text-[10px] bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 px-1.5 py-0.5 rounded-md font-medium">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          id={`advise-btn-${block.id}`}
          onClick={() => onNavigateToCropAdvisory(block.id)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-950 transition"
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>{t.openCropAdvisoryBtn}: {block.name.split(' ')[0]}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Onset Prediction */}
        <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-400" /> {t.expectedOnset}
          </div>
          <div className="text-base font-bold text-white mt-1">
            {forecast.expectedOnsetDate}
          </div>
          <div className="text-[10px] font-mono mt-0.5">
            {t.onsetShift}: <span className={forecast.onsetDelayShiftDays > 0 ? 'text-amber-400 font-bold' : forecast.onsetDelayShiftDays < 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {forecast.onsetDelayShiftDays > 0 ? `+${forecast.onsetDelayShiftDays}d delay` : forecast.onsetDelayShiftDays < 0 ? `${forecast.onsetDelayShiftDays}d early` : 'Normal'}
            </span>
          </div>
        </div>

        {/* Break Risk */}
        <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" /> {t.breakMonsoonRisk}
          </div>
          <div className="text-base font-bold text-amber-400 mt-1">
            {forecast.breakRiskPct}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Category: <strong className="text-slate-200">{forecast.breakRiskCategory}</strong> (~{forecast.breakDurationExpectedDays}d spell)
          </div>
        </div>

        {/* Uncertainty Spread */}
        <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" /> &plusmn;{forecast.onsetConfidenceIntervalDays}d ({t.horizonLabel})
          </div>
          <div className="text-base font-bold text-indigo-300 mt-1 font-mono">
            &plusmn;{forecast.onsetConfidenceIntervalDays} days
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Wk {horizon} Lead-Time Funnel
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-emerald-400" /> {t.modelConfidence}
          </div>
          <div className="text-base font-bold text-emerald-400 mt-1">
            {forecast.modelConfidenceScorePct}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Bayesian Ensemble Score
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Onset Probability Density Curve */}
        <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Probabilistic Onset PDF Curve</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Normal: {block.climatology.normalOnsetDate}</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  labelStyle={{ color: '#a5b4fc', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="pdf" 
                  name="Onset Likelihood Density (%)" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#probGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Cumulative Onset Likelihood: <strong className="text-indigo-300">{forecast.onsetProbabilityPct}%</strong></span>
            <span>Uncertainty Half-Width: &plusmn;{forecast.onsetConfidenceIntervalDays}d</span>
          </div>
        </div>

        {/* 7-Day Rainfall Probabilistic Plumes */}
        <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Projected Weekly Rainfall (P10 / P50 / P90)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Week {horizon} Horizon</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" unit="mm" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="metric" stroke="#64748b" tick={{ fontSize: 10 }} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [`${val} mm`, 'Rainfall']}
                />
                <Bar dataKey="rainfallMm" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Soil Water Capacity: <strong className="text-slate-300">{block.climatology.waterHoldingCapacityMm} mm</strong></span>
            <span>Deficit: <strong className="text-rose-400">{forecast.soilMoistureDeficitPct}%</strong></span>
          </div>
        </div>
      </div>

      {/* Teleconnection Downscaling Breakdown Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5">
        <div className="text-xs font-bold text-slate-200 mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Teleconnection Attributions for {block.name} (Explainability Factors)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {forecast.teleconnectionDrivers.map((driver, idx) => (
            <div 
              key={idx} 
              className={`p-2.5 rounded-lg border ${
                driver.direction === 'favorable'
                  ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                  : driver.direction === 'unfavorable'
                    ? 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
              }`}
            >
              <div className="font-semibold flex items-center justify-between">
                <span>{driver.factor}</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-900/60 border border-slate-700">
                  {driver.direction}
                </span>
              </div>
              <p className="text-[11px] text-slate-300/90 mt-1">
                {driver.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
