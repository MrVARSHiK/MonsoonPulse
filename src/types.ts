/**
 * Core TypeScript definitions for MonsoonPulse
 * SIH Problem Statement 26086 (Ministry of Earth Sciences / NCMRWF)
 */

export type RiskMetricType = 'onset' | 'break' | 'heavyRain' | 'moistureDeficit';
export type ForecastHorizon = 1 | 2 | 3 | 4; // Weeks 1 to 4 (7, 14, 21, 28 days)
export type Language = 
  | 'en' // English
  | 'hi' // हिन्दी (Hindi)
  | 'mr' // मराठी (Marathi)
  | 'te' // తెలుగు (Telugu)
  | 'kn' // ಕನ್ನಡ (Kannada)
  | 'gu' // ગુજરાતી (Gujarati)
  | 'ta' // தமிழ் (Tamil)
  | 'bn' // বাংলা (Bengali)
  | 'pa' // ਪੰਜਾਬੀ (Punjabi)
  | 'or' // ଓଡ଼ିଆ (Odia)
  | 'ml' // മലയാളം (Malayalam)
  | 'ur' // اردو (Urdu)
  | 'as' // অসমীয়া (Assamese)
  | 'mr_local' // ग्रामीण मराठी (Desi Agri-Marathi)
  | string;

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  region: string;
  script: string;
  samplePhrase: string;
  isPopular?: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BlockInfo {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  districtId: string;
  districtName: string;
  state: string;
  coordinates: Coordinates;
  polygon: [number, number][]; // LatLng bounds for choropleth rendering
  climatology: {
    normalOnsetDate: string; // e.g., "June 10"
    normalOnsetDayOfYear: number; // e.g., 161 (June 10)
    stdDevDays: number; // e.g., 5.4 days
    annualRainfallMm: number; // e.g., 850 mm
    kharifRainfallMm: number; // e.g., 680 mm
    historicalBreakProbabilityPct: number; // historical baseline break prob
    soilType: string;
    soilTypeMr: string;
    soilTypeHi: string;
    dominantCrops: string[];
    waterHoldingCapacityMm: number; // mm in root zone (e.g. 150mm for Deep Vertisol)
  };
}

export interface DistrictInfo {
  id: string;
  name: string;
  state: string;
  region: string;
  blocks: string[]; // Block IDs
  description: string;
}

export interface ClimateIndices {
  nino34: number; // ENSO Niño 3.4 SST anomaly in °C (-3.0 to +3.0)
  iodDmi: number; // Indian Ocean Dipole Mode Index in °C (-1.5 to +1.5)
  mjoPhase: number; // 1 to 8
  mjoAmplitude: number; // 0.0 to 3.0 (RMM index)
  lljSpeedKnots: number; // 850 hPa Low Level Findlater Jet (15 to 45 knots)
  pwvMm: number; // Precipitable Water Vapor (30 to 75 mm)
}

export interface HistoricalScenario {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  description: string;
  indices: ClimateIndices;
  groundTruth: {
    actualOnsetDate: string;
    actualOnsetDayOfYear: number;
    delayDays: number;
    breakEventDescription: string;
    seasonRainfallPctOfLPA: number;
    cropImpactSummary: string;
  };
  keyTakeaway: string;
}

export interface ProbabilisticForecast {
  blockId: string;
  horizonWeeks: ForecastHorizon;
  
  // Onset predictions
  expectedOnsetDate: string;
  expectedOnsetDayOfYear: number;
  onsetProbabilityPct: number; // Probability onset has occurred by current date/window
  onsetDelayShiftDays: number; // +ve delayed, -ve advanced
  onsetConfidenceIntervalDays: number; // Uncertainty spread (+/- days)
  
  // Probability distributions for onset timeline
  onsetDistribution: {
    dayOffset: number; // relative to normal onset
    dateStr: string;
    probabilityDensity: number;
    cumulativeProbability: number;
  }[];

  // Break-monsoon spell risk (dry spell >= 5 days)
  breakRiskPct: number; // 0 - 100%
  breakRiskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  breakDurationExpectedDays: number;
  
  // Heavy rainfall risk (>65 mm/day)
  heavyRainRiskPct: number;
  heavyRainCategory: 'LOW' | 'MODERATE' | 'HIGH';
  
  // Moisture & rainfall projection
  projectedWeeklyRainfallMm: {
    p10: number; // 10th percentile (dry scenario)
    p50: number; // 50th percentile (median)
    p90: number; // 90th percentile (wet scenario)
  };
  soilMoistureDeficitPct: number; // 0 - 100%
  
  // Explainability factors
  teleconnectionDrivers: {
    factor: string;
    impact: string;
    weight: number; // -1 to +1
    direction: 'favorable' | 'unfavorable' | 'neutral';
  }[];
  modelConfidenceScorePct: number; // 100 - (horizon * 8 + |extreme_index| * 5)
}

export type CropId = 'cotton' | 'soybean' | 'tur' | 'bajra' | 'maize' | 'groundnut' | 'onion' | 'paddy';

export type CropGrowthStage = 
  | 'pre_sowing'
  | 'sowing_window'
  | 'germination'
  | 'vegetative'
  | 'flowering_podding';

export interface CropInfo {
  id: CropId;
  name: string;
  nameMr: string;
  nameHi: string;
  scientificName: string;
  minSoilMoistureThresholdMm: number; // mm required before sowing
  consecutiveDryDaysSensitivity: number; // days of dry spell that cause crop damage at germination
  sowingWindowStart: string; // "June 10"
  sowingWindowEnd: string; // "July 05"
  droughtTolerance: 'Low' | 'Moderate' | 'High';
  waterloggingTolerance: 'Low' | 'Moderate' | 'High';
  idealSoil: string;
}

export interface AgronomicAdvisory {
  cropId: CropId;
  cropName: string;
  blockId: string;
  blockName: string;
  verdictCode: 'PROCEED' | 'CAUTION_IRRIGATE' | 'DELAY_SOWING' | 'PROTECT_DRAIN';
  trafficColor: 'green' | 'yellow' | 'red' | 'amber';
  headline: {
    en: string;
    mr: string;
    hi: string;
    [key: string]: string;
  };
  simpleSentences: {
    todayAdvice: { en: string; mr: string; hi: string; [key: string]: string };
    waterAdvice: { en: string; mr: string; hi: string; [key: string]: string };
    seedAdvice: { en: string; mr: string; hi: string; [key: string]: string };
    sowingRule: { en: string; mr: string; hi: string; [key: string]: string };
  };
  reasoningChain: {
    step: number;
    title: string;
    detail: string;
    titleMr?: string;
    detailMr?: string;
    titleHi?: string;
    detailHi?: string;
    [key: string]: string | number | undefined;
  }[];
  actionPlan: {
    sowingRecommendation: string;
    soilAndWaterIntervention: string;
    pestDiseaseAlert: string;
    resowingContingency: string;
    sowingRecommendationMr?: string;
    soilAndWaterInterventionMr?: string;
    pestDiseaseAlertMr?: string;
    resowingContingencyMr?: string;
    sowingRecommendationHi?: string;
    soilAndWaterInterventionHi?: string;
    pestDiseaseAlertHi?: string;
    resowingContingencyHi?: string;
    [key: string]: string | undefined;
  };
  smsPayload: {
    en: string;
    mr: string;
    hi: string;
    charCountEn: number;
    charCountMr: number;
    [key: string]: string | number;
  };
  whatsappPayload: {
    en: string;
    mr: string;
    hi: string;
    [key: string]: string;
  };
}

export type UserRole = 'farmer' | 'officer' | 'scientist' | 'general';

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  picture: string;
  role: UserRole;
  state?: string;
  districtId?: string;
  token?: string;
  authProvider: 'google' | 'phone';
  loginTime: string;
  preferredLanguage?: Language; // Customized language setting for farmers & users
  phone?: string; // Registered mobile number for SMS & WhatsApp bulletins (farmers)
}

export interface BroadcastSummary {
  id: string;
  timestamp: string;
  districtId: string;
  recipientCount: number;
  languageBreakdown: { en: number; mr: number; hi: number };
  targetBlocks: string[];
  alertLevel: 'HIGH_ALERT' | 'ADVISORY' | 'NORMAL';
  smsDelivered: boolean;
  whatsappDelivered: boolean;
}
