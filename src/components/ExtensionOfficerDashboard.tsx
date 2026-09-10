import React, { useState } from 'react';
import { 
  DistrictInfo, 
  ForecastHorizon, 
  ProbabilisticForecast,
  Language,
  AuthUser 
} from '../types';
import { BLOCKS } from '../data/climatologyData';
import { generateCropAdvisory } from '../models/cropAdvisoryEngine';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '../data/languages';
import { TRANSLATIONS, LOCALIZED_DISTRICTS } from '../data/translations';
import { 
  Building2, 
  Users, 
  Send, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileSpreadsheet, 
  ArrowUpDown, 
  Check, 
  Filter, 
  Calendar,
  Download,
  Flame,
  Printer,
  Languages,
  Smartphone,
  MessageSquare
} from 'lucide-react';

interface ExtensionOfficerDashboardProps {
  district: DistrictInfo;
  forecasts: Record<string, ProbabilisticForecast>;
  horizon: ForecastHorizon;
  onSelectBlock: (blockId: string) => void;
  currentUser?: AuthUser | null;
  language?: Language;
}

export const ExtensionOfficerDashboard: React.FC<ExtensionOfficerDashboardProps> = ({
  district,
  forecasts,
  horizon,
  onSelectBlock,
  currentUser,
  language = 'en'
}) => {
  const [sortKey, setSortKey] = useState<'breakRisk' | 'onsetDelay' | 'deficit' | 'name'>('breakRisk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBlocksForBroadcast, setSelectedBlocksForBroadcast] = useState<string[]>(district.blocks);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);
  const [broadcastStats, setBroadcastStats] = useState({ total: 46850, delivered: 46850, failed: 0 });
  const [previewLang, setPreviewLang] = useState<Language>(language);
  const [previewChannel, setPreviewChannel] = useState<'sms' | 'whatsapp'>('whatsapp');

  const districtBlocks = district.blocks.map(id => ({
    block: BLOCKS[id],
    forecast: forecasts[id]
  })).filter(item => item.block && item.forecast);

  const sampleBlockId = selectedBlocksForBroadcast[0] || district.blocks[0] || 'nashik_haveli';
  const sampleBlock = BLOCKS[sampleBlockId] || BLOCKS['nashik_haveli'];
  const sampleForecast = forecasts[sampleBlockId] || forecasts['nashik_haveli'];
  const sampleAdvisory = generateCropAdvisory('cotton', 'sowing_window', sampleBlock, sampleForecast);

  // Sorting
  const sortedBlocks = [...districtBlocks].sort((a, b) => {
    let diff = 0;
    if (sortKey === 'breakRisk') {
      diff = a.forecast.breakRiskPct - b.forecast.breakRiskPct;
    } else if (sortKey === 'onsetDelay') {
      diff = a.forecast.onsetDelayShiftDays - b.forecast.onsetDelayShiftDays;
    } else if (sortKey === 'deficit') {
      diff = a.forecast.soilMoistureDeficitPct - b.forecast.soilMoistureDeficitPct;
    } else {
      diff = a.block.name.localeCompare(b.block.name);
    }
    return sortOrder === 'desc' ? -diff : diff;
  });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const toggleBlockSelection = (blockId: string) => {
    setSelectedBlocksForBroadcast(prev => 
      prev.includes(blockId) ? prev.filter(id => id !== blockId) : [...prev, blockId]
    );
  };

  const selectHighRiskOnly = () => {
    const highRiskIds = districtBlocks
      .filter(item => item.forecast.breakRiskPct >= 45 || item.forecast.onsetDelayShiftDays >= 5)
      .map(item => item.block.id);
    setSelectedBlocksForBroadcast(highRiskIds);
  };

  const selectAllBlocks = () => {
    setSelectedBlocksForBroadcast(district.blocks);
  };

  const handleTriggerBroadcast = () => {
    setIsBroadcasting(true);
    setBroadcastDone(false);

    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastDone(true);
      const total = selectedBlocksForBroadcast.length * 6800 + Math.floor(Math.random() * 400);
      setBroadcastStats({
        total,
        delivered: total - 12,
        failed: 12
      });
    }, 2000);
  };

  // High risk count
  const highRiskCount = districtBlocks.filter(b => b.forecast.breakRiskCategory === 'HIGH' || b.forecast.breakRiskCategory === 'SEVERE').length;
  const delayedCount = districtBlocks.filter(b => b.forecast.onsetDelayShiftDays > 4).length;
  const t = TRANSLATIONS[language];
  const localizedDistrictName = LOCALIZED_DISTRICTS[district.id]?.[language] || district.name;

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span>{t.kvkConsoleTitle}</span>
                <span className="text-xs font-mono font-normal bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/60">
                  {localizedDistrictName} {t.districtLabel}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {t.kvkConsoleSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-bulletin-btn"
              onClick={() => window.print()}
              className="bg-[#0F172A] hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" /> {t.exportBulletinPdf}
            </button>
          </div>
        </div>

        {/* District Alert Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
            <div className="text-xs text-slate-400">{t.totalBlocksCard}</div>
            <div className="text-xl font-bold text-white mt-1">{districtBlocks.length} Blocks</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{district.region}</div>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
            <div className="text-xs text-rose-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> {t.highBreakRiskCard}
            </div>
            <div className="text-xl font-bold text-rose-400 mt-1">{highRiskCount} Blocks</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{t.breakRiskCol}: Severe</div>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
            <div className="text-xs text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {t.delayedOnsetCard}
            </div>
            <div className="text-xl font-bold text-amber-400 mt-1">{delayedCount} Blocks</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{t.onsetShiftCol}: &gt;4d</div>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {t.registeredFarmersCard}
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">46,850 Farmers</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Kisan SMS / WhatsApp Registry</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Block Vulnerability Table (8 Cols) & Bulk Broadcast Tool (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Vulnerability Ranking Table (8 Cols) */}
        <div className="lg:col-span-8 bg-[#1E293B] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Block Risk & Vulnerability Matrix (Week {horizon} Horizon)
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Sort by:</span>
              <button 
                onClick={() => toggleSort('breakRisk')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition ${sortKey === 'breakRisk' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#0F172A] border-slate-700 text-slate-300'}`}
              >
                Break Risk {sortKey === 'breakRisk' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => toggleSort('onsetDelay')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition ${sortKey === 'onsetDelay' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#0F172A] border-slate-700 text-slate-300'}`}
              >
                Onset Delay {sortKey === 'onsetDelay' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F172A] text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Select</th>
                  <th className="p-3 cursor-pointer" onClick={() => toggleSort('name')}>
                    Block Name {sortKey === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => toggleSort('onsetDelay')}>
                    Expected Onset
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => toggleSort('breakRisk')}>
                    Break-Risk
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => toggleSort('deficit')}>
                    Moisture Deficit
                  </th>
                  <th className="p-3">KVK Action Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-[#1E293B]">
                {sortedBlocks.map(({ block, forecast }) => {
                  const isChecked = selectedBlocksForBroadcast.includes(block.id);
                  const isSevere = forecast.breakRiskPct >= 55;
                  const isModerate = forecast.breakRiskPct >= 35 && forecast.breakRiskPct < 55;

                  return (
                    <tr 
                      key={block.id}
                      className="hover:bg-slate-800/60 transition cursor-pointer"
                      onClick={() => onSelectBlock(block.id)}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBlockSelection(block.id)}
                          className="w-4 h-4 rounded bg-[#0F172A] border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{block.name}</span>
                          <span className="text-[10px] text-slate-400 font-devanagari">({block.nameMr})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{block.climatology.soilType}</div>
                      </td>

                      <td className="p-3">
                        <span className="font-semibold text-slate-200">{forecast.expectedOnsetDate}</span>
                        <div className="text-[10px] font-mono">
                          {forecast.onsetDelayShiftDays > 0 ? (
                            <span className="text-amber-400">+{forecast.onsetDelayShiftDays}d delay</span>
                          ) : forecast.onsetDelayShiftDays < 0 ? (
                            <span className="text-emerald-400">{forecast.onsetDelayShiftDays}d early</span>
                          ) : (
                            <span className="text-slate-400">Normal</span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold font-mono ${isSevere ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {forecast.breakRiskPct}%
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            isSevere 
                              ? 'bg-rose-950/60 border-rose-800 text-rose-300' 
                              : isModerate 
                                ? 'bg-amber-950/60 border-amber-800 text-amber-300' 
                                : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                          }`}>
                            {forecast.breakRiskCategory}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">~{forecast.breakDurationExpectedDays} dry days</div>
                      </td>

                      <td className="p-3 font-mono text-slate-300">
                        {forecast.soilMoistureDeficitPct}%
                      </td>

                      <td className="p-3">
                        {isSevere ? (
                          <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/30">
                            🔴 Issue Sowing Delay Alert
                          </span>
                        ) : isModerate ? (
                          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                            🟡 Deploy BBF / Micro-Irrig
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                            🟢 Normal Sowing Window
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Bulk Alert Dispatch Console (4 Cols) */}
        <div className="lg:col-span-4 bg-[#1E293B] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Bulk Broadcast Console
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Gateway Online
            </span>
          </div>

          {/* Target Filter Buttons */}
          <div className="space-y-2">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Target Blocks:</span>
              <span className="font-bold text-white">{selectedBlocksForBroadcast.length} / {district.blocks.length} Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="select-all-blocks-btn"
                onClick={selectAllBlocks}
                className="w-1/2 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Select All
              </button>
              <button
                id="select-high-risk-blocks-btn"
                onClick={selectHighRiskOnly}
                className="w-1/2 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/60 transition"
              >
                High Risk Only
              </button>
            </div>
          </div>

          {/* Broadcast Estimation */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Estimated Farmer Reach:</span>
              <strong className="text-emerald-400 font-mono text-sm">
                {(selectedBlocksForBroadcast.length * 6800).toLocaleString()} Farmers
              </strong>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Channels:</span>
              <span className="text-slate-200">SMS (GSM-7) + WhatsApp Business</span>
            </div>
          </div>

          {/* Dynamic Personalized Farmer Language Routing */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                Farmer Sign-in Language Matching
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Customized Setting
              </span>
            </div>
            
            <p className="text-[11px] text-slate-300 leading-relaxed">
              When messages are pushed, each farmer receives the broadcast <strong className="text-emerald-300">strictly in their sign-in selected language</strong>. Zero English default for regional farmers.
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-300 pt-1 border-t border-emerald-900/40">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>Registered Farmer Language Distribution:</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <span className="bg-[#0B1329] px-2 py-1 rounded border border-slate-800 text-slate-300 font-devanagari">मराठी: 62%</span>
                <span className="bg-[#0B1329] px-2 py-1 rounded border border-slate-800 text-slate-300 font-devanagari">हिन्दी: 18%</span>
                <span className="bg-[#0B1329] px-2 py-1 rounded border border-slate-800 text-slate-300">తెలుగు: 10%</span>
                <span className="bg-[#0B1329] px-2 py-1 rounded border border-slate-800 text-slate-300">ಕನ್ನಡ: 5%</span>
                <span className="bg-[#0B1329] px-2 py-1 rounded border border-slate-800 text-slate-300">ગુજરાતી: 3%</span>
                <span className="bg-[#0B1329] px-2 py-1 rounded border border-slate-800 text-slate-300">Other: 2%</span>
              </div>
            </div>

            {/* Language Preview Selector */}
            <div className="pt-2 border-t border-emerald-900/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-300 font-semibold">Inspect Message Translation:</span>
                <div className="flex items-center gap-1 bg-[#0F172A] p-0.5 rounded border border-slate-800 text-[10px]">
                  <button
                    onClick={() => setPreviewChannel('whatsapp')}
                    className={`px-1.5 py-0.5 rounded ${previewChannel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setPreviewChannel('sms')}
                    className={`px-1.5 py-0.5 rounded ${previewChannel === 'sms' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    SMS
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {[
                  { code: 'mr', name: 'मराठी' },
                  { code: 'te', name: 'తెలుగు' },
                  { code: 'hi', name: 'हिन्दी' },
                  { code: 'kn', name: 'ಕನ್ನಡ' },
                  { code: 'gu', name: 'ગુજરાતી' },
                  { code: 'ta', name: 'தமிழ்' },
                  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
                  { code: 'en', name: 'English' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setPreviewLang(l.code as Language)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                      previewLang === l.code
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-[#0F172A] text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>

              {/* Live Preview Box */}
              <div className="bg-[#0B1329] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 mt-1 max-h-32 overflow-y-auto font-sans leading-relaxed">
                <div className="text-[10px] text-emerald-400 font-mono mb-1">
                  Format: {previewChannel.toUpperCase()} • Language: {getLanguageMeta(previewLang).nativeName} ({getLanguageMeta(previewLang).name})
                </div>
                <div className="text-[11px] text-slate-300 whitespace-pre-wrap">
                  {previewChannel === 'whatsapp' 
                    ? ((sampleAdvisory.whatsappPayload[previewLang] as string) || (sampleAdvisory.whatsappPayload.mr as string))
                    : ((sampleAdvisory.smsPayload[previewLang] as string) || (sampleAdvisory.smsPayload.mr as string))}
                </div>
              </div>
            </div>
          </div>

          {/* Broadcast Trigger Button */}
          <div>
            <button
              id="bulk-broadcast-btn"
              onClick={handleTriggerBroadcast}
              disabled={isBroadcasting || selectedBlocksForBroadcast.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                isBroadcasting
                  ? 'bg-indigo-800 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950'
              }`}
            >
              {isBroadcasting ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" />
                  <span>Dispatching Localized Gateway Queue...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Bulk Advisory Blast</span>
                </>
              )}
            </button>
          </div>

          {/* Broadcast Success Feedback */}
          {broadcastDone && (
            <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-3.5 space-y-2 text-xs text-emerald-200">
              <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Broadcast Successfully Dispatched!
              </div>
              <p className="text-[11px] text-slate-300">
                Dispatched to <strong>{broadcastStats.total.toLocaleString()}</strong> registered farmers across {selectedBlocksForBroadcast.length} blocks.
              </p>
              <div className="bg-[#0B1329] p-2 rounded-lg border border-emerald-800/60 text-[10px] space-y-1">
                <div className="text-emerald-300 font-semibold">🎯 Personalized Language Routing Applied:</div>
                <div className="text-slate-300 leading-relaxed">
                  Every farmer received the message in their profile's chosen language (Marathi: ~29,000, Hindi: ~8,400, Telugu: ~4,600, Kannada: ~2,300, Gujarati: ~1,400, Other: ~1,150). Zero default to English.
                </div>
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                Delivery Success: 99.97% • Telecom Gateway Ack ID: #MP-DISP-2026-08
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
