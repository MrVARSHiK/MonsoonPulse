import { LanguageMeta } from '../types';
export type { LanguageMeta };

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Pan-India & International',
    script: 'Latin',
    samplePhrase: 'Weather forecast & sowing advisory',
    isPopular: true
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'North & Central India (MP, UP, Rajasthan, Haryana)',
    script: 'Devanagari',
    samplePhrase: 'मौसम पूर्वानुमान एवं बुवाई सलाह',
    isPopular: true
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra (Vidarbha, Marathwada, Western MH)',
    script: 'Devanagari',
    samplePhrase: 'हवामान अंदाज आणि पेरणी सल्ला',
    isPopular: true
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Telangana & Andhra Pradesh (Warangal, Nalgonda, Kurnool)',
    script: 'Telugu',
    samplePhrase: 'వాతావరణ సూచన మరియు విత్తన సలహా',
    isPopular: true
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka (Dharwad, Belagavi, Raichur, Vijayapura)',
    script: 'Kannada',
    samplePhrase: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಬಿತ್ತನೆ ಸಲಹೆ',
    isPopular: true
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'Gujarat (Saurashtra, Rajkot, Amreli, Kutch)',
    script: 'Gujarati',
    samplePhrase: 'હવામાન આગાહી અને વાવણી સલાહ',
    isPopular: true
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu & Puducherry',
    script: 'Tamil',
    samplePhrase: 'வானிலை முன்னறிவிப்பு மற்றும் விதைப்பு ஆலோசனை',
    isPopular: true
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal, Tripura & Eastern India',
    script: 'Bengali',
    samplePhrase: 'আবহাওয়ার পূর্বাভাস ও বপন সংক্রান্ত পরামর্শ',
    isPopular: true
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'Punjab (Ludhiana, Bathinda, Patiala)',
    script: 'Gurmukhi',
    samplePhrase: 'ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ ਅਤੇ ਬਿਜਾਈ ਦੀ ਸਲਾਹ',
    isPopular: true
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    region: 'Odisha (Coastal & Western Odisha)',
    script: 'Odia',
    samplePhrase: 'ପାଣିପାଗ ପୂର୍ବାନୁମାନ ଏବଂ ବୁଣିବା ପରାମର୍ଶ',
    isPopular: false
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala (Western Ghats & Coastal belt)',
    script: 'Malayalam',
    samplePhrase: 'കാലാവസ്ഥാ പ്രവചനവും വിതയ്ക്കൽ നിർദ്ദേശങ്ങളും',
    isPopular: false
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'Pan-India (Deccan, UP, Telangana, J&K)',
    script: 'Perso-Arabic',
    samplePhrase: 'موسم کی پیش گوئی اور بوائی کا مشورہ',
    isPopular: false
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'Assam & Brahmaputra Valley',
    script: 'Bengali-Assamese',
    samplePhrase: 'বতৰৰ পূৰ্বাভাস আৰু বীজ সিঁচাৰ পৰামৰ্শ',
    isPopular: false
  },
  {
    code: 'mr_local',
    name: 'Rural Marathi (Agri Dialect)',
    nativeName: 'ग्रामीण शेतकरी बोली (मराठी)',
    region: 'विदर्भ व मराठवाडा शेतकरी बोलीभाषा',
    script: 'Devanagari',
    samplePhrase: 'पावसाची बात आणि पेरणीचा पक्का सल्ला',
    isPopular: false
  }
];

export function getLanguageMeta(code: string): LanguageMeta {
  return (
    SUPPORTED_LANGUAGES.find(l => l.code === code) || {
      code,
      name: code.toUpperCase(),
      nativeName: code.toUpperCase(),
      region: 'Custom Language',
      script: 'Universal',
      samplePhrase: 'Weather advisory and crop guide'
    }
  );
}
