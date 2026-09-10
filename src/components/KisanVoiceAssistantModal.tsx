import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Languages, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Copy, 
  Check, 
  Send,
  Radio,
  Sprout
} from 'lucide-react';
import { BlockInfo, ProbabilisticForecast, Language } from '../types';
import { CROPS } from '../data/climatologyData';
import { soundFx } from '../utils/soundFx';
import { speechService } from '../utils/speechService';

interface KisanVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: BlockInfo;
  forecast: ProbabilisticForecast;
  cropId: string;
  initialLanguage: Language;
}

export const KisanVoiceAssistantModal: React.FC<KisanVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  block,
  forecast,
  cropId,
  initialLanguage
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>(
    ['hi', 'te', 'mr', 'en'].includes(initialLanguage) ? initialLanguage : 'hi'
  );
  const [query, setQuery] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [responseSource, setResponseSource] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoiceEngine, setActiveVoiceEngine] = useState<'gemini-tts' | 'browser-speech' | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.9);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const recognitionRef = useRef<any>(null);

  const crop = CROPS[cropId] || CROPS['soybean'];

  // Language mapping for Web Speech API and UI
  const langConfig: Record<string, {
    name: string;
    nativeName: string;
    bcp47: string;
    greeting: string;
    micPrompt: string;
    listeningText: string;
    assistantTitle: string;
    placeholder: string;
    quickQueries: string[];
    cropName: string;
  }> = {
    hi: {
      name: 'Hindi',
      nativeName: 'हिन्दी',
      bcp47: 'hi-IN',
      greeting: `नमस्ते किसान भाई! मैं मानसूनपल्स आवाज़ सहायक हूँ। ${crop.nameHi || crop.name} और मौसम के बारे में कुछ भी पूछें।`,
      micPrompt: 'बोलने के लिए माइक दबाएं',
      listeningText: 'सुन रहे हैं... कृपया अपना प्रश्न बोलें',
      assistantTitle: 'किसान आवाज़ सहायक (Kisan Voice)',
      placeholder: 'बोलें या प्रश्न यहाँ टाइप करें...',
      cropName: crop.nameHi || crop.name,
      quickQueries: [
        `क्या मैं अभी ${crop.nameHi || crop.name} की बुवाई कर सकता हूँ?`,
        'बारिश में 7 दिन का सूखा पड़ने पर फसल कैसे बचाएं?',
        'क्या इस मौसम में ब्रॉड बेड फरो (BBF) विधि फायदेमंद है?',
        'बुवाई के लिए मिट्टी में न्यूनतम कितनी नमी चाहिए?',
        'अगले सप्ताह कितनी बारिश होने का अनुमान है?'
      ]
    },
    te: {
      name: 'Telugu',
      nativeName: 'తెలుగు',
      bcp47: 'te-IN',
      greeting: `నమస్కారం రైతు సోదరులారా! నేను మాన్‌సూన్‌పల్స్ వాయిస్ అసిస్టెంట్‌ని. ${crop.name} మరియు వర్ష సూచన గురించి ఏమైనా అడగండి.`,
      micPrompt: 'మాట్లాడటానికి మైక్ నొక్కండి',
      listeningText: 'వింటున్నాము... దయచేసి మీ ప్రశ్న అడగండి',
      assistantTitle: 'కిసాన్ వాయిస్ అసిస్టెంట్ (Kisan Voice)',
      placeholder: 'మాట్లాడండి లేదా ప్రశ్న టైప్ చేయండి...',
      cropName: crop.name,
      quickQueries: [
        `నేను ఇప్పుడు ${crop.name} విత్తనాలు వేయవచ్చా?`,
        'వర్షం ఆలస్యమైతే లేదా విరామం వస్తే పంటను ఎలా కాపాడుకోవాలి?',
        'మా నేలకు బ్రాడ్ బెడ్ ఫర్రో (BBF) పద్ధతి సరిపోతుందా?',
        'విత్తే ముందు నేలలో ఎంత వర్షం మరియు తేమ ఉండాలి?',
        'రాబోయే వారంలో ఎన్ని మి.మీ వర్షపాతం నమోదవుతుంది?'
      ]
    },
    mr: {
      name: 'Marathi',
      nativeName: 'मराठी',
      bcp47: 'mr-IN',
      greeting: `रामराम शेतकरी बंधूंनो! मी मान्सूनपल्स ऑडिओ सल्लागार आहे. ${crop.nameMr || crop.name} आणि पावसाविषयी काहीही विचारा.`,
      micPrompt: 'बोलण्यासाठी माइक दाबा',
      listeningText: 'ऐकत आहोत... कृपया आपला प्रश्न विचारा',
      assistantTitle: 'शेतकरी व्हॉईस असिस्टंट (Kisan Voice)',
      placeholder: 'बोला किंवा प्रश्न येथे टाइप करा...',
      cropName: crop.nameMr || crop.name,
      quickQueries: [
        `पाऊस लांबल्यास ${crop.nameMr || crop.name} ची पेरणी कधी करावी?`,
        'पावसाचा ७ दिवसांपेक्षा जास्त खंड पडल्यास रोपे कशी वाचवावी?',
        'माझ्या जमिनीसाठी बीबीएफ (BBF) पद्धत फायदेशीर ठरेल का?',
        'किमान किती मिमी पाऊस पडल्यावर पेरणी करावी?',
        'धुळवाफ पेरणी करणे सध्या सुरक्षित आहे का?'
      ]
    },
    en: {
      name: 'English',
      nativeName: 'English',
      bcp47: 'en-IN',
      greeting: `Hello! I am MonsoonPulse Kisan Voice Assistant. Ask any question about ${crop.name} sowing and monsoon dynamics.`,
      micPrompt: 'Tap microphone to speak',
      listeningText: 'Listening... please ask your agronomic question',
      assistantTitle: 'Kisan Voice Assistant',
      placeholder: 'Speak or type your question...',
      cropName: crop.name,
      quickQueries: [
        `Can I sow ${crop.name} now with current rainfall projections?`,
        'How to protect seedlings if break-phase lasts 7+ days?',
        'Is Broad Bed Furrow (BBF) recommended for my soil type?',
        'What cumulative rainfall threshold is required before sowing?',
        'What is the expected rainfall range for the coming week?'
      ]
    },
    kn: {
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      bcp47: 'kn-IN',
      greeting: `ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು ಮಾನ್ಸೂನ್‌ಪಲ್ಸ್ ಧ್ವನಿ ಸಹಾಯಕ. ${crop.name} ಬಿತ್ತನೆ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.`,
      micPrompt: 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿರಿ',
      listeningText: 'ಕೇಳುತ್ತಿದ್ದೇವೆ... ದಯವಿಟ್ಟು ಮಾತನಾಡಿ',
      assistantTitle: 'ಕಿಸಾನ್ ವಾಯ್ಸ್ ಸಹಾಯಕ (Kisan Voice)',
      placeholder: 'ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ...',
      cropName: crop.name,
      quickQueries: [
        `ಈಗ ${crop.name} ಬಿತ್ತನೆ ಮಾಡುವುದು ಸುರಕ್ಷಿತವೇ?`,
        'ಮಳೆಯ ಕೊರತೆ ಇದ್ದಾಗ ಬೆಳೆ ರಕ್ಷಣೆ ಹೇಗೆ ಮಾಡುವುದು?',
        'ಬಿತ್ತನೆಗೆ ಮುಂಚೆ ಮಣ್ಣಿನಲ್ಲಿ ಎಷ್ಟು ತೇವಾಂಶ ಇರಬೇಕು?'
      ]
    },
    gu: {
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      bcp47: 'gu-IN',
      greeting: `નમસ્તે ખેડૂત મિત્રો! હું મોન્સૂનપલ્સ વૉઇસ આસિસ્ટન્ટ છું. ${crop.name} અને વરસાદ અંગે પ્રશ્ન પૂછો.`,
      micPrompt: 'બોલવા માટે માઇક દબાવો',
      listeningText: 'સાંભળી રહ્યા છીએ... કૃપા કરીને બોલો',
      assistantTitle: 'કિસાન વૉઇસ આસિસ્ટન્ટ (Kisan Voice)',
      placeholder: 'બોલો અથવા પ્રશ્ન ટાઇપ કરો...',
      cropName: crop.name,
      quickQueries: [
        `શું હું અત્યારે ${crop.name}ની વાવણી કરી શકું?`,
        'વરસાદ ખેંચાય ત્યારે પાકનું રક્ષણ કેવી રીતે કરવું?',
        'વાવણી માટે જમીનમાં કેટલો વરસાદ જરૂરી છે?'
      ]
    },
    ta: {
      name: 'Tamil',
      nativeName: 'தமிழ்',
      bcp47: 'ta-IN',
      greeting: `வணக்கம் விவசாய தோழர்களே! மான்சூன் பல்ஸ் குரல் உதவியாளர். ${crop.name} விதைப்பு பற்றி கேளுங்கள்.`,
      micPrompt: 'பேச மைக் அழுத்தவும்',
      listeningText: 'கேட்கிறோம்... தயவுசெய்து பேசுங்கள்',
      assistantTitle: 'கிசான் குரல் உதவியாளர் (Kisan Voice)',
      placeholder: 'பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்...',
      cropName: crop.name,
      quickQueries: [
        `இப்போது ${crop.name} விதைக்கலாமா?`,
        'மழை தாமதமானால் பயிரை எவ்வாறு பாதுகாப்பது?',
        'விதைப்புக்கு முன் மண்ணில் எவ்வளவு ஈரப்பதம் தேவை?'
      ]
    }
  };

  const currentCfg = langConfig[selectedLang] || langConfig.hi;

  // Cleanup speech and recognition on unmount or close
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      speechService.stop();
    };
  }, []);

  // Update language from parent if it changes
  useEffect(() => {
    if (['hi', 'te', 'mr', 'en', 'kn', 'gu', 'ta'].includes(initialLanguage)) {
      setSelectedLang(initialLanguage);
    }
  }, [initialLanguage]);

  // Speech Recognition setup
  const startListening = () => {
    setRecognitionError(null);
    setInterimTranscript('');
    soundFx.playRadarPing();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionError(
        selectedLang === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ पहचान (Web Speech) उपलब्ध नहीं है। कृपया नीचे दिए गए प्रश्नों में से चुनें या टाइप करें।'
          : selectedLang === 'te'
          ? 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు. దయచేసి కింద ఇచ్చిన ప్రశ్నలను ఎంచుకోండి లేదా టైప్ చేయండి.'
          : 'Speech recognition is not supported in this browser. Please select a quick query below or type.'
      );
      return;
    }

    // Stop active speech if playing
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentCfg.bcp47;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }
        if (final) {
          setQuery(final);
          setInterimTranscript('');
          handleAskQuestion(final);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setRecognitionError(
            selectedLang === 'hi'
              ? `माइक त्रुटि (${event.error})। कृपया दोबारा प्रयास करें या प्रश्न चुनें।`
              : selectedLang === 'te'
              ? `మైక్ లోపం (${event.error}). దయచేసి మళ్లీ ప్రయత్నించండి లేదా ప్రశ్న ఎంచుకోండి.`
              : `Microphone issue (${event.error}). Please retry or click a query below.`
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setRecognitionError(err.message || 'Could not start voice recognition');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Text-to-Speech Engine with Gemini AI Regional TTS & Web Speech fallback
  const speakText = (textToSpeak: string, lang = selectedLang) => {
    speechService.speak({
      text: textToSpeak,
      language: lang,
      speed: speechSpeed,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
      onSourceDetermined: (source) => setActiveVoiceEngine(source)
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else if (response) {
      speakText(response);
    }
  };

  // Ask question to Agro-Meteorologist AI endpoint
  const handleAskQuestion = async (userQuestion: string) => {
    if (!userQuestion.trim()) return;

    // Stop listening
    stopListening();

    setLoading(true);
    setResponse(null);
    soundFx.playClick();

    try {
      const res = await fetch('/api/gemini/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockName: block.name,
          districtName: block.districtId,
          stateName: block.state,
          cropName: currentCfg.cropName,
          stage: 'Sowing Window',
          forecast,
          language: selectedLang,
          question: userQuestion.trim()
        })
      });

      const data = await res.json();
      if (data.answer) {
        setResponse(data.answer);
        setResponseSource(data.source || 'AI Agronomist');
        soundFx.playSuccess();
        if (autoSpeak) {
          // Speak immediately
          setTimeout(() => {
            speakText(data.answer);
          }, 300);
        }
      } else {
        setResponse(
          selectedLang === 'hi'
            ? 'क्षमा करें, उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।'
            : selectedLang === 'te'
            ? 'క్షమించండి, సమాధానం రాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.'
            : 'Could not generate answer. Please try again.'
        );
      }
    } catch {
      setResponse(
        selectedLang === 'hi'
          ? 'सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।'
          : selectedLang === 'te'
          ? 'సర్వర్ కనెక్ట్ కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.'
          : 'Failed to connect to server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setIsCopied(true);
    soundFx.playSuccess();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLanguageSwitch = (newLang: Language) => {
    soundFx.playClick();
    speechService.stop();
    setIsSpeaking(false);
    setSelectedLang(newLang);
    setQuery('');
    setInterimTranscript('');
    setResponse(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#1E293B] border-2 border-indigo-500/50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white animate-scale-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Language Toggles */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0F172A] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950/60 ring-2 ring-emerald-400/30">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    {currentCfg.assistantTitle}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    🎙️ Live Voice Assistant
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{block.name}, {block.districtId} • {currentCfg.cropName}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Language Selectors: Hindi, Telugu, Marathi, English */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                <Languages className="w-3.5 h-3.5 text-indigo-400" />
                <span>भाषा / భాష:</span>
              </span>

              {/* Hindi */}
              <button
                id="voice-lang-hi"
                onClick={() => handleLanguageSwitch('hi')}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedLang === 'hi'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60 ring-1 ring-emerald-400'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>हिन्दी</span>
                <span className="text-[10px] opacity-80">(Hindi)</span>
              </button>

              {/* Telugu */}
              <button
                id="voice-lang-te"
                onClick={() => handleLanguageSwitch('te')}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedLang === 'te'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60 ring-1 ring-indigo-400'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>తెలుగు</span>
                <span className="text-[10px] opacity-80">(Telugu)</span>
              </button>

              {/* Marathi */}
              <button
                id="voice-lang-mr"
                onClick={() => handleLanguageSwitch('mr')}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedLang === 'mr'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-950/60 ring-1 ring-amber-400'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>मराठी</span>
                <span className="text-[10px] opacity-80">(Marathi)</span>
              </button>

              {/* English */}
              <button
                id="voice-lang-en"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-2.5 py-1 text-xs rounded-xl font-bold transition cursor-pointer ${
                  selectedLang === 'en'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/60 ring-1 ring-cyan-400'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                English
              </button>
            </div>

            {/* Auto-speak Audio toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                autoSpeak
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="Automatically read answers aloud in chosen language"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{autoSpeak ? 'Auto-Voice: ON' : 'Auto-Voice: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Greeting Banner with 1-Tap Audio Audition */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-emerald-950/60 border border-indigo-500/30 rounded-2xl p-3.5 text-xs text-slate-200 flex items-center justify-between gap-3 shadow-inner flex-wrap sm:flex-nowrap">
            <div className="flex items-start gap-3 flex-1 min-w-[200px]">
              <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="leading-relaxed">
                <span className="font-semibold text-emerald-300 mr-1.5">
                  {selectedLang === 'hi' ? 'आवाज़ सहायक:' : selectedLang === 'te' ? 'వాయిస్ అసిస్టెంట్:' : selectedLang === 'mr' ? 'व्हॉईस सल्लागार:' : 'Assistant:'}
                </span>
                <span>{currentCfg.greeting}</span>
              </div>
            </div>
            
            {/* Quick Greeting Audio Play Button */}
            <button
              id="kisan-listen-greeting-btn"
              onClick={() => {
                if (isSpeaking) {
                  speechService.stop();
                  setIsSpeaking(false);
                } else {
                  speakText(currentCfg.greeting);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md ${
                isSpeaking
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white ring-1 ring-indigo-400 hover:scale-105'
              }`}
              title="Listen to Greeting in selected language"
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{selectedLang === 'hi' ? 'आवाज़ बंद' : selectedLang === 'te' ? 'ఆపండి' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{selectedLang === 'hi' ? 'आवाज़ सुनें' : selectedLang === 'te' ? 'వాయిస్ వినండి' : selectedLang === 'mr' ? 'ऐका' : 'Listen'}</span>
                </>
              )}
            </button>
          </div>

          {/* Central Interactive Microphone Area */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 sm:p-7 text-center shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
            {/* Ambient visual background glow */}
            <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
              isListening ? 'opacity-100 bg-emerald-500/10' : 'opacity-0'
            }`} />

            {/* Giant Pulsing Microphone Button */}
            <div className="relative my-2">
              {isListening && (
                <>
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/30 animate-ping" />
                  <div className="absolute -inset-8 rounded-full bg-emerald-500/15 animate-pulse" />
                </>
              )}

              <button
                id="kisan-mic-action-btn"
                onClick={isListening ? stopListening : startListening}
                disabled={loading}
                className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-400 animate-pulse'
                    : 'bg-gradient-to-tr from-emerald-600 via-indigo-600 to-emerald-500 hover:from-emerald-500 hover:to-indigo-500 text-white ring-4 ring-emerald-400/40 hover:scale-105'
                }`}
                title={isListening ? 'Stop Listening' : currentCfg.micPrompt}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-10 h-10 sm:w-11 sm:h-11" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">STOP</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10 sm:w-11 sm:h-11" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">SPEAK</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Listening Status */}
            <div className="mt-3 space-y-1">
              <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
                {isListening ? (
                  <span className="text-emerald-400 flex items-center gap-2 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    {currentCfg.listeningText}
                  </span>
                ) : (
                  <span className="text-slate-300">{currentCfg.micPrompt}</span>
                )}
              </div>

              {interimTranscript && (
                <div className="text-xs text-emerald-300 font-medium italic bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 max-w-md mx-auto">
                  "{interimTranscript}"
                </div>
              )}

              {recognitionError && (
                <div className="text-xs text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30 max-w-md mx-auto mt-2">
                  {recognitionError}
                </div>
              )}
            </div>

            {/* Text Input Row for Fallback or Custom Typing */}
            <div className="w-full max-w-xl mt-5 flex items-center gap-2">
              <input
                id="voice-question-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskQuestion(query);
                }}
                placeholder={currentCfg.placeholder}
                className="flex-1 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500 shadow-inner"
              />
              <button
                id="voice-question-submit-btn"
                onClick={() => handleAskQuestion(query)}
                disabled={loading || !query.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Ask</span>
              </button>
            </div>
          </div>

          {/* Quick Voice Questions Chips in the Selected Language (Hindi / Telugu / Marathi) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {selectedLang === 'hi' 
                    ? 'प्रमुख किसान सवाल (टैप करें और सुनें):' 
                    : selectedLang === 'te' 
                    ? 'రైతుల ముఖ్యమైన ప్రశ్నలు (నొక్కి వినండి):' 
                    : selectedLang === 'mr'
                    ? 'शेतकऱ्यांचे नेहमीचे प्रश्न (टॅप करा व ऐका):'
                    : 'Quick Agronomic Queries (One-Tap):'}
                </span>
              </span>
              <span className="text-[11px] text-slate-500">1-Tap Voice Answer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentCfg.quickQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    handleAskQuestion(q);
                  }}
                  disabled={loading}
                  className="bg-[#0F172A] hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 p-3 rounded-2xl text-left text-xs text-slate-200 transition flex items-start gap-2.5 group cursor-pointer"
                >
                  <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition shrink-0 mt-0.5">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed flex-1 group-hover:text-white transition font-medium">
                    {q}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Display & Voice Audio Controls */}
          {response && (
            <div className="bg-[#0F172A] border-2 border-indigo-500/40 rounded-3xl p-5 shadow-2xl space-y-4 animate-fade-in">
              {/* Audio Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSpeech}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer ${
                      isSpeaking
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>{selectedLang === 'hi' ? 'आवाज़ बंद करें' : selectedLang === 'te' ? 'ఆపండి' : 'Stop Audio'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{selectedLang === 'hi' ? 'बोलकर सुनाएं' : selectedLang === 'te' ? 'చదివి వినిపించండి' : 'Listen Answer'}</span>
                      </>
                    )}
                  </button>

                  {/* Speech Speed Switch */}
                  <div className="flex items-center gap-1 bg-[#1E293B] px-2.5 py-1 rounded-xl text-[11px] border border-slate-700">
                    <span className="text-slate-400">Speed:</span>
                    <button
                      onClick={() => setSpeechSpeed(0.8)}
                      className={`px-1.5 py-0.5 rounded ${speechSpeed === 0.8 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      0.8x
                    </button>
                    <button
                      onClick={() => setSpeechSpeed(1.0)}
                      className={`px-1.5 py-0.5 rounded ${speechSpeed === 1.0 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
                    >
                      1.0x
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {activeVoiceEngine && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{activeVoiceEngine === 'gemini-tts' ? '✨ Gemini AI Regional Voice' : '🔊 Browser Web Voice'}</span>
                    </span>
                  )}
                  <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded-full">
                    {responseSource}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                    title="Copy Answer"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Formatted Advisory Content */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2 bg-[#1E293B]/60 p-4 rounded-2xl border border-slate-800/80">
                {response}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-[#0F172A] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Grounded in ICAR & IMD S2S Agrometeorological Protocols</span>
          </div>
          <span className="text-slate-500 font-mono">
            Languages: हिन्दी (hi-IN) • తెలుగు (te-IN) • मराठी (mr-IN) • English
          </span>
        </div>
      </div>
    </div>
  );
};
