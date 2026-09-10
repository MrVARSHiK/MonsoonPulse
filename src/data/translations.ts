import { Language } from '../types';
import { REGIONAL_TRANSLATIONS } from './regionalTranslations';

export interface AppTranslations {
  // Brand & Top Header
  brandTag: string;
  moesNcmrwfSystem: string;
  regionLabel: string;
  howToUseBtn: string;
  systemSpecsBtn: string;
  googleSignInBtn: string;
  userRoleFarmer: string;
  userRoleExtension: string;
  userRoleScientist: string;
  userRoleGeneral: string;

  // Global Filter Selectors
  stateLabel: string;
  districtLabel: string;
  climateLabel: string;

  // Nav Tabs
  tabRiskMap: string;
  tabCropAdvisory: string;
  tabFarmerMobile: string;
  tabExtensionConsole: string;
  tabValidation: string;

  // Live Telemetry Bar
  monsoonTrackerLive: string;
  monsoonLpaStatus: string;
  downscalingActive: string;
  refreshTime: string;

  // Map Controls & Metrics
  metricOnset: string;
  metricBreak: string;
  metricHeavyRain: string;
  metricMoisture: string;
  horizon1W: string;
  horizon2W: string;
  horizon3W: string;
  horizon4W: string;
  horizonLabel: string;
  metricLabel: string;
  clickBlockHint: string;
  selectedBlockText: string;
  quickFilterAll: string;
  quickFilterHighRisk: string;
  quickFilterDelayed: string;
  quickFilterSafe: string;

  // Map Legend
  legendLow: string;
  legendMod: string;
  legendHigh: string;
  legendSevere: string;

  // Teleconnection Panel
  teleconnectionTitle: string;
  teleconnectionSubtitle: string;
  scenarioSelectLabel: string;
  favorableStatus: string;
  unfavorableStatus: string;
  neutralStatus: string;
  ninoDriverName: string;
  ninoDriverDesc: string;
  iodDriverName: string;
  iodDriverDesc: string;
  mjoDriverName: string;
  mjoDriverDesc: string;
  lljDriverName: string;
  lljDriverDesc: string;
  pwvDriverName: string;
  pwvDriverDesc: string;

  // Block Detail Drawer
  blockInspectorTitle: string;
  districtSubtitle: string;
  soilTypeLabel: string;
  waterHoldingCap: string;
  expectedOnset: string;
  climatologyOnset: string;
  onsetShift: string;
  breakMonsoonRisk: string;
  heavyRainRisk: string;
  soilMoistureDeficit: string;
  projectedRainfallP50: string;
  openCropAdvisoryBtn: string;
  onsetDistributionTitle: string;
  modelConfidence: string;

  // Crop Advisory
  cropAdvisoryTitle: string;
  cropAdvisorySubtitle: string;
  targetBlock: string;
  selectCropLabel: string;
  growthStageLabel: string;
  listenAudioBtn: string;
  stopAudioBtn: string;
  copySmsBtn: string;
  copiedSuccess: string;
  plainLanguageTitle: string;
  plainLanguageSubtitle: string;
  plainLanguageTag: string;
  explainableAiTitle: string;
  explainableAiSubtitle: string;
  actionPlanTitle: string;
  soilWaterPlanTitle: string;
  pestDiseaseTitle: string;
  resowingPlanTitle: string;

  // Sowing Readiness Checklist
  checklistTitle: string;
  checklistSubtitle: string;
  checkSoakingRain: string;
  checkSeedGermination: string;
  checkSeedTreatment: string;
  checkBbfMachine: string;
  checkFarmPond: string;
  readinessReady: string;
  readinessWait: string;

  // Farmer Simplified View
  farmerVillageSelect: string;
  farmerCropSelect: string;
  farmerTrafficTitle: string;
  directActionTag: string;
  farmerBreakRisk: string;
  farmerExpectedOnset: string;
  farmerSoilMoisture: string;
  farmerVoiceBtn: string;
  farmerVoiceStop: string;
  deliverySimulatorTitle: string;
  phoneNumberLabel: string;
  sendBroadcastBtn: string;
  msgDeliveredSuccess: string;
  acknowledgeAdvisory: string;
  callKvkHelpline: string;

  // Extension Officer (KVK) Console
  kvkConsoleTitle: string;
  kvkConsoleSubtitle: string;
  exportBulletinPdf: string;
  totalBlocksCard: string;
  highBreakRiskCard: string;
  delayedOnsetCard: string;
  registeredFarmersCard: string;
  vulnerabilityMatrixTitle: string;
  sortByBreakRisk: string;
  sortByOnsetDelay: string;
  sortByDeficit: string;
  sortByName: string;
  blockCol: string;
  onsetShiftCol: string;
  breakRiskCol: string;
  soilDeficitCol: string;
  verdictCol: string;
  broadcastToolTitle: string;
  selectHighRiskOnlyBtn: string;
  selectAllBlocksBtn: string;
  sendBulkDispatchBtn: string;
  broadcastDispatchedSuccess: string;
  smsPreviewTab: string;
  whatsappPreviewTab: string;
}

const BASE_TRANSLATIONS: Record<string, AppTranslations> = {
  en: {
    brandTag: 'v2.4 Hyperlocal',
    moesNcmrwfSystem: 'MoES/NCMRWF System | Sub-Seasonal Monsoon AI',
    regionLabel: 'Region',
    howToUseBtn: 'How to Use',
    systemSpecsBtn: 'System Specs',
    googleSignInBtn: 'Google Sign In',
    userRoleFarmer: 'Farmer / Kisan',
    userRoleExtension: 'KVK Extension Officer',
    userRoleScientist: 'Agri-Meteorologist',
    userRoleGeneral: 'General User',

    stateLabel: 'State:',
    districtLabel: 'District:',
    climateLabel: 'Climate Scenario:',

    tabRiskMap: 'Risk Map & Teleconnections',
    tabCropAdvisory: 'Crop Advisory Engine',
    tabFarmerMobile: 'Farmer Mobile & Dispatch',
    tabExtensionConsole: 'Extension Officer (KVK)',
    tabValidation: 'Backtest & Defensibility',

    monsoonTrackerLive: 'Southwest Monsoon Pulse (SW-IMD/NCMRWF)',
    monsoonLpaStatus: 'National Rainfall: 101.4% of LPA (Normal)',
    downscalingActive: 'Dynamic Downscaling Active (12km -> 3km Block)',
    refreshTime: 'Satellite & Gauge Refreshed: Today, 06:00 IST',

    metricOnset: 'Monsoon Onset Prob',
    metricBreak: 'Dry Break Risk',
    metricHeavyRain: 'Heavy Rain Risk',
    metricMoisture: 'Soil Deficit',
    horizon1W: '1 Week (7d)',
    horizon2W: '2 Weeks (14d)',
    horizon3W: '3 Weeks (21d)',
    horizon4W: '4 Weeks (28d)',
    horizonLabel: 'Forecast Horizon:',
    metricLabel: 'Risk Metric:',
    clickBlockHint: 'Click any block polygon to inspect localized probability curves and soil profile.',
    selectedBlockText: 'Selected Block',
    quickFilterAll: 'All Blocks',
    quickFilterHighRisk: '⚠️ High Break Risk (>40%)',
    quickFilterDelayed: '⏳ Delayed Onset (>4d)',
    quickFilterSafe: '✅ Favorable Sowing',

    legendLow: 'Low Risk (<25%)',
    legendMod: 'Moderate (25-45%)',
    legendHigh: 'High (45-65%)',
    legendSevere: 'Severe (>65%)',

    teleconnectionTitle: 'Large-Scale Dynamic Climate Teleconnection Drivers',
    teleconnectionSubtitle: 'Perturb oceanic & atmospheric synoptic indices to test block-level downscaled sensitivity',
    scenarioSelectLabel: 'Pre-load Historical Benchmark Year:',
    favorableStatus: 'Favorable',
    unfavorableStatus: 'Adverse',
    neutralStatus: 'Neutral',
    ninoDriverName: 'ENSO Niño 3.4 SST Anomaly',
    ninoDriverDesc: 'Pacific sea surface warmth (El Niño suppresses; La Niña favors monsoon rains)',
    iodDriverName: 'Indian Ocean Dipole (IOD DMI)',
    iodDriverDesc: 'Positive dipole directs monsoon trough across central Indian farm belt',
    mjoDriverName: 'Madden-Julian Oscillation (MJO)',
    mjoDriverDesc: 'Phases 2-4 fuel peninsular & central rain pulses; phases 6-8 suppress rain',
    lljDriverName: 'Low Level Findlater Jet (850 hPa)',
    lljDriverDesc: 'Cross-equatorial Somali jet moisture advection speed into Western Ghats',
    pwvDriverName: 'Precipitable Water Vapor (PWV)',
    pwvDriverDesc: 'Total column atmospheric moisture fueling convective rain clouds',

    blockInspectorTitle: 'Block Probabilistic Climate Profile',
    districtSubtitle: 'District',
    soilTypeLabel: 'Soil Type',
    waterHoldingCap: 'Root-Zone Water Capacity',
    expectedOnset: 'Expected Onset Date',
    climatologyOnset: 'Normal Baseline Onset',
    onsetShift: 'Onset Anomaly Shift',
    breakMonsoonRisk: 'Dry Spell / Break Risk',
    heavyRainRisk: 'Heavy Rainfall Risk',
    soilMoistureDeficit: 'Soil Moisture Deficit',
    projectedRainfallP50: 'Weekly Median Rainfall (P50)',
    openCropAdvisoryBtn: 'Generate Crop Sowing Advisory for this Block',
    onsetDistributionTitle: 'Probabilistic Monsoon Onset Probability (PDF & CDF)',
    modelConfidence: 'Model Confidence Score',

    cropAdvisoryTitle: 'Agronomic Crop Sowing Advisory Engine',
    cropAdvisorySubtitle: 'Rule-based expert system cross-referencing dry break probabilities with crop sensitivity',
    targetBlock: 'Target Block:',
    selectCropLabel: '1. Select Kharif Crop:',
    growthStageLabel: '2. Select Crop Growth Stage:',
    listenAudioBtn: 'Listen Voice Advisory (AI/TTS)',
    stopAudioBtn: 'Stop Audio',
    copySmsBtn: 'Copy SMS Format',
    copiedSuccess: 'Copied!',
    plainLanguageTitle: '4 Simple Sentences for Farmers (Easy-Read Mode)',
    plainLanguageSubtitle: 'Clear, direct single-sentence summaries without complex meteorological jargon',
    plainLanguageTag: 'Farmer Friendly',
    explainableAiTitle: 'Transparent Scientific Reasoning Chain (Explainable AI Engine)',
    explainableAiSubtitle: '5-Stage Decision Matrix connecting atmospheric indices to on-field advice',
    actionPlanTitle: 'Sowing & Field Operation Protocols',
    soilWaterPlanTitle: 'Soil Moisture & Water Conservation',
    pestDiseaseTitle: 'Microclimate Pest & Disease Risk',
    resowingPlanTitle: 'Contingency Seed Planning',

    checklistTitle: 'On-Field Sowing Readiness Checklist',
    checklistSubtitle: 'Ensure critical conditions are met before dropping seeds into the furrow',
    checkSoakingRain: 'Minimum 75-100 mm cumulative soaking rain received in field',
    checkSeedGermination: 'Certified seed germination rate tested >80% at home',
    checkSeedTreatment: 'Seed treated with bio-fungicide (Trichoderma / Thiram)',
    checkBbfMachine: 'Broad Bed Furrow (BBF) machine / ridges ready for drainage',
    checkFarmPond: 'Farm pond / protective sprinkler line checked and operational',
    readinessReady: 'Ready to Sow! Ideal Field Conditions',
    readinessWait: 'Incomplete Prep — Address Unchecked Items to Prevent Losses',

    farmerVillageSelect: 'Select Village/Block:',
    farmerCropSelect: 'Select Crop:',
    farmerTrafficTitle: 'Traffic Light Safety Signal',
    directActionTag: 'Direct Action',
    farmerBreakRisk: 'Dry Break Risk',
    farmerExpectedOnset: 'Expected Onset',
    farmerSoilMoisture: 'Soil Moisture Cap',
    farmerVoiceBtn: '🔊 Listen Spoken Advisory',
    farmerVoiceStop: '⏹️ Stop Audio',
    deliverySimulatorTitle: 'Farmer Delivery Simulator',
    phoneNumberLabel: 'Target Mobile Number:',
    sendBroadcastBtn: 'Push Test Message to Handset',
    msgDeliveredSuccess: 'Message Delivered to Handset (+91 98220...)',
    acknowledgeAdvisory: 'Acknowledge Advisory',
    callKvkHelpline: 'Call KVK Helpline (1800-180-1551)',

    kvkConsoleTitle: 'Krishi Vigyan Kendra (KVK) & Extension Officer Console',
    kvkConsoleSubtitle: 'District-wide block vulnerability assessment & automated bulk advisory dispatch',
    exportBulletinPdf: 'Export Official Bulletin (PDF)',
    totalBlocksCard: 'Total Agrarian Blocks',
    highBreakRiskCard: 'High/Severe Break Risk',
    delayedOnsetCard: 'Delayed Onset (>4d)',
    registeredFarmersCard: 'Registered Farmers',
    vulnerabilityMatrixTitle: 'Block Risk & Vulnerability Matrix',
    sortByBreakRisk: 'Break Risk',
    sortByOnsetDelay: 'Onset Delay',
    sortByDeficit: 'Moisture Deficit',
    sortByName: 'Block Name',
    blockCol: 'Block / Tehsil',
    onsetShiftCol: 'Onset Shift',
    breakRiskCol: 'Break Spell Risk',
    soilDeficitCol: 'Soil Deficit',
    verdictCol: 'Agronomic Protocol',
    broadcastToolTitle: 'Automated Broadcast Campaign Engine',
    selectHighRiskOnlyBtn: 'Select High-Risk Blocks Only',
    selectAllBlocksBtn: 'Select All Blocks',
    sendBulkDispatchBtn: 'Dispatch Bulk Advisory to Selected Blocks',
    broadcastDispatchedSuccess: 'Dispatched to 46,850 Farmers via Kisan SMS Gateway',
    smsPreviewTab: 'SMS Format (160 Chars)',
    whatsappPreviewTab: 'WhatsApp Rich Media'
  },

  mr: {
    brandTag: 'v2.4 सूक्ष्म-स्थानिक',
    moesNcmrwfSystem: 'भूविज्ञान मंत्रालय (MoES/NCMRWF) | मान्सून अंदाज व पीक सल्ला प्रणाली',
    regionLabel: 'विभाग',
    howToUseBtn: 'कसे वापरावे?',
    systemSpecsBtn: 'प्रणाली माहिती',
    googleSignInBtn: 'गुगल साइन-इन',
    userRoleFarmer: 'शेतकरी बांधव',
    userRoleExtension: 'केव्हीके विस्तार अधिकारी',
    userRoleScientist: 'कृषी हवामानशास्त्रज्ञ',
    userRoleGeneral: 'सामान्य नागरिक',

    stateLabel: 'राज्य:',
    districtLabel: 'जिल्हा:',
    climateLabel: 'हवामान परिस्थिती:',

    tabRiskMap: 'जोखीम नकाशा आणि हवामान घटक',
    tabCropAdvisory: 'पीक पेरणी सल्लागार',
    tabFarmerMobile: 'शेतकरी मोबाईल व संदेश',
    tabExtensionConsole: 'विस्तार अधिकारी (KVK)',
    tabValidation: 'मॉडेल पडताळणी व सत्यता',

    monsoonTrackerLive: 'नैऋत्य मान्सून प्रगती (SW-IMD/NCMRWF)',
    monsoonLpaStatus: 'देशातील पाऊस: सरासरीच्या १०१.४% (सामान्य)',
    downscalingActive: 'स्थानिक तालुका अंदाज कार्यरत (१२ किमी -> ३ किमी)',
    refreshTime: 'उपग्रह व रडार अद्ययावत: आज, सकाळी ०६:००',

    metricOnset: 'मान्सून आगमन संभाव्यता',
    metricBreak: 'पावसाचा खंड धोका',
    metricHeavyRain: 'मुसळधार पाऊस इशारा',
    metricMoisture: 'मातीतील ओलावा तूट',
    horizon1W: '१ आठवडा (७ दिवस)',
    horizon2W: '२ आठवडे (१४ दिवस)',
    horizon3W: '३ आठवडे (२१ दिवस)',
    horizon4W: '४ आठवडे (२८ दिवस)',
    horizonLabel: 'अंदाज कालावधी:',
    metricLabel: 'जोखीम निर्देशांक:',
    clickBlockHint: 'संभाव्यता आलेख आणि मातीची माहिती पाहण्यासाठी नकाशावरील कोणत्याही तालुक्यावर क्लिक करा.',
    selectedBlockText: 'निवडलेला तालुका',
    quickFilterAll: 'सर्व तालुके',
    quickFilterHighRisk: '⚠️ मोठा खंड धोका (>४०%)',
    quickFilterDelayed: '⏳ लांबलेला मान्सून (>४ दिवस)',
    quickFilterSafe: '✅ पेरणीसाठी अनुकूल भाग',

    legendLow: 'कमी धोका (<२५%)',
    legendMod: 'मध्यम धोका (२५-४५%)',
    legendHigh: 'जास्त धोका (४५-६५%)',
    legendSevere: 'अतिगंभीर धोका (>६५%)',

    teleconnectionTitle: 'जागतिक महासागरीय व वातावरणीय हवामान घटक (टेलिकनेक्शन)',
    teleconnectionSubtitle: 'तालुका पातळीवरील पावसाच्या अंदाजावर होणारा परिणाम तपासण्यासाठी हवामान निर्देशांक बदला',
    scenarioSelectLabel: 'ऐतिहासिक हवामान वर्ष निवडा:',
    favorableStatus: 'अनुकूल',
    unfavorableStatus: 'प्रतिकूल',
    neutralStatus: 'तटस्थ',
    ninoDriverName: 'एन्सो निनो ३.४ तापमान विसंगती (ENSO)',
    ninoDriverDesc: 'प्रशांत महासागराचे तापमान (एल निनोमुळे पाऊस कमी; ला निनामुळे जोरदार मान्सून)',
    iodDriverName: 'हिंद महासागर द्विध्रुव (IOD DMI)',
    iodDriverDesc: 'सकारात्मक आयओडीमुळे मध्य महाराष्ट्रात व विदर्भात चांगला पाऊस पडतो',
    mjoDriverName: 'मॅडेन-ज्युलियन दोलन (MJO Phase)',
    mjoDriverDesc: 'फेज २-४ मध्ये जोरदार पाऊस पडतो; फेज ६-८ मध्ये पावसाचा खंड पडतो',
    lljDriverName: 'निम्न स्तरीय मान्सून वारे (Findlater Jet 850 hPa)',
    lljDriverDesc: 'अरबी समुद्रावरून पश्चिम घाटाकडे येणाऱ्या बाष्पयुक्त वाऱ्यांचा वेग',
    pwvDriverName: 'वातावरणातील एकूण बाष्प (PWV)',
    pwvDriverDesc: 'ढग निर्मिती आणि पावसासाठी आवश्यक हवेतील एकूण बाष्पाचे प्रमाण',

    blockInspectorTitle: 'तालुकानिहाय हवामान व पर्जन्य आलेख',
    districtSubtitle: 'जिल्हा',
    soilTypeLabel: 'मातीचा प्रकार',
    waterHoldingCap: 'मुळांच्या भागातील जलधारण क्षमता',
    expectedOnset: 'अपेक्षित मान्सून आगमन तारीख',
    climatologyOnset: 'सरासरी सामान्य आगमन तारीख',
    onsetShift: 'आगमनातील तफावत (दिवस)',
    breakMonsoonRisk: 'पावसाचा खंड पडण्याचा धोका',
    heavyRainRisk: 'अतिवृष्टी / जोरदार पाऊस धोका',
    soilMoistureDeficit: 'मातीतील ओलावा तूट',
    projectedRainfallP50: 'अपेक्षित सरासरी पाऊस (P50)',
    openCropAdvisoryBtn: 'या तालुक्यासाठी संपूर्ण पीक पेरणी सल्ला पहा',
    onsetDistributionTitle: 'मान्सून आगमन संभाव्यता घनता वितरण (PDF व CDF आलेख)',
    modelConfidence: 'मॉडेल अचूकता निर्देशांक',

    cropAdvisoryTitle: 'कृषी पीक पेरणी सल्लागार प्रणाली',
    cropAdvisorySubtitle: 'पावसाचा खंड, मातीतील ओलावा आणि पिकाची संवेदनशीलता यावर आधारित अचूक शास्त्रीय सल्ला',
    targetBlock: 'निवडलेला तालुका:',
    selectCropLabel: '१. खरीप पीक निवडा:',
    growthStageLabel: '२. पिकाची सध्याची अवस्था निवडा:',
    listenAudioBtn: '🔊 मराठीत आवाज ऐका (AI बोलणारा सल्ला)',
    stopAudioBtn: 'थांबवा',
    copySmsBtn: 'एसएमएस कॉपी करा',
    copiedSuccess: 'कॉपी झाले!',
    plainLanguageTitle: 'शेतकऱ्यांसाठी ४ सोपी वाक्ये (सरल शेतकरी मार्गदर्शक)',
    plainLanguageSubtitle: 'अतिशय सोप्या आणि स्पष्ट भाषेत थेट शेती निर्णय समजून घ्या',
    plainLanguageTag: 'शेतकरी सोयीचे',
    explainableAiTitle: 'पारदर्शक शास्त्रीय विश्लेषण साखळी (Explainable AI Engine)',
    explainableAiSubtitle: 'हवामान घटकांपासून ते शेतातील प्रत्यक्ष सल्ल्यापर्यंत ५-टप्प्यांची कारणमीमांसा',
    actionPlanTitle: 'पेरणी आणि मशागत कार्यपद्धती',
    soilWaterPlanTitle: 'मातीतील ओलावा संवर्धन व पाणी व्यवस्थापन',
    pestDiseaseTitle: 'बदलत्या हवामानातील कीड व रोग इशारा',
    resowingPlanTitle: 'दुबार पेरणी टाळण्यासाठी बियाणे नियोजन',

    checklistTitle: 'शेतातील पेरणी पूर्वतयारी तपासणी सूची',
    checklistSubtitle: 'बियाणे जमिनीत टाकण्यापूर्वी खालील ५ महत्त्वाच्या गोष्टी नक्की तपासा',
    checkSoakingRain: 'शेतात किमान ७५ ते १०० मिमी दमदार व खोलवर भिजणारा पाऊस झाला आहे',
    checkSeedGermination: 'घरी बियाण्याची उगवण क्षमता तपासली असून ती ८०% पेक्षा जास्त आहे',
    checkSeedTreatment: 'बियाण्याला ट्रायकोडर्मा किंवा रासायनिक बुरशीनाशकाची बीजप्रक्रिया केली आहे',
    checkBbfMachine: 'पाण्याचा निचरा होण्यासाठी बीबीएफ (BBF) किंवा सरी-वरंबा पद्धतीची तयारी आहे',
    checkFarmPond: 'पावसाचा खंड पडल्यास शेततळे किंवा ठिबक सिंचनाची सोय सज्ज आहे',
    readinessReady: 'पेरणीसाठी शेत सज्ज! अनुकूल परिस्थिती',
    readinessWait: 'तयारी अपूर्ण — नुकसान टाळण्यासाठी शिल्लक राहिलेल्या गोष्टी पूर्ण करा',

    farmerVillageSelect: 'तालुका/गाव निवडा:',
    farmerCropSelect: 'पीक निवडा:',
    farmerTrafficTitle: 'ट्रॅफिक सिग्नल शेती निर्णय',
    directActionTag: 'थेट कृती',
    farmerBreakRisk: 'पावसाचा खंड धोका',
    farmerExpectedOnset: 'मान्सून आगमन',
    farmerSoilMoisture: 'जमिनीची क्षमता',
    farmerVoiceBtn: '🔊 थेट आवाज ऐका (मराठी सल्ला)',
    farmerVoiceStop: '⏹️ आवाज थांबवा',
    deliverySimulatorTitle: 'शेतकरी मोबाईल संदेश प्रणाली',
    phoneNumberLabel: 'मोबाईल क्रमांक:',
    sendBroadcastBtn: 'मोबाईलवर संदेश पाठवून पहा (Test SMS)',
    msgDeliveredSuccess: 'शेतकऱ्याच्या मोबाईलवर संदेश यशस्वीरित्या पोहोचला (+91 98220...)',
    acknowledgeAdvisory: 'सल्ला प्राप्त झाल्याची पोच द्या',
    callKvkHelpline: 'केव्हीके कृषी हेल्पलाईन (1800-180-1551)',

    kvkConsoleTitle: 'कृषी विज्ञान केंद्र (KVK) व विस्तार अधिकारी नियंत्रण कक्ष',
    kvkConsoleSubtitle: 'जिल्हास्तरीय तालुका जोखीम विश्लेषण आणि शेतकऱ्यांना स्वयंचलित एकत्रित संदेश पाठवणे',
    exportBulletinPdf: 'अधिकृत कृषी बुलेटिन डाऊनलोड (PDF)',
    totalBlocksCard: 'एकूण शेती तालुके',
    highBreakRiskCard: 'मोठा खंड धोका असलेले तालुके',
    delayedOnsetCard: 'पाऊस लांबलेले तालुके (>४ दिवस)',
    registeredFarmersCard: 'नोंदणीकृत शेतकरी संख्या',
    vulnerabilityMatrixTitle: 'तालुकानिहाय जोखीम व संवेदनशीलता तक्ता',
    sortByBreakRisk: 'खंड धोका',
    sortByOnsetDelay: 'पाऊस विलंब',
    sortByDeficit: 'ओलावा तूट',
    sortByName: 'तालुक्याचे नाव',
    blockCol: 'तालुका / ब्लॉक',
    onsetShiftCol: 'आगमन तफावत',
    breakRiskCol: 'खंड धोका (%)',
    soilDeficitCol: 'ओलावा तूट',
    verdictCol: 'सल्ला / कृती',
    broadcastToolTitle: 'स्वयंचलित शेतकरी संदेश प्रसारण यंत्रणा',
    selectHighRiskOnlyBtn: 'फक्त धोक्यात असलेले तालुके निवडा',
    selectAllBlocksBtn: 'सर्व तालुके निवडा',
    sendBulkDispatchBtn: 'निवडलेल्या तालुक्यांतील सर्व शेतकऱ्यांना संदेश पाठवा',
    broadcastDispatchedSuccess: 'किसान एसएमएस गेटवेवरून ४६,८५० शेतकऱ्यांना संदेश पाठवले',
    smsPreviewTab: 'एसएमएस (१६० अक्षरे)',
    whatsappPreviewTab: 'व्हॉट्सअ‍ॅप माहिती'
  },

  hi: {
    brandTag: 'v2.4 सूक्ष्म-स्थानिक',
    moesNcmrwfSystem: 'पृथ्वी विज्ञान मंत्रालय (MoES/NCMRWF) | मानसून व फसल सलाह प्रणाली',
    regionLabel: 'क्षेत्र',
    howToUseBtn: 'उपयोग कैसे करें?',
    systemSpecsBtn: 'सिस्टम विवरण',
    googleSignInBtn: 'गूगल साइन-इन',
    userRoleFarmer: 'किसान भाई',
    userRoleExtension: 'केवीके विस्तार अधिकारी',
    userRoleScientist: 'कृषि मौसम विज्ञानी',
    userRoleGeneral: 'सामान्य नागरिक',

    stateLabel: 'राज्य:',
    districtLabel: 'ज़िला:',
    climateLabel: 'जलवायु परिदृश्य:',

    tabRiskMap: 'जोखिम मानचित्र और टेलीकनेक्शन',
    tabCropAdvisory: 'फसल बुवाई सलाह प्रणाली',
    tabFarmerMobile: 'किसान मोबाइल व संदेश',
    tabExtensionConsole: 'विस्तार अधिकारी (KVK)',
    tabValidation: 'मॉडल सत्यापन व बैकटेस्ट',

    monsoonTrackerLive: 'दक्षिण-पश्चिम मानसून प्रगति (SW-IMD/NCMRWF)',
    monsoonLpaStatus: 'राष्ट्रीय वर्षा: सामान्य का १०१.४% (अनुकूल)',
    downscalingActive: 'स्थानीय ब्लॉक स्तर का पूर्वानुमान सक्रिय (१२ किमी -> ३ किमी)',
    refreshTime: 'उपग्रह व रडार डेटा: आज, प्रातः ०६:०० बजे',

    metricOnset: 'मानसून आगमन संभावना',
    metricBreak: 'सूखा / ब्रेक जोखिम',
    metricHeavyRain: 'भारी वर्षा चेतावनी',
    metricMoisture: 'मिट्टी नमी की कमी',
    horizon1W: '१ सप्ताह (७ दिन)',
    horizon2W: '२ सप्ताह (१४ दिन)',
    horizon3W: '३ सप्ताह (२१ दिन)',
    horizon4W: '४ सप्ताह (२८ दिन)',
    horizonLabel: 'पूर्वानुमान अवधि:',
    metricLabel: 'जोखिम सूचकांक:',
    clickBlockHint: 'संभावना वक्र और मिट्टी प्रोफाइल देखने के लिए मानचित्र पर किसी भी ब्लॉक पर क्लिक करें।',
    selectedBlockText: 'चयनित ब्लॉक',
    quickFilterAll: 'सभी ब्लॉक',
    quickFilterHighRisk: '⚠️ उच्च सूखा जोखिम (>४०%)',
    quickFilterDelayed: '⏳ देरी से मानसून (>४ दिन)',
    quickFilterSafe: '✅ बुवाई के लिए सुरक्षित क्षेत्र',

    legendLow: 'कम जोखिम (<२५%)',
    legendMod: 'मध्यम जोखिम (२५-४५%)',
    legendHigh: 'उच्च जोखिम (४५-६५%)',
    legendSevere: 'गंभीर जोखिम (>६५%)',

    teleconnectionTitle: 'वैश्विक महासागरीय एवं वायुमंडलीय जलवायु कारक (टेलीकनेक्शन)',
    teleconnectionSubtitle: 'ब्लॉक स्तर के वर्षा पूर्वानुमान पर प्रभाव जानने के लिए जलवायु सूचकांक बदलें',
    scenarioSelectLabel: 'ऐतिहासिक बेंचमार्क वर्ष चुनें:',
    favorableStatus: 'अनुकूल',
    unfavorableStatus: 'प्रतिकूल',
    neutralStatus: 'तटस्थ',
    ninoDriverName: 'एन्सो नीनो ३.४ विसंगति (ENSO Niño 3.4)',
    ninoDriverDesc: 'प्रशांत महासागर का तापमान (एल नीनो सूखा बढ़ाता है, ला नीना अच्छी बारिश लाता है)',
    iodDriverName: 'हिंद महासागर द्विध्रुव (IOD DMI)',
    iodDriverDesc: 'सकारात्मक आईओडी भारतीय कृषि पट्टी में मानसूनी हवाओं को मजबूत करता है',
    mjoDriverName: 'मैडेन-जूलियन दोलन (MJO Phase)',
    mjoDriverDesc: 'चरण २-४ में जोरदार वर्षा होती है; चरण ६-८ में बारिश थम जाती है',
    lljDriverName: 'लो-लेवल जेट मानसूनी हवाएं (850 hPa LLJ)',
    lljDriverDesc: 'अरब सागर से पश्चिमी घाट की ओर नमी लाने वाली हवाओं की गति',
    pwvDriverName: 'वायुमंडलीय कुल नमी (PWV)',
    pwvDriverDesc: 'बादल बनने और बारिश कराने के लिए आवश्यक कुल नमी',

    blockInspectorTitle: 'ब्लॉक जलवायु एवं वर्षा संभावना प्रोफाइल',
    districtSubtitle: 'ज़िला',
    soilTypeLabel: 'मिट्टी का प्रकार',
    waterHoldingCap: 'जड़ क्षेत्र की जल धारण क्षमता',
    expectedOnset: 'अपेक्षित मानसून आगमन तिथि',
    climatologyOnset: 'सामान्य औसत आगमन तिथि',
    onsetShift: 'आगमन में विचलन (दिन)',
    breakMonsoonRisk: 'सूखा / ब्रेक स्पेल जोखिम',
    heavyRainRisk: 'भारी वर्षा का जोखिम',
    soilMoistureDeficit: 'मिट्टी में नमी की कमी',
    projectedRainfallP50: 'अनुमानित औसत वर्षा (P50)',
    openCropAdvisoryBtn: 'इस ब्लॉक के लिए पूरी फसल बुवाई सलाह देखें',
    onsetDistributionTitle: 'मानसून आगमन संभावना वितरण (PDF व CDF चार्ट)',
    modelConfidence: 'मॉडल सटीकता स्कोर',

    cropAdvisoryTitle: 'कृषि फसल बुवाई सलाह प्रणाली',
    cropAdvisorySubtitle: 'सूखा जोखिम, मिट्टी नमी और फसल संवेदनशीलता के आधार पर वैज्ञानिक बुवाई सलाह',
    targetBlock: 'चयनित ब्लॉक:',
    selectCropLabel: '१. खरीफ फसल चुनें:',
    growthStageLabel: '२. फसल की वर्तमान अवस्था चुनें:',
    listenAudioBtn: '🔊 हिंदी में सुनें (AI बोलती सलाह)',
    stopAudioBtn: 'आवाज रोकें',
    copySmsBtn: 'एसएमएस कॉपी करें',
    copiedSuccess: 'कॉपी किया गया!',
    plainLanguageTitle: 'किसानों के लिए ४ सरल वाक्य (आसान गाइड)',
    plainLanguageSubtitle: 'बिना किसी जटिल मौसम शब्दावली के सीधी और स्पष्ट खेती सलाह',
    plainLanguageTag: 'किसान हितैषी',
    explainableAiTitle: 'पारदर्शी वैज्ञानिक तर्क श्रृंखला (Explainable AI Engine)',
    explainableAiSubtitle: 'वायुमंडलीय सूचकांकों से खेत की सलाह तक ५-चरणीय वैज्ञानिक विश्लेषण',
    actionPlanTitle: 'बुवाई व खेत प्रबंधन प्रोटोकॉल',
    soilWaterPlanTitle: 'मृदा नमी संरक्षण व जल प्रबंधन',
    pestDiseaseTitle: 'मौसम अनुसार कीट व रोग चेतावनी',
    resowingPlanTitle: 'दोबारा बुवाई से बचाव बीज योजना',

    checklistTitle: 'खेत में बुवाई पूर्व तैयारी चेकलिस्ट',
    checklistSubtitle: 'खेत में बीज डालने से पहले ये ५ महत्वपूर्ण बातें अवश्य जांचें',
    checkSoakingRain: 'खेत में कम से कम ७५ से १०० मिमी अच्छी बारिश हो चुकी है',
    checkSeedGermination: 'घर पर बीज की अंकुरण क्षमता जांची है और वह ८०% से अधिक है',
    checkSeedTreatment: 'बीज को ट्राइकोडर्मा या फफूंदनाशक से उपचारित किया जा चुका है',
    checkBbfMachine: 'जलभराव रोकने के लिए बीबीएफ (BBF) या मेड़-नाली की तैयारी है',
    checkFarmPond: 'सूखा पड़ने की स्थिति में खेत के तालाब या ड्रिप सिंचाई की तैयारी है',
    readinessReady: 'बुवाई के लिए खेत तैयार! एकदम अनुकूल मौसम',
    readinessWait: 'तैयारी अधूरी — नुकसान से बचने के लिए बची हुई तैयारियां पूरी करें',

    farmerVillageSelect: 'प्रखंड/गांव चुनें:',
    farmerCropSelect: 'फसल चुनें:',
    farmerTrafficTitle: 'ट्रैफिक लाइट कृषि निर्णय',
    directActionTag: 'सीधी सलाह',
    farmerBreakRisk: 'सूखा जोखिम',
    farmerExpectedOnset: 'मानसून आगमन',
    farmerSoilMoisture: 'मिट्टी क्षमता',
    farmerVoiceBtn: '🔊 सीधे आवाज में सुनें (हिंदी सलाह)',
    farmerVoiceStop: '⏹️ आवाज रोकें',
    deliverySimulatorTitle: 'किसान मोबाइल संदेश प्रणाली',
    phoneNumberLabel: 'मोबाइल नंबर:',
    sendBroadcastBtn: 'मोबाइल पर संदेश भेजकर देखें (Test SMS)',
    msgDeliveredSuccess: 'किसान के मोबाइल पर संदेश सफलतापूर्वक भेजा गया (+91 98220...)',
    acknowledgeAdvisory: 'सलाह प्राप्ति की पुष्टि करें',
    callKvkHelpline: 'केवीके किसान हेल्पलाइन (1800-180-1551)',

    kvkConsoleTitle: 'कृषि विज्ञान केंद्र (KVK) व विस्तार अधिकारी डैशबोर्ड',
    kvkConsoleSubtitle: 'ज़िला स्तरीय ब्लॉक संवेदनशीलता मूल्यांकन एवं स्वचालित किसान संदेश प्रसारण',
    exportBulletinPdf: 'आधिकारिक कृषि बुलेटिन (PDF)',
    totalBlocksCard: 'कुल कृषि ब्लॉक',
    highBreakRiskCard: 'उच्च सूखा जोखिम वाले ब्लॉक',
    delayedOnsetCard: 'देरी से मानसून वाले ब्लॉक (>४ दिन)',
    registeredFarmersCard: 'पंजीकृत किसान',
    vulnerabilityMatrixTitle: 'ब्लॉक जोखिम व संवेदनशीलता मैट्रिक्स',
    sortByBreakRisk: 'सूखा जोखिम',
    sortByOnsetDelay: 'मानसून देरी',
    sortByDeficit: 'नमी की कमी',
    sortByName: 'ब्लॉक नाम',
    blockCol: 'ब्लॉक / तहसील',
    onsetShiftCol: 'आगमन विचलन',
    breakRiskCol: 'सूखा जोखिम (%)',
    soilDeficitCol: 'नमी कमी',
    verdictCol: 'कृषि सलाह / निर्णय',
    broadcastToolTitle: 'स्वचालित संदेश प्रसारण इंजन',
    selectHighRiskOnlyBtn: 'केवल जोखिम वाले ब्लॉक चुनें',
    selectAllBlocksBtn: 'सभी ब्लॉक चुनें',
    sendBulkDispatchBtn: 'चयनित ब्लॉक के सभी किसानों को संदेश भेजें',
    broadcastDispatchedSuccess: 'किसान एसएमएस गेटवे द्वारा ४६,८५० किसानों को संदेश भेजा गया',
    smsPreviewTab: 'एसएमएस (१६० वर्ण)',
    whatsappPreviewTab: 'व्हाट्सएप जानकारी'
  }
};

// Combine Base Translations (en, mr, hi) with Regional Indian Languages
const ALL_TRANSLATIONS: Record<string, AppTranslations> = { ...BASE_TRANSLATIONS };

Object.entries(REGIONAL_TRANSLATIONS).forEach(([code, partialTrans]) => {
  ALL_TRANSLATIONS[code] = {
    ...BASE_TRANSLATIONS.en,
    ...partialTrans
  };
});

// Resilient Proxy: Accessing any language code will always yield a full valid AppTranslations
export const TRANSLATIONS: Record<string, AppTranslations> = new Proxy(ALL_TRANSLATIONS, {
  get: (target: Record<string, AppTranslations>, prop: string) => {
    if (prop in target) {
      return target[prop];
    }
    return target['en'];
  }
});

export function getTranslations(lang: Language): AppTranslations {
  return TRANSLATIONS[lang] || TRANSLATIONS['en'];
}

// Localized State Names with multi-language coverage
export const LOCALIZED_STATES: Record<string, Record<string, string>> = {
  'Maharashtra': { en: 'Maharashtra', mr: 'महाराष्ट्र', hi: 'महाराष्ट्र', te: 'మహారాష్ట్ర', kn: 'ಮಹಾರಾಷ್ಟ್ರ', gu: 'મહારાષ્ટ્ર', ta: 'மகாராஷ்டிரா', bn: 'মহারাষ্ট্র', pa: 'ਮਹਾਰਾਸ਼ਟਰ', or: 'ମହାରାଷ୍ଟ୍ର', ml: 'മഹാരാഷ്ട്ര', ur: 'مہاراشٹر' },
  'Telangana': { en: 'Telangana', mr: 'तेलंगणा', hi: 'तेलंगाना', te: 'తెలంగాణ', kn: 'ತೆಲಂಗಾಣ', gu: 'તેલંગાણા', ta: 'தெலுங்கானா', bn: 'তেলেঙ্গানা', pa: 'ਤੇਲੰਗਾਨਾ', or: 'ତେଲେଙ୍ଗାନା', ml: 'തെലങ്കാന', ur: 'تلنگانہ' },
  'Andhra Pradesh': { en: 'Andhra Pradesh', mr: 'आंध्र प्रदेश', hi: 'आंध्र प्रदेश', te: 'ఆంధ్రప్రదేశ్', kn: 'ಆಂಧ್ರಪ್ರದೇಶ', gu: 'આંધ્ર પ્રદેશ', ta: 'ஆந்திரப் பிரதேசம்', bn: 'অন্ধ্রপ্রদেশ', pa: 'ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼', or: 'ଆନ୍ଧ୍ରପ୍ରଦେଶ', ml: 'ആന്ധ്രാപ്രദേശ്', ur: 'آندھرا پردیش' },
  'Madhya Pradesh': { en: 'Madhya Pradesh', mr: 'मध्य प्रदेश', hi: 'मध्य प्रदेश', te: 'మధ్యప్రదేశ్', kn: 'ಮಧ್ಯಪ್ರದೇಶ', gu: 'મધ્ય પ્રદેશ', ta: 'மத்தியப் பிரதேசம்', bn: 'মধ্যপ্রদেশ', pa: 'ਮੱਧ ਪ੍ਰਦੇਸ਼', or: 'ମଧ୍ୟପ୍ରଦେଶ', ml: 'മധ്യപ്രദേശ്', ur: 'مدھیہ پردیش' },
  'Karnataka': { en: 'Karnataka', mr: 'कर्नाटक', hi: 'कर्नाटक', te: 'కర్ణాటక', kn: 'ಕರ್ನಾಟಕ', gu: 'કર્ણાટક', ta: 'கர்நாடகா', bn: 'কর্ণাটক', pa: 'ਕਰਨਾਟਕ', or: 'କର୍ଣ୍ଣାଟକ', ml: 'കർണാടക', ur: 'کرناٹک' },
  'Gujarat': { en: 'Gujarat', mr: 'गुजरात', hi: 'गुजरात', te: 'గుజరాత్', kn: 'ಗುಜರಾತ್', gu: 'ગુજરાત', ta: 'குஜராத்', bn: 'গুজরাত', pa: 'ਗੁਜਰਾਤ', or: 'ଗୁଜରାଟ', ml: 'ഗുജറാത്ത്', ur: 'گجرات' },
  'Rajasthan': { en: 'Rajasthan', mr: 'राजस्थान', hi: 'राजस्थान', te: 'రాజస్థాన్', kn: 'ರಾಜಸ್ಥಾನ', gu: 'રાજસ્થાન', ta: 'ராஜஸ்தான்', bn: 'রাজস্থান', pa: 'ਰਾਜਸਥਾਨ', or: 'ରାଜସ୍ଥାନ', ml: 'രാജസ്ഥാൻ', ur: 'راجستھان' },
  'Punjab': { en: 'Punjab', mr: 'पंजाब', hi: 'पंजाब', te: 'పంజాబ్', kn: 'ಪಂಜಾಬ್', gu: 'પંજાબ', ta: 'பஞ்சாப்', bn: 'পাঞ্জাব', pa: 'ਪੰਜਾਬ', or: 'ପଞ୍ଜାବ', ml: 'പഞ്ചാബ്', ur: 'پنجاب' },
  'Uttar Pradesh': { en: 'Uttar Pradesh', mr: 'उत्तर प्रदेश', hi: 'उत्तर प्रदेश', te: 'ఉత్తరప్రదేశ్', kn: 'ಉತ್ತರಪ್ರದೇಶ', gu: 'ઉત્તર પ્રદેશ', ta: 'உத்தரப் பிரதேசம்', bn: 'উত্তরপ্রদেশ', pa: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼', or: 'ଉତ୍ତରପ୍ରଦେଶ', ml: 'ഉത്തർപ്രദേശ്', ur: 'اتر پردیش' }
};

// Localized District Names with multi-language fallback
export const LOCALIZED_DISTRICTS: Record<string, Record<string, string>> = {
  'nashik': { en: 'Nashik', mr: 'नाशिक', hi: 'नासिक', te: 'నాసిక్', kn: 'ನಾಸಿಕ್', gu: 'નાસિક', ta: 'நாசிக்', bn: 'নাসিক', pa: 'ਨਾਸਿਕ' },
  'ahmednagar': { en: 'Ahmednagar', mr: 'अहमदनगर', hi: 'अहमदनगर', te: 'అహ్మద్‌నగర్', kn: 'ಅಹ್ಮದ್‌ನಗರ', gu: 'અહમદનગર', ta: 'அகமதுநகர்', bn: 'আহমেদনগর' },
  'yavatmal': { en: 'Yavatmal', mr: 'यवतमाळ', hi: 'यवतमाल', te: 'యవత్మాల్', kn: 'ಯವತ್ಮಾಲ್', gu: 'યવતમાળ', ta: 'யவத்மால்', bn: 'ইয়াভাতমাল' },
  'latur': { en: 'Latur', mr: 'लातूर', hi: 'लातूर', te: 'లాతూర్', kn: 'ಲಾತೂರ್', gu: 'લાતુર', ta: 'லாதூர்', bn: 'লাতুর' },
  'solapur': { en: 'Solapur', mr: 'सोलापूर', hi: 'सोलापुर', te: 'సోలాపూర్', kn: 'ಸೋಲಾಪುರ', gu: 'સોલાપુર', ta: 'சோலாப்பூர்', bn: 'সোলাপুর' },
  'warangal': { en: 'Warangal', mr: 'वारंगल', hi: 'वारंगल', te: 'వరంగల్', kn: 'ವರಂಗಲ್', gu: 'વારંગલ', ta: 'வாரங்கல்', bn: 'ওয়ারাঙ্গল' },
  'nalgonda': { en: 'Nalgonda', mr: 'नलगोंडा', hi: 'नलगोंडा', te: 'నల్గొండ', kn: 'ನಲ್ಗೊಂಡ', gu: 'નલગોંડા', ta: 'நல்கொண்டா', bn: 'নালগোন্ডা' },
  'anantapur': { en: 'Anantapur', mr: 'अनंतपूर', hi: 'अनंतपुर', te: 'అనంతపురం', kn: 'ಅನಂತಪುರ', gu: 'અનંતપુર', ta: 'அனந்தபூர்', bn: 'অনন্তপুর' },
  'kurnool': { en: 'Kurnool', mr: 'कुर्नूल', hi: 'कुर्नूल', te: 'కర్నూలు', kn: 'ಕರ್ನೂಲ್', gu: 'કુર્નૂલ', ta: 'கர்னூல்', bn: 'কুর্নুল' },
  'ujjain': { en: 'Ujjain', mr: 'उज्जैन', hi: 'उज्जैन', te: 'ఉజ్జయిని', kn: 'ಉಜ್ಜಯಿನಿ', gu: 'ઉજ્જૈન', ta: 'உஜ்ஜைன்', bn: 'উজ্জয়িনী' },
  'khargone': { en: 'Khargone', mr: 'खरगोन', hi: 'खरगोन', te: 'ఖర్గోన్', kn: 'ಖರ್ಗೋನ್', gu: 'ખરગોન', ta: 'கார்கோன்', bn: 'খারগোন' },
  'dharwad': { en: 'Dharwad', mr: 'धारवाड', hi: 'धारवाड़', te: 'ధార్వాడ్', kn: 'ಧಾರವಾಡ', gu: 'ધારવાડ', ta: 'தார்வாಡ್', bn: 'ধারওয়াদ' },
  'belagavi': { en: 'Belagavi', mr: 'बेळगाव', hi: 'बेलगावी', te: 'బెళగావి', kn: 'ಬೆಳಗಾವಿ', gu: 'બેલગાવી', ta: 'பெலகாவி', bn: 'বেলাগাভি' },
  'rajkot': { en: 'Rajkot', mr: 'राजकोट', hi: 'राजकोट', te: 'రాజ్‌కోట్', kn: 'ರಾಜ್‌ಕೋಟ್', gu: 'રાજકોટ', ta: 'ராஜ்கோட்', bn: 'রাজকোট' },
  'amreli': { en: 'Amreli', mr: 'अमरेली', hi: 'अमरेली', te: 'అమ్రేలి', kn: 'ಅಮ್ರೇಲಿ', gu: 'અમરેલી', ta: 'அம்ரேலி', bn: 'আমরেলি' },
  'jodhpur': { en: 'Jodhpur', mr: 'जोधपूर', hi: 'जोधपुर', te: 'జోధ్‌పూర్', kn: 'ಜೋಧ್‌ಪುರ', gu: 'જોધપુર', ta: 'ஜோத்பூர்', bn: 'যোধপুর' },
  'nagaur': { en: 'Nagaur', mr: 'नागौर', hi: 'नागौर', te: 'నాగౌర్', kn: 'ನಾಗೌರ್', gu: 'નાગૌર', ta: 'நாகௌர்', bn: 'নাগৌর' },
  'ludhiana': { en: 'Ludhiana', mr: 'लुधियाना', hi: 'लुधियाना', te: 'లూధియానా', kn: 'ಲೂಧಿಯಾನ', gu: 'લુધિયાણા', ta: 'லூதியானா', bn: 'লুধিয়ানা', pa: 'ਲੁਧਿਆਣਾ' },
  'bathinda': { en: 'Bathinda', mr: 'भटिंडा', hi: 'बठिंडा', te: 'భటిండా', kn: 'ಭಟಿಂಡಾ', gu: 'ભટિંડા', ta: 'பதிண்டா', bn: 'ভাটিণ্ডা', pa: 'ਬਠਿੰਡਾ' },
  'varanasi': { en: 'Varanasi', mr: 'वाराणसी', hi: 'वाराणसी', te: 'వారణాసి', kn: 'ವಾರಣಾಸಿ', gu: 'વારાણસી', ta: 'வாரணாசி', bn: 'বারাণসী' },
  'aligarh': { en: 'Aligarh', mr: 'अलिगढ', hi: 'अलीगढ़', te: 'అలీఘర్', kn: 'ಅಲಿಗಢ್', gu: 'અલીગઢ', ta: 'அலிகார்', bn: 'আলীগড়' }
};
