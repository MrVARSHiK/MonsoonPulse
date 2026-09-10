import React from 'react';
import { 
  X, 
  Globe2, 
  Wind, 
  Layers, 
  Cpu, 
  Sprout, 
  Smartphone, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';
import { getHowItWorksTranslations } from '../data/guideTranslations';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  lang = 'en'
}) => {
  if (!isOpen) return null;

  const t = getHowItWorksTranslations(lang);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-slate-200">
        
        {/* Close Button */}
        <button
          id="close-how-it-works-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#0F172A] text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs text-slate-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* ORIGINAL ARCHITECTURE PIPELINE FLOW DIAGRAM (SVG / Styled Flex) */}
        <div className="mb-6 bg-[#0F172A] p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-indigo-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>{t.pipelineTitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            
            {/* Stage 1: Global Teleconnections */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 border border-amber-500/20">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Stage 1</div>
                <h4 className="text-xs font-bold text-white">{t.stages.stage1Title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {t.stages.stage1Desc}
                </p>
              </div>
            </div>

            {/* Stage 2: Tropospheric Advection */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 border border-indigo-500/20">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Stage 2</div>
                <h4 className="text-xs font-bold text-white">{t.stages.stage2Title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {t.stages.stage2Desc}
                </p>
              </div>
            </div>

            {/* Stage 3: Hybrid Downscaling */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 border border-indigo-500/20">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Stage 3</div>
                <h4 className="text-xs font-bold text-white">{t.stages.stage3Title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {t.stages.stage3Desc}
                </p>
              </div>
            </div>

            {/* Stage 4: Agronomic Decision Matrix */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/20">
                  <Sprout className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Stage 4</div>
                <h4 className="text-xs font-bold text-white">{t.stages.stage4Title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {t.stages.stage4Desc}
                </p>
              </div>
            </div>

            {/* Stage 5: Multichannel Dispatch */}
            <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2">
              <div>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 border border-purple-500/20">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">Stage 5</div>
                <h4 className="text-xs font-bold text-white">{t.stages.stage5Title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {t.stages.stage5Desc}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Plain-Language Explanations */}
        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t.section1Title}
            </h4>
            <p className="leading-relaxed">
              {t.section1Desc}
            </p>
          </div>

          <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              {t.section2Title}
            </h4>
            <p className="leading-relaxed">
              {t.section2Desc}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
          >
            {t.returnBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
