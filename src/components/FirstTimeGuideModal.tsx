import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sprout, 
  AlertTriangle, 
  Volume2, 
  Sparkles, 
  Check, 
  Globe2, 
  Play, 
  Compass, 
  Radio, 
  Clock, 
  ArrowRight, 
  CloudRain
} from 'lucide-react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { soundFx } from '../utils/soundFx';
import { getGuideTranslations } from '../data/guideTranslations';

interface FirstTimeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageChange?: (lang: Language) => void;
  onNavigateToView?: (view: 'map' | 'advisory' | 'farmer' | 'extension' | 'validation') => void;
  onOpenAuth?: () => void;
}

export const FirstTimeGuideModal: React.FC<FirstTimeGuideModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
  onNavigateToView,
  onOpenAuth
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [autoOpenOnLaunch, setAutoOpenOnLaunch] = useState<boolean>(() => {
    try {
      const pref = localStorage.getItem('monsoonpulse_auto_open_guide');
      return pref !== 'false'; // Default to true!
    } catch {
      return true;
    }
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const [lastSoundPlayed, setLastSoundPlayed] = useState<string | null>(null);

  // Sync language with parent prop
  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);

  // When modal opens, play the welcome chime!
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        soundFx.playWelcome();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLangSelect = (newLang: Language) => {
    setActiveLang(newLang);
    soundFx.playClick();
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const handleClose = () => {
    soundFx.playClick();
    try {
      localStorage.setItem('monsoonpulse_auto_open_guide', autoOpenOnLaunch ? 'true' : 'false');
    } catch {}
    onClose();
  };

  const handleProceedToSignIn = () => {
    soundFx.playClick();
    try {
      localStorage.setItem('monsoonpulse_auto_open_guide', autoOpenOnLaunch ? 'true' : 'false');
    } catch {}
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      onClose();
    }
  };

  const playSoundTest = (type: 'welcome' | 'radar' | 'alarm' | 'rain' | 'success') => {
    setLastSoundPlayed(type);
    if (type === 'welcome') soundFx.playWelcome();
    else if (type === 'radar') soundFx.playRadarPing();
    else if (type === 'alarm') soundFx.playWarningAlarm();
    else if (type === 'rain') soundFx.playRainDrops();
    else if (type === 'success') soundFx.playSuccess();

    setTimeout(() => {
      setLastSoundPlayed(null);
    }, 800);
  };

  const t = getGuideTranslations(activeLang);

  const stepMeta = [
    { id: 'step-overview', icon: Compass, color: 'from-indigo-500 to-cyan-500', targetView: 'map' as const, viewIcon: Globe2 },
    { id: 'step-crop', icon: Sprout, color: 'from-emerald-500 to-teal-500', targetView: 'advisory' as const, viewIcon: Sprout },
    { id: 'step-alarm', icon: AlertTriangle, color: 'from-rose-500 to-amber-500', targetView: 'map' as const, viewIcon: AlertTriangle },
    { id: 'step-audio', icon: Volume2, color: 'from-cyan-500 to-blue-500', targetView: 'farmer' as const, viewIcon: Volume2 }
  ];

  const currentStep = t.steps[activeStep] || t.steps[0];
  const currentMeta = stepMeta[activeStep] || stepMeta[0];
  const StepIcon = currentMeta.icon;
  const CalloutIcon = currentMeta.viewIcon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#070D1B]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        
        {/* Animated Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="bg-[#141E33] border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 relative"
        >
          {/* Subtle Top Radar Scan Effect Bar */}
          <div className="h-1 w-full bg-slate-800 overflow-hidden relative">
            <motion.div 
              className="h-full w-40 bg-gradient-to-r from-transparent via-emerald-400 to-cyan-400"
              animate={{ x: ['-100%', '400%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
          </div>

          {/* Modal Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950/70 via-[#141E33] to-indigo-950/70 border-b border-slate-800 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-inner relative group">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 text-emerald-400 animate-ping" />
                    {t.guideTag}
                  </span>

                  {/* Multi-Language Selector */}
                  <div className="flex items-center gap-1 bg-[#0B1329] border border-slate-700 rounded-lg p-0.5 flex-wrap">
                    {(['en', 'mr', 'hi', 'te', 'kn', 'gu'] as Language[]).map(l => {
                      const meta = SUPPORTED_LANGUAGES.find(sl => sl.code === l);
                      return (
                        <button
                          key={l}
                          type="button"
                          onClick={() => handleLangSelect(l)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                            activeLang === l
                              ? 'bg-emerald-500 text-slate-950 shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title={meta ? meta.name : l}
                        >
                          {meta ? meta.nativeName : l}
                        </button>
                      );
                    })}

                    {/* All languages select dropdown */}
                    <select
                      value={activeLang}
                      onChange={(e) => handleLangSelect(e.target.value as Language)}
                      className="bg-[#0F172A] text-emerald-300 text-xs font-bold px-1.5 py-0.5 rounded border-l border-slate-700 focus:outline-none cursor-pointer hover:text-white"
                      title="Select any Indian language (14+ supported)"
                    >
                      {SUPPORTED_LANGUAGES.map(sl => (
                        <option key={sl.code} value={sl.code} className="bg-[#0B1329] text-white">
                          {sl.nativeName} ({sl.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-white">
                  {t.title}
                </h2>
                <p className="text-xs text-slate-400">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              id="close-guide-modal-x"
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700"
              title={t.closeTooltip}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Sound Effects Preview Bar */}
          <div className="bg-[#0B1329] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>{t.soundFxTitle}</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => playSoundTest('welcome')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono border transition flex items-center gap-1 ${
                  lastSoundPlayed === 'welcome' 
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 scale-105' 
                    : 'bg-[#141E33] text-slate-300 border-slate-700 hover:border-cyan-500'
                }`}
              >
                <Play className="w-2.5 h-2.5" /> {t.sounds.chime}
              </button>

              <button
                type="button"
                onClick={() => playSoundTest('radar')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono border transition flex items-center gap-1 ${
                  lastSoundPlayed === 'radar' 
                    ? 'bg-indigo-500 text-white font-bold border-indigo-400 scale-105' 
                    : 'bg-[#141E33] text-slate-300 border-slate-700 hover:border-indigo-500'
                }`}
              >
                <Radio className="w-2.5 h-2.5" /> {t.sounds.radar}
              </button>

              <button
                type="button"
                onClick={() => playSoundTest('alarm')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono border transition flex items-center gap-1 ${
                  lastSoundPlayed === 'alarm' 
                    ? 'bg-rose-600 text-white font-bold border-rose-400 scale-105' 
                    : 'bg-[#141E33] text-slate-300 border-slate-700 hover:border-rose-500'
                }`}
              >
                <AlertTriangle className="w-2.5 h-2.5" /> {t.sounds.alarm}
              </button>

              <button
                type="button"
                onClick={() => playSoundTest('rain')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono border transition flex items-center gap-1 ${
                  lastSoundPlayed === 'rain' 
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 scale-105' 
                    : 'bg-[#141E33] text-slate-300 border-slate-700 hover:border-sky-500'
                }`}
              >
                <CloudRain className="w-2.5 h-2.5" /> {t.sounds.rain}
              </button>

              <button
                type="button"
                onClick={() => playSoundTest('success')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono border transition flex items-center gap-1 ${
                  lastSoundPlayed === 'success' 
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 scale-105' 
                    : 'bg-[#141E33] text-slate-300 border-slate-700 hover:border-emerald-500'
                }`}
              >
                <Check className="w-2.5 h-2.5" /> {t.sounds.success}
              </button>
            </div>
          </div>

          {/* Interactive Step Switcher Tabs */}
          <div className="grid grid-cols-4 bg-[#0E1729] border-b border-slate-800 p-1.5 gap-1">
            {stepMeta.map((meta, idx) => {
              const Icon = meta.icon;
              const isActive = activeStep === idx;
              const stepData = t.steps[idx] || t.steps[0];
              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => {
                    setActiveStep(idx);
                    soundFx.playTabSwitch();
                  }}
                  className={`py-2 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition relative ${
                    isActive 
                      ? 'bg-[#1E293B] text-white shadow-md border border-slate-700' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#141E33]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-[11px] font-bold leading-tight line-clamp-1">
                    {stepData.tag}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeGuideTabIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Step Content Body */}
          <div className="p-5 space-y-4 max-h-[52vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Step Headline Card */}
                <div className="bg-[#0B1329] p-4 rounded-xl border border-slate-800 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentMeta.color} text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-lg`}>
                    {activeStep + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                      <StepIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{currentStep.title}</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentStep.desc}
                    </p>
                  </div>
                </div>

                {/* Key Capabilities / Bullet points */}
                <div className="bg-[#0E1729]/80 rounded-xl border border-slate-800/80 p-3.5 space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    {t.highlightsHeading}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {currentStep.features.map((item, fIdx) => (
                      <div key={fIdx} className="bg-[#141E33] p-2.5 rounded-lg border border-slate-800 text-xs flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-200 leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Specific Visual Assist Callout */}
                <div className="bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-slate-900 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalloutIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">{currentStep.callout}</span>
                  </div>
                  {onNavigateToView && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToView(currentMeta.targetView);
                        handleClose();
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shrink-0 transition shadow-sm cursor-pointer"
                    >
                      {currentStep.actionBtn}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-[#0B1329] border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
            {/* Startup Toggle Preference */}
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                id="auto-open-guide-checkbox"
                type="checkbox"
                checked={autoOpenOnLaunch}
                onChange={(e) => {
                  setAutoOpenOnLaunch(e.target.checked);
                  soundFx.playClick();
                }}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                {t.autoOpenText}
              </span>
            </label>

            <div className="flex items-center gap-2">
              {activeStep < stepMeta.length - 1 ? (
                <button
                  id="next-guide-step-btn"
                  type="button"
                  onClick={() => {
                    setActiveStep(s => s + 1);
                    soundFx.playClick();
                  }}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.nextStepBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : null}

              <button
                id="start-monsoonpulse-btn"
                type="button"
                onClick={handleProceedToSignIn}
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 active:scale-95 group cursor-pointer"
              >
                <span>{t.getStartedBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

