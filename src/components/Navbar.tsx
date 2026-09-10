import React from 'react';
import { 
  CloudRain, 
  MapPin, 
  Sparkles, 
  Layers, 
  Sprout, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  HelpCircle,
  Calendar,
  Languages,
  User,
  ShieldCheck,
  Globe2,
  BookOpen,
  Volume2,
  VolumeX,
  Award
} from 'lucide-react';
import { DistrictInfo, HistoricalScenario, Language, AuthUser } from '../types';
import { DISTRICTS, STATES } from '../data/climatologyData';
import { STATE_DISTRICT_LOOKUP } from '../data/stateDistrictMapping';
import { HISTORICAL_SCENARIOS } from '../data/historicalScenarios';
import { TRANSLATIONS, LOCALIZED_STATES, LOCALIZED_DISTRICTS } from '../data/translations';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { soundFx } from '../utils/soundFx';

interface NavbarProps {
  currentView: 'map' | 'advisory' | 'farmer' | 'extension' | 'validation' | 'pipeline';
  setCurrentView: (view: 'map' | 'advisory' | 'farmer' | 'extension' | 'validation' | 'pipeline') => void;
  selectedDistrict: DistrictInfo;
  setSelectedDistrict: (district: DistrictInfo) => void;
  selectedScenario: HistoricalScenario;
  setSelectedScenario: (scenario: HistoricalScenario) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenHowItWorks: () => void;
  onOpenGuide: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onOpenLanguageModal?: () => void;
  onOpenJudgeMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  selectedDistrict,
  setSelectedDistrict,
  selectedScenario,
  setSelectedScenario,
  language,
  setLanguage,
  onOpenHowItWorks,
  onOpenGuide,
  currentUser,
  onOpenAuth,
  onOpenLanguageModal,
  onOpenJudgeMode
}) => {
  const t = TRANSLATIONS[language];
  const [isMuted, setIsMuted] = React.useState<boolean>(() => soundFx.isMuted());
  const [isAudioActive, setIsAudioActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unsubscribe = soundFx.subscribe((playing) => {
      setIsAudioActive(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleMute = () => {
    const newMuted = soundFx.toggleMute();
    setIsMuted(newMuted);
  };

  const handleViewChange = (view: 'map' | 'advisory' | 'farmer' | 'extension' | 'validation' | 'pipeline') => {
    soundFx.playTabSwitch();
    if (currentUser?.role === 'farmer') {
      setCurrentView('advisory');
    } else {
      setCurrentView(view);
    }
  };

  const handleLangChange = (lang: Language) => {
    soundFx.playClick();
    setLanguage(lang);
  };

  const handleScenarioChange = (scenario: HistoricalScenario) => {
    soundFx.playRadarPing();
    setSelectedScenario(scenario);
  };

  // Filtered districts based on current state using JSON lookup
  const selectedState = selectedDistrict?.state || '';
  const currentStateDistricts = selectedState ? (STATE_DISTRICT_LOOKUP[selectedState] || []) : [];

  const handleStateChange = (stateName: string) => {
    soundFx.playClick();
    if (!stateName) return;
    // Auto-reset district selection when state changes:
    // Lookup matching districts from the state mapping JSON
    const stateDistricts = STATE_DISTRICT_LOOKUP[stateName] || [];
    if (stateDistricts.length > 0) {
      // Auto-reset to the first district of the newly selected state (never leaves stale district)
      setSelectedDistrict(stateDistricts[0]);
    }
  };

  const localizedDistrictName = LOCALIZED_DISTRICTS[selectedDistrict.id]?.[language] || selectedDistrict.name;
  const localizedStateName = LOCALIZED_STATES[selectedDistrict.state]?.[language] || selectedDistrict.state;

  return (
    <header className="border-b border-slate-800 bg-[#1E293B] sticky top-0 z-50 shadow-xl">
      {/* Top Banner: SIH 26086 Attribution & Live Metrics */}
      <div className="bg-[#0F172A] border-b border-slate-800/80 px-4 sm:px-6 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-indigo-500/10 text-indigo-400 font-semibold px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> SIH 26086
          </span>
          {onOpenJudgeMode && (
            <button
              id="open-judge-mode-btn"
              onClick={() => {
                soundFx.playSuccess();
                onOpenJudgeMode();
              }}
              className="bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 hover:from-amber-500/35 hover:to-yellow-500/35 text-amber-300 font-bold px-2.5 py-0.5 rounded-lg border border-amber-500/50 flex items-center gap-1.5 transition text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] ring-1 ring-amber-500/30"
              title="Open Evaluation Deck & Explanation for Judges"
            >
              <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
              <span>Judge / Jury Mode</span>
              <span className="bg-amber-400/30 text-amber-200 text-[10px] px-1 py-0.2 rounded font-mono font-black">
                DECK
              </span>
            </button>
          )}
          <span className="text-slate-400 hidden sm:inline">{t.moesNcmrwfSystem}</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-indigo-300 font-mono hidden md:inline">{t.downscalingActive}</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          {/* Sound FX Audio Toggle with Equalizer Wave Animation */}
          <button
            id="sound-fx-toggle-btn"
            onClick={handleToggleMute}
            className={`text-xs px-2.5 py-0.5 rounded-lg border transition flex items-center gap-1.5 font-mono ${
              !isMuted 
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {!isMuted ? (
              <>
                <Volume2 className={`w-3.5 h-3.5 text-cyan-400 ${isAudioActive ? 'animate-bounce' : ''}`} />
                <span className="hidden md:inline text-[11px]">Audio FX</span>
                {/* 3-bar animated audio equalizer */}
                <span className="flex items-center gap-0.5 h-3">
                  <span className={`w-0.5 rounded-full bg-cyan-400 transition-all duration-150 ${isAudioActive ? 'h-3 animate-pulse' : 'h-1.5'}`}></span>
                  <span className={`w-0.5 rounded-full bg-cyan-300 transition-all duration-150 ${isAudioActive ? 'h-2 animate-pulse delay-75' : 'h-2'}`}></span>
                  <span className={`w-0.5 rounded-full bg-cyan-400 transition-all duration-150 ${isAudioActive ? 'h-3.5 animate-pulse delay-150' : 'h-1'}`}></span>
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline text-[11px]">Muted</span>
              </>
            )}
          </button>

          {/* How to Use / Guide Button */}
          <button 
            id="how-to-use-guide-btn"
            onClick={() => {
              soundFx.playWelcome();
              onOpenGuide();
            }}
            className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-600 px-2.5 py-0.5 rounded border border-emerald-500/30 transition shadow-sm font-medium"
          >
            <BookOpen className="w-3 h-3 text-emerald-400" /> 
            <span className={language !== 'en' ? 'font-devanagari' : ''}>{t.howToUseBtn}</span>
          </button>

          <button 
            id="how-it-works-btn"
            onClick={() => {
              soundFx.playClick();
              onOpenHowItWorks();
            }}
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-600 px-2.5 py-0.5 rounded border border-indigo-500/30 transition hidden sm:flex font-medium"
          >
            <HelpCircle className="w-3 h-3 text-indigo-400" /> 
            <span className={language !== 'en' ? 'font-devanagari' : ''}>{t.systemSpecsBtn}</span>
          </button>
          
          {/* User Sign-In / User Profile Button */}
          <button
            id="auth-user-btn"
            onClick={() => {
              soundFx.playClick();
              onOpenAuth();
            }}
            className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition ${
              currentUser 
                ? currentUser.role === 'farmer'
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30'
                  : 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {currentUser ? (
              <>
                <img 
                  src={currentUser.picture} 
                  alt={currentUser.name} 
                  className="w-4 h-4 rounded-full border border-emerald-400/40"
                  referrerPolicy="no-referrer"
                />
                <span className="font-semibold max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                  currentUser.role === 'farmer' 
                    ? 'bg-emerald-500/30 text-emerald-200' 
                    : 'bg-indigo-500/30 text-indigo-200'
                }`}>
                  {currentUser.role === 'farmer' ? '🌾 Farmer' : currentUser.role === 'officer' ? '🏢 Officer' : currentUser.role === 'scientist' ? '🔬 Scientist' : '👤 User'}
                </span>
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium">Sign In</span>
              </>
            )}
          </button>

          {/* Comprehensive Multi-Language Switcher & Settings */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 rounded-lg p-1 border border-slate-700 shadow-sm">
            <Languages className="w-3.5 h-3.5 text-indigo-400 ml-1 shrink-0" />
            
            {/* Quick Pill for English */}
            <button
              id="lang-en-btn"
              onClick={() => handleLangChange('en')}
              className={`px-1.5 py-0.5 text-xs rounded transition ${language === 'en' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="English"
            >
              EN
            </button>

            {/* Quick Pill for Marathi */}
            <button
              id="lang-mr-btn"
              onClick={() => handleLangChange('mr')}
              className={`px-1.5 py-0.5 text-xs rounded transition font-devanagari ${language === 'mr' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="मराठी (Marathi)"
            >
              मराठी
            </button>

            {/* Quick Pill for Hindi */}
            <button
              id="lang-hi-btn"
              onClick={() => handleLangChange('hi')}
              className={`px-1.5 py-0.5 text-xs rounded transition font-devanagari ${language === 'hi' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="हिन्दी (Hindi)"
            >
              हिंदी
            </button>

            {/* Quick Pill for Telugu */}
            <button
              id="lang-te-btn"
              onClick={() => handleLangChange('te')}
              className={`px-1.5 py-0.5 text-xs rounded transition ${language === 'te' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200 hidden xl:inline'}`}
              title="తెలుగు (Telugu)"
            >
              తెలుగు
            </button>

            {/* All Languages Dropdown Select */}
            <div className="relative flex items-center border-l border-slate-700 pl-1.5">
              <select
                id="language-all-select"
                value={language}
                onChange={(e) => handleLangChange(e.target.value as Language)}
                className="bg-[#0F172A] text-slate-200 text-xs font-semibold px-2 py-0.5 rounded border border-slate-700 focus:outline-none cursor-pointer hover:border-indigo-500 transition max-w-[130px]"
                title="Select from 14+ Indian & Regional Languages"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} className="bg-[#0F172A] text-white">
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Full Modal Trigger */}
            <button
              id="open-all-languages-modal-btn"
              onClick={() => {
                soundFx.playClick();
                if (onOpenLanguageModal) {
                  onOpenLanguageModal();
                }
              }}
              className="px-2 py-0.5 text-[11px] rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 font-semibold flex items-center gap-1 transition shadow-sm"
              title="Open full Language & Regional Dialects Settings"
            >
              <Globe2 className="w-3 h-3 text-indigo-300" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewChange('map')}>
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400/40">
            <CloudRain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
                MonsoonPulse 
                <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded ml-2 uppercase font-mono tracking-wider">
                  {t.brandTag}
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              <span>{t.regionLabel}: </span>
              <span className={`text-slate-200 font-semibold ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {localizedDistrictName}, {localizedStateName}
              </span>
            </p>
          </div>
        </div>

        {/* Global Selectors & Multi-State Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          
          {/* 1. Multi-State Selector */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm">
            <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className={`text-xs text-slate-400 hidden sm:inline ${language !== 'en' ? 'font-devanagari' : ''}`}>{t.stateLabel}</span>
            <select
              id="state-select"
              value={selectedDistrict.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className={`bg-transparent text-cyan-300 font-semibold text-xs sm:text-sm focus:outline-none cursor-pointer ${language !== 'en' ? 'font-devanagari' : ''}`}
            >
              {STATES.map(stateName => (
                <option key={stateName} value={stateName} className="bg-[#0F172A] text-white">
                  {LOCALIZED_STATES[stateName]?.[language] || stateName}
                </option>
              ))}
            </select>
          </div>

          {/* 2. District Picker - Dependent on State */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm">
            <MapPin className={`w-4 h-4 shrink-0 ${selectedState ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className={`text-xs text-slate-400 hidden sm:inline ${language !== 'en' ? 'font-devanagari' : ''}`}>{t.districtLabel}</span>
            <select
              id="district-select"
              value={selectedDistrict?.id || ''}
              disabled={!selectedState || currentStateDistricts.length === 0}
              onChange={(e) => {
                const found = currentStateDistricts.find(d => d.id === e.target.value);
                if (found) setSelectedDistrict(found);
              }}
              className={`bg-transparent font-medium text-xs sm:text-sm focus:outline-none cursor-pointer ${
                !selectedState ? 'text-slate-500 cursor-not-allowed italic' : 'text-white'
              } ${language !== 'en' ? 'font-devanagari' : ''}`}
            >
              {!selectedState || currentStateDistricts.length === 0 ? (
                <option value="" disabled className="bg-[#0F172A] text-slate-500">Select a state first</option>
              ) : (
                currentStateDistricts.map(d => (
                  <option key={d.id} value={d.id} className="bg-[#0F172A] text-white">
                    {LOCALIZED_DISTRICTS[d.id]?.[language] || d.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* 3. Scenario / Backtest Selector */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className={`text-xs text-slate-400 hidden sm:inline ${language !== 'en' ? 'font-devanagari' : ''}`}>{t.climateLabel}</span>
            <select
              id="scenario-select"
              value={selectedScenario.id}
              onChange={(e) => {
                const found = HISTORICAL_SCENARIOS.find(s => s.id === e.target.value);
                if (found) setSelectedScenario(found);
              }}
              className="bg-transparent text-indigo-300 font-medium text-xs sm:text-sm focus:outline-none cursor-pointer max-w-[140px] sm:max-w-none truncate"
            >
              {HISTORICAL_SCENARIOS.map(s => (
                <option key={s.id} value={s.id} className="bg-[#0F172A] text-white">
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-t border-slate-800 pt-1 pb-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {currentUser?.role === 'farmer' ? (
            /* FARMER VIEW: ONLY THE CROP ADVISORY ENGINE IS SHOWN */
            <div className="flex items-center gap-2">
              <button
                id="nav-tab-advisory"
                onClick={() => handleViewChange('advisory')}
                className="px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 bg-emerald-600 text-white shadow-md shadow-emerald-950/60 border border-emerald-400"
              >
                <Sprout className="w-4 h-4 text-emerald-300" />
                <span>{t.tabCropAdvisory}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/40 ml-1">
                  🌾 Farmer Dedicated Engine
                </span>
              </button>
            </div>
          ) : (
            /* ALL OTHER PERSONS (OFFICER, SCIENTIST, GENERAL, GUEST): FULL DASHBOARD ACCESS */
            <>
              <button
                id="nav-tab-map"
                onClick={() => handleViewChange('map')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition shrink-0 ${
                  currentView === 'map'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                } ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                <Layers className="w-4 h-4" />
                <span>{t.tabRiskMap}</span>
              </button>

              <button
                id="nav-tab-advisory"
                onClick={() => handleViewChange('advisory')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition shrink-0 relative ${
                  currentView === 'advisory'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60 border border-emerald-400'
                    : 'bg-emerald-950/40 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-900/50 border border-emerald-500/40 shadow-sm'
                } ${language !== 'en' ? 'font-devanagari' : ''}`}
                title="Crop Advisory Engine: Accessible to all farmers & extension officers"
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>{t.tabCropAdvisory}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/40 ml-1">
                  🌾 Open to Farmers
                </span>
              </button>

              <button
                id="nav-tab-farmer"
                onClick={() => handleViewChange('farmer')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition shrink-0 ${
                  currentView === 'farmer'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                } ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{t.tabFarmerMobile}</span>
              </button>

              <button
                id="nav-tab-extension"
                onClick={() => handleViewChange('extension')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition shrink-0 ${
                  currentView === 'extension'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                } ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t.tabExtensionConsole}</span>
              </button>

              <button
                id="nav-tab-validation"
                onClick={() => handleViewChange('validation')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition shrink-0 ${
                  currentView === 'validation'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                } ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.tabValidation}</span>
              </button>
            </>
          )}
        </div>

        {/* Dynamic Mode Badge */}
        {currentUser?.role === 'farmer' ? (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg shrink-0">
            <span>🌾 Farmer Mode: Showing Crop Advisory Engine Only</span>
            <button
              onClick={onOpenAuth}
              className="text-[11px] text-slate-300 hover:text-white underline ml-1 font-semibold"
            >
              Switch Role
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-2.5 py-1 rounded-lg shrink-0">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Full Dashboard Mode (All Views Active)</span>
          </div>
        )}
      </div>
    </header>
  );
};
