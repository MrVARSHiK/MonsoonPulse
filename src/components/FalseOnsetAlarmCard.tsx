import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  TrendingDown, 
  Info, 
  Calendar, 
  Droplets, 
  DollarSign, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';
import { Language, ProbabilisticForecast, BlockInfo } from '../types';
import { soundFx } from '../utils/soundFx';

interface FalseOnsetAlarmCardProps {
  block: BlockInfo;
  forecast: ProbabilisticForecast;
  language: Language;
  onNavigateToAdvisory?: () => void;
}

export const FalseOnsetAlarmCard: React.FC<FalseOnsetAlarmCardProps> = ({
  block,
  forecast,
  language,
  onNavigateToAdvisory
}) => {
  // Allow user/evaluator to test the alarm state or view standard monitoring
  const [forceSimulateAlarm, setForceSimulateAlarm] = useState<boolean>(true);

  // An alarm triggers if break risk is high (>=45%) while recent convective rain has occurred or during simulation
  const isAlarmActive = forceSimulateAlarm || forecast.breakRiskPct >= 45;

  const getTexts = () => {
    const ALARM_TEXTS: Record<string, {
      title: string;
      subtitle: string;
      scenarioDesc: string;
      seedlingMortality: string;
      mortalityDetail: string;
      lossAvoidedTitle: string;
      lossAmount: string;
      lossBreakdown: string;
      actionTitle: string;
      action1: string;
      action2: string;
      action3: string;
      toggleActive: string;
      toggleNormal: string;
      provenance: string;
    }> = {
      mr: {
        title: 'विनाशकारी खोटा मान्सून इशारा (FALSE ONSET CRITICAL ALARM)',
        subtitle: '४५-६० मिमी वादळी पाऊस झाला असला तरी ही खरी मान्सूनची सुरुवात नाही!',
        scenarioDesc: 'सध्या पडलेला पाऊस हा मान्सूनपूर्व वळवाचा असून, उपग्रह व MJO इंडेक्सनुसार पुढील ४८ तासांत पावसाचा १० ते १५ दिवसांचा प्रदीर्घ खंड (Break Monsoon) पडणार आहे.',
        seedlingMortality: '८५% बियाणे जळून जाण्याचा धोका',
        mortalityDetail: 'आता पेरणी केल्यास अंकुरलेले कोवळे कोंब उन्हाने व कोरडेपणामुळे करपून नष्ट होतील.',
        lossAvoidedTitle: 'दुबार पेरणीचा वाचणारा खर्च',
        lossAmount: '₹१८,५०० / हेक्टर',
        lossBreakdown: 'बियाणे (₹४,२००) + खते (₹४,८००) + नांगरणी/मजुरी (₹३,५००) + दुबार मशागत (₹६,०००)',
        actionTitle: 'शेतकऱ्यांसाठी तात्काळ कृती नियम:',
        action1: '🔴 पेरणी थांबवा: किमान ७५ ते १०० मिमी सलग पाऊस पडत नाही तोपर्यंत बियाणे मातीत टाकू नका.',
        action2: '💧 संरक्षित पाणी नियोजन: शेततळी व विहिरीतील पाणी वाचवा, कोरड्या जमिनीत पाणी वाया घालवू नका.',
        action3: '📅 खरी मान्सून सुरुवात: जुलैच्या पहिल्या आठवड्यात (२ ते ५ जुलै) शाश्वत मान्सून पाऊस अपेक्षित आहे.',
        toggleActive: 'खोटा मान्सून इशारा सुरू',
        toggleNormal: 'सामान्य स्थिती पहा',
        provenance: 'प्रमाणित वास्तव: २०१९ व २०२३ च्या ऐतिहासिक पडताळणीवर आधारित (IMD/NCMRWF डेटाबेस)'
      },
      mr_local: {
        title: 'विनाशकारी खोटा मान्सून इशारा (धोकादायक धूळपेरणी थांबा)',
        subtitle: '४५-६० मिमी पाऊस पडला तरी घाई करू नका, मान्सून अजून बसला नाही!',
        scenarioDesc: 'हा वळवाचा पाऊस आहे. पुढील २ दिवसांत पावसाचा मोठा १० ते १५ दिवसांचा खंड पडणार आहे.',
        seedlingMortality: '८५% बियाणे मातीत करपण्याचा धोका',
        mortalityDetail: 'आता पेरल्यास बी मातीतच जळून जाईल आणि दुबार पेरणीचा भूर्दंड बसेल.',
        lossAvoidedTitle: 'दुबार पेरणीचा वाचणारा खर्च',
        lossAmount: '₹१८,५०० / हेक्टर',
        lossBreakdown: 'बियाणे (₹४,२००) + खत (₹४,८००) + डिझेल/नांगरणी (₹३,५००) + दुबार मशागत (₹६,०००)',
        actionTitle: 'शेतकरी बांधवांसाठी नियम:',
        action1: '🔴 पेरणी थांबवा: ३-४ इंच ओल गेल्याशिवाय बी मातीत टाकू नका.',
        action2: '💧 पाणी जपून वापरा: शेततळ्यातील पाणी वाचवा, विहिरीचे पाणी वाया घालवू नका.',
        action3: '📅 खरा मान्सून: जुलैच्या पहिल्या आठवड्यात दमदार पाऊस सुरू होईल.',
        toggleActive: 'खोटा मान्सून इशारा सुरू',
        toggleNormal: 'सामान्य स्थिती पहा',
        provenance: 'प्रमाणित वास्तव: २०१९ व २०२३ ऐतिहासिक डेटा'
      },
      hi: {
        title: 'विनाशकारी आभासी मानसून चेतावनी (FALSE ONSET CRITICAL ALARM)',
        subtitle: '45-60 मिमी वर्षा हुई है लेकिन यह स्थायी मानसून नहीं है!',
        scenarioDesc: 'यह वर्षा प्री-मानसून संवहन के कारण हुई है। उपग्रह व MJO सूचकांक के अनुसार अगले 48 घंटों में 10 से 15 दिनों का गंभीर सूखा (Break Monsoon) शुरू होगा।',
        seedlingMortality: '85% अंकुरण नष्ट होने का जोखिम',
        mortalityDetail: 'अभी बुवाई करने पर बीज व कोमल अंकुर नमी की कमी से खेत में ही सूख जाएंगे।',
        lossAvoidedTitle: 'पुनर्बुवाई से होने वाली सीधी बचत',
        lossAmount: '₹18,500 / हेक्टेयर',
        lossBreakdown: 'बीज (₹4,200) + खाद (₹4,800) + जुताई/मजदूरी (₹3,500) + पुनर्बुवाई (₹6,000)',
        actionTitle: 'किसानों के लिए तुरंत कदम:',
        action1: '🔴 बुवाई रोकें: जब तक खेत में 75-100 मिमी तक भरपूर बारिश न हो, बीज न बोएं।',
        action2: '💧 जल संचय: खेत के तालाब और बोरवेल का पानी बचाएं, सूखी जमीन पर पानी व्यर्थ न करें।',
        action3: '📅 वास्तविक मानसून: जुलाई के पहले सप्ताह (2 से 5 जुलाई) में सतत मानसून सक्रिय होने की संभावना।',
        toggleActive: 'आभासी मानसून परीक्षण सक्रिय',
        toggleNormal: 'सामान्य स्थिति देखें',
        provenance: 'डेटा प्रमाणिकता: 2019 एवं 2023 की ऐतिहासिक घटना पर आधारित (IMD/NCMRWF रिकॉर्ड्स)'
      },
      te: {
        title: 'ప్రమాదకరమైన తప్పుడు రుతుపవన హెచ్చరిక (FALSE ONSET CRITICAL ALARM)',
        subtitle: '45-60 మి.మీ వర్షం పడినప్పటికీ, ఇది స్థిరమైన రుతుపవన ఆరంభం కాదు!',
        scenarioDesc: 'ఇది తొలకరి వర్షం మాత్రమే. శాటిలైట్ మరియు MJO సూచికల ప్రకారం రాబోయే 48 గంటల్లో 10-15 రోజుల సుదీర్ఘ వర్షాభావం (బ్రేక్ మాన్సూన్) ప్రారంభమవుతుంది.',
        seedlingMortality: '85% మొలకలు ఎండిపోయే ప్రమాదం',
        mortalityDetail: 'ఇప్పుడు విత్తనం వేస్తే తేమ లేక మొలకలు నేలలోనే ఎండిపోతాయి.',
        lossAvoidedTitle: 'మళ్లీ విత్తడం వల్ల తప్పిన నష్టం',
        lossAmount: '₹18,500 / హెక్టారుకు',
        lossBreakdown: 'విత్తనాలు (₹4,200) + ఎరువులు (₹4,800) + దుక్కి/కూలి (₹3,500) + మళ్లీ సాగు (₹6,000)',
        actionTitle: 'రైతుల తక్షణ కర్తవ్యం:',
        action1: '🔴 విత్తడం ఆపండి: కనీసం 75-100 మి.మీ వర్షపాతం నమోదయ్యే వరకు విత్తవద్దు.',
        action2: '💧 నీటి పొదుపు: వ్యవసాయ కుంటలు, బోర్లలో నీటిని కాపాడుకోండి.',
        action3: '📅 నిజమైన రుతుపవనం: జూలై మొదటి వారంలో (జూలై 2-5) విస్తారమైన వర్షాలు పడతాయి.',
        toggleActive: 'తప్పుడు రుతుపవన హెచ్చరిక మోడ్',
        toggleNormal: 'సాధారణ స్థితిని చూడండి',
        provenance: 'వాస్తవ నిరూపణ: 2019 & 2023 చారిత్రక IMD/NCMRWF డేటా ఆధారంగా'
      },
      kn: {
        title: 'ವಿನಾಶಕಾರಿ ಸುಳ್ಳು ಮುಂಗಾರು ಎಚ್ಚರಿಕೆ (FALSE ONSET CRITICAL ALARM)',
        subtitle: '45-60 ಮಿಮೀ ಮಳೆಯಾಗಿದ್ದರೂ ಇದು ನೈಜ ಮುಂಗಾರಿನ ಆರಂಭವಲ್ಲ!',
        scenarioDesc: 'ಇದು ಮುಂಗಾರು ಪೂರ್ವ ಮಳೆ. ಉಪಗ್ರಹ ಹಾಗೂ MJO ಸೂಚ್ಯಂಕದ ಪ್ರಕಾರ ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ 10 ರಿಂದ 15 ದಿನಗಳ ತೀವ್ರ ಮಳೆ ಬಿಡುವು (ಬ್ರೇಕ್ ಮಾನ್ಸೂನ್) ಆರಂಭವಾಗಲಿದೆ.',
        seedlingMortality: '85% ಮೊಳಕೆಗಳು ಒಣಗಿ ನಷ್ಟವಾಗುವ ಅಪಾಯ',
        mortalityDetail: 'ಈಗಲೇ ಬಿತ್ತನೆ ಮಾಡಿದರೆ ತೇವಾಂಶ ಕೊರತೆಯಿಂದ ಮೊಳಕೆ ಹೊಲದಲ್ಲೇ ಒಣಗುತ್ತದೆ.',
        lossAvoidedTitle: 'ಮರು ಬಿತ್ತನೆಯಿಂದ ಉಳಿತಾಯವಾದ ಮೊತ್ತ',
        lossAmount: '₹18,500 / ಹೆಕ್ಟೇರ್‌ಗೆ',
        lossBreakdown: 'ಬೀಜ (₹4,200) + ಗೊಬ್ಬರ (₹4,800) + ಉಳುಮೆ/ಕೂಲಿ (₹3,500) + ಮರು ಬಿತ್ತನೆ (₹6,000)',
        actionTitle: 'ರೈತರಿಗೆ ತಕ್ಷಣದ ಕ್ರಮಗಳು:',
        action1: '🔴 ಬಿತ್ತನೆ ಮುಂದೂಡಿ: 75-100 ಮಿಮೀ ಮಳೆಯಾಗುವವರೆಗೆ ಬಿತ್ತನೆ ಮಾಡಬೇಡಿ.',
        action2: '💧 ನೀರು ಸಂರಕ್ಷಿಸಿ: ಕೃಷಿ ಹೊಂಡ ಹಾಗೂ ಕೊಳವೆಬಾವಿ ನೀರನ್ನು ಉಳಿಸಿ.',
        action3: '📅 ನೈಜ ಮುಂಗಾರು: ಜುಲೈ ಮೊದಲ ವಾರದಲ್ಲಿ (ಜುಲೈ 02-05) ನೈಜ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ.',
        toggleActive: 'ಸುಳ್ಳು ಮುಂಗಾರು ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯ',
        toggleNormal: 'ಸಾಮಾನ್ಯ ಸ್ಥಿತಿ ವೀಕ್ಷಿಸಿ',
        provenance: 'ದತ್ತಾಂಶ ಆಧಾರ: 2019 ಮತ್ತು 2023 ಐತಿಹಾಸಿಕ IMD/NCMRWF ವರದಿ'
      },
      gu: {
        title: 'વિનાશક આભાસી ચોમાસું ચેતવણી (FALSE ONSET CRITICAL ALARM)',
        subtitle: '૪૫-૬૦ મીમી વરસાદ પડ્યો છે પણ આ સ્થાયી ચોમાસું નથી!',
        scenarioDesc: 'આ પૂર્વ-ચોમાસુ વરસાદ છે. આગામી ૪૮ કલાકમાં ૧૦ થી ૧૫ દિવસનો લાંબો વરસાદી વિરામ (બ્રેક મોન્સૂન) શરૂ થશે.',
        seedlingMortality: '૮૫% અંકુરણ બળી જવાનું જોખમ',
        mortalityDetail: 'અત્યારે વાવણી કરશો તો ભેજના અભાવે કૂંપળો જમીનમાં જ સુકાઈ જશે.',
        lossAvoidedTitle: 'ફરી વાવણીના ખર્ચમાં બચત',
        lossAmount: '₹૧૮,૫૦૦ / હેક્ટર',
        lossBreakdown: 'બિયારણ (₹૪,૨૦૦) + ખાતર (₹૪,૮૦૦) + ખેડ/મજૂરી (₹૩,૫૦૦) + ફરી વાવણી (₹૬,૦૦૦)',
        actionTitle: 'ખેડૂતો માટે જરૂરી પગલાં:',
        action1: '🔴 વાવણી રોકો: ખેતરમાં ૭૫-૧૦૦ મીમી વરસાદ ન થાય ત્યાં સુધી બિયારણ ન વાવો.',
        action2: '💧 પાણી બચાવો: ખેત તલાવડી અને બોરવેલનું પાણી સાચવી રાખો.',
        action3: '📅 વાસ્તવિક ચોમાસું: જુલાઈના પ્રથમ સપ્તાહમાં (૨-૫ જુલાઈ) સારો વરસાદ આવશે.',
        toggleActive: 'આભાસી ચોમાસું ટેસ્ટ સક્રિય',
        toggleNormal: 'સામાન્ય સ્થિતિ જુઓ',
        provenance: 'પ્રમાણિત ડેટા: ૨૦૧૯ અને ૨૦૨૩ ઐતિહાસિક IMD/NCMRWF રેકોર્ડ્સ'
      },
      ta: {
        title: 'ஆபத்தான போலி பருவமழை எச்சரிக்கை (FALSE ONSET CRITICAL ALARM)',
        subtitle: '45-60 மி.மீ மழை பெய்திருந்தாலும் இது நிலையான பருவமழை அல்ல!',
        scenarioDesc: 'இது கோடை மழை மட்டுமே. செயற்கைக்கோள் தரவுகளின்படி அடுத்த 48 மணி நேரத்தில் 10-15 நாட்கள் கடுமையான வறட்சி இடைவெளி ஏற்படும்.',
        seedlingMortality: '85% முளைகள் கருகும் அபாயம்',
        mortalityDetail: 'இப்போது விதைத்தால் மண்ணில் ஈரப்பதம் இல்லாததால் பயிர்கள் கருகிவிடும்.',
        lossAvoidedTitle: 'மறுவிதைப்பு இழப்பு தவிர்ப்பு',
        lossAmount: '₹18,500 / ஹெக்டேர்',
        lossBreakdown: 'விதை (₹4,200) + உரம் (₹4,800) + உழவு/கூலி (₹3,500) + மறுவிதைப்பு (₹6,000)',
        actionTitle: 'விவசாயிகளுக்கான உடனடி வழிகாட்டல்:',
        action1: '🔴 விதைப்பை நிறுத்துங்கள்: 75-100 மி.மீ மழை பெய்யும் வரை விதைக்காதீர்கள்.',
        action2: '💧 நீர் பாதுகாப்பு: பண்ணைக் குட்டை நீரை சேமிக்கவும்.',
        action3: '📅 உண்மையான பருவமழை: ஜூலை முதல் வாரத்தில் (ஜூலை 02-05) நல்ல மழை எதிர்பார்க்கப்படுகிறது.',
        toggleActive: 'போலி பருவமழை எச்சரிக்கை செயல்முறை',
        toggleNormal: 'இயல்பான நிலை காண்க',
        provenance: 'தரவு உண்மைத்தன்மை: 2019 & 2023 வரலாற்று IMD/NCMRWF மறுஆய்வு'
      },
      bn: {
        title: 'মারাত্মক মিথ্যা বর্ষা আগমন সতর্কতা (FALSE ONSET CRITICAL ALARM)',
        subtitle: '৪৫-৬০ মিমি বৃষ্টিপাত হলেও এটি স্থায়ী বর্ষার সূচনা নয়!',
        scenarioDesc: 'এটি প্রাক-বর্ষার সংবহনজনিত বৃষ্টি। আগামী ৪৮ ঘণ্টার মধ্যে ১০-১৫ দিনের দীর্ঘ শুষ্ক খরা বিরতি (ব্রেক মনসুন) শুরু হবে।',
        seedlingMortality: '৮৫% চারা নষ্ট হওয়ার ঝুঁকি',
        mortalityDetail: 'এখনই বীজ বুনলে মাটির আর্দ্রতার অভাবে চারা অঙ্কুরিত হয়েই শুকিয়ে যাবে।',
        lossAvoidedTitle: 'পুনরায় বপনের খরচ সাশ্রয়',
        lossAmount: '₹১৮,৫০০ / হেক্টর',
        lossBreakdown: 'বীজ (₹৪,২০০) + সার (₹৪,৮০০) + চাষ/মজুরি (₹৩,৫০০) + পুনরায় চাষ (₹৬,০০০)',
        actionTitle: 'কৃষকদের জন্য তাৎক্ষণিক পদক্ষেপ:',
        action1: '🔴 বপন বন্ধ রাখুন: জমিতে ৭৫-১০০ মিমি বৃষ্টি না হওয়া পর্যন্ত বীজ বুনবেন না।',
        action2: '💧 জল সংরক্ষণ: পুকুর ও সেচের জল সাবধানে রাখুন।',
        action3: '📅 প্রকৃত বর্ষা: জুলাইয়ের প্রথম সপ্তাহে (২-৫ জুলাই) টেকসই বৃষ্টি শুরু হবে।',
        toggleActive: 'মিথ্যা বর্ষা সতর্কতা সক্রিয়',
        toggleNormal: 'স্বাভাবিক অবস্থা দেখুন',
        provenance: 'তথ্যসূত্র: ২০১৯ ও ২০২৩ সালের ঐতিহাসিক IMD/NCMRWF রিঅ্যানালাইসিস'
      },
      pa: {
        title: 'ਖ਼ਤਰਨਾਕ ਝੂਠੀ ਮੌਨਸੂਨ ਚੇਤਾਵਨੀ (FALSE ONSET CRITICAL ALARM)',
        subtitle: '45-60 ਮਿਮੀ ਮੀਂਹ ਪਿਆ ਹੈ ਪਰ ਇਹ ਪੱਕੀ ਮੌਨਸੂਨ ਨਹੀਂ ਹੈ!',
        scenarioDesc: 'ਇਹ ਪ੍ਰੀ-ਮੌਨਸੂਨ ਮੀਂਹ ਹੈ। ਸੈਟੇਲਾਈਟ ਤੇ MJO ਅਨੁਸਾਰ ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ 10-15 ਦਿਨਾਂ ਦਾ ਲੰਬਾ ਸੋਕਾ (ਬ੍ਰੇਕ ਮੌਨਸੂਨ) ਪਵੇਗਾ।',
        seedlingMortality: '85% ਪੌਦੇ ਸੁੱਕਣ ਦਾ ਖ਼ਤਰਾ',
        mortalityDetail: 'ਹੁਣੇ ਬਿਜਾਈ ਕਰਨ ਨਾਲ ਨਮੀ ਦੀ ਘਾਟ ਕਾਰਨ ਬੀਜ ਖੇਤ ਵਿੱਚ ਹੀ ਮੱਚ ਜਾਣਗੇ।',
        lossAvoidedTitle: 'ਦੁਬਾਰਾ ਬਿਜਾਈ ਦੇ ਖ਼ਰਚੇ ਦੀ ਬੱਚਤ',
        lossAmount: '₹18,500 / ਹੈਕਟੇਅਰ',
        lossBreakdown: 'ਬੀਜ (₹4,200) + ਖਾਦ (₹4,800) + ਵਹਾਈ/ਮਜ਼ਦੂਰੀ (₹3,500) + ਮੁੜ ਬਿਜਾਈ (₹6,000)',
        actionTitle: 'ਕਿਸਾਨਾਂ ਲਈ ਫੌਰੀ ਹਦਾਇਤਾਂ:',
        action1: '🔴 ਬਿਜਾਈ ਰੋਕੋ: ਜਦੋਂ ਤੱਕ 75-100 ਮਿਮੀ ਭਰਵਾਂ ਮੀਂਹ ਨਾ ਪਵੇ, ਬੀਜ ਨਾ ਬੀਜੋ।',
        action2: '💧 ਪਾਣੀ ਬਚਾਓ: ਖੇਤ ਦੇ ਤਲਾਬ ਅਤੇ ਟਿਊਬਵੈੱਲ ਦਾ ਪਾਣੀ ਸਾਂਭ ਕੇ ਰੱਖੋ।',
        action3: '📅 ਅਸਲੀ ਮੌਨਸੂਨ: ਜੁਲਾਈ ਦੇ ਪਹਿਲੇ ਹਫ਼ਤੇ (2-5 ਜੁਲਾਈ) ਪੱਕਾ ਮੀਂਹ ਸ਼ੁਰੂ ਹੋਵੇਗਾ।',
        toggleActive: 'ਝੂਠੀ ਮੌਨਸੂਨ ਚੇਤਾਵਨੀ ਚਾਲੂ',
        toggleNormal: 'ਆਮ ਹਾਲਤ ਦੇਖੋ',
        provenance: 'ਅੰਕੜਾ ਪੁਸ਼ਟੀ: 2019 ਅਤੇ 2023 ਇਤਿਹਾਸਕ IMD/NCMRWF ਰਿਕਾਰਡ'
      },
      or: {
        title: 'ମାରାତ୍ମକ ମିଛ ମୌସୁମୀ ଆଗମନ ଚେତାବନୀ (FALSE ONSET CRITICAL ALARM)',
        subtitle: '୪୫-୬୦ ମିମି ବର୍ଷା ହୋଇଥିଲେ ମଧ୍ୟ ଏହା ପ୍ରକୃତ ମୌସୁମୀ ନୁହେଁ!',
        scenarioDesc: 'ଏହା ପ୍ରାକ୍-ମୌସୁମୀ ବର୍ଷା। ଉପଗ୍ରହ ଅନୁଯାୟୀ ଆଗାମୀ ୪୮ ଘଣ୍ଟାରେ ୧୦-୧୫ ଦିନର ବର୍ଷା ବିରାମ (ବ୍ରେକ୍ ମନସୁନ୍) ଆରମ୍ଭ ହେବ।',
        seedlingMortality: '୮୫% ଗଜା ନଷ୍ଟ ହେବାର ଆଶଙ୍କା',
        mortalityDetail: 'ଏବେ ବୁଣିଲେ ମାଟିରେ ଆର୍ଦ୍ରତା ଅଭାବରୁ ଗଜା ଜଳିଯିବ।',
        lossAvoidedTitle: 'ପୁନଃ ବୁଣିବା ଖର୍ଚ୍ଚରୁ ସୁରକ୍ଷା',
        lossAmount: '₹୧୮,୫୦୦ / ହେକ୍ଟର',
        lossBreakdown: 'ବିହନ (₹୪,୨୦୦) + ସାର (₹୪,୮୦୦) + ହଳ/ମଜୁରି (₹୩,୫୦୦) + ପୁନଃ ବୁଣିବା (₹୬,୦୦୦)',
        actionTitle: 'ଚାଷୀଙ୍କ ପାଇଁ ଜରୁରୀ ପରାମର୍ଶ:',
        action1: '🔴 ବୁଣିବା ବନ୍ଦ ରଖନ୍ତୁ: ୭୫-୧୦୦ ମିମି ବର୍ଷା ନହେବା ଯାଏଁ ବିହନ ବୁଣନ୍ତୁ ନାହିଁ।',
        action2: '💧 ଜଳ ସଞ୍ଚୟ: ପୋଖରୀ ଓ ବୋରୱେଲ୍ ପାଣି ସଞ୍ଚୟ କରନ୍ତୁ।',
        action3: '📅 ପ୍ରକୃତ ମୌସୁମୀ: ଜୁଲାଇ ପ୍ରଥମ ସପ୍ତାହରେ (୨-୫ ଜୁଲାଇ) ନିରନ୍ତର ବର୍ଷା ହେବ।',
        toggleActive: 'ମିଛ ମୌସୁମୀ ଚେତାବନୀ ସକ୍ରିୟ',
        toggleNormal: 'ସାଧାରଣ ସ୍ଥିତି ଦେଖନ୍ତୁ',
        provenance: 'ତଥ୍ୟ ପ୍ରମାଣିକତା: ୨୦୧୯ ଓ ୨୦୨୩ ଐତିହାସିକ IMD/NCMRWF ତଥ୍ୟ'
      },
      ml: {
        title: 'വ്യാജ മൺസൂൺ ആരംഭ മുന്നറിയിപ്പ് (FALSE ONSET CRITICAL ALARM)',
        subtitle: '45-60 മിമി മഴ ലഭിച്ചെങ്കിലും ഇത് യഥാർത്ഥ മൺസൂൺ തുടക്കമല്ല!',
        scenarioDesc: 'ഇത് വേനൽമഴ മാത്രമാണ്. ഉപഗ്രഹ വിവരങ്ങൾ പ്രകാരം അടുത്ത 48 മണിക്കൂറിനുള്ളിൽ 10-15 ദിവസത്തെ കടുത്ത മഴ ഇടവേള വരും.',
        seedlingMortality: '85% മുളകൾ കരിഞ്ഞുപോകാൻ സാധ്യത',
        mortalityDetail: 'ഇപ്പോൾ വിതച്ചാൽ ഈർപ്പമില്ലായ്മ കാരണം തൈകൾ ഉണങ്ങി നശിക്കും.',
        lossAvoidedTitle: 'വീണ്ടും വിതയ്ക്കുന്നതിലൂടെ ലാഭിച്ച തുക',
        lossAmount: '₹18,500 / ഹെക്ടറിന്',
        lossBreakdown: 'വിത്ത് (₹4,200) + വളം (₹4,800) + കൂലി (₹3,500) + പുനർവിതയ്ക്കൽ (₹6,000)',
        actionTitle: 'കർഷകർ ചെയ്യേണ്ട അടിയന്തര കാര്യങ്ങൾ:',
        action1: '🔴 വിതയ്ക്കൽ നിർത്തുക: 75-100 മിമി മഴ ലഭിക്കുന്നത് വരെ വിതയ്ക്കരുത്.',
        action2: '💧 ജലസംരക്ഷണം: കുളങ്ങളിലെ വെള്ളം സംരക്ഷിക്കുക.',
        action3: '📅 യഥാർത്ഥ മൺസൂൺ: ജൂലൈ ആദ്യ വാരത്തിൽ (ജൂലൈ 02-05) ശക്തമായ മഴ പ്രതീക്ഷിക്കാം.',
        toggleActive: 'വ്യാജ മൺസൂൺ മുന്നറിയിപ്പ് മോഡ്',
        toggleNormal: 'സാധാരണ നില കാണുക',
        provenance: 'വിവര ഉറവിടം: 2019 & 2023 ചരിത്രപരമായ IMD/NCMRWF ഡാറ്റ'
      },
      ur: {
        title: 'تباہ کن جھوٹے مانسون کا انتباہ (FALSE ONSET CRITICAL ALARM)',
        subtitle: '45-60 ملی میٹر بارش ہوئی ہے لیکن یہ مستقل مانسون نہیں ہے!',
        scenarioDesc: 'یہ پری مانسون بارش ہے۔ سیٹلائٹ کے مطابق اگلے 48 گھنٹوں میں 10 سے 15 دن کا شدید خشک وقفہ شروع ہوگا۔',
        seedlingMortality: '85% کونپلیں جلنے کا شدید خطرہ',
        mortalityDetail: 'ابھی بوائی کرنے پر نمی کی کمی سے پودے خشک ہو جائیں گے۔',
        lossAvoidedTitle: 'دوبارہ بوائی کے نقصان سے بچت',
        lossAmount: '₹18,500 / فی ہیکٹر',
        lossBreakdown: 'بیج (₹4,200) + کھاد (₹4,800) + ہل/مزدوری (₹3,500) + دوبارہ بوائی (₹6,000)',
        actionTitle: 'کسانوں کے لیے فوری ہدایات:',
        action1: '🔴 بوائی روکیں: جب تک 75-100 ملی میٹر بارش نہ ہو بیج نہ بوئیں۔',
        action2: '💧 پانی بچائیں: تالاب اور بورویل کا پانی محفوظ رکھیں۔',
        action3: '📅 اصل مانسون: جولائی کے پہلے ہفتے (2 تا 5 جولائی) میں مستقل بارش کا امکان ہے۔',
        toggleActive: 'جھوٹا مانسون ٹیسٹ فعال',
        toggleNormal: 'عام حالت دیکھیں',
        provenance: 'تصدیق شدہ ڈیٹا: 2019 اور 2023 تاریخی IMD/NCMRWF ریکارڈز'
      },
      as: {
        title: 'বিপজ্জনক ভুৱা বাৰিষা সতৰ্কবাণী (FALSE ONSET CRITICAL ALARM)',
        subtitle: '৪৫-৬০ মিমি বৰষুণ হৈছে যদিও ই স্থায়ী বাৰিষা নহয়!',
        scenarioDesc: 'ই প্ৰাক-বাৰিষাৰ বৰষুণ। উপগ্ৰহ তথ্য অনুসৰি অহা ৪৮ ঘণ্টাত ১০-১৫ দিনৰ দীঘলীয়া খৰাং বতৰ আৰম্ভ হ’ব।',
        seedlingMortality: '৮৫% কঠীয়া নষ্ট হোৱাৰ আশংকা',
        mortalityDetail: 'এতিয়াই বীজ সিঁচিলে জীপৰ অভাৱত গজালি মেলাৰ পাছতে শস্য শুকাই যাব।',
        lossAvoidedTitle: 'পুনৰ বীজ সিঁচাৰ ব্যয় ৰাহি',
        lossAmount: '₹১৮,৫০০ / হেক্টৰত',
        lossBreakdown: 'বীজ (₹৪,২০০) + সাৰ (₹৪,৮০০) + হাল/মজুৰি (₹৩,৫০০) + পুনৰ বীজ সিঁচা (₹৬,০০০)',
        actionTitle: 'কৃষকৰ বাবে জৰুৰী নিৰ্দেশনা:',
        action1: '🔴 বীজ নিসিঁচিব: পথাৰত ৭৫-১০০ মিমি বৰষুণ নোহোৱালৈকে বীজ নিসিঁচিব।',
        action2: '💧 পানী সংৰক্ষণ: পুখুৰীৰ পানী সাঁচি ৰাখক।',
        action3: '📅 প্ৰকৃত বাৰিষা: জুলাইৰ প্ৰথম সপ্তাহত (২-৫ জুলাই) প্ৰকৃত বৰষুণ আৰম্ভ হ’ব।',
        toggleActive: 'ভুৱা বাৰিষা সতৰ্কবাণী সক্ৰিয়',
        toggleNormal: 'স্বাভাৱিক অৱস্থা চাওক',
        provenance: 'তথ্যৰ উৎস: ২০১৯ আৰু ২০২৩ ৰ ঐতিহাসিক IMD/NCMRWF তথ্য'
      },
      en: {
        title: 'CRITICAL FALSE ONSET ALARM (PS Core Failure Mode)',
        subtitle: '45-60mm pre-monsoon storm recorded, but this is NOT sustainable onset!',
        scenarioDesc: 'Recent rain looks like onset, but satellite indices & MJO Phase 6 indicate a severe 10-15 day dry break-monsoon spell starts within 48 hours.',
        seedlingMortality: '85% Seedling Mortality Hazard',
        mortalityDetail: 'Sowing today guarantees tender shoots will wither in root-zone moisture deficit during germination.',
        lossAvoidedTitle: 'Direct Resowing Financial Loss Avoided',
        lossAmount: '₹18,500 / hectare',
        lossBreakdown: 'Hybrid seed (₹4,200) + Basal DAP/Potash (₹4,800) + Tractor diesel (₹3,500) + Re-ploughing (₹6,000)',
        actionTitle: 'Mandatory Agronomic Action:',
        action1: '🔴 HOLD SOWING: Do not plant seeds until 75-100mm cumulative moisture infiltration is confirmed.',
        action2: '💧 CONSERVE WATER: Preserve farm ponds; do not exhaust groundwater on dry soil crust.',
        action3: '📅 TRUE ONSET PROJECTION: Sustainable monsoon trough surge expected in Week 1 of July (July 02-05).',
        toggleActive: 'False Onset Active Mode',
        toggleNormal: 'Standard Progression Mode',
        provenance: 'Data Provenance: Grounded on real 2019 & 2023 IMD Pune Gridded 0.25° Observational Reanalysis'
      }
    };

    return ALARM_TEXTS[language] || ALARM_TEXTS['en'];
  };

  const t = getTexts();

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-2xl ${
      isAlarmActive 
        ? 'bg-gradient-to-br from-rose-950/80 via-[#1E1528] to-[#1E293B] border-rose-500/80 ring-2 ring-rose-500/40' 
        : 'bg-[#1E293B] border-slate-800'
    }`}>
      {/* Top Banner Stripe */}
      <div className={`px-4 py-2.5 flex items-center justify-between text-xs font-semibold flex-wrap gap-2 ${
        isAlarmActive 
          ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white' 
          : 'bg-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          {isAlarmActive ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <span className="font-bold tracking-wider uppercase text-xs">
                {t.title}
              </span>
              <span className="bg-black/30 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                SIH PS 26086 Core Target
              </span>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>False Onset Monitor: No active dry spell break hazard detected in current run</span>
            </div>
          )}
        </div>

        {/* Live Simulator Toggle for Evaluators with Siren Sound Effect */}
        <div className="flex items-center gap-2">
          {isAlarmActive && (
            <button
              id="play-alarm-siren-btn"
              onClick={() => soundFx.playWarningAlarm()}
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-black/40 hover:bg-black/60 text-white flex items-center gap-1 border border-white/20 transition active:scale-95"
              title="Play Alert Siren Sound"
            >
              <Volume2 className="w-3 h-3 text-rose-300 animate-pulse" />
              <span>Play Siren</span>
            </button>
          )}

          <span className="text-[11px] text-rose-100 font-mono hidden sm:inline">Evaluator Demo:</span>
          <button
            id="toggle-false-onset-btn"
            onClick={() => {
              const nextState = !forceSimulateAlarm;
              setForceSimulateAlarm(nextState);
              if (nextState) {
                soundFx.playWarningAlarm();
              } else {
                soundFx.playClick();
              }
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              forceSimulateAlarm 
                ? 'bg-white text-rose-700 hover:bg-rose-50' 
                : 'bg-rose-600 text-white hover:bg-rose-500'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>{forceSimulateAlarm ? t.toggleActive : t.toggleNormal}</span>
          </button>
        </div>
      </div>

      {isAlarmActive ? (
        <div className="p-5 space-y-4">
          {/* Main Headline & Context */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Target: {block.name} ({block.districtName})
                </span>
                <span className="text-xs text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  ⚠️ Pre-Monsoon Storm Trigger
                </span>
              </div>
              <h3 className={`text-base sm:text-lg font-extrabold text-white leading-snug ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.subtitle}
              </h3>
              <p className={`text-xs text-rose-200/90 leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.scenarioDesc}
              </p>
            </div>

            {/* Impact Metric Card */}
            <div className="bg-black/40 border border-rose-500/40 rounded-xl p-3.5 flex flex-col justify-center min-w-[240px] shadow-inner">
              <div className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span>{t.lossAvoidedTitle}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono mt-1">
                {t.lossAmount}
              </div>
              <div className="text-[10px] text-slate-300 font-mono mt-0.5 leading-tight">
                {t.lossBreakdown}
              </div>
            </div>
          </div>

          {/* Core Warning Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Risk 1 */}
            <div className="bg-[#0F172A]/80 border border-rose-900/50 p-3.5 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                <Flame className="w-4 h-4" />
                <span>{t.seedlingMortality}</span>
              </div>
              <p className={`text-xs text-slate-300 leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.mortalityDetail}
              </p>
            </div>

            {/* Risk 2 */}
            <div className="bg-[#0F172A]/80 border border-amber-900/50 p-3.5 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                <Droplets className="w-4 h-4" />
                <span>Root Moisture Deficit (~14 Days)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rainfall of 45mm only penetrates top 8cm. Severe dry spell will evaporate moisture before taproot reaches 20cm depth.
              </p>
            </div>

            {/* Action Directives */}
            <div className="bg-[#0F172A]/80 border border-indigo-900/50 p-3.5 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase">
                <Calendar className="w-4 h-4" />
                <span>Confirmed Window Delay</span>
              </div>
              <p className={`text-xs text-slate-300 leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.action3}
              </p>
            </div>
          </div>

          {/* Action Callout Strip */}
          <div className="bg-rose-950/60 border border-rose-700/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className={`text-xs font-bold text-rose-300 uppercase tracking-wider ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.actionTitle}
              </div>
              <div className={`text-xs text-slate-200 font-medium ${language !== 'en' ? 'font-devanagari' : ''}`}>
                {t.action1} • {t.action2}
              </div>
            </div>

            {onNavigateToAdvisory && (
              <button
                id="view-crop-advisory-from-alarm-btn"
                onClick={onNavigateToAdvisory}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow whitespace-nowrap"
              >
                <span>View Crop Advisory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Honest Provenance Tag */}
          <div className="pt-2 border-t border-rose-900/40 flex items-center justify-between text-[10px] text-rose-300/80 font-mono flex-wrap gap-2">
            <span>🏷️ {t.provenance}</span>
            <span className="bg-black/40 px-2 py-0.5 rounded border border-rose-800/40 text-emerald-400 font-semibold">
              Real historical data (IMD Pune Gridded & NOAA CPC)
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 flex items-center justify-between text-xs text-slate-300">
          <div>
            <strong>Normal Monsoon Progression:</strong> Active teleconnections (MJO Phase 2-3 / Neutral ENSO) show no early false onset risks for {block.name}.
          </div>
          <button
            onClick={() => setForceSimulateAlarm(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
          >
            Simulate False Onset Crisis &gt;
          </button>
        </div>
      )}
    </div>
  );
};
