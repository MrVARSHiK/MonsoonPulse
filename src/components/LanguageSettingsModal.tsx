import React, { useState, useMemo } from 'react';
import { 
  Languages, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Globe2, 
  MapPin, 
  Volume2, 
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { Language, LanguageMeta } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { soundFx } from '../utils/soundFx';

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageSettingsModal: React.FC<LanguageSettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'popular' | 'south' | 'west' | 'north' | 'east'>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Languages (14)' },
    { id: 'popular', label: 'Major Agri Zones' },
    { id: 'south', label: 'Southern' },
    { id: 'west', label: 'Western' },
    { id: 'north', label: 'Northern' },
    { id: 'east', label: 'Eastern & NE' }
  ] as const;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => {
    const matchesSearch = 
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'popular') return lang.isPopular;
    if (selectedCategory === 'south') return ['te', 'kn', 'ta', 'ml'].includes(lang.code);
    if (selectedCategory === 'west') return ['mr', 'gu', 'mr_local'].includes(lang.code);
    if (selectedCategory === 'north') return ['hi', 'pa', 'ur', 'en'].includes(lang.code);
    if (selectedCategory === 'east') return ['bn', 'or', 'as'].includes(lang.code);
    return true;
  });

  const handleChoose = (code: Language) => {
    soundFx.playSuccess();
    onSelectLanguage(code);
    try {
      localStorage.setItem('monsoonpulse_language', code);
    } catch {
      // ignore
    }
  };

  const handleClose = () => {
    soundFx.playClick();
    onClose();
  };

  const currentMeta = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || {
    name: 'Custom',
    nativeName: currentLanguage,
    region: 'Configured'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="bg-[#1E293B] border border-indigo-500/40 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Language & Regional Settings
                </h3>
                <span className="text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  14+ Indian Languages
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Select your preferred language or regional agricultural dialect for instant localization
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by language name or region (e.g. Telugu, Kannada, Gujarati, Punjabi, বাংলা, தமிழ்)..."
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playTabSwitch();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh]">
          {filteredLanguages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleChoose(lang.code)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 relative group ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                    : 'bg-[#0F172A] border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white tracking-wide">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs font-medium text-indigo-300">
                        ({lang.name})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{lang.region}</span>
                    </p>
                  </div>

                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 group-hover:border-indigo-400 group-hover:text-indigo-400 transition">
                      <span className="text-[10px] uppercase font-mono font-bold">{lang.code}</span>
                    </span>
                  )}
                </div>

                {/* Sample phrase in script */}
                <div className="mt-1 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="truncate italic text-slate-400 font-sans">
                    "{lang.samplePhrase}"
                  </span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded font-mono shrink-0 ml-2">
                    {lang.script}
                  </span>
                </div>
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="col-span-2 py-12 text-center text-slate-400 space-y-2">
              <Languages className="w-8 h-8 mx-auto text-slate-600 mb-1" />
              <p className="text-sm font-semibold text-slate-300">No matching language found</p>
              <p className="text-xs text-slate-500">Try searching with a different term like "Marathi", "Telugu", or "Gujarati"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-indigo-400 hover:underline"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300">
              Active: <strong className="text-white">{currentMeta.nativeName} ({currentMeta.name})</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done / Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
