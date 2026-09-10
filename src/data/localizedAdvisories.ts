import { CropId, BlockInfo, ProbabilisticForecast, AgronomicAdvisory } from '../types';
import { LOCALIZED_DISTRICTS } from './translations';

// Multilingual Crop Names across Indian Languages
export const LOCALIZED_CROP_NAMES: Record<CropId, Record<string, string>> = {
  cotton: {
    en: 'Bt Cotton',
    mr: 'कापूस (बीटी)',
    hi: 'कपास (बीटी)',
    te: 'ప్రత్తి (పత్తి)',
    kn: 'ಹತ್ತಿ (ಬಿಟಿ)',
    gu: 'કપાસ (બીટી)',
    ta: 'பருத்தி',
    bn: 'তুলা',
    pa: 'ਕਪਾਹ (ਬੀਟੀ)',
    or: 'କପା',
    ml: 'പരുത്തി',
    ur: 'کپاس',
    as: 'কপাহ',
    mr_local: 'कपाशी'
  },
  soybean: {
    en: 'Soybean',
    mr: 'सोयाबीन',
    hi: 'सोयाबीन',
    te: 'సోయాబీన్',
    kn: 'ಸೋಯಾಬೀನ್',
    gu: 'સોયાબીન',
    ta: 'சோயாபீன்',
    bn: 'সয়াবিন',
    pa: 'ਸੋਇਆਬੀਨ',
    or: 'ସୋୟାବିନ୍',
    ml: 'സോയാബീൻ',
    ur: 'سویا بین',
    as: 'ছয়াবিন',
    mr_local: 'सोयाबीन'
  },
  tur: {
    en: 'Pigeon Pea (Tur/Arhar)',
    mr: 'तूर',
    hi: 'अरहर / तुअर',
    te: 'కంది (తొగరి)',
    kn: 'ತೊಗರಿ',
    gu: 'તુવેર',
    ta: 'துவரை',
    bn: 'অড়হর',
    pa: 'ਅਰਹਰ (ਤੂਰ)',
    or: 'ହରଡ଼',
    ml: 'തുവര',
    ur: 'ارہر دال',
    as: 'অৰহৰ',
    mr_local: 'तूर'
  },
  bajra: {
    en: 'Pearl Millet (Bajra)',
    mr: 'बाजरी',
    hi: 'बाजरा',
    te: 'సజ్జలు',
    kn: 'ಸಜ್ಜೆ',
    gu: 'બાજરી',
    ta: 'கம்பு',
    bn: 'বাজরা',
    pa: 'ਬਾਜਰਾ',
    or: 'ବାଜରା',
    ml: 'കമ്പം',
    ur: 'باجرہ',
    as: 'বাজৰা',
    mr_local: 'बाजरी'
  },
  maize: {
    en: 'Maize / Corn',
    mr: 'मका',
    hi: 'मक्का',
    te: 'మొక్కజొన్న',
    kn: 'ಮೆಕ್ಕೆಜೋಳ',
    gu: 'મકાઈ',
    ta: 'மக்காச்சோளம்',
    bn: 'ভুট্টা',
    pa: 'ਮੱਕੀ',
    or: 'ମକା',
    ml: 'മക്കച്ചോളം',
    ur: 'مکئی',
    as: 'মাকৈ',
    mr_local: 'मका'
  },
  groundnut: {
    en: 'Groundnut / Peanut',
    mr: 'भुईमूग',
    hi: 'मूंगफली',
    te: 'వేరుశనగ',
    kn: 'ಕಡಲೆಕಾಯಿ',
    gu: 'મગફળી',
    ta: 'வேர்க்கடலை',
    bn: 'চীনাবাদাম',
    pa: 'ਮੂੰਗਫਲੀ',
    or: 'ଚିନାବାଦାମ',
    ml: 'നിലക്കടല',
    ur: 'مونگ پھلی',
    as: 'চীনাবাদাম',
    mr_local: 'भुईमूग'
  },
  onion: {
    en: 'Kharif Onion',
    mr: 'कांदा',
    hi: 'प्याज',
    te: 'ఉల్లిపాయ',
    kn: 'ಈರುಳ್ಳಿ',
    gu: 'ડુંગળી',
    ta: 'வெங்காயம்',
    bn: 'পেঁয়াজ',
    pa: 'ਪਿਆਜ਼',
    or: 'ପିଆଜ',
    ml: 'സവാള',
    ur: 'پیاز',
    as: 'পিয়াঁজ',
    mr_local: 'कांदा'
  },
  paddy: {
    en: 'Paddy / Rice',
    mr: 'भात (धान)',
    hi: 'धान (चावल)',
    te: 'వరి (వరి ధాన్యం)',
    kn: 'ಭತ್ತ',
    gu: 'ડાંગર',
    ta: 'நெல்',
    bn: 'ধান',
    pa: 'ਝੋਨਾ',
    or: 'ଧାନ',
    ml: 'നെല്ല്',
    ur: 'دھان / چاول',
    as: 'ধান',
    mr_local: 'भात / धान'
  }
};

export function getLocalizedCropName(cropId: CropId, lang: string): string {
  const crop = LOCALIZED_CROP_NAMES[cropId];
  if (!crop) return cropId;
  return crop[lang] || crop['en'] || cropId;
}

export function getLocalizedBlockOrDistrictName(block: BlockInfo, lang: string): string {
  if (lang === 'mr' || lang === 'mr_local') return block.nameMr || block.name;
  if (lang === 'hi') return block.nameHi || block.name;
  const dist = LOCALIZED_DISTRICTS[block.districtId];
  if (dist && dist[lang]) {
    return `${block.name} (${dist[lang]})`;
  }
  return block.name;
}

interface AdvisoryGenerationParams {
  cropId: CropId;
  stage: string;
  block: BlockInfo;
  forecast: ProbabilisticForecast;
  verdictCode: 'PROCEED' | 'CAUTION_IRRIGATE' | 'DELAY_SOWING' | 'PROTECT_DRAIN' | 'OPTIMAL_SOWING';
  breakRiskPct: number;
  soilMoistureDeficitPct: number;
}

export function generateAllLanguagePayloads({
  cropId,
  stage,
  block,
  forecast,
  verdictCode,
  breakRiskPct,
  soilMoistureDeficitPct
}: AdvisoryGenerationParams): {
  smsPayload: AgronomicAdvisory['smsPayload'];
  whatsappPayload: AgronomicAdvisory['whatsappPayload'];
} {
  const smsPayload: AgronomicAdvisory['smsPayload'] = {
    en: '',
    mr: '',
    hi: '',
    charCountEn: 0,
    charCountMr: 0
  };
  const whatsappPayload: AgronomicAdvisory['whatsappPayload'] = {
    en: '',
    mr: '',
    hi: ''
  };

  // Standard Telecom SMS (160 Characters) for all languages
  // 1. English
  const cropEn = getLocalizedCropName(cropId, 'en');
  smsPayload['en'] = `MonsoonPulse [${block.name}]: ${verdictCode === 'DELAY_SOWING' ? 'ALERT: Delay' : verdictCode === 'CAUTION_IRRIGATE' ? 'CAUTION: Prepare irrigation for' : 'SAFE: Sow'} ${cropEn}. Break Risk: ${breakRiskPct}%. Expected onset: ${forecast.expectedOnsetDate}. MoES-NCMRWF`;
  
  // 2. Marathi
  const cropMr = getLocalizedCropName(cropId, 'mr');
  const locMr = block.nameMr || block.name;
  smsPayload['mr'] = `मान्सूनपल्स [${locMr}]: ${verdictCode === 'DELAY_SOWING' ? 'इशारा: पेरणी लांबवा' : verdictCode === 'CAUTION_IRRIGATE' ? 'सतर्कता: पाणी सोय ठेवा' : 'अनुकूल: पेरणी करा'} (${cropMr}). पावसाचा खंड: ${breakRiskPct}%. MoES-NCMRWF`;

  // 3. Hindi
  const cropHi = getLocalizedCropName(cropId, 'hi');
  const locHi = block.nameHi || block.name;
  smsPayload['hi'] = `मानसूनपल्स [${locHi}]: ${verdictCode === 'DELAY_SOWING' ? 'चेतावनी: बुवाई टालें' : verdictCode === 'CAUTION_IRRIGATE' ? 'सतर्कता: सिंचाई तैयार रखें' : 'अनुकूल: बुवाई करें'} (${cropHi})। सूखा जोखिम: ${breakRiskPct}%। MoES-NCMRWF`;

  // 4. Telugu
  const cropTe = getLocalizedCropName(cropId, 'te');
  const locTe = getLocalizedBlockOrDistrictName(block, 'te');
  smsPayload['te'] = `మాన్సూన్‌పల్స్ [${locTe}]: ${verdictCode === 'DELAY_SOWING' ? 'హెచ్చరిక: విత్తడం ఆలస్యం చేయండి' : verdictCode === 'CAUTION_IRRIGATE' ? 'జాగ్రత్త: నీటి పారుదల సిద్ధం చేసుకోండి' : 'అనుకూలం: విత్తనం వేయండి'} (${cropTe}). వర్షాభావం/బ్రేక్ రిస్క్: ${breakRiskPct}%. MoES-NCMRWF`;

  // 5. Kannada
  const cropKn = getLocalizedCropName(cropId, 'kn');
  const locKn = getLocalizedBlockOrDistrictName(block, 'kn');
  smsPayload['kn'] = `ಮಾನ್ಸೂನ್‌ಪಲ್ಸ್ [${locKn}]: ${verdictCode === 'DELAY_SOWING' ? 'ಎಚ್ಚರಿಕೆ: ಬಿತ್ತನೆ ಮುಂದೂಡಿ' : verdictCode === 'CAUTION_IRRIGATE' ? 'ಜಾಗರೂಕತೆ: ನೀರಾವರಿ ಸಿದ್ಧತೆ ಮಾಡಿ' : 'ಅನುಕೂಲಕರ: ಬಿತ್ತನೆ ಮಾಡಿ'} (${cropKn}). ಒಣ ಅವಧಿ ಅಪಾಯ: ${breakRiskPct}%. MoES-NCMRWF`;

  // 6. Gujarati
  const cropGu = getLocalizedCropName(cropId, 'gu');
  const locGu = getLocalizedBlockOrDistrictName(block, 'gu');
  smsPayload['gu'] = `મોન્સૂનપલ્સ [${locGu}]: ${verdictCode === 'DELAY_SOWING' ? 'ચેતવણી: વાવણી મોકૂફ રાખો' : verdictCode === 'CAUTION_IRRIGATE' ? 'સાવચેતી: પિયત વ્યવસ્થા રાખો' : 'યોગ્ય: વાવણી શરૂ કરો'} (${cropGu}). વરસાદ વિરામ જોખમ: ${breakRiskPct}%. MoES-NCMRWF`;

  // 7. Tamil
  const cropTa = getLocalizedCropName(cropId, 'ta');
  const locTa = getLocalizedBlockOrDistrictName(block, 'ta');
  smsPayload['ta'] = `மான்சூன் பல்ஸ் [${locTa}]: ${verdictCode === 'DELAY_SOWING' ? 'எச்சரிக்கை: விதைப்பை தள்ளிப்போடுங்கள்' : verdictCode === 'CAUTION_IRRIGATE' ? 'எச்சரிக்கை: பாசனம் தயாராக வையுங்கள்' : 'ஏற்றது: விதைப்பு செய்யுங்கள்'} (${cropTa}). வறட்சி இடைவெளி ஆபத்து: ${breakRiskPct}%. MoES-NCMRWF`;

  // 8. Bengali
  const cropBn = getLocalizedCropName(cropId, 'bn');
  const locBn = getLocalizedBlockOrDistrictName(block, 'bn');
  smsPayload['bn'] = `মনসুনপালস [${locBn}]: ${verdictCode === 'DELAY_SOWING' ? 'সতর্কতা: বপন স্থগিত রাখুন' : verdictCode === 'CAUTION_IRRIGATE' ? 'সতর্কতা: সেচের প্রস্তুতি রাখুন' : 'অনুকূল: বপন শুরু করুন'} (${cropBn})। খরা বিরতির ঝুঁকি: ${breakRiskPct}%। MoES-NCMRWF`;

  // 9. Punjabi
  const cropPa = getLocalizedCropName(cropId, 'pa');
  const locPa = getLocalizedBlockOrDistrictName(block, 'pa');
  smsPayload['pa'] = `ਮੌਨਸੂਨਪਲਸ [${locPa}]: ${verdictCode === 'DELAY_SOWING' ? 'ਚੇਤਾਵਨੀ: ਬਿਜਾਈ ਮੁਲਤਵੀ ਕਰੋ' : verdictCode === 'CAUTION_IRRIGATE' ? 'ਸਾਵਧਾਨੀ: ਸਿੰਚਾਈ ਤਿਆਰ ਰੱਖੋ' : 'ਅਨੁਕੂਲ: ਬਿਜਾਈ ਕਰੋ'} (${cropPa})। ਮੀਂਹ ਰੁਕਾਵਟ ਜੋਖਮ: ${breakRiskPct}%। MoES-NCMRWF`;

  // 10. Odia
  const cropOr = getLocalizedCropName(cropId, 'or');
  const locOr = getLocalizedBlockOrDistrictName(block, 'or');
  smsPayload['or'] = `ମନସୁନପଲ୍ସ [${locOr}]: ${verdictCode === 'DELAY_SOWING' ? 'ଚେତାବନୀ: ବୁଣିବା ବିଳମ୍ବ କରନ୍ତୁ' : verdictCode === 'CAUTION_IRRIGATE' ? 'ସତର୍କତା: ଜଳସେଚନ ପ୍ରସ୍ତୁତ ରଖନ୍ତୁ' : 'ଅନୁକୂଳ: ବୁଣିବା ଆରମ୍ଭ କରନ୍ତୁ'} (${cropOr})। ବର୍ଷା ବିରାମ ବିପଦ: ${breakRiskPct}%। MoES-NCMRWF`;

  // 11. Malayalam
  const cropMl = getLocalizedCropName(cropId, 'ml');
  const locMl = getLocalizedBlockOrDistrictName(block, 'ml');
  smsPayload['ml'] = `മൺസൂൺപൾസ് [${locMl}]: ${verdictCode === 'DELAY_SOWING' ? 'ജാഗ്രത: വിതയ്ക്കൽ മാറ്റിവെക്കുക' : verdictCode === 'CAUTION_IRRIGATE' ? 'ശ്രദ്ധിക്കുക: ജലസേചനം തയ്യാറാക്കുക' : 'അനുയോജ്യം: വിതയ്ക്കാം'} (${cropMl}). മഴ ഇടവേള സാധ്യത: ${breakRiskPct}%. MoES-NCMRWF`;

  // 12. Urdu
  const cropUr = getLocalizedCropName(cropId, 'ur');
  const locUr = block.name;
  smsPayload['ur'] = `مانسون پلس [${locUr}]: ${verdictCode === 'DELAY_SOWING' ? 'انتباہ: بوائی مؤخر کریں' : verdictCode === 'CAUTION_IRRIGATE' ? 'احتیاط: آبپاشی کا انتظام رکھیں' : 'سازگار: بوائی کریں'} (${cropUr})۔ بارش کا وقفہ خطرہ: ${breakRiskPct}%۔ MoES-NCMRWF`;

  // 13. Assamese
  const cropAs = getLocalizedCropName(cropId, 'as');
  const locAs = block.name;
  smsPayload['as'] = `মনচুনপালচ [${locAs}]: ${verdictCode === 'DELAY_SOWING' ? 'সতৰ্কবাণী: বীজ সিঁচা স্থগিত ৰাখক' : verdictCode === 'CAUTION_IRRIGATE' ? 'সাৱধানতা: পানী যোগানৰ ব্যৱস্থা কৰক' : 'উপযুক্ত: বীজ সিঁচক'} (${cropAs})। খৰাং সম্ভାৱনা: ${breakRiskPct}%। MoES-NCMRWF`;

  // 14. Rural Desi Agri-Marathi
  smsPayload['mr_local'] = `मान्सूनपल्स [${locMr}]: पक्का सल्ला: ${verdictCode === 'DELAY_SOWING' ? 'धूळपेरणी करू नका, पाऊस लांबलाय' : verdictCode === 'CAUTION_IRRIGATE' ? 'पाणी सोय ठेवा मगच पेरा' : 'पेरणीसाठी वाफसा तयार आहे'} (${cropMr}). खंड: ${breakRiskPct}%. MoES-NCMRWF`;

  // Character counts
  smsPayload['charCountEn'] = (smsPayload['en'] as string).length;
  smsPayload['charCountMr'] = (smsPayload['mr'] as string).length;

  // Rich WhatsApp Bulletins for all languages
  // 1. English
  whatsappPayload['en'] = `🌾 *MONSOONPULSE HYPERLOCAL AGRI-ADVISORY* 🌾\n📍 *Location:* ${block.name}, ${block.districtName}\n🌱 *Crop:* ${cropEn} (${stage.replace('_', ' ')})\n\n📊 *FORECAST SUMMARY (Week 1-4):*\n• Onset Window: ${forecast.expectedOnsetDate}\n• Break Monsoon Risk: ${breakRiskPct}% (${forecast.breakRiskCategory})\n• Soil Moisture Deficit: ${soilMoistureDeficitPct}%\n\n📢 *ACTION VERDICT:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 POSTPONE DRY SOWING: Prolonged dry spell ahead. Wait for at least 75-100mm cumulative soaking rain.' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 SOW ONLY WITH PROTECTIVE IRRIGATION: Ensure drip/sprinkler or farm pond is operational.' : '🟢 OPTIMAL SOWING WINDOW OPEN: Adequate soil moisture profile detected.'}\n\n💡 *FARM ADVICE:*\n1. Check seed germination and treat seeds with bio-fungicide.\n2. Form broad bed furrows (BBF) to conserve in-situ soil moisture.\n\n_Powered by MoES & NCMRWF (SIH 26086)_`;

  // 2. Marathi
  whatsappPayload['mr'] = `🌾 *मान्सूनपल्स हवामान व कृषी सल्ला* 🌾\n📍 *गाव/तालुका:* ${locMr}, ${block.districtName}\n🌱 *पीक:* ${cropMr}\n\n📊 *हवामान अंदाज:* \n• मान्सून आगमन: ${forecast.expectedOnsetDate}\n• पावसाचा खंड धोका: ${breakRiskPct}% (${forecast.breakRiskCategory})\n• जमिनीत ओलावा तूट: ${soilMoistureDeficitPct}%\n\n📢 *महत्वाचा सल्ला:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 धूळपेरणी टाळा: सुरुवातीच्या पावसानंतर मोठा खंड पडण्याची शक्यता आहे. किमान ७५ ते १०० मिमी पाऊस पडून वाफसा आल्याशिवाय पेरणी करू नका.' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 संरक्षित सिंचनाची सोय असेल तरच पेरणी करा: ठिबक किंवा तुषार सिंचनाची व्यवस्था सज्ज ठेवा.' : '🟢 पेरणीसाठी अनुकूल हवामान: जमिनीत पुरेसा ओलावा उपलब्ध आहे, पेरणी सुरू करावी.'}\n\n💡 *शेतकरी कृती:*\n1. बियाण्यावर बीजप्रक्रिया करा व योग्य वाणाची निवड करा.\n2. मूलस्थानी जलसंधारणासाठी रुंद चर-गादी वाफा (BBF) तंत्रज्ञानाचा वापर करा.\n\n_भारत सरकार भूविज्ञान मंत्रालय (MoES / NCMRWF)_`;

  // 3. Hindi
  whatsappPayload['hi'] = `🌾 *मानसूनपल्स कृषि व मौसम सलाह* 🌾\n📍 *प्रखंड:* ${locHi}, ${block.districtName}\n🌱 *फसल:* ${cropHi}\n\n📊 *पूर्वानुमान विवरण:*\n• मानसून आगमन: ${forecast.expectedOnsetDate}\n• सूखा/ब्रेक जोखिम: ${breakRiskPct}% (${forecast.breakRiskCategory})\n• मिट्टी नमी कमी: ${soilMoistureDeficitPct}%\n\n📢 *मुख्य सलाह:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 धूल बुवाई टालें: मानसूनी बारिश के बाद लंबा सूखा पड़ने का जोखिम है। 75-100 मिमी पर्याप्त वर्षा होने तक बुवाई स्थगित रखें।' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 संरक्षित सिंचाई उपलब्ध होने पर ही बुवाई करें: ड्रिप या स्प्रिंकलर की व्यवस्था जांच लें।' : '🟢 बुवाई के लिए उपयुक्त समय: मिट्टी में पर्याप्त नमी मौजूद है, बुवाई करें।'}\n\n💡 *किसान कार्य योजना:*\n1. प्रमाणित बीज का उपयोग करें और कवकनाशी से बीजोपचार अवश्य करें।\n2. खेत में नमी संरक्षण हेतु चौड़ी क्यारी-कूड़ (BBF) विधि अपनाएं।\n\n_पृथ्वी विज्ञान मंत्रालय / NCMRWF (SIH 26086)_`;

  // 4. Telugu
  whatsappPayload['te'] = `🌾 *మాన్సూన్‌పల్స్ హైపర్‌లోకల్ వ్యవసాయ సలహా* 🌾\n📍 *ప్రాంతం/మండలం:* ${locTe}\n🌱 *పంట:* ${cropTe}\n\n📊 *వాతావరణ అంచనా వివరాలు:*\n• వర్షాకాల ప్రారంభం: ${forecast.expectedOnsetDate}\n• వర్షాభావం / బ్రేక్ మాన్సూన్ ప్రమాదం: ${breakRiskPct}%\n• నేలలో తేమ లోపం: ${soilMoistureDeficitPct}%\n\n📢 *ముఖ్యమైన కార్యాచరణ నిర్ణయం:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 దుమ్ము విత్తనాలు వేయకండి (ఆలస్యం చేయండి): తొలి వర్షాల తర్వాత పొడి కాలం వచ్చే ప్రమాదం ఉంది. కనీసం 75-100 మి.మీ సమృద్ధిగా వర్షం కురిసే వరకు ఆగండి.' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 రక్షిత నీటి పారుదల సౌకర్యం ఉంటేనే విత్తండి: బిందు/తుంపర సేద్యం సిద్ధంగా ఉంచుకోండి.' : '🟢 విత్తనాలకు అనుకూల సమయం: నేలలో తగినంత తేమ ఉంది, విత్తడం ప్రారంభించవచ్చు.'}\n\n💡 *రైతులకు సలహాలు:*\n1. విత్తన శుద్ధి తప్పనిసరిగా చేయండి.\n2. తేమ నిల్వ కోసం వెడల్పు బెడ్ మరియు చాళ్లు (BBF) పద్ధతిని పాటించండి.\n\n_భారత ప్రభుత్వ భూవిజ్ఞాన మంత్రిత్వ శాఖ (MoES / NCMRWF)_`;

  // 5. Kannada
  whatsappPayload['kn'] = `🌾 *ಮಾನ್ಸೂನ್‌ಪಲ್ಸ್ ಕೃಷಿ ಮತ್ತು ಹವಾಮಾನ ಸಲಹೆ* 🌾\n📍 *ಸ್ಥಳ:* ${locKn}\n🌱 *ಬೆಳೆ:* ${cropKn}\n\n📊 *ಮುನ್ಸೂಚನೆ ಸಾರಾಂಶ:*\n• ಮುಂಗಾರು ಆರಂಭ: ${forecast.expectedOnsetDate}\n• ಮಳೆ ವಿರಾಮ (ಒಣ ಅವಧಿ) ಅಪಾಯ: ${breakRiskPct}%\n• ಮಣ್ಣಿನ ತೇವಾಂಶ ಕೊರತೆ: ${soilMoistureDeficitPct}%\n\n📢 *ಕಾರ್ಯಕಾರಿ ಸಲಹೆ:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 ಧೂಳು ಬಿತ್ತನೆ ಮುಂದೂಡಿ: ಮಳೆಯ ನಂತರ ದೀರ್ಘ ಒಣ ಅವಧಿ ಬರುವ ಸಾಧ್ಯತೆಯಿದೆ. ಕನಿಷ್ಠ 75-100 ಮಿಮೀ ಮಳೆಯಾಗುವವರೆಗೆ ಕಾಯಿರಿ.' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 ಸಂರಕ್ಷಿತ ನೀರಾವರಿ ಲಭ್ಯವಿದ್ದರೆ ಮಾತ್ರ ಬಿತ್ತನೆ ಮಾಡಿ: ಹನಿ ಅಥವಾ ತುಂತುರು ನೀರಾವರಿ ಸಿದ್ಧವಾಗಿರಲಿ.' : '🟢 ಸೂಕ್ತ ಬಿತ್ತನೆ ಅವಧಿ: ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ, ಬಿತ್ತನೆ ಮುಂದುವರಿಸಿ.'}\n\n💡 *ರೈತರ ಕ್ರಮಗಳು:*\n1. ಬಿತ್ತನೆ ಬೀಜಗಳಿಗೆ ಶಿಲೀಂಧ್ರನಾಶಕದಿಂದ ಬೀಜೋಪಚಾರ ಮಾಡಿ.\n2. ತೇವಾಂಶ ಸಂರಕ್ಷಣೆಗಾಗಿ ಅಗಲ ಪಾತಿ ಮತ್ತು ಸಾಲು (BBF) ಪದ್ಧತಿ ಬಳಸಿ.\n\n_ಕೇಂದ್ರ ಭೂ ವಿಜ್ಞಾನ ಸಚಿವಾಲಯ (MoES / NCMRWF)_`;

  // 6. Gujarati
  whatsappPayload['gu'] = `🌾 *મોન્સૂનપલ્સ હવામાન અને કૃષિ માર્ગદર્શિકા* 🌾\n📍 *વિસ્તાર:* ${locGu}\n🌱 *પાક:* ${cropGu}\n\n📊 *હવામાન આગાહી સારાંશ:*\n• ચોમાસાનું આગમન: ${forecast.expectedOnsetDate}\n• વરસાદ વિરામ જોખમ: ${breakRiskPct}%\n• જમીનમાં ભેજની અછત: ${soilMoistureDeficitPct}%\n\n📢 *નિર્ણય:* \n${verdictCode === 'DELAY_SOWING' ? '🔴 ધૂળ વાવણી મોકૂફ રાખો: વરસાદ પછી લાંબો વિરામ આવવાનું જોખમ છે. ૭૫-૧૦૦ મીમી વરસાદ થાય પછી જ વાવણી કરો.' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 પૂરક પિયત હોય તો જ વાવણી કરો: ડ્રિપ કે સ્પ્રિંકલર સિસ્ટમ સજ્જ રાખો.' : '🟢 વાવણી માટે ઉત્તમ સમય: જમીનમાં પૂરતો ભેજ છે, વાવણી શરૂ કરો.'}\n\n💡 *ખેડૂત સલાહ:*\n1. બીજ માવજત (બીજ સંસ્કાર) જરૂરથી કરો.\n2. ભેજ સંરક્ષણ માટે બ્રોડ બેડ ફરો (BBF) પદ્ધતિ અપનાવો.\n\n_પૃથ્વી વિજ્ઞાન મંત્રાલય (MoES / NCMRWF)_`;

  // 7. Tamil
  whatsappPayload['ta'] = `🌾 *மான்சூன் பல்ஸ் விவசாய வானிலை ஆலோசனை* 🌾\n📍 *இடம்:* ${locTa}\n🌱 *பயிர்:* ${cropTa}\n\n📊 *வானிலை முன்னறிவிப்பு:*\n• பருவமழை தொடக்கம்: ${forecast.expectedOnsetDate}\n• வறட்சி இடைவெளி ஆபத்து: ${breakRiskPct}%\n• மண்ணின் ஈரப்பதப் பற்றாக்குறை: ${soilMoistureDeficitPct}%\n\n📢 *முடிவு:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 விதைப்பை ஒத்திவைக்கவும்: 75-100 மி.மீ வரை போதிய மழை பெய்யும் வரை காத்திருக்கவும்.' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 பாசன வசதி இருந்தால் மட்டுமே விதைக்கவும்: சொட்டு நீர் பாசனத்தை தயார் செய்யவும்.' : '🟢 உகந்த விதைப்பு காலம்: மண்ணில் போதுமான ஈரப்பதம் உள்ளது.'}\n\n💡 *விவசாயிகள் செய்ய வேண்டியவை:*\n1. விதை நேர்த்தி செய்து விதைக்கவும்.\n2. ஈரப்பதத்தை பாதுகாக்க அகல பாத்தி மற்றும் வாய்க்கால் அமைப்பை பயன்படுத்தவும்.\n\n_இந்திய புவி அறிவியல் அமைச்சகம் (MoES / NCMRWF)_`;

  // 8. Bengali
  whatsappPayload['bn'] = `🌾 *মনসুনপালস কৃষি ও আবহাওয়া পরামর্শ* 🌾\n📍 *এলাকা:* ${locBn}\n🌱 *ফসল:* ${cropBn}\n\n📊 *আবহাওয়া পূর্বাভাস:*\n• বর্ষা আগমন: ${forecast.expectedOnsetDate}\n• খরা বিরতি ঝুঁকি: ${breakRiskPct}%\n• মাটির আর্দ্রতা ঘাটতি: ${soilMoistureDeficitPct}%\n\n📢 *পরামর্শ:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 ধুলো বোনা স্থগিত রাখুন: পর্যাপ্ত ৭৫-১০০ মিমি বৃষ্টি না হওয়া পর্যন্ত অপেক্ষা করুন।' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 সেচ সুবিধা থাকলে তবেই বপন করুন: ড্রিপ বা স্প্রিংকলার প্রস্তুত রাখুন।' : '🟢 বপনের অনুকূল সময়: মাটিতে পর্যাপ্ত আর্দ্রতা রয়েছে।'}\n\n💡 *কৃষক পদক্ষেপ:*\n1. বীজ শোধন করে বপন করুন।\n2. আর্দ্রতা ধরে রাখার জন্য চওড়া বেড নালা পদ্ধতি ব্যবহার করুন।\n\n_ভূ-বিজ্ঞান মন্ত্রক (MoES / NCMRWF)_`;

  // 9. Punjabi
  whatsappPayload['pa'] = `🌾 *ਮੌਨਸੂਨਪਲਸ ਮੌਸਮ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸਲਾਹ* 🌾\n📍 *ਇਲਾਕਾ:* ${locPa}\n🌱 *ਫ਼ਸਲ:* ${cropPa}\n\n📊 *ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ:*\n• ਮੌਨਸੂਨ ਆਮਦ: ${forecast.expectedOnsetDate}\n• ਮੀਂਹ ਰੁਕਾਵਟ ਜੋਖਮ: ${breakRiskPct}%\n• ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ ਦੀ ਘਾਟ: ${soilMoistureDeficitPct}%\n\n📢 *ਮੁੱਖ ਫ਼ੈਸਲਾ:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 ਸੁੱਕੀ ਬਿਜਾਈ ਮੁਲਤਵੀ ਕਰੋ: ਚੰਗਾ ਮੀਂਹ ਪੈਣ ਤੱਕ ਉਡੀਕ ਕਰੋ।' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 ਜੇ ਸਿੰਚਾਈ ਉਪਲਬਧ ਹੈ ਤਾਂ ਹੀ ਬਿਜਾਈ ਕਰੋ।' : '🟢 ਬਿਜਾਈ ਲਈ ਢੁਕਵਾਂ ਸਮਾਂ: ਮਿੱਟੀ ਵਿੱਚ ਕਾਫ਼ੀ ਨਮੀ ਹੈ।'}\n\n💡 *ਕਿਸਾਨਾਂ ਲਈ ਸੁਝਾਅ:*\n1. ਬੀਜ ਸੋਧ ਕਰਕੇ ਹੀ ਬਿਜਾਈ ਕਰੋ।\n2. ਨਮੀ ਸੰਭਾਲ ਲਈ ਬੈੱਡ ਬਣਾਓ।\n\n_ਧਰਤੀ ਵਿਗਿਆਨ ਮੰਤਰਾਲਾ (MoES / NCMRWF)_`;

  // 10. Odia
  whatsappPayload['or'] = `🌾 *ମନସୁନପଲ୍ସ ପାଣିପାଗ ଏବଂ କୃଷି ପରାମର୍ଶ* 🌾\n📍 *ଅଞ୍ଚଳ:* ${locOr}\n🌱 *ଫସଲ:* ${cropOr}\n\n📊 *ପୂର୍ବାନୁମାନ:*\n• ମୌସୁମୀ ଆଗମନ: ${forecast.expectedOnsetDate}\n• ବର୍ଷା ବିରାମ ବିପଦ: ${breakRiskPct}%\n• ମାଟି ଆର୍ଦ୍ରତା ଅଭାବ: ${soilMoistureDeficitPct}%\n\n📢 *ମୁଖ୍ୟ ପରାମର୍ଶ:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 ଶୁଖିଲା ବୁଣିବା ବନ୍ଦ ରଖନ୍ତୁ: ୭୫-୧୦୦ ମିମି ଭଲ ବର୍ଷା ହେବା ପର୍ଯ୍ୟନ୍ତ ଅପେକ୍ଷା କରନ୍ତୁ।' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 ଜଳସେଚନ ବ୍ୟବସ୍ଥା ଥିଲେ ହିଁ ବୁଣନ୍ତୁ।' : '🟢 ବୁଣିବା ପାଇଁ ଉପଯୁକ୍ତ ସମୟ: ମାଟିରେ ପର୍ଯ୍ୟାପ୍ତ ଆର୍ଦ୍ରତା ଅଛି।'}\n\n_ପୃଥିବୀ ବିଜ୍ଞାନ ମନ୍ତ୍ରଣାଳୟ (MoES / NCMRWF)_`;

  // 11. Malayalam
  whatsappPayload['ml'] = `🌾 *മൺസൂൺപൾസ് കാർഷിക കാലാവസ്ഥാ മുന്നറിയിപ്പ്* 🌾\n📍 *പ്രദേശം:* ${locMl}\n🌱 *വിള:* ${cropMl}\n\n📊 *പ്രവചന വിവരങ്ങൾ:*\n• മൺസൂൺ ആരംഭം: ${forecast.expectedOnsetDate}\n• മഴ ഇടവേള സാധ്യത: ${breakRiskPct}%\n• മണ്ണിലെ ഈർപ്പക്കുറവ്: ${soilMoistureDeficitPct}%\n\n📢 *തീരുമാനം:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 വിതയ്ക്കൽ മാറ്റിവെക്കുക: നല്ല മഴ ലഭിക്കുന്നത് വരെ കാത്തിരിക്കുക.' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 ജലസേചന സൗകര്യമുണ്ടെങ്കിൽ മാത്രം വിതയ്ക്കുക.' : '🟢 വിതയ്ക്കാൻ ഏറ്റവും അനുയോജ്യമായ സമയം.'}\n\n_ഭൗമശാസ്ത്ര മന്ത്രാലയം (MoES / NCMRWF)_`;

  // 12. Urdu
  whatsappPayload['ur'] = `🌾 *مانسون پلس زرعی و موسمی مشورہ* 🌾\n📍 *مقام:* ${locUr}\n🌱 *فصل:* ${cropUr}\n\n📊 *پیش گوئی:* \n• مانسون آمد: ${forecast.expectedOnsetDate}\n• بارش کا وقفہ خطرہ: ${breakRiskPct}%\n• مٹی میں نمی کی کمی: ${soilMoistureDeficitPct}%\n\n📢 *حکمت عملی:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 خشک بوائی مؤخر کریں: 75 سے 100 ملی میٹر بارش ہونے تک انتظار کریں۔' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 آبپاشی کا انتظام ہو تب ہی بوائی کریں۔' : '🟢 بوائی کے لیے انتہائی موزوں وقت۔'}\n\n_وزارت ارضیاتی علوم (MoES / NCMRWF)_`;

  // 13. Assamese
  whatsappPayload['as'] = `🌾 *মনচুনপালচ বতৰ আৰু কৃষি পৰামৰ্শ* 🌾\n📍 *স্থান:* ${locAs}\n🌱 *শস্য:* ${cropAs}\n\n📊 *বতৰৰ পূৰ্বাভাস:*\n• বাৰিষা আগমন: ${forecast.expectedOnsetDate}\n• খৰাং সম্ভাৱনা: ${breakRiskPct}%\n• মাটিৰ আৰ্দ্ৰতা ঘাটি: ${soilMoistureDeficitPct}%\n\n📢 *পৰামৰ্শ:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 বীজ সিঁচা স্থগিত ৰাখক: পর্যাপ্ত বৰষুণ নোহোৱালৈকে অপেক্ষা কৰক।' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 পানীৰ যোগান থাকিলেহে বীজ সিঁচক।' : '🟢 বীজ সিঁচাৰ বাবে উপযুক্ত সময়।'}\n\n_পৃথিৱী বিজ্ঞান মন্ত্ৰালয় (MoES / NCMRWF)_`;

  // 14. Rural Marathi
  whatsappPayload['mr_local'] = `🌾 *मान्सूनपल्स - शेतकरी बांधवांसाठी पक्का सल्ला* 🌾\n📍 *आपलं गाव/शिवार:* ${locMr}\n🌱 *पीक:* ${cropMr}\n\n📊 *पावसाची बात:*\n• पाऊस सुरु होण्याची तारीख: ${forecast.expectedOnsetDate}\n• पाऊस उघडीप देण्याचा धोका: ${breakRiskPct}%\n• जमिनीतला वाफसा/ओलावा तूट: ${soilMoistureDeficitPct}%\n\n📢 *पक्का निर्णय:*\n${verdictCode === 'DELAY_SOWING' ? '🔴 धूळपेरणी अजिबात करू नका: सुरुवातीला थोडा पाऊस पडून नंतर मोठा खंड पडणार आहे. बियाणे वाया जाईल. ३-४ इंच खोल ओल गेल्याशिवाय पेरणी करू नका.' : verdictCode === 'CAUTION_IRRIGATE' ? '🟡 विहीर किंवा बोअरला पाणी असेल तरच पेरा: तुषार किंवा ठिबक तयार ठेवा.' : '🟢 पेरणीला जोरदार सुरुवात करा: जमिनीत उत्तम वाफसा आहे.'}\n\n💡 *काय काळजी घ्याल?*\n1. बियाण्याला बुरशीनाशकाची चोळणी (बीजप्रक्रिया) नक्की करा.\n2. बीबीएफ (रुंद वरंबा-चर) पद्धतीने पेरणी केल्यास पाऊस लांबला तरी पीक जळत नाही.\n\n_कृषी विज्ञान केंद्र व भूविज्ञान मंत्रालय (MoES / NCMRWF)_`;

  return { smsPayload, whatsappPayload };
}

// Multi-Language Growth Stages
export const LOCALIZED_GROWTH_STAGES: Record<string, Record<string, { label: string; desc: string }>> = {
  pre_sowing: {
    en: { label: 'Pre-Sowing / Field Prep', desc: 'Summer tillage & farmyard manure application' },
    mr: { label: 'पेरणीपूर्व मशागत', desc: 'उन्हाळी नांगरट व शेणखत नियोजन' },
    hi: { label: 'बुवाई पूर्व तैयारी', desc: 'गर्मी की जुताई व गोबर खाद अनुप्रयोग' },
    te: { label: 'విత్తన పూర్వ తయారీ', desc: 'వేసవి దుక్కి మరియు సేంద్రీయ ఎరువు' },
    kn: { label: 'ಬಿತ್ತನೆ ಪೂರ್ವ ಸಿದ್ಧತೆ', desc: 'ಬೇಸಿಗೆ ಉಳುಮೆ ಮತ್ತು ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ' },
    gu: { label: 'વાવણી પૂર્વ ખેડ', desc: 'ઉનાળુ ખેડ અને દેશી ખાતર વ્યવસ્થા' },
    ta: { label: 'விதைப்புக்கு முந்தைய தயாரிப்பு', desc: 'கோடை உழவு மற்றும் தொழுவுரம்' },
    bn: { label: 'বপন পূর্ব প্রস্তুতি', desc: 'গ্রীষ্মকালীন চাষ ও গোবর সার' },
    pa: { label: 'ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਤਿਆਰੀ', desc: 'ਗਰਮੀਆਂ ਦੀ ਵਾਹੀ ਅਤੇ ਰੂੜੀ ਖਾਦ' },
    or: { label: 'ବୁଣିବା ପୂର୍ବ ପ୍ରସ୍ତୁତି', desc: 'ଖରାଟିଆ ଚାଷ ଓ ଖତ ପ୍ରୟୋଗ' },
    ml: { label: 'വിതയ്ക്കലിന് മുമ്പുള്ള തയ്യാറെടുപ്പ്', desc: 'വേനൽക്കാല ഉഴവും ജൈവവളവും' },
    ur: { label: 'بوائی سے پہلے تیاری', desc: 'موسم گرما کی جتاائی اور گوبر کھاد' },
    as: { label: 'বীজ সিঁচাৰ পূৰ্ব প্ৰস্তুতি', desc: 'গ্ৰীষ্মকালীন হাল বোৱা আৰু গোবৰ সাৰ' },
    mr_local: { label: 'पेरणीपूर्व मशागत', desc: 'उन्हाळी नांगरणी अन् शेणखत घालणे' }
  },
  sowing_window: {
    en: { label: 'Sowing Window (Now)', desc: 'Evaluating moisture infiltration & break risk' },
    mr: { label: 'पेरणीची वेळ (सध्या)', desc: 'मातीतील ओलावा व पावसाचा खंड पडताळणी' },
    hi: { label: 'बुवाई का समय (वर्तमान)', desc: 'मिट्टी में नमी व मानसून ब्रेक जोखिम जांच' },
    te: { label: 'విత్తన సమయం (ప్రస్తుతం)', desc: 'నేల తేమ మరియు వర్షాభావ ముప్పు పరిశీలన' },
    kn: { label: 'ಬಿತ್ತನೆ ಸಮಯ (ಈಗ)', desc: 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಒಣ ಅವಧಿ ಅಪಾಯ ಪರಿಶೀಲನೆ' },
    gu: { label: 'વાવણી સમય (હાલ)', desc: 'જમીનમાં ભેજ અને વરસાદ વિરામ જોખમ ચકાસણી' },
    ta: { label: 'விதைப்பு நேரம் (தற்போது)', desc: 'மண் ஈரப்பதம் மற்றும் வறட்சி இடைவெளி சரிபார்ப்பு' },
    bn: { label: 'বপনের সময় (বর্তমান)', desc: 'মাটির আর্দ্রতা এবং খরা বিরতি ঝুঁকি পর্যবেক্ষণ' },
    pa: { label: 'ਬਿਜਾਈ ਦਾ ਸਮਾਂ (ਹੁਣ)', desc: 'ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ ਅਤੇ ਮੀਂਹ ਰੁਕਾਵਟ ਜਾਂਚ' },
    or: { label: 'ବୁଣିବା ସମୟ (ବର୍ତ୍ତମାନ)', desc: 'ମାଟିର ଆର୍ଦ୍ରତା ଏବଂ ବର୍ଷା ବିରାମ ବିପଦ ଯାଞ୍ଚ' },
    ml: { label: 'വിതയ്ക്കൽ സമയം (ഇപ്പോൾ)', desc: 'മണ്ണിലെ ഈർപ്പവും മഴ ഇടവേള സാധ്യതയും' },
    ur: { label: 'بوائی کا وقت (ابھی)', desc: 'مٹی میں نمی اور بارش کے وقفے کا جائزہ' },
    as: { label: 'বীজ সিঁচাৰ সময় (বৰ্তমান)', desc: 'মাটিৰ আৰ্দ্ৰতা আৰু খৰাং সম্ভাৱনা নিৰীক্ষণ' },
    mr_local: { label: 'पेरणीची योग्य वेळ', desc: 'वाफसा आलाय का अन् पाऊस खंड कसा आहे' }
  },
  germination: {
    en: { label: 'Emergence & Germination', desc: '0-15 days after sowing (highly dry spell sensitive)' },
    mr: { label: 'उगवण अवस्था', desc: 'पेरणीनंतर ०-१५ दिवस (पावसाच्या खंडास अत्यंत संवेदनशील)' },
    hi: { label: 'अंकुरण अवस्था', desc: 'बुवाई के 0-15 दिन बाद (सूखे के प्रति अत्यधिक संवेदनशील)' },
    te: { label: 'మొలకెత్తే దశ', desc: 'విత్తిన 0-15 రోజులు (వర్షాభావానికి అత్యంత సున్నితం)' },
    kn: { label: 'ಮೊಳಕೆ ಒಡೆಯುವ ಹಂತ', desc: 'ಬಿತ್ತನೆಯ 0-15 ದಿನಗಳು (ಒಣ ಅವಧಿಗೆ ಅತ್ಯಂತ ಸೂಕ್ಷ್ಮ)' },
    gu: { label: 'અંકુરણ અવસ્થા', desc: 'વાવણી પછી ૦-૧૫ દિવસ (વરસાદ વિરામ માટે અતિ સંવેદનશીલ)' },
    ta: { label: 'முளைப்பு நிலை', desc: 'விதைத்த 0-15 நாட்கள் (வறட்சிக்கு மிக உணர்திறன்)' },
    bn: { label: 'অঙ্কুরোদগম পর্যায়', desc: 'বপনের ০-১৫ দিন পর (খরা বিরতিতে অত্যন্ত সংবেদনশীল)' },
    pa: { label: 'ਜੰਮਣ ਦਾ ਪੜਾਅ', desc: 'ਬਿਜਾਈ ਤੋਂ 0-15 ਦਿਨ ਬਾਅਦ (ਸੋਕੇ ਪ੍ਰਤੀ ਬਹੁਤ ਸੰਵੇਦਨਸ਼ੀਲ)' },
    or: { label: 'ଗଜା ହେବା ଅବସ୍ଥା', desc: 'ବୁଣିବାର ୦-୧୫ ଦିନ ପରେ (ଶୁଖିଲା ସମୟ ପାଇଁ ଅତ୍ୟନ୍ତ ସମ୍ବେଦନଶୀଳ)' },
    ml: { label: 'മുളയ്ക്കൽ ഘട്ടം', desc: 'വിതച്ച് 0-15 ദിവസങ്ങൾ (വരൾച്ചയോട് അതീവ പ്രതികരണം)' },
    ur: { label: 'اگاؤ کا مرحلہ', desc: 'بوائی کے 0-15 دن بعد (خشک سالی کے لیے انتہائی نازک)' },
    as: { label: 'অঙ্কুৰণ অৱস্থা', desc: 'বীজ সিঁচাৰ ০-১৫ দিন পিছত (খৰাঙৰ প্ৰতি অতি সংবেদনশীল)' },
    mr_local: { label: 'उगवण अवस्था (कोंब)', desc: 'पेरणीनंतर १५ दिवस (पावसाचा खंड पडल्यास रोपे जळतात)' }
  },
  vegetative: {
    en: { label: 'Vegetative Growth', desc: '15-45 days, interculture weeding & basal top-dress' },
    mr: { label: 'शाकीय वाढ अवस्था', desc: '१५-४५ दिवस, कोळपणी, खुरपणी व खतांची पहिली मात्रा' },
    hi: { label: 'वानस्पतिक वृद्धि', desc: '15-45 दिन, निराई-गुड़ाई व शीर्ष उर्वरक अनुप्रयोग' },
    te: { label: 'శాకీయ ఎదుగుదల దశ', desc: '15-45 రోజులు, కలుపు తీత మరియు ఎరువుల వేత' },
    kn: { label: 'ಸಸ್ಯಕ ಬೆಳವಣಿಗೆಯ ಹಂತ', desc: '15-45 ದಿನಗಳು, ಎಡೆಕುಂಟೆ ಹೊಡೆಯುವುದು ಮತ್ತು ಮೇಲುಗೊಬ್ಬರ' },
    gu: { label: 'વાનસ્પતિક વૃદ્ધિ', desc: '૧૫-૪૫ દિવસ, આંતરખેડ, નીંદામણ અને ખાતર' },
    ta: { label: 'வளர்ச்சி நிலை', desc: '15-45 நாட்கள், களையெடுத்தல் மற்றும் உரமிடுதல்' },
    bn: { label: 'অঙ্গজ বৃদ্ধি পর্যায়', desc: '১৫-৪৫ দিন, নিড়ানি এবং চাপান সার প্রয়োগ' },
    pa: { label: 'ਵਧਣ-ਫੁੱਲਣ ਦਾ ਪੜਾਅ', desc: '15-45 ਦਿਨ, ਗੋਡੀ ਅਤੇ ਖਾਦ ਪਾਉਣਾ' },
    or: { label: 'ବୃଦ୍ଧି ଅବସ୍ଥା', desc: '୧୫-୪୫ ଦିନ, କୋଡ଼ା-ଘାସ ବଛା ଓ ଖତ ପ୍ରୟୋଗ' },
    ml: { label: 'കായിക വളർച്ചാ ഘട്ടം', desc: '15-45 ദിവസങ്ങൾ, കളപറിക്കലും വളപ്രയോഗവും' },
    ur: { label: 'نشوونما کا مرحلہ', desc: '15-45 دن، گوڈی اور کھاد ڈالنا' },
    as: { label: 'দৈহিক বৃদ্ধিৰ অৱস্থা', desc: '১৫-৪৫ দিন, বনবাত নিৰোৱা আৰু সাৰ প্ৰয়োগ' },
    mr_local: { label: 'वाढीची अवस्था', desc: '१५-४५ दिवस, कोळपणी व खताचा डोस' }
  },
  flowering_podding: {
    en: { label: 'Flowering & Pod Formation', desc: 'Moisture stress here cuts yield by 40-60%' },
    mr: { label: 'फुलधारणा व शेंगा भरणे', desc: 'पाण्याचा ताण पडल्यास उत्पादनात ४०-६०% घट शक्य' },
    hi: { label: 'फूल व फली निर्माण', desc: 'इस समय नमी की कमी से उत्पादन में 40-60% गिरावट संभव' },
    te: { label: 'పూత మరియు కాయల దశ', desc: 'ఇక్కడ తేమ ఒత్తిడి దిగుబడిని 40-60% తగ్గిస్తుంది' },
    kn: { label: 'ಹೂವು ಮತ್ತು ಕಾಯಿ ಕಟ್ಟುವ ಹಂತ', desc: 'ಇಲ್ಲಿ ತೇವಾಂಶದ ಕೊರತೆಯು ಇಳುವರಿಯನ್ನು 40-60% ಕಡಿಮೆ ಮಾಡುತ್ತದೆ' },
    gu: { label: 'ફૂલ અને શીંગ બેસવાની અવસ્થા', desc: 'ભેજની ખેંચથી ઉત્પાદનમાં ૪૦-૬૦% ઘટાડો થઈ શકે' },
    ta: { label: 'பூக்கும் மற்றும் காய் பிடிக்கும் நிலை', desc: 'ஈரப்பத பற்றாக்குறை மகசூலை 40-60% குறைக்கும்' },
    bn: { label: 'ফুল ও শুঁটি গঠন পর্যায়', desc: 'আর্দ্রতার ঘাটতি ফলন ৪০-৬০% হ্রাস করতে পারে' },
    pa: { label: 'ਫੁੱਲ ਅਤੇ ਫ਼ਲੀ ਬਣਨ ਦਾ ਪੜਾਅ', desc: 'ਨਮੀ ਦੀ ਘਾਟ ਨਾਲ ਝਾੜ 40-60% ਘੱਟ ਸਕਦਾ ਹੈ' },
    or: { label: 'ଫୁଲ ଏବଂ ଛୁଇଁ ଧରିବା ଅବସ୍ଥା', desc: 'ଆର୍ଦ୍ରତା ଅଭାବ ଅମଳ ୪୦-୬୦% ହ୍ରାସ କରିପାରେ' },
    ml: { label: 'പൂവിടലും കായ്പിടുത്തവും', desc: 'ഈർപ്പക്കുറവ് വിളവ് 40-60% കുറയ്ക്കും' },
    ur: { label: 'پھول اور پھلی کا مرحلہ', desc: 'نمی کی کمی سے پیداوار میں 40-60% کمی ممکن ہے' },
    as: { label: 'ফুল আৰু ছেঁই ধৰা অৱস্থা', desc: 'আৰ্দ্ৰতাৰ নাটনিয়ে উৎপাদন ৪০-৬০% হ্ৰাস কৰিব পাৰে' },
    mr_local: { label: 'फुलं अन् शेंगांची अवस्था', desc: 'ओलावा कमी पडला तर उत्पादनात मोठी घट होते' }
  }
};

export function getLocalizedGrowthStage(stageId: string, lang: string): { label: string; desc: string } {
  const stage = LOCALIZED_GROWTH_STAGES[stageId];
  if (!stage) return { label: stageId, desc: '' };
  return stage[lang] || stage['en'] || { label: stageId, desc: '' };
}

// Multi-Language Traffic Badges
export function getLocalizedTrafficBadge(trafficColor: string, verdictCode: string, lang: string): {
  title: string;
  badgeText: string;
  status: string;
} {
  const isGreen = trafficColor === 'green' || verdictCode === 'PROCEED';
  const isYellow = trafficColor === 'yellow' || verdictCode === 'CAUTION_IRRIGATE';
  const isOrange = trafficColor === 'amber' || verdictCode === 'PROTECT_DRAIN';

  const BADGES: Record<string, {
    green: { title: string; badgeText: string; status: string };
    yellow: { title: string; badgeText: string; status: string };
    orange: { title: string; badgeText: string; status: string };
    red: { title: string; badgeText: string; status: string };
  }> = {
    en: {
      green: { title: 'PROCEED WITH SOWING', badgeText: 'Optimal Sowing Window', status: 'SAFE TO SOW NOW' },
      yellow: { title: 'CAUTION: PROTECTIVE IRRIGATION REQUIRED', badgeText: 'Contingency Protocol', status: 'CAUTION: PREPARE IRRIGATION' },
      orange: { title: 'CAUTION: AVOID WATERLOGGING', badgeText: 'Drainage Protocol', status: 'DRAIN EXCESS WATER' },
      red: { title: 'DELAY SOWING: POSTPONE SEED PLANTING', badgeText: 'False Onset Alert', status: 'DELAY SOWING (HIGH BREAK RISK)' }
    },
    mr: {
      green: { title: 'पेरणीस अनुकूल (सुरक्षित वेळ)', badgeText: 'वाफसा - योग्य वेळ', status: 'पेरणीसाठी अनुकूल (सुरक्षित वेळ)' },
      yellow: { title: 'सतर्कता: संरक्षित सिंचनाची सोय ठेवा', badgeText: 'पाणी व्यवस्थापन सतर्कता', status: 'सतर्कता: संरक्षित पाणी तयार ठेवा' },
      orange: { title: 'सावधगिरी: शेतातून पाण्याचा निचरा करा', badgeText: 'निचरा नियोजन', status: 'अतिरिक्त पाणी काढून टाका' },
      red: { title: 'पेरणी लांबवा: धूळपेरणी टाळा', badgeText: 'पावसाचा मोठा खंड इशारा', status: 'पेरणी लांबवा (पावसाचा मोठा खंड)' }
    },
    hi: {
      green: { title: 'बुवाई के लिए अनुकूल (सुरक्षित समय)', badgeText: 'अनुकूल बुवाई खिड़की', status: 'बुवाई के लिए सुरक्षित (अनुकूल)' },
      yellow: { title: 'सतर्कता: जीवनरक्षक सिंचाई व्यवस्था रखें', badgeText: 'आकस्मिक प्रोटोकॉल', status: 'सतर्कता: जीवनरक्षक सिंचाई तैयार रखें' },
      orange: { title: 'सावधानी: जल निकासी प्रबंध करें', badgeText: 'जलभराव रोकथाम', status: 'अतिरिक्त जल निकासी करें' },
      red: { title: 'बुवाई टालें: धूल बुवाई से बचें', badgeText: 'लंबा सूखा व खंड चेतावनी', status: 'बुवाई टालें (सूखा व खंड जोखिम)' }
    },
    te: {
      green: { title: 'విత్తడానికి అనుకూలం (సురక్షిత సమయం)', badgeText: 'అనుకూల విత్తన సమయం', status: 'విత్తడానికి సురక్షితం' },
      yellow: { title: 'జాగ్రత్త: రక్షిత నీటి పారుదల సిద్ధం చేసుకోండి', badgeText: 'అత్యవసర ప్రోటోకాల్', status: 'జాగ్రత్త: నీటి పారుదల సిద్ధం చేసుకోండి' },
      orange: { title: 'హెచ్చరిక: నీటి నిల్వను నివారించండి', badgeText: 'డ్రైనేజీ ప్రోటోకాల్', status: 'అదనపు నీటిని బయటకు పంపండి' },
      red: { title: 'విత్తడం ఆలస్యం చేయండి: దుమ్ము విత్తనాలు వేయకండి', badgeText: 'వర్షాభావ హెచ్చరిక', status: 'విత్తడం ఆలస్యం చేయండి (తీవ్ర వర్షాభావం)' }
    },
    kn: {
      green: { title: 'ಬಿತ್ತನೆಗೆ ಸೂಕ್ತ ಸಮಯ (ಸುರಕ್ಷಿತ)', badgeText: 'ಅನುಕೂಲಕರ ಬಿತ್ತನೆ ಅವಧಿ', status: 'ಈಗಲೇ ಬಿತ್ತನೆ ಮಾಡಲು ಸುರಕ್ಷಿತ' },
      yellow: { title: 'ಎಚ್ಚರಿಕೆ: ಸಂರಕ್ಷಿತ ನೀರಾವರಿ ಸಿದ್ಧತೆ ಮಾಡಿ', badgeText: 'ತುರ್ತು ಕಾರ್ಯವಿಧಾನ', status: 'ಎಚ್ಚರಿಕೆ: ನೀರಾವರಿ ಸಿದ್ಧತೆ ಮಾಡಿ' },
      orange: { title: 'ಎಚ್ಚರಿಕೆ: ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ', badgeText: 'ಚರಂಡಿ ವ್ಯವಸ್ಥೆ', status: 'ಹೆಚ್ಚುವರಿ ನೀರನ್ನು ಹೊರಹಾಕಿ' },
      red: { title: 'ಬಿತ್ತನೆ ಮುಂದೂಡಿ: ಧೂಳು ಬಿತ್ತನೆ ಮಾಡಬೇಡಿ', badgeText: 'ಒಣ ಅವಧಿ ಅಪಾಯದ ಎಚ್ಚರಿಕೆ', status: 'ಬಿತ್ತನೆ ಮುಂದೂಡಿ (ಹೆಚ್ಚಿನ ಒಣ ಅವಧಿ)' }
    },
    gu: {
      green: { title: 'વાવણી માટે યોગ્ય (સલામત સમય)', badgeText: 'ઉત્તમ વાવણી સમય', status: 'વાવણી માટે સલામત' },
      yellow: { title: 'સાવચેતી: પૂરક પિયતની વ્યવસ્થા રાખો', badgeText: 'આકસ્મિક પ્રોટોકોલ', status: 'સાવચેતી: પિયત તૈયાર રાખો' },
      orange: { title: 'સાવચેતી: ખેતરમાં પાણી ભરાવા ન દો', badgeText: 'નિતાર વ્યવસ્થા', status: 'વધારાનું પાણી નિકાલ કરો' },
      red: { title: 'વાવણી મોકૂફ રાખો: ધૂળ વાવણી ટાળો', badgeText: 'લાંબો વરસાદ વિરામ ચેતવણી', status: 'વાવણી મોકૂફ રાખો (વિરામ જોખમ)' }
    },
    ta: {
      green: { title: 'விதைப்புக்கு ஏற்றது (பாதுகாப்பானது)', badgeText: 'சிறந்த விதைப்பு காலம்', status: 'விதைப்பு செய்ய பாதுகாப்பானது' },
      yellow: { title: 'எச்சரிக்கை: பாதுகாப்பு பாசனம் தயார் செய்யுங்கள்', badgeText: 'அவசர நெறிமுறை', status: 'எச்சரிக்கை: பாசனம் தயார் செய்க' },
      orange: { title: 'எச்சரிக்கை: நீர் தேங்குவதை தவிர்க்கவும்', badgeText: 'வடிகால் நெறிமுறை', status: 'அதிகப்படியான நீரை வெளியேற்றுக' },
      red: { title: 'விதைப்பை தள்ளிப்போடுங்கள்: புழுதி விதைப்பு வேண்டாம்', badgeText: 'நீண்ட வறட்சி இடைவெளி எச்சரிக்கை', status: 'விதைப்பை தள்ளிப்போடுங்கள்' }
    },
    bn: {
      green: { title: 'বপনের জন্য অনুকূল (নিরাপদ সময়)', badgeText: 'অনুকূল বপন সময়', status: 'বপন করার উপযুক্ত সময়' },
      yellow: { title: 'সতর্কতা: সুরক্ষামূলক সেচের ব্যবস্থা রাখুন', badgeText: 'জরুরী প্রোটোকল', status: 'সতর্কতা: সেচ প্রস্তুত রাখুন' },
      orange: { title: 'সতর্কতা: জল নিষ্কাশন ব্যবস্থা করুন', badgeText: 'নিষ্কাশন প্রোটোকল', status: 'অতিরিক্ত জল বের করে দিন' },
      red: { title: 'বপন স্থগিত রাখুন: ধুলো বোনা এড়িয়ে চলুন', badgeText: 'দীর্ঘ খরা বিরতি সতর্কতা', status: 'বপন স্থগিত রাখুন (খরা ঝুঁকি)' }
    },
    pa: {
      green: { title: 'ਬਿਜਾਈ ਲਈ ਅਨੁਕੂਲ (ਸੁਰੱਖਿਅਤ ਸਮਾਂ)', badgeText: 'ਵਧੀਆ ਬਿਜਾਈ ਸਮਾਂ', status: 'ਬਿਜਾਈ ਲਈ ਸੁਰੱਖਿਅਤ' },
      yellow: { title: 'ਸਾਵਧਾਨੀ: ਸੰਭਾਲ ਸਿੰਚਾਈ ਦਾ ਪ੍ਰਬੰਧ ਰੱਖੋ', badgeText: 'ਹੰਗਾਮੀ ਪ੍ਰੋਟੋਕੋਲ', status: 'ਸਾਵਧਾਨੀ: ਸਿੰਚਾਈ ਤਿਆਰ ਰੱਖੋ' },
      orange: { title: 'ਸਾਵਧਾਨੀ: ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਹੋਣ ਦਿਓ', badgeText: 'ਨਿਕਾਸ ਪ੍ਰੋਟੋਕੋਲ', status: 'ਵਾਧੂ ਪਾਣੀ ਬਾਹਰ ਕੱਢੋ' },
      red: { title: 'ਬਿਜਾਈ ਮੁਲਤਵੀ ਕਰੋ: ਸੁੱਕੀ ਬਿਜਾਈ ਨਾ ਕਰੋ', badgeText: 'ਲੰਬੇ ਸੋਕੇ ਦੀ ਚੇਤਾਵਨੀ', status: 'ਬਿਜਾਈ ਮੁਲਤਵੀ ਕਰੋ (ਸੋਕਾ ਜੋਖਮ)' }
    },
    or: {
      green: { title: 'ବୁଣିବା ପାଇଁ ଅନୁକୂଳ (ସୁରକ୍ଷିତ ସମୟ)', badgeText: 'ଉତ୍ତମ ବୁଣିବା ସମୟ', status: 'ବୁଣିବା ପାଇଁ ସୁରକ୍ଷିତ' },
      yellow: { title: 'ସତର୍କତା: ଜଳସେଚନ ବ୍ୟବସ୍ଥା ପ୍ରସ୍ତୁତ ରଖନ୍ତୁ', badgeText: 'ଜରୁରୀକାଳୀନ ନିୟମ', status: 'ସତର୍କତା: ଜଳସେଚନ ପ୍ରସ୍ତୁତ ରଖନ୍ତୁ' },
      orange: { title: 'ସତର୍କତା: ଜଳ ନିଷ୍କାସନ ବ୍ୟବସ୍ଥା କରନ୍ତୁ', badgeText: 'ନିଷ୍କାସନ ନିୟମ', status: 'ଅଧିକ ପାଣି ବାହାର କରନ୍ତୁ' },
      red: { title: 'ବୁଣିବା ବିଳମ୍ବ କରନ୍ତୁ: ଶୁଖିଲା ବୁଣନ୍ତୁ ନାହିଁ', badgeText: 'ଦୀର୍ଘ ବର୍ଷା ବିରାମ ଚେତାବନୀ', status: 'ବୁଣିବା ବିଳମ୍ବ କରନ୍ତୁ' }
    },
    ml: {
      green: { title: 'വിതയ്ക്കാൻ അനുയോജ്യം (സുരക്ഷിത സമയം)', badgeText: 'അനുയോജ്യമായ വിതയ്ക്കൽ സമയം', status: 'വിതയ്ക്കാൻ സുരക്ഷിതം' },
      yellow: { title: 'ജാഗ്രത: ജലസേചനം തയ്യാറാക്കുക', badgeText: 'അടിയന്തര പ്രോട്ടോക്കോൾ', status: 'ജാഗ്രത: ജലസേചനം തയ്യാറാക്കുക' },
      orange: { title: 'ശ്രദ്ധിക്കുക: വെള്ളക്കെട്ട് ഒഴിവാക്കുക', badgeText: 'ഡ്രെയിനേജ് പ്രോട്ടോക്കോൾ', status: 'അധിക ജലം ഒഴുക്കിക്കളയുക' },
      red: { title: 'വിതയ്ക്കൽ മാറ്റിവെക്കുക: പൊടിവിത ഒഴിവാക്കുക', badgeText: 'മഴ ഇടവേള മുന്നറിയിപ്പ്', status: 'വിതയ്ക്കൽ മാറ്റിവെക്കുക' }
    },
    ur: {
      green: { title: 'بوائی کے لیے سازگار (محفوظ وقت)', badgeText: 'بہترین بوائی کی کھڑکی', status: 'بوائی کے لیے محفوظ' },
      yellow: { title: 'احتیاط: حفاظتی آبپاشی کا انتظام رکھیں', badgeText: 'ہنگامی پروٹوکول', status: 'احتیاط: آبپاشی تیار رکھیں' },
      orange: { title: 'احتیاط: نکاسی آب کا بندوبست کریں', badgeText: 'نکاسی کا پروٹوکول', status: 'اضافی پانی نکال دیں' },
      red: { title: 'بوائی مؤخر کریں: خشک بوائی نہ کریں', badgeText: 'طویل خشک سالی انتباہ', status: 'بوائی مؤخر کریں (خطرے کا امکان)' }
    },
    as: {
      green: { title: 'বীজ সিঁচাৰ বাবে উপযুক্ত (নিৰাপদ সময়)', badgeText: 'অনুকূল বীজ সিঁচা সময়', status: 'বীজ সিঁচিবলৈ নিৰাপদ' },
      yellow: { title: 'সাৱধানতা: পানী যোগানৰ ব্যৱস্থা ৰাখক', badgeText: 'জৰুৰী প্ৰট’কল', status: 'সাৱধানতা: পানী যোগান সাজু ৰাখক' },
      orange: { title: 'সাৱধানতা: পানী জমা হোৱাৰ পৰা ৰক্ষা কৰক', badgeText: 'পানী নিষ্কাশন ব্যৱস্থা', status: 'অতিৰিক্ত পানী উলিয়াই দিয়ক' },
      red: { title: 'বীজ সিঁচা স্থগিত ৰাখক: শুকান মাটিত নিসিঁচিব', badgeText: 'দীঘলীয়া খৰাং সতৰ্কবাণী', status: 'বীজ সিঁচা স্থগিত ৰাখক' }
    },
    mr_local: {
      green: { title: 'पेरणीसाठी एकदम योग्य (वाफसा)', badgeText: 'पेरणीचा पक्का टाईम', status: 'पेरणीसाठी अनुकूल (सुरक्षित वेळ)' },
      yellow: { title: 'सावध राहा: विहिरीला पाणी असेल तरच पेरा', badgeText: 'पाणी जपून वापरा', status: 'सतर्कता: पाणी सोय ठेवा' },
      orange: { title: 'चर काढून पाणी वाहून जाऊ द्या', badgeText: 'निचरा करा', status: 'अतिरिक्त पाणी काढून टाका' },
      red: { title: 'धूळपेरणी करू नका: पाऊस लांबलाय', badgeText: 'मोठा पाऊस खंड', status: 'पेरणी लांबवा (पावसाचा मोठा खंड)' }
    }
  };

  const selected = BADGES[lang] || BADGES['en'];
  if (isGreen) return selected.green;
  if (isYellow) return selected.yellow;
  if (isOrange) return selected.orange;
  return selected.red;
}

// 6-Step Sowing Preparedness Checklist for Farmers & KVK Officers
export function getLocalizedChecklist(lang: string): { id: string; title: string }[] {
  const CHECKLIST_LOCALIZED: Record<string, { id: string; title: string }[]> = {
    en: [
      { id: 'soaking_rain', title: '75-100mm Cumulative Soaking Rain Received (Wafsa confirmed)' },
      { id: 'germination_tested', title: 'Seed Germination Tested (>70% emergence confirmed)' },
      { id: 'seed_treatment', title: 'Seed Treatment Completed (Trichoderma / Fungicide + Rhizobium)' },
      { id: 'bbf_ready', title: 'BBF Planter or Ridge Layout Ready for In-Situ Moisture' },
      { id: 'farm_pond', title: 'Farm Pond / Wells Checked for Protective Life-Saving Irrigation' },
      { id: 'contingency_seed', title: 'Contingency Seed Reserved (Bajra/Pigeonpea in case of break)' }
    ],
    mr: [
      { id: 'soaking_rain', title: 'किमान ७५ ते १०० मिमी सलग पाऊस पडून जमिनीत ओलावा (वाफसा) आला' },
      { id: 'germination_tested', title: 'बियाण्याची उगवण क्षमता तपासली (>७०% उगवण खात्री)' },
      { id: 'seed_treatment', title: 'बियाण्यावर बुरशीनाशक / ट्रायकोडर्मा व जैविक खतांची प्रक्रिया पूर्ण' },
      { id: 'bbf_ready', title: 'बीबीएफ (रुंद वरंबा-चर) यंत्र किंवा सरी-वरंबा आखणी तयार' },
      { id: 'farm_pond', title: 'शेततळे / विहीर संरक्षित जीवनरक्षक पाण्यासाठी सज्ज' },
      { id: 'contingency_seed', title: 'पावसाचा मोठा खंड पडल्यास आपत्कालीन बियाण्याची (तूर/बाजरी) उपलब्धता' }
    ],
    hi: [
      { id: 'soaking_rain', title: 'कम से कम 75-100 मिमी पर्याप्त वर्षा होकर खेत में ओट/नमी उपलब्ध' },
      { id: 'germination_tested', title: 'बीज अंकुरण क्षमता की जांच (>70% अंकुरण प्रमाणित)' },
      { id: 'seed_treatment', title: 'कवकनाशी / ट्राइकोडर्मा एवं जैव उर्वरक से बीजोपचार पूर्ण' },
      { id: 'bbf_ready', title: 'बीबीएफ (BBF) मशीन या मेड़-कूड़ पद्धति की खेत में व्यवस्था' },
      { id: 'farm_pond', title: 'खेत का तालाब / कुआं जीवनरक्षक सिंचाई हेतु तैयार' },
      { id: 'contingency_seed', title: 'मानसून ब्रेक हेतु आकस्मिक बीज (अरहर/बाजरा) का अग्रिम प्रबंध' }
    ],
    te: [
      { id: 'soaking_rain', title: 'కనీసం 75-100 మి.మీ వర్షం కురిసి నేలలో తగినంత తేమ చేరింది' },
      { id: 'germination_tested', title: 'విత్తన మొలక శాతం తనిఖీ చేయబడింది (>70% మొలక శాతం)' },
      { id: 'seed_treatment', title: 'ట్రైకోడెర్మా/రైజోబియంతో విత్తన శుద్ధి పూర్తయింది' },
      { id: 'bbf_ready', title: 'తేమ రక్షణ కోసం బ్రాడ్ బెడ్ ఫర్రో (BBF) యంత్రం సిద్ధంగా ఉంది' },
      { id: 'farm_pond', title: 'వ్యవసాయ కుంట లేదా రక్షిత నీటి వనరు సిద్ధంగా ఉంది' },
      { id: 'contingency_seed', title: 'వర్షాభావం కోసం ప్రత్యామ్నాయ విత్తనాలు (కందులు/సజ్జలు) సిద్ధం' }
    ],
    kn: [
      { id: 'soaking_rain', title: 'ಕನಿಷ್ಠ 75-100 ಮಿಮೀ ಮಳೆಯಾಗಿ ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ' },
      { id: 'germination_tested', title: 'ಬೀಜ ಮೊಳಕೆ ಪ್ರಮಾಣ ಪರೀಕ್ಷಿಸಲಾಗಿದೆ (>70% ಮೊಳಕೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ)' },
      { id: 'seed_treatment', title: 'ಟ್ರೈಕೋಡರ್ಮಾ / ಶಿಲೀಂಧ್ರನಾಶಕದಿಂದ ಬೀಜೋಪಚಾರ ಪೂರ್ಣಗೊಂಡಿದೆ' },
      { id: 'bbf_ready', title: 'ತೇವಾಂಶ ಸಂರಕ್ಷಣೆಗಾಗಿ ಬಿಬಿಎಫ್ (BBF) ಸಾಲು ವ್ಯವಸ್ಥೆ ಸಿದ್ಧವಾಗಿದೆ' },
      { id: 'farm_pond', title: 'ಕೃಷಿ ಹೊಂಡ ಅಥವಾ ಸಂರಕ್ಷಿತ ನೀರಾವರಿ ಸೌಲಭ್ಯ ಪರಿಶೀಲಿಸಲಾಗಿದೆ' },
      { id: 'contingency_seed', title: 'ಮಳೆ ಕೊರತೆಗಾಗಿ ಪರ್ಯಾಯ ಬೆಳೆ ಬೀಜಗಳ (ತೊಗರಿ/ಸಜ್ಜೆ) ಸಿದ್ಧತೆ' }
    ],
    gu: [
      { id: 'soaking_rain', title: 'ઓછામાં ઓછો ૭૫-૧૦૦ મીમી વરસાદ પડીને જમીનમાં વરાપ/ભેજ થયો છે' },
      { id: 'germination_tested', title: 'બીજ ઉગાવો ચકાસાયો (>૭૦% ઉગાવો પ્રમાણિત)' },
      { id: 'seed_treatment', title: 'ટ્રાઇકોડર્મા / ફૂગનાશક અને જૈવિક ખાતરથી બીજ માવજત પૂર્ણ' },
      { id: 'bbf_ready', title: 'ભેજ જાળવણી માટે બ્રોડ બેડ ફરો (BBF) ની વ્યવસ્થા તૈયાર' },
      { id: 'farm_pond', title: 'ખેત તલાવડી અથવા રક્ષણાત્મક પિયત માટેનો સ્ત્રોત સજ્જ' },
      { id: 'contingency_seed', title: 'વરસાદ વિરામ માટે વૈકલ્પિક બિયારણ (તુવેર/બાજરી) અનામત' }
    ],
    ta: [
      { id: 'soaking_rain', title: 'குறைந்தது 75-100 மி.மீ வரை போதிய மழை பெய்து மண்ணில் ஈரப்பதம் உள்ளது' },
      { id: 'germination_tested', title: 'விதை முளைப்பு திறன் சோதிக்கப்பட்டது (>70% முளைப்பு உறுதி)' },
      { id: 'seed_treatment', title: 'ட்ரைக்கோடெர்மா / பூஞ்சாணக்கொல்லி கொண்டு விதை நேர்த்தி செய்யப்பட்டது' },
      { id: 'bbf_ready', title: 'ஈரப்பதத்தை காக்க அகல பாத்தி சால் (BBF) அமைப்பு தயார்' },
      { id: 'farm_pond', title: 'பண்ணை குட்டை அல்லது பாதுகாப்பு பாசன வசதி தயார்' },
      { id: 'contingency_seed', title: 'வறட்சிக்கு மாற்று விதை ஏற்பாடு (துவரை/கம்பு)' }
    ],
    bn: [
      { id: 'soaking_rain', title: 'কমপক্ষে ৭৫-১০০ মিমি পর্যাপ্ত বৃষ্টি হয়ে মাটিতে আর্দ্রতা এসেছে' },
      { id: 'germination_tested', title: 'বীজের অঙ্কুরোদগম পরীক্ষা করা হয়েছে (>৭০% অঙ্কুরোদগম নিশ্চিত)' },
      { id: 'seed_treatment', title: 'ট্রাইকোডার্মা বা ছত্রাকনাশক দিয়ে বীজ শোধন সম্পন্ন' },
      { id: 'bbf_ready', title: 'মাটির আর্দ্রতা রক্ষায় ব্রড বেড ফারো (BBF) ব্যবস্থা প্রস্তুত' },
      { id: 'farm_pond', title: 'কৃষি পুকুর বা জীবন রক্ষাকারী সেচ উৎস প্রস্তুত' },
      { id: 'contingency_seed', title: 'খরা পরিস্থিতির জন্য বিকল্প বীজ (অড়হর/বাজরা) মজুদ' }
    ],
    pa: [
      { id: 'soaking_rain', title: 'ਘੱਟੋ-ਘੱਟ 75-100 ਮਿਲੀਮੀਟਰ ਚੰਗਾ ਮੀਂਹ ਪੈ ਕੇ ਜ਼ਮੀਨ ਵਿੱਚ ਨਮੀ ਆ ਗਈ ਹੈ' },
      { id: 'germination_tested', title: 'ਬੀਜ ਜੰਮਣ ਸਮਰੱਥਾ ਜਾਂਚੀ ਗਈ (>70% ਜੰਮਣ ਯਕੀਨੀ)' },
      { id: 'seed_treatment', title: 'ਉੱਲੀਨਾਸ਼ਕ ਜਾਂ ਟ੍ਰਾਈਕੋਡਰਮਾ ਨਾਲ ਬੀਜ ਸੋਧ ਮੁਕੰਮਲ' },
      { id: 'bbf_ready', title: 'ਨਮੀ ਸੰਭਾਲ ਲਈ ਬੈੱਡ ਫਰੋ (BBF) ਪ੍ਰਬੰਧ ਤਿਆਰ' },
      { id: 'farm_pond', title: 'ਖੇਤ ਦਾ ਤਲਾਬ ਜਾਂ ਬਚਾਓ ਸਿੰਚਾਈ ਦਾ ਸਾਧਨ ਤਿਆਰ' },
      { id: 'contingency_seed', title: 'ਸੋਕੇ ਦੇ ਹਾਲਾਤ ਲਈ ਬਦਲਵੇਂ ਬੀਜਾਂ ਦਾ ਪ੍ਰਬੰਧ' }
    ],
    or: [
      { id: 'soaking_rain', title: 'ଅତି କମରେ ୭୫-୧୦୦ ମିମି ଭଲ ବର୍ଷା ହୋଇ ମାଟିରେ ଆର୍ଦ୍ରତା ଆସିଛି' },
      { id: 'germination_tested', title: 'ବିହନ ଗଜା କ୍ଷମତା ପରୀକ୍ଷା କରାଯାଇଛି (>୭୦% ନିଶ୍ଚିତ)' },
      { id: 'seed_treatment', title: 'ଟ୍ରାଇକୋଡର୍ମା / କବକନାଶକ ଦ୍ୱାରା ବିହନ ବିଶୋଧନ ସମ୍ପୂର୍ଣ୍ଣ' },
      { id: 'bbf_ready', title: 'ଆର୍ଦ୍ରତା ସଂରକ୍ଷଣ ପାଇଁ ବିବିଏଫ (BBF) ପଦ୍ଧତି ପ୍ରସ୍ତୁତ' },
      { id: 'farm_pond', title: 'କୃଷି ପୋଖରୀ କିମ୍ବା ଜରୁରୀ ଜଳସେଚନ ବ୍ୟବସ୍ଥା ଯାଞ୍ଚ ହୋଇଛି' },
      { id: 'contingency_seed', title: 'ବର୍ଷା ଅଭାବ ପାଇଁ ବିକଳ୍ପ ବିହନ (ହରଡ଼/ବାଜରା) ମହଜୁଦ' }
    ],
    ml: [
      { id: 'soaking_rain', title: 'കുറഞ്ഞത് 75-100 മിമി മഴ ലഭിച്ച് മണ്ണിൽ ആവശ്യത്തിന് ഈർപ്പമുണ്ട്' },
      { id: 'germination_tested', title: 'വിത്ത് മുളയ്ക്കൽ ശേഷി പരിശോധിച്ചു (>70% ഉറപ്പുവരുത്തി)' },
      { id: 'seed_treatment', title: 'ട്രൈക്കോഡെർമ ഉപയോഗിച്ച് വിത്തുചികിത്സ പൂർത്തിയാക്കി' },
      { id: 'bbf_ready', title: 'ഈർപ്പം നിലനിർത്താൻ ബിബിഎഫ് (BBF) കിടങ്ങ് സംവിധാനം സജ്ജം' },
      { id: 'farm_pond', title: 'ജീവൻരക്ഷാ ജലസേചനത്തിനായി കുളം അല്ലെങ്കിൽ ഉറവിടം പരിശോധിച്ചു' },
      { id: 'contingency_seed', title: 'മഴക്കുറവ് നേരിടാൻ ബദൽ വിത്തുകളുടെ ലഭ്യത' }
    ],
    ur: [
      { id: 'soaking_rain', title: 'کم از کم 75 سے 100 ملی میٹر بارش ہو کر مٹی میں وتر آ چکا ہے' },
      { id: 'germination_tested', title: 'بیج کی اگاؤ صلاحیت کی جانچ (>70% اگاؤ تصدیق شدہ)' },
      { id: 'seed_treatment', title: 'ٹرائیکوڈرما یا پھپھوند کش ادویات سے بیج کا علاج مکمل' },
      { id: 'bbf_ready', title: 'نمی برقرار رکھنے کے لیے بی بی ایف بیڈ طریقہ تیار' },
      { id: 'farm_pond', title: 'ہنگامی آبپاشی کے لیے فارم تالاب یا کنواں تیار' },
      { id: 'contingency_seed', title: 'خشک سالی کے متبادل بیجوں کا پیشگی بندوبست' }
    ],
    as: [
      { id: 'soaking_rain', title: 'নূন্যতম ৭৫-১০০ মিমি পৰ্যাপ্ত বৰষুণ হৈ মাটিত জীপ আহিছে' },
      { id: 'germination_tested', title: 'বীজৰ গজা ক্ষমতা পৰীক্ষা কৰা হৈছে (>৭০% নিশ্চিত)' },
      { id: 'seed_treatment', title: 'ফাংগিচাইদ বা ট্রাইক’ডাৰ্মাৰে বীজ শোধন সম্পূৰ্ণ' },
      { id: 'bbf_ready', title: 'মাটিৰ জীপ ধৰি ৰাখিবলৈ চহ আৰু ভেটিৰ ব্যৱস্থা প্ৰস্তুত' },
      { id: 'farm_pond', title: 'পথাৰৰ পুখুৰী বা জৰুৰী জলসিঞ্চনৰ ব্যৱস্থা পৰীক্ষা কৰা হৈছে' },
      { id: 'contingency_seed', title: 'খৰাং অৱস্থাৰ বাবে বিকল্প বীজ মজুত ৰখা হৈছে' }
    ],
    mr_local: [
      { id: 'soaking_rain', title: 'किमान ७५-१०० मिमी पाऊस पडून जमिनीत चांगला वाफसा आलाय' },
      { id: 'germination_tested', title: 'बियाण्याची उगवण तपासून पाहिली (>७०% कोंब आलेत)' },
      { id: 'seed_treatment', title: 'बियाण्याला बुरशीनाशकाची चोळणी (बीजप्रक्रिया) झाली' },
      { id: 'bbf_ready', title: 'बीबीएफ (रुंद वरंबा-चर) यंत्र किंवा नांगराची चर आखली' },
      { id: 'farm_pond', title: 'शेततळे किंवा विहिरीत पाणी शिल्लक आहे का ते तपासले' },
      { id: 'contingency_seed', title: 'पाऊस लांबल्यास दुसरं बियाणे (तूर/बाजरी) जवळ ठेवलंय' }
    ]
  };

  return CHECKLIST_LOCALIZED[lang] || CHECKLIST_LOCALIZED['en'];
}

// Multi-Language Headlines and 4 Simple Sentences Generator
export function getLocalizedAdvisorySentences(
  cropId: CropId,
  stage: string,
  block: BlockInfo,
  forecast: ProbabilisticForecast,
  verdictCode: 'PROCEED' | 'CAUTION_IRRIGATE' | 'DELAY_SOWING' | 'PROTECT_DRAIN' | 'OPTIMAL_SOWING',
  breakRiskPct: number,
  onsetDelayShiftDays: number,
  breakDurationExpectedDays: number
): {
  headline: Record<string, string>;
  todayAdvice: Record<string, string>;
  waterAdvice: Record<string, string>;
  seedAdvice: Record<string, string>;
  sowingRule: Record<string, string>;
} {
  const cropNames: Record<string, string> = {
    en: getLocalizedCropName(cropId, 'en'),
    mr: getLocalizedCropName(cropId, 'mr'),
    hi: getLocalizedCropName(cropId, 'hi'),
    te: getLocalizedCropName(cropId, 'te'),
    kn: getLocalizedCropName(cropId, 'kn'),
    gu: getLocalizedCropName(cropId, 'gu'),
    ta: getLocalizedCropName(cropId, 'ta'),
    bn: getLocalizedCropName(cropId, 'bn'),
    pa: getLocalizedCropName(cropId, 'pa'),
    or: getLocalizedCropName(cropId, 'or'),
    ml: getLocalizedCropName(cropId, 'ml'),
    ur: getLocalizedCropName(cropId, 'ur'),
    as: getLocalizedCropName(cropId, 'as'),
    mr_local: getLocalizedCropName(cropId, 'mr_local')
  };

  const delayDays = Math.max(1, Math.round(onsetDelayShiftDays));
  const isDelay = verdictCode === 'DELAY_SOWING';
  const isCaution = verdictCode === 'CAUTION_IRRIGATE';
  const isDrain = verdictCode === 'PROTECT_DRAIN';

  // Headlines in 14 languages
  const headline: Record<string, string> = {
    en: isDelay
      ? `POSTPONE SOWING of ${cropNames.en}: False onset risk (${breakRiskPct}%). Wait for cumulative 75-100mm rain.`
      : isCaution
        ? `CAUTION FOR ${cropNames.en}: Sow only with protective irrigation / Broad Bed Furrow.`
        : isDrain
          ? `DRAIN EXCESS RUNOFF: High rain risk detected for ${cropNames.en}.`
          : `OPTIMAL SOWING WINDOW: Favorable conditions for ${cropNames.en}.`,
    mr: isDelay
      ? `${cropNames.mr} ची धूळपेरणी टाळा: पावसाचा मोठा खंड धोका (${breakRiskPct}%). ७५-१०० मिमी पाऊस पडेपर्यंत थांबा.`
      : isCaution
        ? `${cropNames.mr} साठी सतर्कता: संरक्षित सिंचनाची सोय असेल तरच पेरणी करा.`
        : isDrain
          ? `शेतातून पाण्याचा निचरा करा: ${cropNames.mr} पिकात पाणी साचू देऊ नका.`
          : `${cropNames.mr} साठी पेरणीची सर्वोत्तम वेळ: जमिनीत योग्य वाफसा उपलब्ध.`,
    hi: isDelay
      ? `${cropNames.hi} की धूल बुवाई टालें: सूखा / ब्रेक जोखिम (${breakRiskPct}%)। 75-100 मिमी वर्षा तक रुकें।`
      : isCaution
        ? `${cropNames.hi} हेतु सतर्कता: जीवनरक्षक सिंचाई या बीबीएफ पद्धति से ही बुवाई करें।`
        : isDrain
          ? `जल निकासी सुनिश्चित करें: ${cropNames.hi} के खेत में पानी भराव न होने दें।`
          : `${cropNames.hi} की बुवाई के लिए आदर्श समय: मिट्टी में पर्याप्त नमी मौजूद।`,
    te: isDelay
      ? `${cropNames.te} విత్తడం ఆలస్యం చేయండి: వర్షాభావ ప్రమాదం (${breakRiskPct}%). 75-100 మి.మీ వర్షం పడేవరకు ఆగండి.`
      : isCaution
        ? `${cropNames.te} కొరకు జాగ్రత్త: రక్షిత నీటి పారుదల సౌకర్యం ఉంటేనే విత్తండి.`
        : isDrain
          ? `అదనపు నీటిని బయటకు పంపండి: ${cropNames.te} పొలంలో నీరు నిల్వ ఉండకూడదు.`
          : `${cropNames.te} విత్తనానికి అనుకూల సమయం: నేలలో తగినంత తేమ ఉంది.`,
    kn: isDelay
      ? `${cropNames.kn} ಬಿತ್ತನೆ ಮುಂದೂಡಿ: ಒಣ ಅವಧಿ ಅಪಾಯ (${breakRiskPct}%). 75-100 ಮಿಮೀ ಮಳೆಯಾಗುವವರೆಗೆ ಕಾಯಿರಿ.`
      : isCaution
        ? `${cropNames.kn} ಎಚ್ಚರಿಕೆ: ಸಂರಕ್ಷಿತ ನೀರಾವರಿ ಇದ್ದರೆ ಮಾತ್ರ ಬಿತ್ತನೆ ಮಾಡಿ.`
        : isDrain
          ? `ಹೆಚ್ಚುವರಿ ನೀರನ್ನು ಹೊರಹಾಕಿ: ${cropNames.kn} ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.`
          : `${cropNames.kn} ಬಿತ್ತನೆಗೆ ಸೂಕ್ತ ಸಮಯ: ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ.`,
    gu: isDelay
      ? `${cropNames.gu} ની વાવણી મોકૂફ રાખો: વરસાદ વિરામ જોખમ (${breakRiskPct}%). ૭૫-૧૦૦ મીમી વરસાદ સુધી થોભો.`
      : isCaution
        ? `${cropNames.gu} માટે સાવચેતી: પૂરક પિયત હોય તો જ વાવણી કરો.`
        : isDrain
          ? `પાણીનો નિકાલ કરો: ${cropNames.gu} ના ખેતરમાં પાણી ભરાવા ન દેશો.`
          : `${cropNames.gu} વાવણી માટે ઉત્તમ સમય: જમીનમાં પૂરતો ભેજ છે.`,
    ta: isDelay
      ? `${cropNames.ta} விதைப்பை தள்ளிப்போடுங்கள்: வறட்சி இடைவெளி ஆபத்து (${breakRiskPct}%). 75-100 மி.மீ மழை வரை காத்திருங்கள்.`
      : isCaution
        ? `${cropNames.ta} எச்சரிக்கை: பாதுகாப்பு பாசனம் இருந்தால் மட்டுமே விதைக்கவும்.`
        : isDrain
          ? `நீரை வெளியேற்றவும்: ${cropNames.ta} வயலில் நீர் தேங்காமல் பார்த்துக் கொள்ளவும்.`
          : `${cropNames.ta} விதைப்புக்கு சிறந்த நேரம்: மண்ணில் போதுமான ஈரப்பதம் உள்ளது.`,
    bn: isDelay
      ? `${cropNames.bn} বপন স্থগিত রাখুন: খরা বিরতি ঝুঁকি (${breakRiskPct}%)। ৭৫-১০০ মিমি বৃষ্টি না হওয়া পর্যন্ত অপেক্ষা করুন।`
      : isCaution
        ? `${cropNames.bn} এর জন্য সতর্কতা: সুরক্ষামূলক সেচ ব্যবস্থা থাকলে তবেই বপন করুন।`
        : isDrain
          ? `জল নিষ্কাশন করুন: ${cropNames.bn} জমিতে জল জমতে দেবেন না।`
          : `${cropNames.bn} বপনের অনুকূল সময়: মাটিতে পর্যাপ্ত আর্দ্রতা রয়েছে।`,
    pa: isDelay
      ? `${cropNames.pa} ਦੀ ਬਿਜਾਈ ਮੁਲਤਵੀ ਕਰੋ: ਸੋਕੇ ਦਾ ਜੋਖਮ (${breakRiskPct}%)। 75-100 ਮਿਮੀ ਮੀਂਹ ਪੈਣ ਤੱਕ ਉਡੀਕ ਕਰੋ।`
      : isCaution
        ? `${cropNames.pa} ਲਈ ਸਾਵਧਾਨੀ: ਸਿੰਚਾਈ ਉਪਲਬਧ ਹੋਵੇ ਤਾਂ ਹੀ ਬਿਜਾਈ ਕਰੋ।`
        : isDrain
          ? `ਪਾਣੀ ਦਾ ਨਿਕਾਸ ਕਰੋ: ${cropNames.pa} ਦੇ ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਹੋਣ ਦਿਓ।`
          : `${cropNames.pa} ਬਿਜਾਈ ਲਈ ਢੁਕਵਾਂ ਸਮਾਂ: ਮਿੱਟੀ ਵਿੱਚ ਕਾਫ਼ੀ ਨਮੀ ਹੈ।`,
    or: isDelay
      ? `${cropNames.or} ବୁଣିବା ବିଳମ୍ବ କରନ୍ତୁ: ବର୍ଷା ବିରାମ ବିପଦ (${breakRiskPct}%)। ୭୫-୧୦୦ ମିମି ବର୍ଷା ପର୍ଯ୍ୟନ୍ତ ଅପେକ୍ଷା କରନ୍ତୁ।`
      : isCaution
        ? `${cropNames.or} ପାଇଁ ସତର୍କତା: ଜଳସେଚନ ବ୍ୟବସ୍ଥା ଥିଲେ ହିଁ ବୁଣନ୍ତୁ।`
        : isDrain
          ? `ଜଳ ନିଷ୍କାସନ କରନ୍ତୁ: ${cropNames.or} କ୍ଷେତରେ ପାଣି ଜମିବାକୁ ଦିଅନ୍ତୁ ନାହିଁ।`
          : `${cropNames.or} ବୁଣିବା ପାଇଁ ଉପଯୁକ୍ତ ସମୟ: ମାଟିରେ ଆର୍ଦ୍ରତା ଉପଲବ୍ଧ।`,
    ml: isDelay
      ? `${cropNames.ml} വിതയ്ക്കൽ മാറ്റിവെക്കുക: മഴ ഇടവേള സാധ്യത (${breakRiskPct}%). 75-100 മിമി മഴ വരെ കാത്തിരിക്കുക.`
      : isCaution
        ? `${cropNames.ml} ജാഗ്രത: ജലസേചന സൗകര്യമുണ്ടെങ്കിൽ മാത്രം വിതയ്ക്കുക.`
        : isDrain
          ? `വെള്ളം ഒഴുക്കിക്കളയുക: ${cropNames.ml} തോട്ടത്തിൽ വെള്ളം കെട്ടിക്കിടക്കാൻ അനുവദിക്കരുത്.`
          : `${cropNames.ml} വിതയ്ക്കാൻ ഏറ്റവും അനുയോജ്യമായ സമയം: മണ്ണിൽ ഈർപ്പമുണ്ട്.`,
    ur: isDelay
      ? `${cropNames.ur} کی بوائی مؤخر کریں: طویل وقفے کا خطرہ (${breakRiskPct}%)۔ 75 سے 100 ملی میٹر بارش تک انتظار کریں۔`
      : isCaution
        ? `${cropNames.ur} کے لیے احتیاط: حفاظتی آبپاشی میسر ہو تب ہی بوائیں کریں۔`
        : isDrain
          ? `نکاسی آب کریں: ${cropNames.ur} کے کھیت میں پانی جمع نہ ہونے دیں۔`
          : `${cropNames.ur} کی بوائی کے لیے بہترین وقت: مٹی میں مناسب نمی موجود ہے۔`,
    as: isDelay
      ? `${cropNames.as} বীজ সিঁচা স্থগিত ৰাখক: খৰাং সম্ভাৱনা (${breakRiskPct}%)। ৭৫-১০০ মিমি বৰষুণ নোহোৱালৈকে অপেক্ষা কৰক।`
      : isCaution
        ? `${cropNames.as} বাবে সাৱধানতা: পানী যোগান থাকিলেহে বীজ সিঁচক।`
        : isDrain
          ? `পানী নিষ্কাশন কৰক: ${cropNames.as} পথাৰত পানী জমা হ'বলৈ নিদিব।`
          : `${cropNames.as} বীজ সিঁচাৰ উপযুক্ত সময়: মাটিত পৰ্যাপ্ত জীপ আছে।`,
    mr_local: isDelay
      ? `${cropNames.mr_local} ची धूळपेरणी अजिबात करू नका: पाऊस ${delayDays} दिवस लांबलाय. बियाणे वाया जाईल.`
      : isCaution
        ? `${cropNames.mr_local} साठी सावध राहा: विहिरीला किंवा बोअरला पाणी असेल तरच पेरा.`
        : isDrain
          ? `चर काढून शेतातलं साचलेलं पाणी बाहेर काढा.`
          : `${cropNames.mr_local} साठी वाफसा उत्तम आलाय, पेरणीला सुरुवात करा.`
  };

  // Today's action in 14 languages
  const todayAdvice: Record<string, string> = {
    en: isDelay
      ? `Hold sowing today. Monsoon onset delayed by ~${delayDays} days. Plant only after sustained 75-100mm soaking rain.`
      : isCaution
        ? `Sow only if supplemental irrigation is ready. Dry spell of ~${breakDurationExpectedDays} days expected ahead.`
        : isDrain
          ? `Open drainage furrows immediately to flush excess water and prevent seed rot.`
          : `Sow ${cropNames.en} today! Soil moisture profile is optimal and climate window is open.`,
    mr: isDelay
      ? `आज कोरड्या जमिनीत पेरणी करू नका. पाऊस ${delayDays} दिवस लांबला आहे. चांगला मोठा पाऊस पडल्यावरच पेरा.`
      : isCaution
        ? `शेतात पाणी देण्याची सोय असल्यास पेरणी करा. पुढील काही दिवसांत पावसाचा खंड पडू शकतो.`
        : isDrain
          ? `शेतातून पाण्याचा निचरा होण्यासाठी चर काढा जेणेकरून बियाणे सडणार नाही.`
          : `आज ${cropNames.mr} ची पेरणी करा! जमिनीत भरपूर ओलावा आहे आणि हवामान उत्तम आहे.`,
    hi: isDelay
      ? `आज सूखी मिट्टी में बीज न डालें। मानसून ${delayDays} दिन की देरी से है। अच्छी बारिश का इंतज़ार करें।`
      : isCaution
        ? `यदि सिंचाई की व्यवस्था है तभी बुवाई करें। आगे ~${breakDurationExpectedDays} दिनों का सूखा हो सकता है।`
        : isDrain
          ? `खेत में पानी निकासी की नाली बनाएं ताकि भारी बारिश से बीज न सड़े।`
          : `आज ${cropNames.hi} की बुवाई करें! मिट्टी में पर्याप्त नमी है और मौसम बहुत अच्छा है।`,
    te: isDelay
      ? `ఈ రోజు పొడి నేలలో విత్తనాలు వేయకండి. వర్షాకాలం ${delayDays} రోజులు ఆలస్యమైంది. మంచి వర్షం కోసం వేచి ఉండండి.`
      : isCaution
        ? `నీటి పారుదల సౌకర్యం ఉంటేనే విత్తండి. రాబోయే రోజుల్లో వర్షాభావం ఉండవచ్చు.`
        : isDrain
          ? `విత్తనాలు కుళ్ళిపోకుండా పొలంలో మురుగు కాలువలు తీయండి.`
          : `ఈ రోజే ${cropNames.te} విత్తండి! నేలలో తగినంత తేమ ఉంది.`,
    kn: isDelay
      ? `ಇಂದು ಒಣ ಮಣ್ಣಿನಲ್ಲಿ ಬಿತ್ತನೆ ಮಾಡಬೇಡಿ. ಮುಂಗಾರು ${delayDays} ದಿನ ತಡವಾಗಿದೆ. ಉತ್ತಮ ಮಳೆಯಾಗುವವರೆಗೆ ಕಾಯಿರಿ.`
      : isCaution
        ? `ನೀರಾವರಿ ಲಭ್ಯವಿದ್ದರೆ ಮಾತ್ರ ಬಿತ್ತನೆ ಮಾಡಿ. ಮುಂದೆ ಒಣ ಅವಧಿ ಎದುರಾಗಬಹುದು.`
        : isDrain
          ? `ಬೀಜ ಕೊಳೆಯದಂತೆ ತಡೆಯಲು ಹೊಲದಲ್ಲಿ ಚರಂಡಿ ಮಾಡಿ ಹೆಚ್ಚುವರಿ ನೀರನ್ನು ಹೊರಹಾಕಿ.`
          : `ಇಂದೇ ${cropNames.kn} ಬಿತ್ತನೆ ಮಾಡಿ! ಮಣ್ಣಿನಲ್ಲಿ ಉತ್ತಮ ತೇವಾಂಶವಿದೆ.`,
    gu: isDelay
      ? `આજે સૂકી જમીનમાં વાવણી ન કરો. ચોમાસું ${delayDays} દિવસ મોડું છે. સારો વરસાદ થાય પછી જ વાવો.`
      : isCaution
        ? `જો પિયતની સગવડ હોય તો જ વાવણી કરો. આગળ વરસાદનો વિરામ આવી શકે છે.`
        : isDrain
          ? `વધારાના પાણીના નિકાલ માટે નીંક બનાવો જેથી બિયારણ સડે નહીં.`
          : `આજે ${cropNames.gu} ની વાવણી શરૂ કરો! જમીનમાં ઉત્તમ ભેજ છે.`,
    ta: isDelay
      ? `இன்று காய்ந்த மண்ணில் விதைக்க வேண்டாம். பருவமழை ${delayDays} நாட்கள் தாமதமாகிறது. நல்ல மழை பெய்யும் வரை காத்திருங்கள்.`
      : isCaution
        ? `பாசன வசதி இருந்தால் மட்டுமே விதைக்கவும். அடுத்து வறட்சி இடைவெளி வரலாம்.`
        : isDrain
          ? `விதை அழுகாமல் இருக்க வயலில் வடிகால் வாய்க்கால்களை அமையுங்கள்.`
          : `இன்றே ${cropNames.ta} விதைத்திடுங்கள்! மண்ணில் போதிய ஈரப்பதம் உள்ளது.`,
    bn: isDelay
      ? `আজ শুকনো মাটিতে বীজ বুনবেন না। বর্ষা ${delayDays} দিন দেরিতে আসছে। ভালো বৃষ্টি না হওয়া পর্যন্ত অপেক্ষা করুন।`
      : isCaution
        ? `সেচের ব্যবস্থা থাকলে তবেই বপন করুন। সামনে শুষ্ক আবহাওয়া আসতে পারে।`
        : isDrain
          ? `বীজ পচন রোধে অতিরিক্ত জল নিষ্কাশনের জন্য নালা তৈরি করুন।`
          : `আজই ${cropNames.bn} বপন করুন! মাটিতে পর্যাপ্ত আর্দ্রতা রয়েছে।`,
    pa: isDelay
      ? `ਅੱਜ ਸੁੱਕੀ ਜ਼ਮੀਨ ਵਿੱਚ ਬਿਜਾਈ ਨਾ ਕਰੋ। ਮੌਨਸੂਨ ${delayDays} ਦਿਨ ਲੇਟ ਹੈ। ਚੰਗੇ ਮੀਂਹ ਦਾ ਇੰਤਜ਼ਾਰ ਕਰੋ।`
      : isCaution
        ? `ਜੇ ਸਿੰਚਾਈ ਦਾ ਪ੍ਰਬੰਧ ਹੈ ਤਾਂ ਹੀ ਬਿਜਾਈ ਕਰੋ। ਅੱਗੇ ਸੋਕਾ ਪੈ ਸਕਦਾ ਹੈ।`
        : isDrain
          ? `ਬੀਜ ਗਲਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਪਾਣੀ ਦੇ ਨਿਕਾਸ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ।`
          : `ਅੱਜ ${cropNames.pa} ਦੀ ਬਿਜਾਈ ਕਰੋ! ਮਿੱਟੀ ਵਿੱਚ ਬਹੁਤ ਵਧੀਆ ਨਮੀ ਹੈ।`,
    or: isDelay
      ? `ଆଜି ଶୁଖିଲା ମାଟିରେ ବୁଣନ୍ତୁ ନାହିଁ। ମୌସୁମୀ ${delayDays} ଦିନ ବିଳମ୍ବ ଅଛି। ଭଲ ବର୍ଷାକୁ ଅପେକ୍ଷା କରନ୍ତୁ।`
      : isCaution
        ? `ଜଳସେଚନ ବ୍ୟବସ୍ଥା ଥିଲେ ହିଁ ବୁଣନ୍ତୁ। ଆଗକୁ ବର୍ଷା ବିରାମ ଆସିପାରେ।`
        : isDrain
          ? `ବିହନ ସଢ଼ିବାକୁ ରୋକିବା ପାଇଁ ଜଳ ନିଷ୍କାସନ ନାଳି ପ୍ରସ୍ତୁତ କରନ୍ତୁ।`
          : `ଆଜି ${cropNames.or} ବୁଣିବା ଆରମ୍ଭ କରନ୍ତୁ! ମାଟିରେ ଭଲ ଆର୍ଦ୍ରତା ଅଛି।`,
    ml: isDelay
      ? `ഇന്ന് ഉണങ്ങിയ മണ്ണിൽ വിതയ്ക്കരുത്. മൺസൂൺ ${delayDays} ദിവസം വൈകുന്നു. നല്ല മഴയ്ക്കായി കാത്തിരിക്കുക.`
      : isCaution
        ? `ജലസേചനമുണ്ടെങ്കിൽ മാത്രം വിതയ്ക്കുക. മഴക്കുറവ് വരാൻ സാധ്യതയുണ്ട്.`
        : isDrain
          ? `വിത്ത് ചീഞ്ഞുപോകാതിരിക്കാൻ അധിക ജലം ഒഴുക്കിക്കളയാൻ ചാലുകൾ ഉണ്ടാക്കുക.`
          : `ഇന്ന് തന്നെ ${cropNames.ml} വിതയ്ക്കാം! മണ്ണിൽ ആവശ്യത്തിന് ഈർപ്പമുണ്ട്.`,
    ur: isDelay
      ? `آج خشک مٹی میں بیج نہ ڈالیں۔ مانسون ${delayDays} دن کی تاخیر سے ہے۔ اچھی بارش کا انتظار کریں۔`
      : isCaution
        ? `اگر آبپاشی کا انتظام ہے تب ہی بوائی کریں۔ آگے خشک سالی آ سکتی ہے۔`
        : isDrain
          ? `کھیت سے اضافی پانی نکالنے کے لیے نالیاں بنائیں تاکہ بیج گلنے سے بچ سکے۔`
          : `آج ${cropNames.ur} کی بوائی کریں! مٹی میں مناسب وتر موجود ہے۔`,
    as: isDelay
      ? `আজি শুকান মাটিত বীজ নিসিঁচিব। বাৰিষা ${delayDays} দিন পলম হৈছে। ভাল বৰষুণ নোহোৱালৈকে অপেক্ষা কৰক।`
      : isCaution
        ? `পানীৰ যোগান থাকিলেহে বীজ সিঁচক। আগলৈ খৰাং বতৰ আহিব পাৰে।`
        : isDrain
          ? `বীজ পচি যোৱাৰ পৰা ৰক্ষা কৰিবলৈ অতিৰিক্ত পানী ওলাই যোৱাৰ নলা কাটক।`
          : `আজিয়েই ${cropNames.as} বীজ সিঁচক! মাটিত উপযুক্ত জীপ আছে।`,
    mr_local: isDelay
      ? `आज कोरड्या रानात पेरणी करू नका. पाऊस ${delayDays} दिवस लांबलाय. ३-४ इंच ओल गेल्यावरच पेरा.`
      : isCaution
        ? `विहिरीला पाणी असेल तरच पेरा. पुढे पाऊस उघडीप देणार आहे.`
        : isDrain
          ? `चर काढून शेतातलं पाणी वाहून जाऊ द्या, नाहीतर बी सडेल.`
          : `आज ${cropNames.mr_local} पेरायला घ्या! जमिनीत उत्तम वाफसा आहे.`
  };

  // Water advice in 14 languages
  const waterAdvice: Record<string, string> = {
    en: isDrain
      ? `Keep field drains open to flush excess runoff.`
      : isDelay || breakRiskPct > 40
        ? `Save water in farm ponds; do not waste tubewell water on dry crust.`
        : `Soil has sufficient root moisture; no extra irrigation needed now.`,
    mr: isDrain
      ? `शेतातील चर मोकळे ठेवा जेणेकरून जास्त पाणी वाहून जाईल.`
      : isDelay || breakRiskPct > 40
        ? `शेततळ्यात पाणी साठवा, विहिरीचे पाणी जपून वापरा.`
        : `जमिनीत पुरेसा ओलावा आहे, आत्ता जादा पाण्याची गरज नाही.`,
    hi: isDrain
      ? `खेत की नालियां खुली रखें ताकि अतिरिक्त पानी निकल जाए।`
      : isDelay || breakRiskPct > 40
        ? `खेत के तालाब में पानी संचित रखें, बोरवेल का पानी बचाएं।`
        : `मिट्टी में भरपूर नमी है, अभी अतिरिक्त सिंचाई की आवश्यकता नहीं है।`,
    te: isDrain
      ? `అదనపు నీరు బయటకు పోయేలా కాలువలను తెరిచి ఉంచండి.`
      : isDelay || breakRiskPct > 40
        ? `వ్యవసాయ కుంటలలో నీటిని పొదుపు చేయండి; బోరు నీటిని వృధా చేయవద్దు.`
        : `నేలలో తగినంత తేమ ఉంది; ఇప్పుడు అదనపు నీరు అవసరం లేదు.`,
    kn: isDrain
      ? `ಹೆಚ್ಚುವರಿ ನೀರು ಹರಿದುಹೋಗಲು ಹೊಲದ ಕಾಲುವೆಗಳನ್ನು ತೆರೆದಿಡಿ.`
      : isDelay || breakRiskPct > 40
        ? `ಕೃಷಿ ಹೊಂಡದಲ್ಲಿ ನೀರು ಉಳಿಸಿ; ಬೋರ್‌ವೆಲ್ ನೀರನ್ನು ವ್ಯರ್ಥ ಮಾಡಬೇಡಿ.`
        : `ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ; ಈಗ ಹೆಚ್ಚುವರಿ ನೀರಾವರಿ ಅಗತ್ಯವಿಲ್ಲ.`,
    gu: isDrain
      ? `વધારાનું પાણી વહી જાય તે માટે ખેતરની નીંક ખુલ્લી રાખો.`
      : isDelay || breakRiskPct > 40
        ? `ખેત તલાવડીમાં પાણી બચાવો; બોરવેલનું પાણી વેડફશો નહીં.`
        : `જમીનમાં પૂરતો ભેજ છે; અત્યારે વધારાના પિયતની જરૂર નથી.`,
    ta: isDrain
      ? `அதிகப்படியான நீர் வெளியேற வடிகால் வாய்க்கால்களை திறந்து வைக்கவும்.`
      : isDelay || breakRiskPct > 40
        ? `பண்ணை குட்டையில் நீரை சேமியுங்கள்; நிலத்தடி நீரை வீணாக்காதீர்கள்.`
        : `மண்ணில் போதுமான ஈரப்பதம் உள்ளது; கூடுதல் பாசனம் தேவையில்லை.`,
    bn: isDrain
      ? `অতিরিক্ত জল নিষ্কাশনের জন্য নালার মুখ খুলে রাখুন।`
      : isDelay || breakRiskPct > 40
        ? `কৃষি পুকুরে জল সংরক্ষণ করুন; নলকূপের জল অপচয় করবেন না।`
        : `মাটিতে পর্যাপ্ত আর্দ্রতা রয়েছে; এখন অতিরিক্ত সেচের প্রয়োজন নেই।`,
    pa: isDrain
      ? `ਵਾਧੂ ਪਾਣੀ ਦੇ ਨਿਕਾਸ ਲਈ ਖਾਲ ਖੁੱਲ੍ਹੇ ਰੱਖੋ।`
      : isDelay || breakRiskPct > 40
        ? `ਤਲਾਬਾਂ ਵਿੱਚ ਪਾਣੀ ਬਚਾਓ; ਟਿਊਬਵੈੱਲ ਦਾ ਪਾਣੀ ਵਿਅਰਥ ਨਾ ਗੁਆਓ।`
        : `ਮਿੱਟੀ ਵਿੱਚ ਕਾਫ਼ੀ ਨਮੀ ਹੈ; ਵਾਧੂ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਨਹੀਂ।`,
    or: isDrain
      ? `ଅଧିକ ପାଣି ବାହାରିଯିବା ପାଇଁ ନାଳି ଖୋଲା ରଖନ୍ତୁ।`
      : isDelay || breakRiskPct > 40
        ? `ପୋଖରୀରେ ପାଣି ସଞ୍ଚୟ କରନ୍ତୁ; ବୋରୱେଲ ପାଣି ନଷ୍ଟ କରନ୍ତୁ ନାହିଁ।`
        : `ମାଟିରେ ଆବଶ୍ୟକ ଆର୍ଦ୍ରତା ଅଛି; ବର୍ତ୍ତମାନ ଅତିରିକ୍ତ ଜଳସେଚନ ଦରକାର ନାହିଁ।`,
    ml: isDrain
      ? `അധിക വെള്ളം ഒഴുക്കിക്കളയാൻ ചാലുകൾ തുറന്നുവെക്കുക.`
      : isDelay || breakRiskPct > 40
        ? `കുളങ്ങളിൽ ജലം സംരക്ഷിക്കുക; വെള്ളം പാഴാക്കരുത്.`
        : `മണ്ണിൽ ആവശ്യത്തിന് ഈർപ്പമുണ്ട്; ഇപ്പോൾ അധിക നന ആവശ്യമില്ല.`,
    ur: isDrain
      ? `اضافی پانی کے بہاؤ کے لیے نالیاں کھلی رکھیں۔`
      : isDelay || breakRiskPct > 40
        ? `تالاب میں پانی محفوظ رکھیں؛ ٹیوب ویل کا پانی ضائع نہ کریں۔`
        : `مٹی میں کافی نمی موجود ہے؛ ابھی اضافی آبپاشی کی ضرورت نہیں۔`,
    as: isDrain
      ? `অতিৰিক্ত পানী ওলাই যাব পৰাকৈ নলাবোৰ মুকলি কৰি ৰাখক।`
      : isDelay || breakRiskPct > 40
        ? `পথাৰৰ পুখুৰীত পানী সংৰক্ষণ কৰক; পানী অপচয় নকৰিব।`
        : `মাটিত পৰ্যাপ্ত জীপ আছে; এতিয়া অতিৰিক্ত পানীৰ প্ৰয়োজন নাই।`,
    mr_local: isDrain
      ? `चर मोकळा ठेवा, पाणी साचून राहू देऊ नका.`
      : isDelay || breakRiskPct > 40
        ? `शेततळ्यातलं पाणी जपून ठेवा, पाऊस उघडीप देणार आहे.`
        : `जमिनीत वाफसा आहे, वरून पाणी देण्याची गरज नाही.`
  };

  // Seed treatment advice in 14 languages
  const seedAdvice: Record<string, string> = {
    en: `Treat seeds with bio-fertilizers or Trichoderma before planting to stop fungal root rot.`,
    mr: `पेरणीपूर्वी बियाण्याला ट्रायकोडर्मा किंवा बुरशीनाशक चोळा जेणेकरून रोग पडणार नाही.`,
    hi: `बुवाई से पहले बीजों को ट्राइकोडर्मा या फफूंदनाशक से अवश्य उपचारित करें।`,
    te: `శిలీంధ్ర తెగుళ్లు రాకుండా విత్తనాలను ట్రైకోడెర్మా లేదా శిలీంధ్రనాశినితో శుద్ధి చేయండి.`,
    kn: `ಶಿಲೀಂಧ್ರ ರೋಗ ಬರದಂತೆ ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೀಜಗಳಿಗೆ ಟ್ರೈಕೋಡರ್ಮಾ ಅಥವಾ ಶಿಲೀಂಧ್ರನಾಶಕದಿಂದ ಉಪಚರಿಸಿ.`,
    gu: `ફૂગજન્ય રોગો અટકાવવા વાવણી પહેલાં બીજને ટ્રાઇકોડર્મા કે ફૂગનાશકથી માવજત આપો.`,
    ta: `வேரழுகல் நோயைத் தடுக்க விதைக்கும் முன் ட்ரைக்கோடெர்மா கொண்டு விதை நேர்த்தி செய்யவும்.`,
    bn: `ছত্রাকঘটিত শিকড় পচন রোধে বপনের আগে বীজকে ট্রাইকোডার্মা দিয়ে শোধন করুন।`,
    pa: `ਜੜ੍ਹ ਗਲਣ ਤੋਂ ਬਚਾਅ ਲਈ ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਬੀਜ ਨੂੰ ਟ੍ਰਾਈਕੋਡਰਮਾ ਨਾਲ ਸੋਧੋ।`,
    or: `ଚେର ସଢ଼ା ରୋଗରୁ ରକ୍ଷା ପାଇବା ପାଇଁ ବୁଣିବା ପୂର୍ବରୁ ବିହନ ବିଶୋଧନ କରନ୍ତୁ।`,
    ml: `വേരുചീയൽ തടയാൻ വിതയ്ക്കുന്നതിന് മുമ്പ് ട്രൈക്കോഡെർമ ഉപയോഗിച്ച് വിത്തുചികിത്സ നടത്തുക.`,
    ur: `پھپھوندی سے جڑوں کے گلنے سے بچاؤ کے لیے بوائی سے پہلے بیج کا علاج لازمی کریں۔`,
    as: `ভেঁকুৰজনিত শিপা পচন ৰোধ কৰিবলৈ বীজ সিঁচাৰ পূৰ্বে ট্ৰাইক’ডাৰ্মাৰে শোধন কৰক।`,
    mr_local: `बियाण्याला आधी ट्रायकोडर्मा किंवा बुरशीनाशकाची चोळणी नक्की करा.`
  };

  // Sowing Rule / Traffic signal in 14 languages
  const sowingRule: Record<string, string> = {
    en: isDelay
      ? `🔴 RED LIGHT: Stop! Do not rush sowing until 75 mm rain is received.`
      : isCaution
        ? `🟡 YELLOW LIGHT: Sow with broad-bed furrows and keep emergency water ready.`
        : isDrain
          ? `🟠 ORANGE LIGHT: Protect fields from waterlogging before planting.`
          : `🟢 GREEN LIGHT: Safe to sow full area immediately.`,
    mr: isDelay
      ? `🔴 लाल दिवा: थांबा! ७५ मिमी पाऊस पडल्याशिवाय घाईघाईत पेरणी करू नका.`
      : isCaution
        ? `🟡 पिवळा दिवा: बीबीएफ पद्धतीने पेरा आणि पाण्याची तयारी ठेवा.`
        : isDrain
          ? `🟠 नारंगी दिवा: शेतात चर काढून पाणी साचण्यापासून वाचवा.`
          : `🟢 हिरवा दिवा: त्वरित संपूर्ण क्षेत्रात पेरणी करण्यास सुरक्षित.`,
    hi: isDelay
      ? `🔴 लाल बत्ती: रुकें! 75 मिमी बारिश होने से पहले जल्दबाजी में बुवाई न करें।`
      : isCaution
        ? `🟡 पीली बत्ती: बीबीएफ विधि से बुवाई करें और पानी का इंतज़ाम रखें।`
        : isDrain
          ? `🟠 नारंगी बत्ती: बुवाई से पहले खेत में पानी भराव से बचाव करें।`
          : `🟢 हरी बत्ती: तुरंत पूरे खेत में बुवाई करने के लिए सुरक्षित।`,
    te: isDelay
      ? `🔴 ఎరుపు లైట్: ఆగండి! 75 మి.మీ వర్షం పడేవరకు తొందరపడి విత్తవద్దు.`
      : isCaution
        ? `🟡 పసుపు లైట్: BBF పద్ధతిలో విత్తండి మరియు నీటిని సిద్ధంగా ఉంచుకోండి.`
        : isDrain
          ? `🟠 నారింజ లైట్: విత్తే ముందు నీరు నిల్వ ఉండకుండా చూసుకోండి.`
          : `🟢 ఆకుపచ్చ లైట్: వెంటనే మొత్తం పొలంలో విత్తడానికి సురక్షితం.`,
    kn: isDelay
      ? `🔴 ಕೆಂಪು ದೀಪ: ನಿಲ್ಲಿ! 75 ಮಿಮೀ ಮಳೆಯಾಗುವವರೆಗೆ ಆತುರದಿಂದ ಬಿತ್ತನೆ ಮಾಡಬೇಡಿ.`
      : isCaution
        ? `🟡 ಹಳದಿ ದೀಪ: ಬಿಬಿಎಫ್ ವಿಧಾನದಲ್ಲಿ ಬಿತ್ತಿ ಮತ್ತು ತುರ್ತು ನೀರನ್ನು ಸಿದ್ಧವಾಗಿಡಿ.`
        : isDrain
          ? `🟠 ಕಿತ್ತಳೆ ದೀಪ: ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ರಕ್ಷಿಸಿ.`
          : `🟢 ಹಸಿರು ದೀಪ: ತಕ್ಷಣವೇ ಪೂರ್ಣ ಪ್ರದೇಶದಲ್ಲಿ ಬಿತ್ತನೆ ಮಾಡಲು ಸುರಕ್ಷಿತ.`,
    gu: isDelay
      ? `🔴 લાલ લાઈટ: થોભો! ૭૫ મીમી વરસાદ ન પડે ત્યાં સુધી ઉતાવળે વાવણી ન કરો.`
      : isCaution
        ? `🟡 પીળી લાઈટ: BBF પદ્ધતિથી વાવણી કરો અને પાણીની વ્યવસ્થા રાખો.`
        : isDrain
          ? `🟠 નારંગી લાઈટ: વાવણી પહેલાં ખેતરમાં પાણી ભરાવા ન દેશો.`
          : `🟢 લીલી લાઈટ: તરત જ સમગ્ર ખેતરમાં વાવણી કરવા માટે સલામત.`,
    ta: isDelay
      ? `🔴 சிவப்பு விளக்கு: நில்லுங்கள்! 75 மி.மீ மழை பெய்யும் வரை அவசரப்பட்டு விதைக்க வேண்டாம்.`
      : isCaution
        ? `🟡 மஞ்சள் விளக்கு: BBF முறையில் விதைத்து அவசர பாசனத்தை தயார் செய்யவும்.`
        : isDrain
          ? `🟠 ஆரஞ்சு விளக்கு: விதைப்பதற்கு முன் நீர் தேங்குவதைத் தடுக்கவும்.`
          : `🟢 பச்சை விளக்கு: உடனடியாக முழுப் பகுதியிலும் விதைக்க பாதுகாப்பானது.`,
    bn: isDelay
      ? `🔴 লাল আলো: থামুন! ৭৫ মিমি বৃষ্টি না হওয়া পর্যন্ত তাড়াহুড়ো করে বপন করবেন না।`
      : isCaution
        ? `🟡 হলুদ আলো: বিবিএফ পদ্ধতিতে বপন করুন এবং জরুরী সেচ প্রস্তুত রাখুন।`
        : isDrain
          ? `🟠 কমলা আলো: বপনের আগে জমিতে জল জমা রোধ করুন।`
          : `🟢 সবুজ আলো: অবিলম্বে পুরো জমিতে বপনের জন্য নিরাপদ।`,
    pa: isDelay
      ? `🔴 ਲਾਲ ਬੱਤੀ: ਰੁਕੋ! 75 ਮਿਮੀ ਮੀਂਹ ਪੈਣ ਤੱਕ ਜਲਦਬਾਜ਼ੀ ਵਿੱਚ ਬਿਜਾਈ ਨਾ ਕਰੋ।`
      : isCaution
        ? `🟡 ਪੀਲੀ ਬੱਤੀ: ਬੀਬੀਐੱਫ ਵਿਧੀ ਨਾਲ ਬਿਜਾਈ ਕਰੋ ਅਤੇ ਪਾਣੀ ਤਿਆਰ ਰੱਖੋ।`
        : isDrain
          ? `🟠 ਸੰਤਰੀ ਬੱਤੀ: ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਪਾਣੀ ਖੜ੍ਹਾ ਹੋਣ ਤੋਂ ਬਚਾਓ।`
          : `🟢 ਹਰੀ ਬੱਤੀ: ਤੁਰੰਤ ਪੂਰੇ ਖੇਤ ਵਿੱਚ ਬਿਜਾਈ ਲਈ ਸੁਰੱਖਿਅਤ।`,
    or: isDelay
      ? `🔴 ଲାଲ୍ ଆଲୋକ: ଅଟକନ୍ତୁ! ୭୫ ମିମି ବର୍ଷା ନହେବା ପର୍ଯ୍ୟନ୍ତ ବୁଣିବା ପାଇଁ ତରବର ହୁଅନ୍ତୁ ନାହିଁ।`
      : isCaution
        ? `🟡 ହଳଦିଆ ଆଲୋକ: ବିବିଏଫ୍ ପଦ୍ଧତିରେ ବୁଣନ୍ତୁ ଏବଂ ଜଳସେଚନ ପ୍ରସ୍ତୁତ ରଖନ୍ତୁ।`
        : isDrain
          ? `🟠 କମଳା ଆଲୋକ: ବୁଣିବା ପୂର୍ବରୁ କ୍ଷେତରେ ପାଣି ଜମିବାକୁ ରୋକନ୍ତୁ।`
          : `🟢 ସବୁଜ ଆଲୋକ: ତୁରନ୍ତ ସମସ୍ତ ଜମିରେ ବୁଣିବା ପାଇଁ ସୁରକ୍ଷିତ।`,
    ml: isDelay
      ? `🔴 ചുവപ്പ് ലൈറ്റ്: നിൽക്കൂ! 75 മിമി മഴ ലഭിക്കുന്നത് വരെ വിതയ്ക്കാൻ തിടുക്കം കൂട്ടരുത്.`
      : isCaution
        ? `🟡 മഞ്ഞ ലൈറ്റ്: ബിബിഎഫ് രീതിയിൽ വിതയ്ക്കുകയും നനയ്ക്കൽ തയ്യാറാക്കുകയും ചെയ്യുക.`
        : isDrain
          ? `🟠 ഓറഞ്ച് ലൈറ്റ്: വിതയ്ക്കുന്നതിന് മുൻപ് വെള്ളക്കെട്ട് ഒഴിവാക്കുക.`
          : `🟢 പച്ച ലൈറ്റ്: ഉടൻ തന്നെ മുഴുവൻ സ്ഥലത്തും വിതയ്ക്കാൻ സുരക്ഷിതം.`,
    ur: isDelay
      ? `🔴 سرخ بتی: رکیں! 75 ملی میٹر بارش ہونے تک جلد بازی میں بوائی نہ کریں۔`
      : isCaution
        ? `🟡 پیلی بتی: بی بی ایف طریقے سے بوائی کریں اور پانی تیار رکھیں۔`
        : isDrain
          ? `🟠 نارنجی بتی: بوائی سے پہلے کھیت میں پانی جمع ہونے سے بچائیں۔`
          : `🟢 سبز بتی: فوراً پورے رقبے پر بوائی کے لیے محفوظ۔`,
    as: isDelay
      ? `🔴 ৰঙা বাতি: ৰওক! ৭৫ মিমি বৰষুণ নোহোৱালৈকে খৰখেদাকৈ বীজ নিসিঁচিব।`
      : isCaution
        ? `🟡 হালধীয়া বাতি: বিবিএফ পদ্ধতিত বীজ সিঁচক আৰু পানীৰ ব্যৱস্থা ৰাখক।`
        : isDrain
          ? `🟠 সুমথিৰা বাতি: বীজ সিঁচাৰ পূৰ্বে পথাৰত পানী জমা হোৱাৰ পৰা ৰক্ষা কৰক।`
          : `🟢 সেউজীয়া বাতি: তৎক্ষণাৎ সমগ্ৰ পথাৰত বীজ সিঁচিবলৈ নিৰাপদ।`,
    mr_local: isDelay
      ? `🔴 लाल दिवा: थांबा! ७५ मिमी पाऊस पडल्याशिवाय घाई करू नका.`
      : isCaution
        ? `🟡 पिवळा दिवा: बीबीएफ पद्धतीने पेरा अन् पाण्याची सोय ठेवा.`
        : isDrain
          ? `🟠 नारंगी दिवा: चर मोकळे करा, पाणी साचू देऊ नका.`
          : `🟢 हिरवा दिवा: लगेच संपूर्ण शेतात पेरा, वाफसा तयार आहे.`
  };

  return { headline, todayAdvice, waterAdvice, seedAdvice, sowingRule };
}

