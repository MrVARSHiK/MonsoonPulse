// Unified Multilingual Speech Service for MonsoonPulse Kisan Voice
// Supports Server-side Gemini AI Regional TTS with automatic Web Speech API fallback

export interface SpeakOptions {
  text: string;
  language: string; // 'hi', 'te', 'mr', 'kn', 'gu', 'ta', 'bn', 'en', etc.
  speed?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: any) => void;
  onSourceDetermined?: (source: 'gemini-tts' | 'browser-speech') => void;
}

const BCP47_MAP: Record<string, string> = {
  hi: 'hi-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  mr_local: 'mr-IN',
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

const LANG_NAME_KEYWORDS: Record<string, string[]> = {
  hi: ['hindi', 'हिन्दी', 'devanagari'],
  te: ['telugu', 'తెలుగు'],
  mr: ['marathi', 'मराठी'],
  kn: ['kannada', 'ಕನ್ನಡ'],
  gu: ['gujarati', 'ગુજરાતી'],
  ta: ['tamil', 'தமிழ்'],
  bn: ['bengali', 'bangla', 'বাংলা'],
  en: ['india', 'indian', 'english']
};

class SpeechService {
  private activeAudio: HTMLAudioElement | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    }
  }

  private initVoices() {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      try {
        const loaded = window.speechSynthesis.getVoices();
        if (loaded && loaded.length > 0) {
          this.voices = loaded;
          this.voicesLoaded = true;
        }
      } catch {
        // ignore
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public getLoadedVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.voices = window.speechSynthesis.getVoices();
      } catch {
        // ignore
      }
    }
    return this.voices;
  }

  public hasRegionalVoice(lang: string): boolean {
    const voices = this.getLoadedVoices();
    const bcp47 = (BCP47_MAP[lang] || lang).toLowerCase();
    const prefix = bcp47.split('-')[0];
    const keywords = LANG_NAME_KEYWORDS[lang] || [lang];

    return voices.some(v => {
      const vLang = v.lang.toLowerCase();
      const vName = v.name.toLowerCase();
      return (
        vLang === bcp47 ||
        vLang.replace('_', '-') === bcp47 ||
        vLang.startsWith(prefix) ||
        keywords.some(k => vName.includes(k))
      );
    });
  }

  public stop() {
    // 1. Stop any HTMLAudio playing Gemini TTS
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.activeAudio = null;
    }

    // 2. Stop Web Speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  public async speak(options: SpeakOptions): Promise<void> {
    const { text, language, speed = 1.0, onStart, onEnd, onError, onSourceDetermined } = options;

    // Stop any ongoing speech first
    this.stop();

    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/\[.*?\]/g, '')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    // 1. Attempt Server-side Gemini AI Text-to-Speech first
    // This produces high-fidelity, natural native pronunciation in Telugu, Hindi, Marathi, etc.
    try {
      const ttsResponse = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          language,
          voiceName: language === 'te' || language === 'hi' || language === 'mr' ? 'Kore' : 'Zephyr'
        })
      });

      if (ttsResponse.ok) {
        const data = await ttsResponse.json();
        if (data.available && data.audio) {
          onSourceDetermined?.('gemini-tts');
          
          const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audio}`;
          const audio = new Audio(audioSrc);
          this.activeAudio = audio;
          audio.playbackRate = speed;

          audio.onplay = () => {
            onStart?.();
          };

          audio.onended = () => {
            this.activeAudio = null;
            onEnd?.();
          };

          audio.onerror = (e) => {
            console.warn('Gemini audio playback error, falling back to Web Speech:', e);
            this.activeAudio = null;
            this.speakWebSpeech(cleanText, language, speed, onStart, onEnd, onError, onSourceDetermined);
          };

          await audio.play();
          return;
        }
      }
    } catch (apiErr) {
      console.warn('Gemini TTS endpoint unavailable, falling back to Web Speech:', apiErr);
    }

    // 2. Fallback to Browser Web Speech API
    this.speakWebSpeech(cleanText, language, speed, onStart, onEnd, onError, onSourceDetermined);
  }

  private speakWebSpeech(
    cleanText: string,
    language: string,
    speed: number,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err?: any) => void,
    onSourceDetermined?: (source: 'gemini-tts' | 'browser-speech') => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError?.(new Error('Web Speech not supported in this browser'));
      return;
    }

    onSourceDetermined?.('browser-speech');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speed;

    const bcp47 = BCP47_MAP[language] || 'en-IN';
    utterance.lang = bcp47;

    // Search available voices
    const voices = this.getLoadedVoices();
    const targetLang = bcp47.toLowerCase();
    const prefix = targetLang.split('-')[0];
    const keywords = LANG_NAME_KEYWORDS[language] || [language];

    // Preference: Exact code -> Prefix match -> Keyword in voice name
    let matchedVoice = voices.find(v => v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().replace('_', '-') === targetLang);

    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    }

    if (!matchedVoice) {
      matchedVoice = voices.find(v => keywords.some(k => v.name.toLowerCase().includes(k)));
    }

    // If Telugu/Marathi/Hindi specifically and no voice found, see if Hindi voice exists
    // (Hindi voices handle Indic phonetic Devanagari/Dravidian characters vastly better than standard US English)
    if (!matchedVoice && (language === 'te' || language === 'mr')) {
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (err) => {
      onError?.(err);
      onEnd?.();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (synthErr) {
      onError?.(synthErr);
      onEnd?.();
    }
  }
}

export const speechService = new SpeechService();
