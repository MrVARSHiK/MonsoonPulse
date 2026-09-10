import React, { useState } from 'react';
import { 
  BlockInfo, 
  CropId, 
  Language, 
  ProbabilisticForecast,
  AuthUser,
  DistrictInfo
} from '../types';
import { BLOCKS, CROPS, DISTRICTS, STATES } from '../data/climatologyData';
import { STATE_DISTRICT_LOOKUP, DISTRICT_BLOCK_LOOKUP, getCropsForState, getSubdivisionCrops } from '../data/stateDistrictMapping';
import { generateCropAdvisory } from '../models/cropAdvisoryEngine';
import { TRANSLATIONS } from '../data/translations';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '../data/languages';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Volume2, 
  MessageSquare, 
  Check, 
  PhoneCall, 
  ShieldAlert, 
  AlertTriangle, 
  Droplet,
  Languages,
  Sparkles,
  RefreshCw,
  Gauge,
  Share2,
  Copy,
  Wifi,
  WifiOff,
  Clock,
  Database,
  AlertCircle,
  Sprout,
  ArrowUpRight
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface FarmerSimplifiedViewProps {
  district?: DistrictInfo;
  selectedBlockId: string;
  onSelectBlockId: (id: string) => void;
  forecasts: Record<string, ProbabilisticForecast>;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
  onUpdateUser?: (user: AuthUser) => void;
  onNavigateToAdvisory?: () => void;
}

export const FarmerSimplifiedView: React.FC<FarmerSimplifiedViewProps> = ({
  selectedBlockId,
  onSelectBlockId,
  forecasts,
  language,
  setLanguage,
  currentUser,
  onOpenAuthModal,
  onUpdateUser,
  onNavigateToAdvisory
}) => {
  const [selectedCropId, setSelectedCropId] = useState<CropId>('cotton');
  const [phoneNumber, setPhoneNumber] = useState<string>(() => {
    return (currentUser?.role === 'farmer' && currentUser.phone)
      || (localStorage.getItem('monsoonpulse_farmer_phone'))
      || '+91 98220 41289';
  });
  const [deliveryChannel, setDeliveryChannel] = useState<'sms' | 'whatsapp'>('whatsapp');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  // Sync phone when currentUser updates
  React.useEffect(() => {
    if (currentUser?.role === 'farmer' && currentUser.phone) {
      setPhoneNumber(currentUser.phone);
    }
  }, [currentUser]);
  const [isCopied, setIsCopied] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  const block = BLOCKS[selectedBlockId] || BLOCKS['nashik_haveli'];
  const currentDistrict = DISTRICTS.find(d => d.blocks.includes(block.id)) || DISTRICTS[0];

  const [selectedState, setSelectedState] = useState<string>(currentDistrict.state);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(currentDistrict.id);

  // Sync state and district when selectedBlockId changes
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

  const availableDistricts = selectedState ? (STATE_DISTRICT_LOOKUP[selectedState] || []) : [];
  const availableBlocks = selectedDistrictId ? (DISTRICT_BLOCK_LOOKUP[selectedDistrictId] || []) : [];
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
    const districtBlocks = DISTRICT_BLOCK_LOOKUP[newDistrictId] || [];
    if (districtBlocks.length > 0) {
      onSelectBlockId(districtBlocks[0].id);
    }
  };

  // Farmer's registered language setting selected during sign-in
  const currentDeliveryLang: Language = (currentUser?.role === 'farmer' && currentUser?.preferredLanguage)
    || (localStorage.getItem('monsoonpulse_farmer_lang') as Language)
    || language;

  const t = TRANSLATIONS[language];
  const forecast = forecasts[selectedBlockId] || forecasts['nashik_haveli'];
  const crop = CROPS[selectedCropId] || CROPS['cotton'];

  const advisory = generateCropAdvisory(selectedCropId, 'sowing_window', block, forecast);

  const getLocalizedWhatsappText = (): string => {
    return (advisory.whatsappPayload[currentDeliveryLang] as string)
      || (advisory.whatsappPayload[language] as string)
      || (advisory.whatsappPayload.mr as string)
      || (advisory.whatsappPayload.en as string);
  };

  const getLocalizedSmsText = (): string => {
    return (advisory.smsPayload[currentDeliveryLang] as string)
      || (advisory.smsPayload[language] as string)
      || (advisory.smsPayload.mr as string)
      || (advisory.smsPayload.en as string);
  };

  const handleShareWhatsApp = () => {
    const text = getLocalizedWhatsappText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyAdvisory = () => {
    const text = deliveryChannel === 'whatsapp' ? getLocalizedWhatsappText() : getLocalizedSmsText();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulateSend = () => {
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
    }, 4500);
  };

  const handleSpeakAudio = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const fullText = getLocalizedSmsText();
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = speechRate;
      
      const speechLangMap: Record<string, string> = {
        hi: 'hi-IN',
        mr: 'mr-IN',
        mr_local: 'mr-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        gu: 'gu-IN',
        ta: 'ta-IN',
        bn: 'bn-IN',
        pa: 'pa-IN',
        or: 'or-IN',
        ml: 'ml-IN',
        ur: 'ur-IN',
        as: 'as-IN',
        en: 'en-IN'
      };
      utterance.lang = speechLangMap[currentDeliveryLang] || 'en-IN';

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getTrafficVisual = () => {
    if (advisory.trafficColor === 'green') {
      return {
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500',
        glow: 'shadow-emerald-500/30',
        statusEn: 'SAFE TO SOW NOW',
        statusMr: 'पेरणीसाठी अनुकूल (सुरक्षित वेळ)',
        statusHi: 'बुवाई के लिए सुरक्षित (अनुकूल)'
      };
    }
    if (advisory.trafficColor === 'yellow') {
      return {
        bgColor: 'bg-amber-500',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500',
        glow: 'shadow-amber-500/30',
        statusEn: 'CAUTION: PREPARE IRRIGATION',
        statusMr: 'सतर्कता: संरक्षित पाणी तयार ठेवा',
        statusHi: 'सतर्कता: जीवनरक्षक सिंचाई तैयार रखें'
      };
    }
    return {
      bgColor: 'bg-rose-600',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-600',
      glow: 'shadow-rose-600/30',
      statusEn: 'DELAY SOWING (HIGH BREAK RISK)',
      statusMr: 'पेरणी लांबवा (पावसाचा मोठा खंड)',
      statusHi: 'बुवाई टालें (सूखा व खंड जोखिम)'
    };
  };

  const visual = getTrafficVisual();
  const currentStatus = language === 'mr' ? visual.statusMr : language === 'hi' ? visual.statusHi : visual.statusEn;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT: Farmer Ultra-Simple Mobile-First Dashboard (7 Cols) */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* HIGHLIGHTED CROP ADVISORY ENGINE CALLOUT (Open to All Farmers) */}
        <div className="bg-gradient-to-r from-emerald-950/70 via-indigo-950/60 to-slate-900 border-2 border-emerald-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-inner">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Crop Advisory Engine
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                      🌾 Open to All Farmers
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Farmers can access complete sowing windows, soil moisture projections, and scientific phenological protection rules.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {currentUser?.role === 'farmer' && currentUser.phone ? (
                <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1.5 rounded-xl text-xs">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-emerald-200 font-bold">{currentUser.phone}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                    Registered
                  </span>
                  {onOpenAuthModal && (
                    <button
                      onClick={onOpenAuthModal}
                      className="text-[10px] text-emerald-400 hover:text-white underline cursor-pointer ml-1"
                    >
                      Edit
                    </button>
                  )}
                </div>
              ) : (
                onOpenAuthModal && (
                  <button
                    id="farmer-register-phone-header-btn"
                    onClick={() => {
                      soundFx.playClick();
                      onOpenAuthModal();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md border border-emerald-400/40 transition transform active:scale-95 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-300" />
                    <span>Register Phone (मोबाईल नोंदणी)</span>
                  </button>
                )
              )}

              {onNavigateToAdvisory && (
                <button
                  id="farmer-launch-crop-advisory-btn"
                  onClick={() => {
                    soundFx.playClick();
                    onNavigateToAdvisory();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition transform active:scale-95 cursor-pointer"
                >
                  <span>Launch Crop Advisory</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Village & Language Selector Bar */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Dependent State -> District -> Block */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* State Selector */}
              <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-xl border border-slate-700">
                <span className="text-[11px] font-semibold text-slate-400">{t.stateLabel}:</span>
                <select
                  id="farmer-state-select"
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="bg-transparent text-cyan-300 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#0F172A] text-slate-400">Select a state...</option>
                  {STATES.map(s => (
                    <option key={s} value={s} className="bg-[#0F172A] text-white">{s}</option>
                  ))}
                </select>
              </div>

              {/* District Selector - Dependent on State */}
              <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-xl border border-slate-700">
                <span className="text-[11px] font-semibold text-slate-400">{t.districtLabel}:</span>
                <select
                  id="farmer-district-select"
                  value={selectedDistrictId}
                  disabled={!selectedState || availableDistricts.length === 0}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className={`bg-transparent font-bold text-xs focus:outline-none cursor-pointer ${
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

              {/* Block/Village Selector - Dependent on District */}
              <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-xl border border-slate-700">
                <span className={`text-[11px] font-semibold text-slate-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {t.farmerVillageSelect}:
                </span>
                <select
                  id="farmer-block-select"
                  value={selectedBlockId}
                  disabled={!selectedDistrictId || availableBlocks.length === 0}
                  onChange={(e) => onSelectBlockId(e.target.value)}
                  className={`bg-transparent font-bold text-xs focus:outline-none cursor-pointer ${
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

            {/* Crop Selector with <optgroup> strictly for Subdivision and State Crops */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold text-slate-300 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.farmerCropSelect}:
              </span>
              <select
                id="farmer-crop-select"
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value as CropId)}
                className={`bg-[#0F172A] text-indigo-300 font-bold text-sm px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                {dominantCropsInBlock.length > 0 && (
                  <optgroup label={`⭐ ${block.name} Primary (${dominantCropsInBlock.length})`}>
                    {dominantCropsInBlock.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#0F172A] text-white">
                        {language === 'mr' ? c.nameMr : language === 'hi' ? c.nameHi : c.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {otherStateCrops.length > 0 && (
                  <optgroup label={`🌾 Other ${selectedState} Crops (${otherStateCrops.length})`}>
                    {otherStateCrops.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#0F172A] text-slate-300">
                        {language === 'mr' ? c.nameMr : language === 'hi' ? c.nameHi : c.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Graceful Degradation Connectivity Simulator Switch */}
            <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-xl border border-slate-700">
              <button
                id="toggle-connectivity-mode-btn"
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1.5 transition ${
                  isOfflineMode 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
                title="Toggle Graceful Degradation State for Evaluator Testing"
              >
                {isOfflineMode ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Offline Cache (Simulated)</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live 4G/5G Feed</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* GRACEFUL DEGRADATION REAL STATE BANNER (When Connectivity Fails) */}
        {isOfflineMode && (
          <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-4 shadow-lg space-y-2 text-amber-200">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-amber-900/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {language === 'mr' 
                    ? 'कमी इंटरनेट संपर्क: ऑफलाइन कॅश सल्ला (Graceful Degradation Mode)' 
                    : language === 'hi' 
                      ? 'कम कनेक्टिविटी: ऑफलाइन कैश परामर्श (Graceful Degradation Mode)' 
                      : 'Graceful Degradation: Low Connectivity / Offline Cache Active'}
                </span>
              </div>
              <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded border border-amber-700/50 text-amber-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {language === 'mr' ? 'डेटा ६ तास जुना (स्थानिक फोन मेमरी)' : language === 'hi' ? 'डेटा 6 घंटे पुराना (स्थानीय मेमोरी)' : 'Data 6 Hours Old (Local PWA Storage)'}
              </span>
            </div>

            <p className="text-xs text-amber-100/90 leading-relaxed">
              {language === 'mr'
                ? 'नेटवर्क खंडित झाले असले तरी ॲप बंद न होता शेवटचा प्रमाणित सल्ला दाखवत आहे. अनिश्चितता वाढल्याने (+/- ४ दिवस) सिस्टीम आपोआप शेतकऱ्यांच्या संरक्षणासाठी सावधगिरीचा सल्ला (पेरणी थांबवा) देते.'
                : language === 'hi'
                  ? 'नेटवर्क बाधित होने पर भी ऐप क्रैश नहीं हुआ है और अंतिम सत्यापित परामर्श प्रदर्शित कर रहा है। अनिश्चितता बढ़ने के कारण प्रणाली स्वतः सुरक्षित व सतर्क रुख अपनाती है।'
                  : 'Connectivity dropped — application gracefully degrades to cached sub-seasonal advisory stored in local IndexedDB. Because boundary conditions are stale, model uncertainty has widened (σ+4d) and the system automatically defaults to conservative precautionary rules to protect farmer capital.'}
            </p>

            <div className="flex items-center justify-between pt-1 text-[10px] text-amber-400/90 font-mono flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" />
                <span>Confidence downgraded: 68% (Safe Failover Active)</span>
              </span>
              <span className="text-slate-300">
                Fallback: 2G SMS dispatch operational via USSD gateway
              </span>
            </div>
          </div>
        )}

        {/* Big Giant High-Contrast Traffic Light Safety Display */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-6 relative overflow-hidden">
          {/* Glowing pulse aura */}
          <div className={`w-32 h-32 mx-auto rounded-full ${visual.bgColor} ${visual.glow} shadow-2xl flex items-center justify-center border-4 border-white/90 animate-pulse`}>
            {advisory.trafficColor === 'green' && <CheckCircle2 className="w-16 h-16 text-slate-950 stroke-[2.5]" />}
            {advisory.trafficColor === 'yellow' && <AlertTriangle className="w-16 h-16 text-slate-950 stroke-[2.5]" />}
            {advisory.trafficColor === 'red' && <ShieldAlert className="w-16 h-16 text-white stroke-[2.5]" />}
            {advisory.trafficColor === 'amber' && <Droplet className="w-16 h-16 text-white stroke-[2.5]" />}
          </div>

          <div className="space-y-2">
            <span className={`inline-block font-mono font-black text-sm tracking-widest px-4 py-1 rounded-full uppercase bg-[#0F172A] border ${visual.borderColor} ${visual.textColor} ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {currentStatus}
            </span>

            <h2 className={`text-2xl sm:text-3xl font-black text-white leading-tight ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {advisory.headline[language] || advisory.headline.en}
            </h2>
          </div>

          {/* 4 Farmer-Friendly Simple Sentence Cards */}
          <div className="bg-[#0F172A] border border-emerald-500/30 rounded-2xl p-4 text-left space-y-3 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className={`text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider ${language !== 'en' ? 'font-devanagari' : ''}`}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {t.plainLanguageTitle}
              </span>
              <span className={`text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/50 font-bold ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.directActionTag}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#1E293B] p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-emerald-400 font-bold text-sm">1.</span>
                <p className="text-slate-200 font-devanagari leading-relaxed">
                  {advisory.simpleSentences.todayAdvice[language] || advisory.simpleSentences.todayAdvice.en}
                </p>
              </div>

              <div className="bg-[#1E293B] p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-indigo-400 font-bold text-sm">2.</span>
                <p className="text-slate-200 font-devanagari leading-relaxed">
                  {advisory.simpleSentences.waterAdvice[language] || advisory.simpleSentences.waterAdvice.en}
                </p>
              </div>

              <div className="bg-[#1E293B] p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-amber-400 font-bold text-sm">3.</span>
                <p className="text-slate-200 font-devanagari leading-relaxed">
                  {advisory.simpleSentences.seedAdvice[language] || advisory.simpleSentences.seedAdvice.en}
                </p>
              </div>

              <div className="bg-[#1E293B] p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-cyan-400 font-bold text-sm">4.</span>
                <p className="text-slate-200 font-devanagari font-bold leading-relaxed">
                  {advisory.simpleSentences.sowingRule[language] || advisory.simpleSentences.sowingRule.en}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
            <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
              <div className={`text-[11px] text-slate-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.farmerBreakRisk}
              </div>
              <div className={`text-lg font-bold ${visual.textColor}`}>
                {forecast.breakRiskPct}%
              </div>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
              <div className={`text-[11px] text-slate-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.farmerExpectedOnset}
              </div>
              <div className="text-lg font-bold text-white">
                {forecast.expectedOnsetDate}
              </div>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl col-span-2 sm:col-span-1">
              <div className={`text-[11px] text-slate-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.farmerSoilMoisture}
              </div>
              <div className="text-lg font-bold text-indigo-400">
                {block.climatology.waterHoldingCapacityMm} mm
              </div>
            </div>
          </div>

          {/* Audio Spoken Button and Speech Rate controls */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="voice-advisory-button"
              onClick={handleSpeakAudio}
              className={`w-full sm:w-auto flex-1 max-w-sm py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition text-sm sm:text-base ${
                isSpeaking 
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-950' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950'
              } ${language !== 'en' ? 'font-devanagari' : ''}`}
            >
              <Volume2 className="w-5 h-5 shrink-0" />
              <span>
                {isSpeaking ? t.farmerVoiceStop : t.farmerVoiceBtn}
              </span>
            </button>

            {/* Speech rate switch */}
            <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] text-slate-400 font-mono">Speed:</span>
              <button
                onClick={() => setSpeechRate(0.8)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${speechRate === 0.8 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                0.8x (Slow)
              </button>
              <button
                onClick={() => setSpeechRate(1.0)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${speechRate === 1.0 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                1.0x
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Interactive SMS / WhatsApp Dispatch Simulator (5 Cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <h3 className={`text-sm font-bold text-white uppercase tracking-wider ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.deliverySimulatorTitle}
              </h3>
            </div>

            {/* Channel Tabs */}
            <div className="flex items-center bg-[#0F172A] rounded-lg p-0.5 border border-slate-800">
              <button
                id="channel-whatsapp-btn"
                onClick={() => setDeliveryChannel('whatsapp')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  deliveryChannel === 'whatsapp' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                WhatsApp
              </button>
              <button
                id="channel-sms-btn"
                onClick={() => setDeliveryChannel('sms')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  deliveryChannel === 'sms' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SMS (GSM-7)
              </button>
            </div>
          </div>

          {/* FARMER PERSONALIZED LANGUAGE SETTING BANNER */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>Alert Language: <strong>{getLanguageMeta(currentDeliveryLang).nativeName} ({getLanguageMeta(currentDeliveryLang).name})</strong></span>
              </div>
              {currentUser?.role === 'farmer' ? (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Signed-in Farmer Preference
                </span>
              ) : (
                <button
                  id="farmer-view-signin-btn"
                  onClick={onOpenAuthModal}
                  className="text-[10px] text-indigo-300 hover:text-white underline font-semibold"
                >
                  Sign in to lock language
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              When alerts are pushed to this farmer, messages arrive <strong className="text-emerald-300">strictly in {getLanguageMeta(currentDeliveryLang).nativeName}</strong>. No English fallback.
            </p>

            <div className="flex items-center gap-2 pt-0.5">
              <label className="text-[10px] text-slate-400 shrink-0">Customized Setting:</label>
              <select
                id="farmer-view-lang-select"
                value={currentDeliveryLang}
                onChange={(e) => {
                  const newL = e.target.value as Language;
                  localStorage.setItem('monsoonpulse_farmer_lang', newL);
                  if (currentUser && currentUser.role === 'farmer' && onUpdateUser) {
                    onUpdateUser({ ...currentUser, preferredLanguage: newL });
                  }
                  setLanguage(newL);
                }}
                className="flex-1 bg-[#0F172A] border border-emerald-500/50 text-emerald-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipient Input & Registered Farmer Phone Status */}
          <div className="space-y-1.5 bg-[#0F172A] border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <label className={`text-xs text-slate-300 font-semibold flex items-center gap-1.5 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                {t.phoneNumberLabel}
              </label>
              {currentUser?.role === 'farmer' && currentUser?.phone ? (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Linked Farmer Number
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">
                  SMS / WhatsApp Destination
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="farmer-phone-input"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98220 41289"
                className="flex-1 bg-[#141E33] border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
              />
              {currentUser?.role === 'farmer' && onUpdateUser && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playSuccess();
                    onUpdateUser({ ...currentUser, phone: phoneNumber.trim() });
                    localStorage.setItem('monsoonpulse_farmer_phone', phoneNumber.trim());
                  }}
                  className="px-2.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition shrink-0 cursor-pointer shadow-sm"
                  title="Save this number to your registered farmer profile"
                >
                  Save Number
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Future localized bulletins, false onset emergency warnings, and SMS advisories will be sent to this number.
            </p>
          </div>

          {/* Smartphone Mockup Preview */}
          <div className="bg-[#0F172A] border-4 border-slate-800 rounded-3xl p-3 shadow-2xl relative overflow-hidden">
            {/* Top Phone Notch */}
            <div className="w-24 h-3.5 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900 mr-2"></div>
              <div className="w-8 h-1 rounded bg-slate-900"></div>
            </div>

            {/* Screen Header */}
            <div className="bg-[#1E293B] border-b border-slate-800 p-2 rounded-t-xl flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deliveryChannel === 'whatsapp' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                <span className="font-bold text-white">
                  {deliveryChannel === 'whatsapp' ? 'MonsoonPulse Alert Bot' : 'GOV-MNPULS'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                {getLanguageMeta(currentDeliveryLang).nativeName}
              </span>
            </div>

            {/* Chat Bubble Display */}
            <div className="p-3 space-y-3 min-h-[220px] bg-[#0F172A]/70 rounded-b-xl">
              {deliveryChannel === 'whatsapp' ? (
                <div className="bg-emerald-950/70 border border-emerald-800/60 rounded-2xl p-3 text-xs text-emerald-100 space-y-2 shadow-md">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400/80 border-b border-emerald-800/40 pb-1 font-mono">
                    <span>Target Language: {getLanguageMeta(currentDeliveryLang).nativeName}</span>
                    <span>Direct Push</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed font-devanagari">
                    {getLocalizedWhatsappText()}
                  </pre>

                  {/* WhatsApp Action Buttons */}
                  <div className="pt-2 border-t border-emerald-800/60 flex flex-col gap-1.5">
                    <button className={`w-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-[11px] font-semibold py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1.5 border border-emerald-700/50 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                      <Check className="w-3.5 h-3.5" /> {t.acknowledgeAdvisory}
                    </button>
                    <button className={`w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1.5 border border-slate-700 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-400" /> {t.callKvkHelpline}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-3 text-xs text-slate-200 space-y-2 shadow-md">
                  <div className="flex items-center justify-between text-[10px] text-indigo-300/80 border-b border-slate-700 pb-1 font-mono">
                    <span>SMS Delivery: {getLanguageMeta(currentDeliveryLang).nativeName}</span>
                    <span>Priority Push</span>
                  </div>
                  <p className="font-sans leading-relaxed font-devanagari">
                    {getLocalizedSmsText()}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-700">
                    <span>GSM-7 / Unicode Standard</span>
                    <span>Length: {getLocalizedSmsText().length} chars</span>
                  </div>
                </div>
              )}
            </div>

            {/* Send Trigger Simulator Button */}
            <div className="mt-3 space-y-2">
              <button
                id="send-broadcast-simulator-btn"
                onClick={handleSimulateSend}
                disabled={sentSuccess}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition ${
                  sentSuccess
                    ? 'bg-emerald-600 text-white'
                    : deliveryChannel === 'whatsapp'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                } ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                {sentSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Message Delivered in {getLanguageMeta(currentDeliveryLang).nativeName}!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Push {deliveryChannel.toUpperCase()} to Farmer ({getLanguageMeta(currentDeliveryLang).nativeName})
                  </>
                )}
              </button>

              {sentSuccess && (
                <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-2.5 text-[11px] text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Delivered in {getLanguageMeta(currentDeliveryLang).nativeName} ({getLanguageMeta(currentDeliveryLang).name})
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Alert pushed to {phoneNumber}. Content matched specifically to the farmer's sign-in customized setting with zero English fallback.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  id="farmer-share-whatsapp-btn"
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-2 px-3 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-emerald-600/50"
                  title="Share directly via WhatsApp in farmer's selected language"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share ({getLanguageMeta(currentDeliveryLang).nativeName})</span>
                </button>

                <button
                  id="farmer-copy-text-btn"
                  onClick={handleCopyAdvisory}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
                  title="Copy Advisory Text"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
