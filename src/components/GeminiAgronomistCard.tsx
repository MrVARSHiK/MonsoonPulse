import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, Key, AlertCircle, RefreshCw, Volume2, Copy, Check, ChevronRight, Mic, MicOff, Radio } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlockInfo, CropGrowthStage, CropId, Language, ProbabilisticForecast } from '../types';
import { CROPS } from '../data/climatologyData';

interface GeminiAgronomistCardProps {
  block: BlockInfo;
  cropId: CropId;
  stage: CropGrowthStage;
  forecast: ProbabilisticForecast;
  language: Language;
  onOpenVoiceAssistant?: () => void;
}

export const GeminiAgronomistCard: React.FC<GeminiAgronomistCardProps> = ({
  block,
  cropId,
  stage,
  forecast,
  language,
  onOpenVoiceAssistant
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const crop = CROPS[cropId] || CROPS['cotton'];

  // Language mapping for speech recognition and synthesis
  const speechLangMap: Record<string, string> = {
    hi: 'hi-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    kn: 'kn-IN',
    gu: 'gu-IN',
    ta: 'ta-IN',
    bn: 'bn-IN',
    en: 'en-IN'
  };

  // Check Gemini status on mount
  useEffect(() => {
    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => {
        setIsConfigured(data.configured);
      })
      .catch(() => {
        setIsConfigured(false);
      });

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleAsk = async (queryText?: string) => {
    const q = queryText !== undefined ? queryText : question;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockName: block.name,
          districtName: block.districtName,
          stateName: block.state,
          cropName: crop.name,
          stage,
          forecast,
          language,
          question: q.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.answer) {
        setResponse(data.answer);
      } else if (data.error) {
        setResponse(`Error: ${data.error}`);
      }
      if (typeof data.configured === 'boolean') {
        setIsConfigured(data.configured);
      }
    } catch (err: any) {
      setResponse(`Request error: ${err.message || 'Failed to reach server'}`);
    } finally {
      setLoading(false);
    }
  };

  // Speech Recognition
  const handleToggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        language === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है।'
          : language === 'te'
          ? 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు.'
          : 'Voice recognition is not supported in your browser.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = speechLangMap[language] || 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        if (spoken) {
          setQuestion(spoken);
          handleAsk(spoken);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !response) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = response.replace(/[#*`_~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechLangMap[language] || 'en-IN';

    // Select regional voice if available in browser
    const voices = window.speechSynthesis.getVoices();
    const target = utterance.lang.toLowerCase();
    const prefix = target.split('-')[0];
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase() === target || 
      v.lang.toLowerCase().replace('_', '-') === target ||
      v.lang.toLowerCase().startsWith(prefix)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const sampleQuestions = [
    {
      en: `Can I sow ${crop.name} if rain is delayed by ${forecast.onsetDelayShiftDays} days?`,
      mr: `पाऊस ${forecast.onsetDelayShiftDays} दिवस लांबल्यास ${crop.nameMr} ची पेरणी करावी का?`,
      hi: `यदि मानसून ${forecast.onsetDelayShiftDays} दिन की देरी से है तो क्या ${crop.nameHi} बोएं?`,
      te: `వర్షం ${forecast.onsetDelayShiftDays} రోజులు ఆలస్యమైతే ${crop.name} విత్తవచ్చా?`
    },
    {
      en: `How to protect seedlings if break-phase lasts 7+ days?`,
      mr: `पावसाचा खंड ७ दिवसांपेक्षा जास्त पडल्यास रोपे कशी वाचवावी?`,
      hi: `7+ दिनों का सूखा पड़ने पर अंकुरित पौधों की रक्षा कैसे करें?`,
      te: `7 రోజులకు పైగా వర్షాభావం/విరామం వస్తే మొలకలను ఎలా కాపాడాలి?`
    },
    {
      en: `Is Broad Bed Furrow (BBF) recommended for my ${block.climatology.soilType}?`,
      mr: `${block.climatology.soilType} जमिनीसाठी बीबीएफ (BBF) फायदेशीर ठरेल का?`,
      hi: `${block.climatology.soilType} मिट्टी के लिए क्या बीबीएफ पद्धति उपयुक्त है?`,
      te: `మా ${block.climatology.soilType} నేలకు బ్రాడ్ బెడ్ ఫర్రో (BBF) పద్ధతి అనుకూలమా?`
    }
  ];

  return (
    <div className="bg-[#1E293B] border border-indigo-900/60 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Agro-Meteorologist AI Advisory</span>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded-full">
                  S2S Intelligence
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live scientific reasoning grounded in S2S ensemble forecasts & ICAR/MoES contingency protocols
            </p>
          </div>
        </div>

        {/* Top actions: Voice Assistant trigger & API Key Status */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Open Full Voice Assistant (Hindi & Telugu)"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Voice Assistant (किसाన్ / किसान)</span>
            </button>
          )}

          {/* API Key Status Badge */}
          <div className="flex items-center gap-1.5 text-xs">
            {isConfigured === true ? (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                API Key Active
              </span>
            ) : (
              <div className="flex items-center gap-1 text-amber-300 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-lg text-[11px]">
                <Key className="w-3 h-3 text-amber-400" />
                <span>AI Studio Secrets: Add GEMINI_API_KEY</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notice regarding AI Studio API Key if not configured */}
      {isConfigured === false && (
        <div className="bg-[#0F172A] border border-amber-500/30 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-300">Why does AI Studio show "API key required"?</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Google AI Studio requires your personal Gemini API key to run live generative queries with <code className="text-indigo-300">gemini-3.1-flash-lite</code>.
              To connect it, click the <strong>Key / Secrets</strong> icon in AI Studio's top toolbar, select or paste your Gemini API key, and it will be securely injected into <code className="text-indigo-300">process.env.GEMINI_API_KEY</code>.
            </p>
          </div>
        </div>
      )}

      {/* Action / Query Row */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleAsk('')}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition shrink-0 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bot className="w-3.5 h-3.5" />
            )}
            <span>Generate Deep AI Strategy ({crop.name})</span>
          </button>

          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>
                {language === 'hi' ? 'बोलकर पूछें (Voice)' : language === 'te' ? 'మాట్లాడి అడగండి (Voice)' : 'Ask with Voice'}
              </span>
            </button>
          )}

          <span className="text-xs text-slate-500 font-medium">or ask a specific question below</span>
        </div>

        {/* Quick Sample Questions with Hindi & Telugu & Marathi */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400">Quick Prompts:</span>
          {sampleQuestions.map((sq, i) => {
            const promptText = (language === 'mr' && sq.mr) || (language === 'hi' && sq.hi) || (language === 'te' && sq.te) || sq.en;
            return (
              <button
                key={i}
                onClick={() => {
                  setQuestion(promptText);
                  handleAsk(promptText);
                }}
                disabled={loading}
                className="text-[11px] bg-[#0F172A] hover:bg-slate-800 text-slate-300 border border-slate-700/80 px-2.5 py-1 rounded-md transition flex items-center gap-1 text-left cursor-pointer"
              >
                <span>{promptText}</span>
                <ChevronRight className="w-3 h-3 text-indigo-400" />
              </button>
            );
          })}
        </div>

        {/* Input box with Voice Recognition Mic button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleAsk();
              }
            }}
            placeholder={
              language === 'hi'
                ? `पूछें: ${crop.nameHi || crop.name} बुवाई, बारिश या नमी के बारे में...`
                : language === 'te'
                ? `అడగండి: ${crop.name} విత్తడం, వర్షం లేదా నేల తేమ గురించి...`
                : `Ask Gemini about ${crop.name} in ${block.name} (e.g. soil moisture, break spell, irrigation)...`
            }
            className="bg-[#0F172A] border border-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-lg flex-1 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
          />

          {/* Voice Input Button */}
          <button
            onClick={handleToggleVoiceInput}
            className={`p-2 rounded-lg transition border cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak question'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2 rounded-lg transition cursor-pointer"
            title="Ask Gemini"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {isListening && (
          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 animate-pulse bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
            <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
            <span>
              {language === 'hi' 
                ? 'सुन रहे हैं... कृपया अपना प्रश्न बोलें' 
                : language === 'te' 
                ? 'వింటున్నాము... దయచేసి మాట్లాడండి' 
                : 'Listening... speak your question now'}
            </span>
          </div>
        )}
      </div>

      {/* Response Box with Multilingual Audio */}
      {response && (
        <div className="bg-[#0F172A] border border-indigo-900/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              Agro-Meteorological Advisory Analysis
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className={`transition p-1 flex items-center gap-1 text-[11px] rounded px-2 py-0.5 cursor-pointer ${
                  isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'hover:text-slate-200 bg-slate-800 text-indigo-300'
                }`}
                title="Listen to advice in active language"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
              <button
                onClick={handleCopy}
                className="hover:text-slate-200 transition p-1 flex items-center gap-1 text-[11px] cursor-pointer"
                title="Copy advice"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed space-y-2 prose prose-invert max-w-none">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
