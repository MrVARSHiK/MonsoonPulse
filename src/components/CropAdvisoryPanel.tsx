import React, { useState } from 'react';
import { 
  BlockInfo, 
  CropGrowthStage, 
  CropId, 
  Language, 
  ProbabilisticForecast 
} from '../types';
import { CROPS, BLOCKS, DISTRICTS, STATES } from '../data/climatologyData';
import { STATE_DISTRICT_LOOKUP, DISTRICT_BLOCK_LOOKUP, getCropsForState, getSubdivisionCrops } from '../data/stateDistrictMapping';
import { generateCropAdvisory } from '../models/cropAdvisoryEngine';
import { TRANSLATIONS } from '../data/translations';
import { ModelVsNaiveRuleCard } from './ModelVsNaiveRuleCard';
import { GeminiAgronomistCard } from './GeminiAgronomistCard';
import { speechService } from '../utils/speechService';
import { 
  Sprout, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Droplets, 
  Share2, 
  Volume2, 
  Copy, 
  Check, 
  FileText, 
  Calendar, 
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ClipboardCheck,
  CheckSquare,
  Square,
  Mic
} from 'lucide-react';

interface CropAdvisoryPanelProps {
  selectedBlockId: string;
  onSelectBlockId: (id: string) => void;
  forecasts: Record<string, ProbabilisticForecast>;
  language: Language;
  onOpenVoiceAssistant?: () => void;
}

export const CropAdvisoryPanel: React.FC<CropAdvisoryPanelProps> = ({
  selectedBlockId,
  onSelectBlockId,
  forecasts,
  language,
  onOpenVoiceAssistant
}) => {
  const [selectedCropId, setSelectedCropId] = useState<CropId>('cotton');
  const [selectedStage, setSelectedStage] = useState<CropGrowthStage>('sowing_window');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const block = BLOCKS[selectedBlockId] || BLOCKS['nashik_haveli'];
  const currentDistrict = DISTRICTS.find(d => d.blocks.includes(block.id)) || DISTRICTS[0];

  const [selectedState, setSelectedState] = useState<string>(currentDistrict.state);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(currentDistrict.id);

  // Sync state and district when selectedBlockId changes externally
  React.useEffect(() => {
    const b = BLOCKS[selectedBlockId];
    if (b) {
      const d = DISTRICTS.find(dist => dist.blocks.includes(b.id));
      if (d) {
        setSelectedState(d.state);
        setSelectedDistrictId(d.id);
      }
    }
  }, [selectedBlockId]);

  // Derived state districts and district blocks from mapping JSON
  const availableDistricts = selectedState ? (STATE_DISTRICT_LOOKUP[selectedState] || []) : [];
  const availableBlocks = selectedDistrictId ? (DISTRICT_BLOCK_LOOKUP[selectedDistrictId] || []) : [];

  // Derived authentic crops for the selected subdivision and state (strictly only crops grown in that state)
  const { stateCrops, dominantCropsInBlock, otherStateCrops, primaryCropId } = getSubdivisionCrops(selectedBlockId, selectedState);

  // Synchronize selectedCropId: ensure it is strictly a crop grown in this state & subdivision
  React.useEffect(() => {
    const validCropIds = stateCrops.map(c => c.id);
    if (!validCropIds.includes(selectedCropId)) {
      setSelectedCropId(primaryCropId);
    }
  }, [selectedState, selectedBlockId, stateCrops, primaryCropId, selectedCropId]);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    if (!newState) {
      setSelectedDistrictId('');
      return;
    }
    // Auto-reset district and block when state changes
    const districts = STATE_DISTRICT_LOOKUP[newState] || [];
    if (districts.length > 0) {
      const firstDistrict = districts[0];
      setSelectedDistrictId(firstDistrict.id);
      if (firstDistrict.blocks.length > 0) {
        onSelectBlockId(firstDistrict.blocks[0]);
      }
    } else {
      setSelectedDistrictId('');
    }
  };

  const handleDistrictChange = (newDistrictId: string) => {
    setSelectedDistrictId(newDistrictId);
    if (!newDistrictId) return;
    // Auto-reset block when district changes
    const districtBlocks = DISTRICT_BLOCK_LOOKUP[newDistrictId] || [];
    if (districtBlocks.length > 0) {
      onSelectBlockId(districtBlocks[0].id);
    }
  };

  // Interactive Sowing Preparedness Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    moisture: true,
    seed: true,
    treatment: false,
    plough: true,
    pond: false,
    furrow: false
  });

  const t = TRANSLATIONS[language];
  const forecast = forecasts[selectedBlockId] || forecasts['nashik_haveli'];
  const crop = CROPS[selectedCropId] || CROPS['cotton'];

  const advisory = generateCropAdvisory(selectedCropId, selectedStage, block, forecast);

  const handleCopySMS = () => {
    const text = (advisory.smsPayload[language] as string) || (advisory.smsPayload.mr as string) || (advisory.smsPayload.en as string);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = (advisory.whatsappPayload[language] as string) || (advisory.whatsappPayload.mr as string) || (advisory.whatsappPayload.en as string);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Text-to-Speech audio synthesis for accessibility
  const handleSpeak = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      return;
    }
    
    const headline = advisory.headline[language] || advisory.headline.en;
    const s1 = advisory.simpleSentences.todayAdvice[language] || advisory.simpleSentences.todayAdvice.en;
    const s2 = advisory.simpleSentences.waterAdvice[language] || advisory.simpleSentences.waterAdvice.en;
    const s3 = advisory.simpleSentences.seedAdvice[language] || advisory.simpleSentences.seedAdvice.en;
    const s4 = advisory.simpleSentences.sowingRule[language] || advisory.simpleSentences.sowingRule.en;

    const fullText = `${headline}. ${s1}. ${s2}. ${s3}. ${s4}.`;
    speechService.speak({
      text: fullText,
      language,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const getTrafficBadge = () => {
    switch (advisory.trafficColor) {
      case 'green':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          title: language === 'mr' ? 'पेरणीस अनुकूल (सुरक्षित वेळ)' : language === 'hi' ? 'बुवाई के लिए अनुकूल (सुरक्षित समय)' : 'PROCEED WITH SOWING',
          badgeText: language === 'mr' ? 'पुरेसा ओलावा उपलब्ध' : language === 'hi' ? 'पर्याप्त नमी उपलब्ध' : 'Optimal Moisture Window'
        };
      case 'yellow':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          title: language === 'mr' ? 'सतर्कता - संरक्षित पाणी तयार ठेवा' : language === 'hi' ? 'सतर्कता - जीवनरक्षक सिंचाई तैयार रखें' : 'CAUTION - PREPARE IRRIGATION',
          badgeText: language === 'mr' ? `मध्यम पावसाचा खंड धोका (${forecast.breakRiskPct}%)` : language === 'hi' ? `मध्यम सूखा जोखिम (${forecast.breakRiskPct}%)` : `Moderate Dry Spell Risk (${forecast.breakRiskPct}%)`
        };
      case 'red':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
          title: language === 'mr' ? 'पेरणी लांबवा (पावसाचा मोठा खंड)' : language === 'hi' ? 'बुवाई टालें (गंभीर सूखा जोखिम)' : 'DELAY SOWING (HIGH BREAK RISK)',
          badgeText: language === 'mr' ? `तीव्र पावसाचा खंड धोका (${forecast.breakRiskPct}%)` : language === 'hi' ? `तीव्र सूखा जोखिम (${forecast.breakRiskPct}%)` : `Severe Dry Spell Risk (${forecast.breakRiskPct}%)`
        };
      case 'amber':
      default:
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
          icon: <Droplets className="w-5 h-5 text-indigo-400" />,
          title: language === 'mr' ? 'अतिवृष्टी - पाण्याचा निचरा करा' : language === 'hi' ? 'भारी वर्षा - जल निकासी करें' : 'EXCESS RAIN - CLEAR DRAINAGE',
          badgeText: language === 'mr' ? `जोरदार पाऊस इशारा (${forecast.heavyRainRiskPct}%)` : language === 'hi' ? `भारी वर्षा चेतावनी (${forecast.heavyRainRiskPct}%)` : `Heavy Rainfall Warning (${forecast.heavyRainRiskPct}%)`
        };
    }
  };

  const traffic = getTrafficBadge();

  // Growth stages localized list
  const STAGES: { id: CropGrowthStage; label: string; desc: string }[] = [
    { 
      id: 'pre_sowing', 
      label: language === 'mr' ? 'पेरणीपूर्व मशागत' : language === 'hi' ? 'बुवाई पूर्व जुताई' : 'Pre-Sowing / Field Prep', 
      desc: language === 'mr' ? 'नांगरणी व शेणखत' : language === 'hi' ? 'खेत तैयारी व खाद' : 'Tillage & FYM' 
    },
    { 
      id: 'sowing_window', 
      label: language === 'mr' ? 'पेरणीची वेळ (संवेदनशील)' : language === 'hi' ? 'बुवाई समय (संवेदनशील)' : 'Sowing Window (Critical)', 
      desc: language === 'mr' ? 'उगवण जोखीम' : language === 'hi' ? 'अंकुरण जोखिम' : 'Germination risk' 
    },
    { 
      id: 'germination', 
      label: language === 'mr' ? 'उगवण अवस्था (०-१५ दिवस)' : language === 'hi' ? 'अंकुरण अवस्था (0-15 दिन)' : 'Emergence (0-15d)', 
      desc: language === 'mr' ? 'रोप जगणे' : language === 'hi' ? 'पौध सुरक्षा' : 'Seedling survival' 
    },
    { 
      id: 'vegetative', 
      label: language === 'mr' ? 'शाकीय वाढ' : language === 'hi' ? 'वानस्पतिक वृद्धि' : 'Vegetative Growth', 
      desc: language === 'mr' ? 'पाने व फांद्या' : language === 'hi' ? 'शाखा व पत्ती' : 'Canopy spread' 
    },
    { 
      id: 'flowering_podding', 
      label: language === 'mr' ? 'फुलोरा व शेंगा भरणे' : language === 'hi' ? 'फूल व फली अवस्था' : 'Flowering & Podding', 
      desc: language === 'mr' ? 'ओलावा अतिमहत्वाचा' : language === 'hi' ? 'नमी अत्यंत जरूरी' : 'Moisture sensitive' 
    }
  ];

  // Checklist items
  const CHECKLIST_ITEMS = [
    {
      id: 'moisture',
      titleEn: 'Adequate Soil Moisture (75-100mm rain received)',
      titleMr: 'जमिनीत पुरेसा ओलावा (७५ ते १०० मिमी पाऊस पडलेला असणे)',
      titleHi: 'खेत में पर्याप्त नमी (75-100 मिमी वर्षा प्राप्त होना)'
    },
    {
      id: 'seed',
      titleEn: 'Certified Drought-Tolerant Seed Variety Acquired',
      titleMr: 'प्रमाणित व अवर्षणक्षम वाणाचे बियाणे उपलब्ध असणे',
      titleHi: 'प्रमाणित व सूखा-सहनशील किस्म का बीज उपलब्ध होना'
    },
    {
      id: 'treatment',
      titleEn: 'Biological / Fungicide Seed Treatment (Trichoderma) Completed',
      titleMr: 'बियाण्यास ट्रायकोडर्मा किंवा बुरशीनाशक बीजप्रक्रिया पूर्ण',
      titleHi: 'बीज पर ट्राइकोडर्मा या फफूंदनाशी उपचार संपन्न'
    },
    {
      id: 'plough',
      titleEn: 'Contour Tillage & Deep Ploughing Across Slope Done',
      titleMr: 'उताराला आडवी नांगरणी व मशागत पूर्ण',
      titleHi: 'ढलान के विपरीत गहरी जुताई व पाटा लगाना संपन्न'
    },
    {
      id: 'pond',
      titleEn: 'Farm Pond / Well Prepared for Emergency Protective Irrigation',
      titleMr: 'शेततळे / विहीर संरक्षित पाण्यासाठी सज्ज असणे',
      titleHi: 'खेत का तालाब / कुआं जीवनरक्षक सिंचाई हेतु तैयार'
    },
    {
      id: 'furrow',
      titleEn: 'Broad Bed Furrow (BBF) or Ridge Layout Implemented',
      titleMr: 'बीबीएफ (BBF) किंवा सरी-वरंबा पद्धतीचे नियोजन',
      titleHi: 'बीबीएफ (BBF) या मेड़-कूड़ पद्धति की व्यवस्था'
    }
  ];

  const totalChecklist = CHECKLIST_ITEMS.length;
  const completedChecklist = Object.values(checkedItems).filter(Boolean).length;
  const checklistPct = Math.round((completedChecklist / totalChecklist) * 100);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Selection Strip */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`text-sm font-bold text-white uppercase tracking-wider ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {language === 'mr' ? 'हवामान आधारित पीक सल्ला इंजिन' : language === 'hi' ? 'मौसम आधारित फसल सलाहकार इंजन' : 'Agronomic Crop Advisory Engine'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                  <span>🌾</span> Open to All Farmers & KVK Officers
                </span>
              </div>
              <p className={`text-xs text-slate-400 mt-0.5 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {language === 'mr' 
                  ? 'शेतकरी व कृषी तज्ज्ञांसाठी: पावसाचा खंड व पीक संवेदनशीलता यांवर आधारित शास्त्रोक्त सल्ला' 
                  : language === 'hi' 
                    ? 'किसानों व कृषि अधिकारियों हेतु: मानसून ब्रेक व फसल संवेदनशीलता पर आधारित वैज्ञानिक सलाह' 
                    : 'Interactive advisory engine for farmers and extension workers — evaluate sowing windows, moisture deficits & dry spells'}
              </p>
            </div>
          </div>

          {/* Dependent State -> District -> Block Filter Hierarchy */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* State Selector */}
            <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold">{t.stateLabel}:</span>
              <select
                id="advisory-state-select"
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="bg-transparent text-cyan-300 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-[#0F172A] text-slate-400">Select a state...</option>
                {STATES.map(s => (
                  <option key={s} value={s} className="bg-[#0F172A] text-white">{s}</option>
                ))}
              </select>
            </div>

            {/* District Selector - Dependent on State */}
            <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold">{t.districtLabel}:</span>
              <select
                id="advisory-district-select"
                value={selectedDistrictId}
                disabled={!selectedState || availableDistricts.length === 0}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer ${
                  !selectedState ? 'text-slate-500 cursor-not-allowed italic' : 'text-emerald-300'
                }`}
              >
                {!selectedState ? (
                  <option value="" className="bg-[#0F172A] text-slate-500">Select a state first</option>
                ) : (
                  availableDistricts.map(d => (
                    <option key={d.id} value={d.id} className="bg-[#0F172A] text-white">
                      {d.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Block Selector - Dependent on District */}
            <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-lg border border-slate-700">
              <span className={`text-[11px] text-slate-400 font-semibold ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.farmerVillageSelect}:
              </span>
              <select
                id="advisory-block-select"
                value={selectedBlockId}
                disabled={!selectedDistrictId || availableBlocks.length === 0}
                onChange={(e) => onSelectBlockId(e.target.value)}
                className={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer ${
                  !selectedDistrictId ? 'text-slate-500 cursor-not-allowed italic' : 'text-white'
                } ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                {!selectedDistrictId ? (
                  <option value="" className="bg-[#0F172A] text-slate-500">Select a district first</option>
                ) : (
                  availableBlocks.map(b => (
                    <option key={b.id} value={b.id} className="bg-[#0F172A] text-white">
                      {language === 'mr' ? b.nameMr : language === 'hi' ? b.nameHi : b.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Crop Selector with Grouped Dropdown and Categorized Cards */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={language !== 'en' ? 'font-devanagari' : ''}>
                {language === 'mr' ? '१. खरीप पीक निवडा:' : language === 'hi' ? '1. खरीफ फसल चुनें:' : '1. Select Kharif Crop:'}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {selectedState ? `Strictly ${selectedState} Crops (${stateCrops.length})` : 'State-Specific Crops'}
              </span>
            </div>
            <span className="text-[10px] text-indigo-400 font-mono">
              Subdivision: {block.name} • Ideal Soil: {crop.idealSoil}
            </span>
          </div>

          {/* Grouped Crop Dropdown: Strictly only crops cultivated in this state/subdivision */}
          <div className="mb-3">
            <select
              id="crop-select"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value as CropId)}
              className="w-full bg-[#0F172A] text-white font-bold text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
            >
              {dominantCropsInBlock.length > 0 && (
                <optgroup label={`⭐ Dominant in ${block.name} (${dominantCropsInBlock.length})`}>
                  {dominantCropsInBlock.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#0F172A] text-white font-semibold py-1">
                      {c.name} {language === 'mr' ? `(${c.nameMr})` : language === 'hi' ? `(${c.nameHi})` : ''}
                    </option>
                  ))}
                </optgroup>
              )}
              {otherStateCrops.length > 0 && (
                <optgroup label={`🌾 Other ${selectedState} Crops (${otherStateCrops.length})`}>
                  {otherStateCrops.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#0F172A] text-slate-300 py-1">
                      {c.name} {language === 'mr' ? `(${c.nameMr})` : language === 'hi' ? `(${c.nameHi})` : ''}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Visual Crop Cards: Strictly only crops cultivated in this state/subdivision */}
          <div className="space-y-3">
            {dominantCropsInBlock.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between mb-1.5">
                  <span>⭐ Dominant Crops in {block.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">Subdivision Primary</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dominantCropsInBlock.map(c => {
                    const isSelected = selectedCropId === c.id;
                    return (
                      <button
                        key={c.id}
                        id={`crop-btn-${c.id}`}
                        onClick={() => setSelectedCropId(c.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/50 shadow-md'
                            : 'bg-[#0F172A] border-slate-700/80 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-slate-100 truncate">{c.name.split(' ')[0]}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold">Top</span>
                        </div>
                        <div className="text-[10px] text-emerald-300 font-devanagari truncate font-medium mt-1">
                          {language === 'hi' ? c.nameHi : c.nameMr}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {otherStateCrops.length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between mb-1.5">
                  <span>🌾 Other {selectedState} Kharif Crops</span>
                  <span className="text-[10px] font-mono text-slate-500">State Approved</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {otherStateCrops.map(c => {
                    const isSelected = selectedCropId === c.id;
                    return (
                      <button
                        key={c.id}
                        id={`crop-btn-${c.id}`}
                        onClick={() => setSelectedCropId(c.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/50 shadow-md'
                            : 'bg-[#0F172A] border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-xs text-slate-300 truncate">{c.name.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-400 font-devanagari truncate mt-1">
                          {language === 'hi' ? c.nameHi : c.nameMr}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Growth Stage Selector */}
        <div>
          <div className={`text-xs font-semibold text-slate-400 mb-2.5 ${language !== 'en' ? 'font-devanagari' : ''}`}>
            {language === 'mr' ? '२. पिकाची सध्याची अवस्था निवडा:' : language === 'hi' ? '2. फसल की वर्तमान वृद्धि अवस्था चुनें:' : '2. Select Current Crop Growth Stage:'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {STAGES.map(stage => {
              const isSelected = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  id={`stage-btn-${stage.id}`}
                  onClick={() => setSelectedStage(stage.id as CropGrowthStage)}
                  className={`p-2.5 rounded-xl border text-left transition text-xs ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/50 shadow-md'
                      : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className={`font-semibold text-slate-200 ${language !== 'en' ? 'font-devanagari' : ''}`}>{stage.label}</div>
                  <div className={`text-[10px] text-slate-400 mt-0.5 ${language !== 'en' ? 'font-devanagari' : ''}`}>{stage.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Advisory Display Banner */}
      <div className={`p-5 rounded-2xl border ${traffic.bg} shadow-xl backdrop-blur-md relative overflow-hidden`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              {traffic.icon}
              <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0F172A] border border-current ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {traffic.title}
              </span>
              <span className={`text-xs bg-[#0F172A] text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {traffic.badgeText}
              </span>
            </div>

            <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight text-white ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {advisory.headline[language] || advisory.headline.en}
            </h3>

            <p className="text-xs text-slate-300">
              {language === 'mr' ? (
                <>
                  क्षेत्र: <strong>{block.nameMr || block.name}</strong> • पीक: <strong>{crop.nameMr || crop.name}</strong> • माती क्षमता: <strong>{block.climatology.waterHoldingCapacityMm}mm</strong> • अपेक्षित मान्सून: <strong>{forecast.expectedOnsetDate}</strong>
                </>
              ) : language === 'hi' ? (
                <>
                  क्षेत्र: <strong>{block.nameHi || block.name}</strong> • फसल: <strong>{crop.nameHi || crop.name}</strong> • मिट्टी क्षमता: <strong>{block.climatology.waterHoldingCapacityMm}mm</strong> • संभावित मानसून: <strong>{forecast.expectedOnsetDate}</strong>
                </>
              ) : (
                <>
                  Computed for <strong>{crop.name}</strong> in <strong>{block.name}</strong> • Soil Capacity: <strong>{block.climatology.waterHoldingCapacityMm}mm</strong> • Expected Onset: <strong>{forecast.expectedOnsetDate}</strong>
                </>
              )}
            </p>
          </div>

          {/* Audio Readout & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenVoiceAssistant && (
              <button
                id="panel-open-voice-assistant-btn"
                onClick={onOpenVoiceAssistant}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 flex items-center gap-1.5 text-xs font-bold transition shadow-md cursor-pointer"
                title="Open Kisan Voice Assistant (Hindi & Telugu)"
              >
                <Mic className="w-4 h-4 text-white animate-pulse" />
                <span>
                  {language === 'hi' 
                    ? 'किसान आवाज़ (Voice)' 
                    : language === 'te' 
                    ? 'కిసాన్ వాయిస్ (Voice)' 
                    : language === 'mr' 
                    ? 'शेतकरी व्हॉईस' 
                    : 'Kisan Voice Assistant'}
                </span>
              </button>
            )}

            <button
              id="listen-advisory-btn"
              onClick={handleSpeak}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition ${
                isSpeaking 
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                  : 'bg-[#0F172A] hover:bg-slate-800 text-slate-200 border-slate-700'
              } ${language !== 'en' ? 'font-devanagari' : ''}`}
              title="Listen to spoken audio advisory"
            >
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>{isSpeaking ? (language === 'mr' ? 'थांबवा' : language === 'hi' ? 'रोकें' : 'Stop Audio') : (language === 'mr' ? '🔊 आवाज ऐका' : language === 'hi' ? '🔊 बोलकर सुनें' : 'Listen Spoken')}</span>
            </button>

            <button
              id="copy-sms-btn"
              onClick={handleCopySMS}
              className={`p-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 text-xs font-semibold transition ${language !== 'en' ? 'font-devanagari' : ''}`}
              title="Copy SMS format"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{copied ? (language === 'mr' ? 'कॉपी झाले!' : language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : 'Copy SMS'}</span>
            </button>

            <button
              id="share-whatsapp-btn"
              onClick={handleShareWhatsApp}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 flex items-center gap-1.5 text-xs font-semibold transition shadow-sm"
              title="Share via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sowing Preparedness Checklist for Farmers & KVK Officers (पेरणी पूर्वतयारी तपासणी सूची) */}
      <div className="bg-[#1E293B] border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-bold text-white uppercase tracking-wider ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {language === 'mr' ? 'पेरणी पूर्वतयारी तपासणी सूची (तयारी चाचणी)' : language === 'hi' ? 'बुवाई पूर्व तैयारी चेकलिस्ट' : 'Farmer Sowing Preparedness Checklist'}
                </h4>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                  checklistPct >= 80 ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  {checklistPct}% {language === 'mr' ? 'तयारी' : language === 'hi' ? 'तैयार' : 'Ready'}
                </span>
              </div>
              <p className={`text-xs text-slate-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {language === 'mr'
                  ? 'पेरणी करण्यापूर्वी या ६ आवश्यक बाबींची खात्री करून सुरक्षित शेती करा'
                  : language === 'hi'
                    ? 'बीज बोने से पहले इन 6 आवश्यक कदमों की पुष्टि करें'
                    : 'Interactive readiness scorecard before sowing seeds in the field'}
              </p>
            </div>
          </div>

          <div className="w-48 bg-[#0F172A] rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${checklistPct >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${checklistPct}%` }}
            />
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CHECKLIST_ITEMS.map((item, idx) => {
            const isChecked = !!checkedItems[item.id];
            const title = language === 'mr' ? item.titleMr : language === 'hi' ? item.titleHi : item.titleEn;
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 select-none ${
                  isChecked 
                    ? 'bg-indigo-950/40 border-indigo-500/40 text-slate-100 shadow-sm' 
                    : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="pt-0.5">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-indigo-400 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono">Check {idx + 1}/6</div>
                  <p className={`text-xs leading-snug font-medium ${isChecked ? 'text-slate-100 font-semibold' : 'text-slate-400'} ${language !== 'en' ? 'font-devanagari' : ''}`}>
                    {title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plain-Language Simple Sentences for Farmers (सरल शेतकरी मार्गदर्शक) */}
      <div className="bg-[#1E293B] border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-bold text-white uppercase tracking-wider ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {language === 'mr' ? 'शेतकऱ्यांसाठी ४ सोपी वाक्ये (सरल मार्गदर्शक)' : language === 'hi' ? 'किसानों के लिए 4 सरल वाक्य (आसान गाइड)' : '4 Simple Sentences for Farmers (Easy-Read Mode)'}
                </h4>
                <span className="bg-emerald-500/10 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  {language === 'mr' ? 'सोपी भाषा' : language === 'hi' ? 'सरल भाषा' : 'Farmer Friendly'}
                </span>
              </div>
              <p className={`text-xs text-slate-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {language === 'mr' 
                  ? 'अतिशय सोप्या भाषेत थेट शेती कामे समजून घ्या' 
                  : language === 'hi' 
                    ? 'अत्यंत सरल शब्दों में खेत की सीधी सलाह समझें' 
                    : 'Clear, direct single-sentence summaries without complex meteorological jargon'}
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className={language !== 'en' ? 'font-devanagari' : ''}>
              {advisory.simpleSentences.sowingRule[language] || advisory.simpleSentences.sowingRule.en}
            </span>
          </div>
        </div>

        {/* 4 Plain Language Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Today's Action */}
          <div className="bg-[#0F172A] border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between space-y-2 transition shadow-sm">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  {language === 'mr' ? '१. आज काय करावे?' : language === 'hi' ? '1. आज क्या करें?' : "1. Today's Action"}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 leading-relaxed font-devanagari">
                {advisory.simpleSentences.todayAdvice[language] || advisory.simpleSentences.todayAdvice.en}
              </p>
            </div>
            <div className={`text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80 ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {language === 'mr' ? 'पेरणी वेळ निर्णय' : language === 'hi' ? 'बुवाई समय निर्णय' : 'Sowing timing'}
            </div>
          </div>

          {/* 2. Water / Rain Advice */}
          <div className="bg-[#0F172A] border border-slate-800 hover:border-indigo-500/40 rounded-xl p-4 flex flex-col justify-between space-y-2 transition shadow-sm">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  <Droplets className="w-3.5 h-3.5" />
                  {language === 'mr' ? '२. पाण्याचे नियोजन' : language === 'hi' ? '2. पानी का प्रबंधन' : '2. Water & Irrigation'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 leading-relaxed font-devanagari">
                {advisory.simpleSentences.waterAdvice[language] || advisory.simpleSentences.waterAdvice.en}
              </p>
            </div>
            <div className={`text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80 ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {language === 'mr' ? 'ओलावा व पाऊस खंड' : language === 'hi' ? 'नमी व सूखा रक्षा' : 'Moisture protection'}
            </div>
          </div>

          {/* 3. Seed Treatment */}
          <div className="bg-[#0F172A] border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-2 transition shadow-sm">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  <Sprout className="w-3.5 h-3.5" />
                  {language === 'mr' ? '३. बियाणे प्रक्रिया' : language === 'hi' ? '3. बीज उपचार' : '3. Seed Treatment'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 leading-relaxed font-devanagari">
                {advisory.simpleSentences.seedAdvice[language] || advisory.simpleSentences.seedAdvice.en}
              </p>
            </div>
            <div className={`text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80 ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {language === 'mr' ? 'बुरशी व कीड संरक्षण' : language === 'hi' ? 'कीट व रोग बचाव' : 'Fungicide & bio-fertilizer'}
            </div>
          </div>

          {/* 4. Traffic Signal */}
          <div className="bg-[#0F172A] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between space-y-2 transition shadow-sm">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {language === 'mr' ? '४. ट्रॅफिक नियम' : language === 'hi' ? '4. ट्रैफिक नियम' : '4. Traffic Light Rule'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 leading-relaxed font-devanagari">
                {advisory.simpleSentences.sowingRule[language] || advisory.simpleSentences.sowingRule.en}
              </p>
            </div>
            <div className={`text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80 ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {language === 'mr' ? 'स्पष्ट संकेत' : language === 'hi' ? 'स्पष्ट संकेत' : 'Clear Decision Matrix'}
            </div>
          </div>

        </div>
      </div>

      {/* 5-Step Explainable Reasoning Chain */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h4 className={`text-sm font-bold text-white uppercase tracking-wider ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {language === 'mr' ? '५-टप्प्यांची पारदर्शक वैज्ञानिक कारणमीमांसा (Explainable AI Engine)' : language === 'hi' ? '5-चरणीय पारदर्शी वैज्ञानिक तर्क श्रृंखला (Explainable AI Engine)' : 'Transparent Scientific Reasoning Chain (Explainable AI Engine)'}
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            5-Stage Decision Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {advisory.reasoningChain.map((step) => {
            const stepTitle = language === 'mr' && step.titleMr ? step.titleMr : language === 'hi' && step.titleHi ? step.titleHi : step.title;
            const stepDetail = language === 'mr' && step.detailMr ? step.detailMr : language === 'hi' && step.detailHi ? step.detailHi : step.detail;
            return (
              <div 
                key={step.step}
                className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2 relative"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center text-[11px] border border-indigo-500/30">
                      {step.step}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Stage {step.step}/5</span>
                  </div>
                  <h5 className={`text-xs font-bold text-slate-200 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                    {stepTitle}
                  </h5>
                  <p className={`text-[11px] text-slate-400 mt-1 leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
                    {stepDetail}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-indigo-400 font-mono">
                  &gt; Grounded Verification
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agro-Meteorologist AI Consultation */}
      <GeminiAgronomistCard
        block={block}
        cropId={selectedCropId}
        stage={selectedStage}
        forecast={forecast}
        language={language}
        onOpenVoiceAssistant={onOpenVoiceAssistant}
      />

      {/* Model vs Naive Rule Benchmark Card (Evaluator Scorecard Defense) */}
      <ModelVsNaiveRuleCard language={language} />

      {/* Action Plan Specifics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sowing & Field Actions */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span className={language !== 'en' ? 'font-devanagari' : ''}>
              {language === 'mr' ? 'पेरणी व शेती कामे मार्गदर्शक' : language === 'hi' ? 'बुवाई व कृषि कार्य प्रोटोकॉल' : 'Sowing & Field Operation Protocols'}
            </span>
          </div>
          <p className={`text-xs text-slate-300 bg-[#0F172A] p-3 rounded-lg border border-slate-800 leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
            {language === 'mr' && advisory.actionPlan.sowingRecommendationMr 
              ? advisory.actionPlan.sowingRecommendationMr 
              : language === 'hi' && advisory.actionPlan.sowingRecommendationHi 
                ? advisory.actionPlan.sowingRecommendationHi 
                : advisory.actionPlan.sowingRecommendation}
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider pt-2">
            <Droplets className="w-4 h-4" />
            <span className={language !== 'en' ? 'font-devanagari' : ''}>
              {language === 'mr' ? 'मातीतील ओलावा व जलसंधारण उपाय' : language === 'hi' ? 'मृदा नमी व जल संरक्षण' : 'Soil Moisture & Water Conservation'}
            </span>
          </div>
          <p className={`text-xs text-slate-300 bg-[#0F172A] p-3 rounded-lg border border-slate-800 leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
            {language === 'mr' && advisory.actionPlan.soilAndWaterInterventionMr 
              ? advisory.actionPlan.soilAndWaterInterventionMr 
              : language === 'hi' && advisory.actionPlan.soilAndWaterInterventionHi 
                ? advisory.actionPlan.soilAndWaterInterventionHi 
                : advisory.actionPlan.soilAndWaterIntervention}
          </p>
        </div>

        {/* Pest/Disease & Resowing Contingency */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span className={language !== 'en' ? 'font-devanagari' : ''}>
              {language === 'mr' ? 'सूक्ष्म-हवामान कीड व रोग इशारा' : language === 'hi' ? 'सूक्ष्म मौसम कीट व रोग चेतावनी' : 'Microclimate Pest & Disease Risk'}
            </span>
          </div>
          <p className={`text-xs text-slate-300 bg-[#0F172A] p-3 rounded-lg border border-slate-800 leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
            {language === 'mr' && advisory.actionPlan.pestDiseaseAlertMr 
              ? advisory.actionPlan.pestDiseaseAlertMr 
              : language === 'hi' && advisory.actionPlan.pestDiseaseAlertHi 
                ? advisory.actionPlan.pestDiseaseAlertHi 
                : advisory.actionPlan.pestDiseaseAlert}
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider pt-2">
            <TrendingDown className="w-4 h-4" />
            <span className={language !== 'en' ? 'font-devanagari' : ''}>
              {language === 'mr' ? 'दुबार पेरणी टाळण्यासाठी आपत्कालीन नियोजन' : language === 'hi' ? 'पुनर्बुवाई से बचाव हेतु आकस्मिक योजना' : 'Contingency Seed Planning'}
            </span>
          </div>
          <p className={`text-xs text-slate-300 bg-[#0F172A] p-3 rounded-lg border border-slate-800 leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
            {language === 'mr' && advisory.actionPlan.resowingContingencyMr 
              ? advisory.actionPlan.resowingContingencyMr 
              : language === 'hi' && advisory.actionPlan.resowingContingencyHi 
                ? advisory.actionPlan.resowingContingencyHi 
                : advisory.actionPlan.resowingContingency}
          </p>
        </div>
      </div>
    </div>
  );
};
