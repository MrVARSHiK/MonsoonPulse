import { AgronomicAdvisory, BlockInfo, CropGrowthStage, CropId, ProbabilisticForecast } from '../types';
import { CROPS } from '../data/climatologyData';
import { generateAllLanguagePayloads } from '../data/localizedAdvisories';

export function generateCropAdvisory(
  cropId: CropId,
  stage: CropGrowthStage,
  block: BlockInfo,
  forecast: ProbabilisticForecast
): AgronomicAdvisory {
  const crop = CROPS[cropId] || CROPS['cotton'];
  const { breakRiskPct, onsetDelayShiftDays, heavyRainRiskPct, soilMoistureDeficitPct, breakDurationExpectedDays } = forecast;

  let verdictCode: 'PROCEED' | 'CAUTION_IRRIGATE' | 'DELAY_SOWING' | 'PROTECT_DRAIN' = 'PROCEED';
  let trafficColor: 'green' | 'yellow' | 'red' | 'amber' = 'green';

  // Rule Logic
  if (heavyRainRiskPct > 55) {
    verdictCode = 'PROTECT_DRAIN';
    trafficColor = 'amber';
  } else if (breakRiskPct >= 50 || (stage === 'sowing_window' && onsetDelayShiftDays > 5 && soilMoistureDeficitPct > 45)) {
    verdictCode = 'DELAY_SOWING';
    trafficColor = 'red';
  } else if (breakRiskPct >= 30 || soilMoistureDeficitPct > 35) {
    verdictCode = 'CAUTION_IRRIGATE';
    trafficColor = 'yellow';
  } else {
    verdictCode = 'PROCEED';
    trafficColor = 'green';
  }

  // Crop-specific threshold nuances
  if (cropId === 'soybean' && stage === 'sowing_window' && breakRiskPct > 38) {
    // Soybean seed is very sensitive to moisture deficit during germination
    verdictCode = 'DELAY_SOWING';
    trafficColor = 'red';
  } else if (cropId === 'bajra' && breakRiskPct < 55) {
    // Bajra is drought tolerant
    if (verdictCode === 'DELAY_SOWING' && breakRiskPct < 60) {
      verdictCode = 'CAUTION_IRRIGATE';
      trafficColor = 'yellow';
    }
  }

  // Multilingual Headlines
  const headlines = {
    PROCEED: {
      en: `Favorable Sowing Window: Proceed with ${crop.name} sowing in ${block.name}. Soil moisture optimal.`,
      mr: `पेरणीसाठी अनुकूल वातावरण: ${block.nameMr} येथे ${crop.nameMr} ची पेरणी करण्यास हरकत नाही. जमिनीत पुरेसा ओलावा आहे.`,
      hi: `बुवाई के लिए अनुकूल मौसम: ${block.nameHi} में ${crop.nameHi} की बुवाई शुरू करें। मिट्टी में पर्याप्त नमी उपलब्ध है।`
    },
    CAUTION_IRRIGATE: {
      en: `Caution Alert: Moderate dry spell risk (${breakRiskPct}%). Prepare supplemental irrigation or Broad Bed Furrow for ${crop.name}.`,
      mr: `सतर्कता इशारा: मध्यम पावसाचा खंड संभव (${breakRiskPct}%). ${crop.nameMr} साठी बीबीएफ (BBF) किंवा संरक्षित पाण्याची सोय ठेवा.`,
      hi: `सतर्कता सलाह: मध्यम सूखा जोखिम (${breakRiskPct}%)। ${crop.nameHi} के लिए बीबीएफ या संरक्षित सिंचाई की व्यवस्था रखें।`
    },
    DELAY_SOWING: {
      en: `Critical Alert: High dry spell risk (${breakRiskPct}% / ~${breakDurationExpectedDays} days). Delay ${crop.name} sowing by 7-10 days to avoid seedling mortality.`,
      mr: `अतिसतर्कता इशारा: पावसाचा मोठा खंड संभव (${breakRiskPct}% / ~${breakDurationExpectedDays} दिवस). कोमेजणे टाळण्यासाठी ${crop.nameMr} ची पेरणी ७-१० दिवस पुढे ढकला.`,
      hi: `गंभीर चेतावनी: लंबे सूखे की उच्च संभावना (${breakRiskPct}% / ~${breakDurationExpectedDays} दिन)। अंकुरण नुकसान से बचने के लिए ${crop.nameHi} की बुवाई 7-10 दिन टालें।`
    },
    PROTECT_DRAIN: {
      en: `Excess Rain Warning: Heavy rainfall risk (${heavyRainRiskPct}%). Create drainage channels to prevent waterlogging in ${crop.name}.`,
      mr: `अतिवृष्टी इशारा: जोरदार पावसाची शक्यता (${heavyRainRiskPct}%). ${crop.nameMr} पिकात पाणी साचू नये म्हणून निचरा चर काढा.`,
      hi: `भारी बारिश की चेतावनी: तेज वर्षा का जोखिम (${heavyRainRiskPct}%)। ${crop.nameHi} में जलभराव रोकने के लिए जल निकासी नालियां बनाएं।`
    }
  };

  // Plain-Language Simple Sentences for Farmers (सरल वाक्य)
  const simpleSentences = {
    todayAdvice: {
      en: verdictCode === 'DELAY_SOWING'
        ? `Do not sow in dry soil today. Rain is delayed by ${Math.max(1, Math.round(onsetDelayShiftDays))} days. Wait for good soaking rain.`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `Sow only if you have farm pond water ready. A brief dry pause of ~${breakDurationExpectedDays} days may follow.`
          : verdictCode === 'PROTECT_DRAIN'
            ? `Dig water drainage channels today so that heavy rain does not drown your seedlings.`
            : `Sow your ${crop.name} seeds today! Soil is moist and weather is very favorable.`,
      mr: verdictCode === 'DELAY_SOWING'
        ? `आज कोरड्या जमिनीत पेरणी करू नका. पाऊस ${Math.max(1, Math.round(onsetDelayShiftDays))} दिवस लांबला आहे. चांगला मोठा पाऊस पडल्यावरच पेरा.`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `शेतात पाणी देण्याची सोय असल्यास पेरणी करा. पुढील काही दिवसांत पावसाचा खंड पडू शकतो.`
          : verdictCode === 'PROTECT_DRAIN'
            ? `शेतातून पाण्याचा निचरा होण्यासाठी चर काढा जेणेकरून बियाणे सडणार नाही.`
            : `आज ${crop.nameMr} ची पेरणी करा! जमिनीत भरपूर ओलावा आहे आणि हवामान उत्तम आहे.`,
      hi: verdictCode === 'DELAY_SOWING'
        ? `आज सूखी मिट्टी में बीज न डालें। मानसून ${Math.max(1, Math.round(onsetDelayShiftDays))} दिन की देरी से है। अच्छी बारिश का इंतज़ार करें।`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `यदि सिंचाई की व्यवस्था है तभी बुवाई करें। आगे ~${breakDurationExpectedDays} दिनों का सूखा हो सकता है।`
          : verdictCode === 'PROTECT_DRAIN'
            ? `खेत में पानी निकासी की नाली बनाएं ताकि भारी बारिश से बीज न सड़े।`
            : `आज ${crop.nameHi} की बुवाई करें! मिट्टी में पर्याप्त नमी है और मौसम बहुत अच्छा है।`
    },
    waterAdvice: {
      en: verdictCode === 'PROTECT_DRAIN'
        ? `Keep field drains open to flush excess runoff.`
        : verdictCode === 'DELAY_SOWING' || breakRiskPct > 40
          ? `Save water in farm ponds; do not waste tubewell water on dry crust.`
          : `Soil has sufficient root moisture; no extra irrigation needed now.`,
      mr: verdictCode === 'PROTECT_DRAIN'
        ? `शेतातील चर मोकळे ठेवा जेणेकरून जास्त पाणी वाहून जाईल.`
        : verdictCode === 'DELAY_SOWING' || breakRiskPct > 40
          ? `शेततळ्यात पाणी साठवा, विहिरीचे पाणी जपून वापरा.`
          : `जमिनीत पुरेसा ओलावा आहे, आत्ता जादा पाण्याची गरज नाही.`,
      hi: verdictCode === 'PROTECT_DRAIN'
        ? `खेत की नालियां खुली रखें ताकि अतिरिक्त पानी निकल जाए।`
        : verdictCode === 'DELAY_SOWING' || breakRiskPct > 40
          ? `खेत के तालाब में पानी संचित रखें, बोरवेल का पानी बचाएं।`
          : `मिट्टी में भरपूर नमी है, अभी अतिरिक्त सिंचाई की आवश्यकता नहीं है।`
    },
    seedAdvice: {
      en: `Treat seeds with bio-fertilizers or Trichoderma before planting to stop fungal root rot.`,
      mr: `पेरणीपूर्वी बियाण्याला ट्रायकोडर्मा किंवा बुरशीनाशक चोळा जेणेकरून रोग पडणार नाही.`,
      hi: `बुवाई से पहले बीजों को ट्राइकोडर्मा या फफूंदनाशक से अवश्य उपचारित करें।`
    },
    sowingRule: {
      en: verdictCode === 'DELAY_SOWING' 
        ? `🔴 RED LIGHT: Stop! Do not rush sowing until 75 mm rain is received.`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `🟡 YELLOW LIGHT: Sow with broad-bed furrows and keep emergency water ready.`
          : verdictCode === 'PROTECT_DRAIN'
            ? `🟠 ORANGE LIGHT: Protect fields from waterlogging before planting.`
            : `🟢 GREEN LIGHT: Safe to sow full area immediately.`,
      mr: verdictCode === 'DELAY_SOWING'
        ? `🔴 लाल दिवा: थांबा! ७५ मिमी पाऊस पडल्याशिवाय घाईघाईत पेरणी करू नका.`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `🟡 पिवळा दिवा: बीबीएफ पद्धतीने पेरा आणि पाण्याची तयारी ठेवा.`
          : verdictCode === 'PROTECT_DRAIN'
            ? `🟠 नारंगी दिवा: शेतात चर काढून पाणी साचण्यापासून वाचवा.`
            : `🟢 हिरवा दिवा: त्वरित संपूर्ण क्षेत्रात पेरणी करण्यास सुरक्षित.`,
      hi: verdictCode === 'DELAY_SOWING'
        ? `🔴 लाल बत्ती: रुकें! 75 मिमी बारिश होने से पहले जल्दबाजी में बुवाई न करें।`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `🟡 पीली बत्ती: बीबीएफ विधि से बुवाई करें और पानी का इंतज़ाम रखें।`
          : verdictCode === 'PROTECT_DRAIN'
            ? `🟠 नारंगी बत्ती: बुवाई से पहले खेत में पानी भराव से बचाव करें।`
            : `🟢 हरी बत्ती: तुरंत पूरे खेत में बुवाई करने के लिए सुरक्षित।`
    }
  };

  // 5-Step Explainability Chain (English, Marathi & Hindi)
  const reasoningChain = [
    {
      step: 1,
      title: 'Climatological Prior',
      titleMr: 'ऐतिहासिक हवामान संदर्भ (Climatological Prior)',
      titleHi: 'ऐतिहासिक जलवायु संदर्भ (Climatological Prior)',
      detail: `Historical onset for ${block.name} is ${block.climatology.normalOnsetDate} with baseline break frequency of ${block.climatology.historicalBreakProbabilityPct}%.`,
      detailMr: `${block.nameMr} तालुक्यात सरासरी मान्सून आगमन तारीख ${block.climatology.normalOnsetDate} असून ऐतिहासिक पावसाचा खंड पडण्याची वारंवारता ${block.climatology.historicalBreakProbabilityPct}% आहे.`,
      detailHi: `${block.nameHi} ब्लॉक में सामान्य आगमन तिथि ${block.climatology.normalOnsetDate} है और ऐतिहासिक सूखा / ब्रेक अंतराल दर ${block.climatology.historicalBreakProbabilityPct}% है।`
    },
    {
      step: 2,
      title: 'Teleconnection Downscaling Impact',
      titleMr: 'जागतिक हवामान घटकांचा परिणाम (Teleconnection Impact)',
      titleHi: 'वैश्विक जलवायु कारकों का प्रभाव (Teleconnection Impact)',
      detail: `Current climate indices project an onset shift of ${onsetDelayShiftDays > 0 ? `+${onsetDelayShiftDays}` : onsetDelayShiftDays} days, lifting break likelihood to ${breakRiskPct}%.`,
      detailMr: `सध्याच्या महासागरीय घटकांनुसार मान्सून ${onsetDelayShiftDays > 0 ? `+${onsetDelayShiftDays}` : onsetDelayShiftDays} दिवस विलंबाने असून पावसाचा खंड पडण्याची शक्यता ${breakRiskPct}% पर्यंत वाढली आहे.`,
      detailHi: `वर्तमान जलवायु सूचकांकों के अनुसार मानसून में ${onsetDelayShiftDays > 0 ? `+${onsetDelayShiftDays}` : onsetDelayShiftDays} दिन का विचलन है, जिससे ब्रेक जोखिम ${breakRiskPct}% आंका गया है।`
    },
    {
      step: 3,
      title: 'Root-Zone Moisture Balance',
      titleMr: 'मुळांच्या भागातील ओलावा समतोल (Moisture Balance)',
      titleHi: 'जड़ क्षेत्र की नमी संतुलन (Moisture Balance)',
      detail: `Soil water holding capacity is ${block.climatology.waterHoldingCapacityMm} mm (${block.climatology.soilType}). Current soil moisture deficit is estimated at ${soilMoistureDeficitPct}%.`,
      detailMr: `जमिनीची जलधारण क्षमता ${block.climatology.waterHoldingCapacityMm} मिमी (${block.climatology.soilType}) आहे. सध्या मातीतील ओलावा तूट ${soilMoistureDeficitPct}% आहे.`,
      detailHi: `मिट्टी की जलधारण क्षमता ${block.climatology.waterHoldingCapacityMm} मिमी (${block.climatology.soilType}) है। वर्तमान में नमी की कमी ${soilMoistureDeficitPct}% है।`
    },
    {
      step: 4,
      title: 'Crop Sensitivity Cross-Check',
      titleMr: 'पिकाची संवेदनशीलता तपासणी (Crop Sensitivity)',
      titleHi: 'फसल संवेदनशीलता जांच (Crop Sensitivity)',
      detail: `${crop.name} requires ≥${crop.minSoilMoistureThresholdMm} mm moisture. At '${stage.replace('_', ' ').toUpperCase()}' stage, dry spells >${crop.consecutiveDryDaysSensitivity} days trigger irreversible seedling failure.`,
      detailMr: `${crop.nameMr} पिकासाठी किमान ≥${crop.minSoilMoistureThresholdMm} मिमी ओलावा आवश्यक आहे. पेरणीनंतर ${crop.consecutiveDryDaysSensitivity} दिवसांपेक्षा जास्त खंड पडल्यास कोमेजण्याचा धोका संभवतो.`,
      detailHi: `${crop.nameHi} के लिए कम से कम ≥${crop.minSoilMoistureThresholdMm} मिमी नमी चाहिए। बुवाई के बाद ${crop.consecutiveDryDaysSensitivity} दिन से अधिक सूखा अंकुरण को नष्ट कर सकता है।`
    },
    {
      step: 5,
      title: 'Agronomic Action Recommendation',
      titleMr: 'कृषी कृती शिफारस (Action Recommendation)',
      titleHi: 'कृषि कार्य संस्तुति (Action Recommendation)',
      detail: verdictCode === 'DELAY_SOWING' 
        ? `Withhold dust sowing (धुळवाफ पेरणी). Wait for a verified minimum 75-100 mm cumulative soaking rain spell before planting.`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `Deploy Broad Bed Furrow (BBF) furrow system or seed treatment with Trichoderma & Rhizobium to enhance seedling resilience.`
          : verdictCode === 'PROTECT_DRAIN'
            ? `Clear all farm boundary field channels to divert storm runoff.`
            : `Sow treated certified seed at recommended depth (3-5 cm) in moist soil.`,
      detailMr: verdictCode === 'DELAY_SOWING'
        ? `धुळवाफ पेरणी करू नका. शेतात किमान ७५-१०० मिमी मुसळधार पाऊस पडून जमिनीत ओलावा आल्याशिवाय पेरणी करू नका.`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `बीबीएफ (BBF) पद्धतीचा वापर करा आणि बियाण्याला ट्रायकोडर्मा किंवा रायझोबियमची प्रक्रिया करून संरक्षित पाण्याची व्यवस्था ठेवा.`
          : verdictCode === 'PROTECT_DRAIN'
            ? `शेतातील सर्व चर मोकळे करून जास्त पाण्याचा निचरा करा जेणेकरून बियाणे सडणार नाही.`
            : `जमिनीत योग्य ओलावा असताना प्रमाणित बियाण्याची ३-५ सेमी खोलीवर पेरणी करा.`,
      detailHi: verdictCode === 'DELAY_SOWING'
        ? `सूखी मिट्टी में बुवाई न करें। कम से कम 75-100 मिमी अच्छी बारिश होने तक प्रतीक्षा करें।`
        : verdictCode === 'CAUTION_IRRIGATE'
          ? `बीबीएफ (BBF) पद्धति अपनाएं और बीजोपचार कर जीवनरक्षक सिंचाई तैयार रखें।`
          : verdictCode === 'PROTECT_DRAIN'
            ? `खेत से अतिरिक्त पानी निकालने के लिए नालियां साफ करें ताकि जलभराव न हो।`
            : `पर्याप्त नमी होने पर उपचारित प्रमाणित बीज की 3-5 सेमी गहराई पर बुवाई करें।`
    }
  ];

  // Specific Action Plans in 3 Languages
  const actionPlan = {
    sowingRecommendation: verdictCode === 'DELAY_SOWING'
      ? `DO NOT sow on isolated pre-monsoon showers. Postpone sowing until sustained monsoon pulse is established (estimated ${forecast.expectedOnsetDate}).`
      : verdictCode === 'CAUTION_IRRIGATE'
        ? `Sow only if 75mm+ rainfall received. Adopt Broad Bed Furrow (BBF) method (1.5m bed with 30cm furrow) to conserve in-situ moisture.`
        : verdictCode === 'PROTECT_DRAIN'
          ? `Delay sowing 3-4 days until saturated topsoil achieves optimum field capacity.`
          : `Optimal sowing window is OPEN. Complete sowing between 06:00-11:00 AM or late afternoon to preserve seed moisture.`,
    sowingRecommendationMr: verdictCode === 'DELAY_SOWING'
      ? `पूर्व-मान्सूनच्या किरकोळ पावसावर पेरणी करू नका. मुख्य मान्सून सक्रिय होईपर्यंत (अपेक्षित ${forecast.expectedOnsetDate}) पेरणी पुढे ढकला.`
      : verdictCode === 'CAUTION_IRRIGATE'
        ? `७५ मिमी पेक्षा जास्त पाऊस झाल्यावरच पेरा. जमिनीतील ओलावा टिकवण्यासाठी १.५ मीटर रुंद गादीवाफा व ३० सेमी चर (BBF) पद्धत वापरा.`
        : verdictCode === 'PROTECT_DRAIN'
          ? `मातीतील अतिपाणी ओसरेपर्यंत आणि वाफसा येईपर्यंत पेरणी ३-४ दिवस पुढे ढकला.`
          : `पेरणीची योग्य वेळ सुरू झाली आहे. बियाण्यातील ओलावा टिकवण्यासाठी सकाळी ६ ते ११ किंवा संध्याकाळी पेरणी करा.`,
    sowingRecommendationHi: verdictCode === 'DELAY_SOWING'
      ? `हल्की प्री-मानसून फुहारों पर बुवाई न करें। मुख्य मानसूनी बारिश शुरू होने तक (अपेक्षित ${forecast.expectedOnsetDate}) बुवाई टालें।`
      : verdictCode === 'CAUTION_IRRIGATE'
        ? `75 मिमी से अधिक बारिश होने पर ही बुवाई करें। नमी संरक्षण के लिए ब्रॉड बेड फरो (BBF) विधि अपनाएं।`
        : verdictCode === 'PROTECT_DRAIN'
          ? `खेत में वाफसा स्थिति आने तक बुवाई 3-4 दिन के लिए टालें।`
          : `बुवाई के लिए अनुकूल समय आ गया है। सुबह 6 से 11 बजे अथवा शाम के समय बुवाई पूरी करें।`,
    
    soilAndWaterIntervention: verdictCode === 'DELAY_SOWING'
      ? `Keep land prepared with fine tilth; apply farmyard manure (FYM) or compost to improve soil moisture retention for the delayed start.`
      : `Apply organic mulch (crop residue / straw 5 t/ha) or spray anti-transpirant 8% Kaolin if dry spell exceeds 7 days. Ensure drip/sprinkler lines are ready.`,
    soilAndWaterInterventionMr: verdictCode === 'DELAY_SOWING'
      ? `जमीन नांगरून तयार ठेवा; उशिरा होणाऱ्या पेरणीसाठी ओलावा टिकवून ठेवण्याकरिता शेणखत किंवा कंपोस्ट खताचा वापर करा.`
      : `पावसाचा खंड ७ दिवसांपेक्षा जास्त असल्यास पिकांच्या अवशेषांचे आच्छादन (मल्चिंग) करा किंवा ८% काओलिनची फवारणी करा. ठिबक/तुषार सिंचन सज्ज ठेवा.`,
    soilAndWaterInterventionHi: verdictCode === 'DELAY_SOWING'
      ? `खेत तैयार रखें और मिट्टी में नमी संचित करने के लिए गोबर की सड़ी खाद अथवा कंपोस्ट मिलाएं।`
      : `यदि सूखा 7 दिन से अधिक खिंचे तो फसल अवशेषों से मल्चिंग करें या 8% काओलिन का छिड़काव करें। ड्रिप/स्प्रिंकलर तैयार रखें।`,
    
    pestDiseaseAlert: `High humidity after rain followed by dry breaks increases Spodoptera frugiperda (Fall Armyworm in Maize) and Stem Fly / Girdle Beetle in Soybean. Install 5 pheromone traps per acre.`,
    pestDiseaseAlertMr: `पाऊस पडून खंड पडल्यास खोडमाशी, चक्रीभुंगा आणि लष्करी अळीचा प्रादुर्भाव वाढतो. नियंत्रणासाठी एकरी ५ कामगंध सापळे (फेरोमोन ट्रॅप्स) लावा.`,
    pestDiseaseAlertHi: `बारिश के बाद सूखे से तना मक्खी, गर्डल बीटल और फॉल आर्मीवॉर्म का प्रकोप बढ़ता है। बचाव हेतु प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं।`,

    resowingContingency: `Keep contingency seed stock of short-duration drought-tolerant varieties (e.g. JS-9305 / JS-9560 for Soybean; Phule Yashoda / BDN-711 for Tur) in case resowing is mandated.`,
    resowingContingencyMr: `पावसाचा खंड पडल्यास आपत्कालीन नियोजनासाठी कमी कालावधीत येणाऱ्या वाणांचे बियाणे (सोयाबीन: जेएस-९३०५, जेएस-९५६०; तूर: फुले यशोदा, बीडीएन-७११) राखून ठेवा.`,
    resowingContingencyHi: `सूखे की स्थिति में दोबारा बुवाई के लिए कम अवधि वाली सूखा प्रतिरोधी किस्मों (सोयाबीन: JS-9305, JS-9560; अरहर: BDN-711) का बीज सुरक्षित रखें।`
  };

  // Generate All-Language Telecom SMS and WhatsApp Bulletins (Zero English fallback for regional farmers)
  const allPayloads = generateAllLanguagePayloads({
    cropId,
    stage,
    block,
    forecast,
    verdictCode,
    breakRiskPct,
    soilMoistureDeficitPct
  });

  return {
    cropId,
    cropName: crop.name,
    blockId: block.id,
    blockName: block.name,
    verdictCode,
    trafficColor,
    headline: {
      en: headlines[verdictCode].en,
      mr: headlines[verdictCode].mr,
      hi: headlines[verdictCode].hi
    },
    simpleSentences,
    reasoningChain,
    actionPlan,
    smsPayload: allPayloads.smsPayload,
    whatsappPayload: allPayloads.whatsappPayload
  };
}
