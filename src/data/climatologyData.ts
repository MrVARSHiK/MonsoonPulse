import { BlockInfo, DistrictInfo, CropInfo } from '../types';

export const STATES = [
  'Maharashtra',
  'Telangana',
  'Andhra Pradesh',
  'Madhya Pradesh',
  'Karnataka',
  'Gujarat',
  'Rajasthan',
  'Punjab',
  'Uttar Pradesh'
];

export const DISTRICTS: DistrictInfo[] = [
  // --- MAHARASHTRA ---
  {
    id: 'nashik',
    name: 'Nashik',
    state: 'Maharashtra',
    region: 'North Maharashtra (Khandesh/Ghats)',
    blocks: ['nashik_haveli', 'niphad', 'dindori', 'sinnar', 'yeola', 'malegaon', 'kalwan'],
    description: 'Western Ghats transition to dry plateau. High microclimate gradient from humid Dindori to semi-arid Yeola.'
  },
  {
    id: 'ahmednagar',
    name: 'Ahmednagar',
    state: 'Maharashtra',
    region: 'Central Maharashtra (Western Rain Shadow)',
    blocks: ['sangamner', 'rahata', 'shrirampur', 'shevgaon', 'parner', 'karjat'],
    description: 'Severe rain-shadow zone in the lee of Sahyadri ranges. Highly vulnerable to July-August break monsoon dry spells.'
  },
  {
    id: 'yavatmal',
    name: 'Yavatmal',
    state: 'Maharashtra',
    region: 'Vidarbha (Cotton-Soybean Heartland)',
    blocks: ['yavatmal_sadar', 'pusad', 'darwha', 'umarkhed', 'kelapur', 'wani'],
    description: 'Premier Kharif rainfed black cotton soil (Vertisols) belt. Extreme sensitivity to false onset and prolonged dry spells.'
  },
  {
    id: 'latur',
    name: 'Latur',
    state: 'Maharashtra',
    region: 'Marathwada (Soybean & Pulses Bowl)',
    blocks: ['latur_sadar', 'ausa', 'nilanga', 'udgir', 'renapur'],
    description: 'Drought-prone Marathwada plateau with high dependency on Kharif pulses and soybean in deep to medium Vertisols.'
  },
  {
    id: 'solapur',
    name: 'Solapur',
    state: 'Maharashtra',
    region: 'Southern Maharashtra (Scarcity Zone)',
    blocks: ['solapur_north', 'pandharpur', 'barshi', 'malshiras'],
    description: 'Core rain shadow scarcity zone with shallow calcareous soils, suited for drought-hardy millets, pulses, and pomegranate.'
  },

  // --- TELANGANA ---
  {
    id: 'warangal',
    name: 'Warangal',
    state: 'Telangana',
    region: 'North Telangana (Cotton-Chilli Belt)',
    blocks: ['warangal_urban', 'narsampet', 'parkal', 'wardhannapet'],
    description: 'Red sandy loam and black cotton soil transition. Highly intensive cotton, chilli, and maize cultivation dependent on SW monsoon bursts.'
  },
  {
    id: 'nalgonda',
    name: 'Nalgonda',
    state: 'Telangana',
    region: 'South Telangana (Semi-Arid Basin)',
    blocks: ['nalgonda_sadar', 'miryalaguda', 'devarakonda', 'nakrekal'],
    description: 'Granitic red chalkas and mixed red loams. Prone to dry spells in July during early vegetative growth stages.'
  },
  {
    id: 'nizamabad',
    name: 'Nizamabad',
    state: 'Telangana',
    region: 'Godavari Basin (Paddy & Soybean)',
    blocks: ['nizamabad_north', 'bodhan', 'armoor', 'banswada'],
    description: 'Fertile Godavari basin with intensive paddy and soybean cultivation requiring precise monsoon onset tracking.'
  },

  // --- ANDHRA PRADESH ---
  {
    id: 'anantapur',
    name: 'Anantapur',
    state: 'Andhra Pradesh',
    region: 'Rayalaseema (Arid Groundnut Basin)',
    blocks: ['anantapur_sadar', 'dharmavaram', 'kadiri', 'guntakal'],
    description: 'Lowest rainfall district in South India after Jaisalmer. Extremely high vulnerability to prolonged dry spells during groundnut pod filling.'
  },
  {
    id: 'kurnool',
    name: 'Kurnool',
    state: 'Andhra Pradesh',
    region: 'Rayalaseema (Tungabhadra Basin)',
    blocks: ['kurnool_sadar', 'nandyal', 'adoni', 'dhone'],
    description: 'Black cotton soil plains supporting cotton, pulses, and sunflower. Crucial monsoon timing for rainfed sowing.'
  },
  {
    id: 'guntur',
    name: 'Guntur',
    state: 'Andhra Pradesh',
    region: 'Coastal Andhra (Delta Plains)',
    blocks: ['guntur_sadar', 'tenali', 'narasaraopet', 'sattenapalle'],
    description: 'Rich deltaic alluvial soils with heavy cotton, chilli, and paddy acreage prone to early season flash floods and subsequent moisture deficits.'
  },

  // --- MADHYA PRADESH ---
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    region: 'Malwa Plateau (Soybean Heartland)',
    blocks: ['indore_sadar', 'depalpur', 'mhow', 'sanwer'],
    description: 'High-elevation Malwa black soils. India’s premier soybean and maize belt with high sensitivity to June onset delays.'
  },
  {
    id: 'ujjain',
    name: 'Ujjain',
    state: 'Madhya Pradesh',
    region: 'Malwa Plateau (Central)',
    blocks: ['ujjain_sadar', 'nagda', 'mahidpur', 'tarana'],
    description: 'Deep fertile black soil plain cultivating soybean, gram, and pulses under Kharif rainfed regimes.'
  },
  {
    id: 'hoshangabad',
    name: 'Narmadapuram (Hoshangabad)',
    state: 'Madhya Pradesh',
    region: 'Narmada Valley (Alluvial Clay)',
    blocks: ['hoshangabad_sadar', 'itarsi', 'pipariya', 'seoni_malwa'],
    description: 'Heavy clay alluvial soils along the Narmada river valley with major Kharif paddy and soybean production.'
  },

  // --- KARNATAKA ---
  {
    id: 'dharwad',
    name: 'Dharwad',
    state: 'Karnataka',
    region: 'Northern Transitional Zone',
    blocks: ['dharwad_sadar', 'hubballi', 'kalghatgi', 'kundgol'],
    description: 'Bimodal rainfall transition zone. Early onset rains vital for cotton, soybean, and groundnut sowing.'
  },
  {
    id: 'belagavi',
    name: 'Belagavi',
    state: 'Karnataka',
    region: 'North Interior Karnataka (Ghats Transition)',
    blocks: ['belagavi_sadar', 'gokak', 'chikodi', 'bailhongal'],
    description: 'Extensive microclimate variation from wet western taluks to dry eastern rain-shadow belts.'
  },
  {
    id: 'kalaburagi',
    name: 'Kalaburagi (Gulbarga)',
    state: 'Karnataka',
    region: 'Hyderabad-Karnataka (Tur / Pulse Bowl)',
    blocks: ['kalaburagi_sadar', 'aland', 'afzalpur', 'sedam'],
    description: 'Deep black Vertisols dedicated to India’s largest pigeon pea (Tur) production, vulnerable to false onsets.'
  },

  // --- GUJARAT ---
  {
    id: 'rajkot',
    name: 'Rajkot',
    state: 'Gujarat',
    region: 'Saurashtra (Groundnut & Cotton)',
    blocks: ['rajkot_sadar', 'gondal', 'jasdan', 'jetpur'],
    description: 'Semi-arid Saurashtra plateau with shallow to medium black soils, heavily dependent on Arabian Sea monsoon dynamics.'
  },
  {
    id: 'amreli',
    name: 'Amreli',
    state: 'Gujarat',
    region: 'South Saurashtra',
    blocks: ['amreli_sadar', 'dhari', 'savarkundla', 'babra'],
    description: 'Rainfed groundnut and Bt cotton zone with frequent July dry spells requiring supplemental irrigation planning.'
  },

  // --- RAJASTHAN ---
  {
    id: 'kota',
    name: 'Kota',
    state: 'Rajasthan',
    region: 'Hadoti Region (Chambal Basin)',
    blocks: ['kota_sadar', 'ladpura', 'sangod', 'ramganj_mandi'],
    description: 'Fertile black soil plain in Chambal valley with high soybean, mustard, and paddy production.'
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    region: 'Marwar (Thar Desert Fringe)',
    blocks: ['jodhpur_sadar', 'bilara', 'osian', 'phalodi'],
    description: 'Arid sandy soils cultivating drought-hardy pearl millet (Bajra), guar, and moth bean under short monsoon windows.'
  },

  // --- PUNJAB ---
  {
    id: 'ludhiana',
    name: 'Ludhiana',
    state: 'Punjab',
    region: 'Central Alluvial Plain',
    blocks: ['ludhiana_sadar', 'jagraon', 'khanna', 'samrala'],
    description: 'Intensive agricultural hub with alluvial soils, highly sensitive to monsoon onset timing for paddy transplantation.'
  },

  // --- UTTAR PRADESH ---
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'Eastern Gangetic Plain',
    blocks: ['varanasi_sadar', 'pindra', 'rohaniya'],
    description: 'Deep alluvial Gangetic loam supporting rice-wheat, pulses, and vegetables with high monsoon dependence.'
  }
];

// Helper to make block bounding polygons around center
function createBlockPolygon(lat: number, lng: number, radiusLat = 0.08, radiusLng = 0.09, jitter = 0.015): [number, number][] {
  return [
    [lat + radiusLat + jitter, lng - radiusLng],
    [lat + radiusLat, lng + radiusLng + jitter],
    [lat - radiusLat + jitter, lng + radiusLng],
    [lat - radiusLat, lng - radiusLng + jitter],
    [lat + radiusLat + jitter, lng - radiusLng]
  ];
}

export const BLOCKS: Record<string, BlockInfo> = {
  // ================= MAHARASHTRA =================
  // --- NASHIK ---
  nashik_haveli: {
    id: 'nashik_haveli',
    name: 'Nashik Haveli',
    nameMr: 'नाशिक हवेली',
    nameHi: 'नासिक हवेली',
    districtId: 'nashik',
    districtName: 'Nashik',
    state: 'Maharashtra',
    coordinates: { lat: 20.00, lng: 73.78 },
    polygon: createBlockPolygon(20.00, 73.78, 0.08, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 09',
      normalOnsetDayOfYear: 160,
      stdDevDays: 5.2,
      annualRainfallMm: 812,
      kharifRainfallMm: 640,
      historicalBreakProbabilityPct: 24,
      soilType: 'Medium Black & Red Loam',
      soilTypeMr: 'मध्यम काळी व तांबडी जमीन',
      soilTypeHi: 'मध्यम काली और लाल मिट्टी',
      dominantCrops: ['Soybean', 'Kharif Onion', 'Vegetables', 'Paddy'],
      waterHoldingCapacityMm: 120
    }
  },
  niphad: {
    id: 'niphad',
    name: 'Niphad',
    nameMr: 'निफाड',
    nameHi: 'निफाड़',
    districtId: 'nashik',
    districtName: 'Nashik',
    state: 'Maharashtra',
    coordinates: { lat: 20.08, lng: 74.11 },
    polygon: createBlockPolygon(20.08, 74.11, 0.09, 0.10, 0.015),
    climatology: {
      normalOnsetDate: 'June 10',
      normalOnsetDayOfYear: 161,
      stdDevDays: 5.6,
      annualRainfallMm: 620,
      kharifRainfallMm: 480,
      historicalBreakProbabilityPct: 32,
      soilType: 'Deep Alluvial Black Soil',
      soilTypeMr: 'खोल काळी पोयट्याची जमीन',
      soilTypeHi: 'गहरी जलोढ़ काली मिट्टी',
      dominantCrops: ['Kharif Onion', 'Soybean', 'Maize', 'Sugarcane'],
      waterHoldingCapacityMm: 160
    }
  },
  dindori: {
    id: 'dindori',
    name: 'Dindori',
    nameMr: 'दिंडोरी',
    nameHi: 'डिंडोरी',
    districtId: 'nashik',
    districtName: 'Nashik',
    state: 'Maharashtra',
    coordinates: { lat: 20.20, lng: 73.83 },
    polygon: createBlockPolygon(20.20, 73.83, 0.09, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 08',
      normalOnsetDayOfYear: 159,
      stdDevDays: 4.8,
      annualRainfallMm: 980,
      kharifRainfallMm: 820,
      historicalBreakProbabilityPct: 18,
      soilType: 'Coarse Red Lateritic & Forest Loam',
      soilTypeMr: 'तांबडी जांभी व डोंगराळ जमीन',
      soilTypeHi: 'लाल लैटराइट और पहाड़ी मिट्टी',
      dominantCrops: ['Paddy', 'Soybean', 'Kharif Vegetables', 'Nagali/Finger Millet'],
      waterHoldingCapacityMm: 95
    }
  },
  sinnar: {
    id: 'sinnar',
    name: 'Sinnar',
    nameMr: 'सिन्नर',
    nameHi: 'सिन्नर',
    districtId: 'nashik',
    districtName: 'Nashik',
    state: 'Maharashtra',
    coordinates: { lat: 19.85, lng: 74.00 },
    polygon: createBlockPolygon(19.85, 74.00, 0.10, 0.11, 0.02),
    climatology: {
      normalOnsetDate: 'June 11',
      normalOnsetDayOfYear: 162,
      stdDevDays: 6.1,
      annualRainfallMm: 530,
      kharifRainfallMm: 390,
      historicalBreakProbabilityPct: 41,
      soilType: 'Shallow to Medium Gravelly Soil',
      soilTypeMr: 'हलकी मुरमाड व मध्यम जमीन',
      soilTypeHi: 'उथली पथरीली और मध्यम मिट्टी',
      dominantCrops: ['Pearl Millet (Bajra)', 'Soybean', 'Groundnut', 'Kharif Onion'],
      waterHoldingCapacityMm: 85
    }
  },
  yeola: {
    id: 'yeola',
    name: 'Yeola',
    nameMr: 'येवला',
    nameHi: 'येवला',
    districtId: 'nashik',
    districtName: 'Nashik',
    state: 'Maharashtra',
    coordinates: { lat: 20.04, lng: 74.48 },
    polygon: createBlockPolygon(20.04, 74.48, 0.09, 0.10, -0.015),
    climatology: {
      normalOnsetDate: 'June 12',
      normalOnsetDayOfYear: 163,
      stdDevDays: 6.4,
      annualRainfallMm: 510,
      kharifRainfallMm: 380,
      historicalBreakProbabilityPct: 44,
      soilType: 'Medium Black to Light Loam',
      soilTypeMr: 'मध्यम काळी व हलकी जमीन',
      soilTypeHi: 'मध्यम काली और हल्की दोमट',
      dominantCrops: ['Maize', 'Cotton', 'Bajra', 'Kharif Onion'],
      waterHoldingCapacityMm: 110
    }
  },
  malegaon: {
    id: 'malegaon',
    name: 'Malegaon',
    nameMr: 'मालेगाव',
    nameHi: 'मालेगांव',
    districtId: 'nashik',
    districtName: 'Nashik',
    state: 'Maharashtra',
    coordinates: { lat: 20.55, lng: 74.52 },
    polygon: createBlockPolygon(20.55, 74.52, 0.11, 0.12, 0.01),
    climatology: {
      normalOnsetDate: 'June 12',
      normalOnsetDayOfYear: 163,
      stdDevDays: 6.2,
      annualRainfallMm: 560,
      kharifRainfallMm: 420,
      historicalBreakProbabilityPct: 38,
      soilType: 'Medium to Deep Vertisols',
      soilTypeMr: 'मध्यम ते भारी काळी जमीन',
      soilTypeHi: 'मध्यम से भारी काली मिट्टी',
      dominantCrops: ['Cotton', 'Maize', 'Pearl Millet', 'Pigeon Pea (Tur)'],
      waterHoldingCapacityMm: 140
    }
  },
  kalwan: {
    id: 'kalwan',
    name: 'Kalwan',
    nameMr: 'कळवण',
    nameHi: 'कलवण',
    districtId: 'nashik',
    districtName: 'Nashik',
    state: 'Maharashtra',
    coordinates: { lat: 20.48, lng: 73.96 },
    polygon: createBlockPolygon(20.48, 73.96, 0.09, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 09',
      normalOnsetDayOfYear: 160,
      stdDevDays: 5.0,
      annualRainfallMm: 790,
      kharifRainfallMm: 630,
      historicalBreakProbabilityPct: 22,
      soilType: 'Red Loamy & Mixed Black Soil',
      soilTypeMr: 'तांबडी व मिश्र काळी जमीन',
      soilTypeHi: 'लाल दोमट और मिश्रित काली मिट्टी',
      dominantCrops: ['Kharif Onion', 'Maize', 'Soybean', 'Paddy'],
      waterHoldingCapacityMm: 115
    }
  },

  // --- AHMEDNAGAR ---
  sangamner: {
    id: 'sangamner',
    name: 'Sangamner',
    nameMr: 'संगमनेर',
    nameHi: 'संगमनेर',
    districtId: 'ahmednagar',
    districtName: 'Ahmednagar',
    state: 'Maharashtra',
    coordinates: { lat: 19.57, lng: 74.21 },
    polygon: createBlockPolygon(19.57, 74.21, 0.10, 0.11, 0.02),
    climatology: {
      normalOnsetDate: 'June 11',
      normalOnsetDayOfYear: 162,
      stdDevDays: 6.0,
      annualRainfallMm: 505,
      kharifRainfallMm: 360,
      historicalBreakProbabilityPct: 45,
      soilType: 'Medium Black & Calcareous Sandy Loam',
      soilTypeMr: 'मध्यम काळी व चुनखडीयुक्त जमीन',
      soilTypeHi: 'मध्यम काली और चूनायुक्त दोमट',
      dominantCrops: ['Pearl Millet (Bajra)', 'Soybean', 'Pigeon Pea', 'Pomegranate'],
      waterHoldingCapacityMm: 105
    }
  },
  rahata: {
    id: 'rahata',
    name: 'Rahata',
    nameMr: 'राहाता',
    nameHi: 'राहाता',
    districtId: 'ahmednagar',
    districtName: 'Ahmednagar',
    state: 'Maharashtra',
    coordinates: { lat: 19.68, lng: 74.49 },
    polygon: createBlockPolygon(19.68, 74.49, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 11',
      normalOnsetDayOfYear: 162,
      stdDevDays: 5.8,
      annualRainfallMm: 540,
      kharifRainfallMm: 395,
      historicalBreakProbabilityPct: 39,
      soilType: 'Deep Pravara Canal Vertisol',
      soilTypeMr: 'खोल भारी काळी जमीन',
      soilTypeHi: 'गहरी भारी काली मिट्टी',
      dominantCrops: ['Soybean', 'Cotton', 'Maize', 'Sugarcane'],
      waterHoldingCapacityMm: 155
    }
  },
  shrirampur: {
    id: 'shrirampur',
    name: 'Shrirampur',
    nameMr: 'श्रीरामपूर',
    nameHi: 'श्रीरामपुर',
    districtId: 'ahmednagar',
    districtName: 'Ahmednagar',
    state: 'Maharashtra',
    coordinates: { lat: 19.62, lng: 74.65 },
    polygon: createBlockPolygon(19.62, 74.65, 0.09, 0.10, 0.01),
    climatology: {
      normalOnsetDate: 'June 12',
      normalOnsetDayOfYear: 163,
      stdDevDays: 5.9,
      annualRainfallMm: 535,
      kharifRainfallMm: 390,
      historicalBreakProbabilityPct: 40,
      soilType: 'Deep Black Cotton Soil',
      soilTypeMr: 'खोल काळी कसदार जमीन',
      soilTypeHi: 'गहरी काली उपजाऊ मिट्टी',
      dominantCrops: ['Cotton', 'Soybean', 'Pigeon Pea (Tur)', 'Maize'],
      waterHoldingCapacityMm: 160
    }
  },
  shevgaon: {
    id: 'shevgaon',
    name: 'Shevgaon',
    nameMr: 'शेवगाव',
    nameHi: 'शेवगांव',
    districtId: 'ahmednagar',
    districtName: 'Ahmednagar',
    state: 'Maharashtra',
    coordinates: { lat: 19.34, lng: 75.29 },
    polygon: createBlockPolygon(19.34, 75.29, 0.11, 0.12, -0.015),
    climatology: {
      normalOnsetDate: 'June 13',
      normalOnsetDayOfYear: 164,
      stdDevDays: 6.8,
      annualRainfallMm: 480,
      kharifRainfallMm: 340,
      historicalBreakProbabilityPct: 49,
      soilType: 'Light to Medium Black Soil',
      soilTypeMr: 'हलकी ते मध्यम काळी जमीन',
      soilTypeHi: 'हल्की से मध्यम काली मिट्टी',
      dominantCrops: ['Cotton', 'Pearl Millet (Bajra)', 'Pigeon Pea', 'Moong/Urad'],
      waterHoldingCapacityMm: 110
    }
  },
  parner: {
    id: 'parner',
    name: 'Parner',
    nameMr: 'पारनेर',
    nameHi: 'पारनेर',
    districtId: 'ahmednagar',
    districtName: 'Ahmednagar',
    state: 'Maharashtra',
    coordinates: { lat: 19.00, lng: 74.43 },
    polygon: createBlockPolygon(19.00, 74.43, 0.12, 0.12, 0.02),
    climatology: {
      normalOnsetDate: 'June 10',
      normalOnsetDayOfYear: 161,
      stdDevDays: 6.5,
      annualRainfallMm: 460,
      kharifRainfallMm: 330,
      historicalBreakProbabilityPct: 52,
      soilType: 'Shallow Rocky to Murrum Soil',
      soilTypeMr: 'मुरमाड व हलकी खडकाळ जमीन',
      soilTypeHi: 'पथरीली और उथली मिट्टी',
      dominantCrops: ['Pearl Millet', 'Kharif Onion', 'Pulses (Tur, Moong)', 'Soybean'],
      waterHoldingCapacityMm: 80
    }
  },
  karjat: {
    id: 'karjat',
    name: 'Karjat (A.Nagar)',
    nameMr: 'कर्जत (अ.नगर)',
    nameHi: 'कर्जत (अ.नगर)',
    districtId: 'ahmednagar',
    districtName: 'Ahmednagar',
    state: 'Maharashtra',
    coordinates: { lat: 18.55, lng: 75.00 },
    polygon: createBlockPolygon(18.55, 75.00, 0.11, 0.12, -0.01),
    climatology: {
      normalOnsetDate: 'June 12',
      normalOnsetDayOfYear: 163,
      stdDevDays: 7.1,
      annualRainfallMm: 420,
      kharifRainfallMm: 290,
      historicalBreakProbabilityPct: 56,
      soilType: 'Drought Prone Medium Clay Loam',
      soilTypeMr: 'अवर्षणप्रवण हलकी ते मध्यम जमीन',
      soilTypeHi: 'सूखाग्रस्त हल्की दोमट मिट्टी',
      dominantCrops: ['Bajra', 'Pigeon Pea (Tur)', 'Sunflower', 'Green Gram (Moong)'],
      waterHoldingCapacityMm: 90
    }
  },

  // --- YAVATMAL ---
  yavatmal_sadar: {
    id: 'yavatmal_sadar',
    name: 'Yavatmal Sadar',
    nameMr: 'यवतमाळ सदर',
    nameHi: 'यवतमाल सदर',
    districtId: 'yavatmal',
    districtName: 'Yavatmal',
    state: 'Maharashtra',
    coordinates: { lat: 20.39, lng: 78.13 },
    polygon: createBlockPolygon(20.39, 78.13, 0.09, 0.10, 0.01),
    climatology: {
      normalOnsetDate: 'June 15',
      normalOnsetDayOfYear: 166,
      stdDevDays: 5.5,
      annualRainfallMm: 920,
      kharifRainfallMm: 790,
      historicalBreakProbabilityPct: 29,
      soilType: 'Heavy Deep Black Vertisol',
      soilTypeMr: 'खोल भारी काळी रेगुर जमीन',
      soilTypeHi: 'भारी गहरी काली रेगुर मिट्टी',
      dominantCrops: ['Cotton (Kapus)', 'Soybean', 'Pigeon Pea (Tur)', 'Maize'],
      waterHoldingCapacityMm: 175
    }
  },
  pusad: {
    id: 'pusad',
    name: 'Pusad',
    nameMr: 'पुसद',
    nameHi: 'पुसद',
    districtId: 'yavatmal',
    districtName: 'Yavatmal',
    state: 'Maharashtra',
    coordinates: { lat: 19.91, lng: 77.58 },
    polygon: createBlockPolygon(19.91, 77.58, 0.10, 0.11, -0.015),
    climatology: {
      normalOnsetDate: 'June 14',
      normalOnsetDayOfYear: 165,
      stdDevDays: 5.7,
      annualRainfallMm: 890,
      kharifRainfallMm: 750,
      historicalBreakProbabilityPct: 33,
      soilType: 'Medium to Heavy Black Soil',
      soilTypeMr: 'मध्यम ते भारी काळी जमीन',
      soilTypeHi: 'मध्यम से भारी काली मिट्टी',
      dominantCrops: ['Soybean', 'Cotton', 'Tur (Arhar)', 'Green Gram'],
      waterHoldingCapacityMm: 160
    }
  },
  darwha: {
    id: 'darwha',
    name: 'Darwha',
    nameMr: 'दारव्हा',
    nameHi: 'दारव्हा',
    districtId: 'yavatmal',
    districtName: 'Yavatmal',
    state: 'Maharashtra',
    coordinates: { lat: 20.31, lng: 77.77 },
    polygon: createBlockPolygon(20.31, 77.77, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 15',
      normalOnsetDayOfYear: 166,
      stdDevDays: 5.8,
      annualRainfallMm: 880,
      kharifRainfallMm: 740,
      historicalBreakProbabilityPct: 31,
      soilType: 'Rich Deep Vertisol',
      soilTypeMr: 'कसदार खोल काळी जमीन',
      soilTypeHi: 'उपजाऊ गहरी काली मिट्टी',
      dominantCrops: ['Cotton', 'Soybean', 'Tur', 'Jowar'],
      waterHoldingCapacityMm: 170
    }
  },
  umarkhed: {
    id: 'umarkhed',
    name: 'Umarkhed',
    nameMr: 'उमरखेड',
    nameHi: 'उमरखेड',
    districtId: 'yavatmal',
    districtName: 'Yavatmal',
    state: 'Maharashtra',
    coordinates: { lat: 19.60, lng: 77.70 },
    polygon: createBlockPolygon(19.60, 77.70, 0.10, 0.11, 0.02),
    climatology: {
      normalOnsetDate: 'June 13',
      normalOnsetDayOfYear: 164,
      stdDevDays: 6.2,
      annualRainfallMm: 850,
      kharifRainfallMm: 710,
      historicalBreakProbabilityPct: 36,
      soilType: 'Medium Black with Red Sandy Loam',
      soilTypeMr: 'मध्यम काळी व लाल रेताड जमीन',
      soilTypeHi: 'मध्यम काली और लाल बलुई दोमट',
      dominantCrops: ['Cotton', 'Soybean', 'Tur', 'Groundnut'],
      waterHoldingCapacityMm: 140
    }
  },
  kelapur: {
    id: 'kelapur',
    name: 'Kelapur (Pandharkawada)',
    nameMr: 'केळापूर (पांढरकवडा)',
    nameHi: 'केलापुर (पांढरकवड़ा)',
    districtId: 'yavatmal',
    districtName: 'Yavatmal',
    state: 'Maharashtra',
    coordinates: { lat: 20.01, lng: 78.53 },
    polygon: createBlockPolygon(20.01, 78.53, 0.11, 0.12, -0.01),
    climatology: {
      normalOnsetDate: 'June 16',
      normalOnsetDayOfYear: 167,
      stdDevDays: 5.4,
      annualRainfallMm: 980,
      kharifRainfallMm: 850,
      historicalBreakProbabilityPct: 26,
      soilType: 'Deep Clay Black Soil',
      soilTypeMr: 'खोल चिकणमाती काळी जमीन',
      soilTypeHi: 'गहरी चिकनी काली मिट्टी',
      dominantCrops: ['Cotton', 'Soybean', 'Pigeon Pea', 'Paddy'],
      waterHoldingCapacityMm: 180
    }
  },
  wani: {
    id: 'wani',
    name: 'Wani',
    nameMr: 'वणी',
    nameHi: 'वणी',
    districtId: 'yavatmal',
    districtName: 'Yavatmal',
    state: 'Maharashtra',
    coordinates: { lat: 20.06, lng: 78.95 },
    polygon: createBlockPolygon(20.06, 78.95, 0.10, 0.11, 0.015),
    climatology: {
      normalOnsetDate: 'June 17',
      normalOnsetDayOfYear: 168,
      stdDevDays: 5.6,
      annualRainfallMm: 990,
      kharifRainfallMm: 860,
      historicalBreakProbabilityPct: 25,
      soilType: 'Alluvial Wardha River Basin Vertisol',
      soilTypeMr: 'वर्धा नदी खोरे गाळाची काळी जमीन',
      soilTypeHi: 'वर्धा नदी घाटी जलोढ़ काली मिट्टी',
      dominantCrops: ['Cotton (Kapus)', 'Soybean', 'Pigeon Pea', 'Chilli'],
      waterHoldingCapacityMm: 185
    }
  },

  // --- LATUR ---
  latur_sadar: {
    id: 'latur_sadar',
    name: 'Latur Sadar',
    nameMr: 'लातूर सदर',
    nameHi: 'लातूर सदर',
    districtId: 'latur',
    districtName: 'Latur',
    state: 'Maharashtra',
    coordinates: { lat: 18.40, lng: 76.58 },
    polygon: createBlockPolygon(18.40, 76.58, 0.09, 0.10, 0.01),
    climatology: {
      normalOnsetDate: 'June 11',
      normalOnsetDayOfYear: 162,
      stdDevDays: 5.7,
      annualRainfallMm: 740,
      kharifRainfallMm: 590,
      historicalBreakProbabilityPct: 37,
      soilType: 'Medium Deep Black Clay',
      soilTypeMr: 'मध्यम खोल काळी जमीन',
      soilTypeHi: 'मध्यम गहरी काली मिट्टी',
      dominantCrops: ['Soybean', 'Pigeon Pea (Tur)', 'Urad', 'Cotton'],
      waterHoldingCapacityMm: 145
    }
  },
  ausa: {
    id: 'ausa',
    name: 'Ausa',
    nameMr: 'औसा',
    nameHi: 'औसा',
    districtId: 'latur',
    districtName: 'Latur',
    state: 'Maharashtra',
    coordinates: { lat: 18.25, lng: 76.50 },
    polygon: createBlockPolygon(18.25, 76.50, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 10',
      normalOnsetDayOfYear: 161,
      stdDevDays: 5.9,
      annualRainfallMm: 710,
      kharifRainfallMm: 560,
      historicalBreakProbabilityPct: 40,
      soilType: 'Shallow to Medium Vertisol',
      soilTypeMr: 'हलकी ते मध्यम काळी जमीन',
      soilTypeHi: 'हल्की से मध्यम काली मिट्टी',
      dominantCrops: ['Soybean', 'Tur', 'Moong', 'Bajra'],
      waterHoldingCapacityMm: 120
    }
  },
  nilanga: {
    id: 'nilanga',
    name: 'Nilanga',
    nameMr: 'निलंगा',
    nameHi: 'निलंगा',
    districtId: 'latur',
    districtName: 'Latur',
    state: 'Maharashtra',
    coordinates: { lat: 18.12, lng: 76.76 },
    polygon: createBlockPolygon(18.12, 76.76, 0.09, 0.10, 0.015),
    climatology: {
      normalOnsetDate: 'June 10',
      normalOnsetDayOfYear: 161,
      stdDevDays: 5.6,
      annualRainfallMm: 760,
      kharifRainfallMm: 610,
      historicalBreakProbabilityPct: 35,
      soilType: 'Deep Black Cotton Soil',
      soilTypeMr: 'खोल काळी कसदार जमीन',
      soilTypeHi: 'गहरी काली उपजाऊ मिट्टी',
      dominantCrops: ['Soybean', 'Cotton', 'Tur', 'Jowar'],
      waterHoldingCapacityMm: 160
    }
  },
  udgir: {
    id: 'udgir',
    name: 'Udgir',
    nameMr: 'उदगीर',
    nameHi: 'उदगीर',
    districtId: 'latur',
    districtName: 'Latur',
    state: 'Maharashtra',
    coordinates: { lat: 18.39, lng: 77.11 },
    polygon: createBlockPolygon(18.39, 77.11, 0.09, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 11',
      normalOnsetDayOfYear: 162,
      stdDevDays: 5.5,
      annualRainfallMm: 790,
      kharifRainfallMm: 640,
      historicalBreakProbabilityPct: 33,
      soilType: 'Rich Alluvial Black Soil',
      soilTypeMr: 'कसदार गाळाची काळी जमीन',
      soilTypeHi: 'उपजाऊ जलोढ़ काली मिट्टी',
      dominantCrops: ['Soybean', 'Tur', 'Cotton', 'Maize'],
      waterHoldingCapacityMm: 165
    }
  },
  renapur: {
    id: 'renapur',
    name: 'Renapur',
    nameMr: 'रेणापूर',
    nameHi: 'रेणापुर',
    districtId: 'latur',
    districtName: 'Latur',
    state: 'Maharashtra',
    coordinates: { lat: 18.53, lng: 76.68 },
    polygon: createBlockPolygon(18.53, 76.68, 0.08, 0.09, 0.02),
    climatology: {
      normalOnsetDate: 'June 11',
      normalOnsetDayOfYear: 162,
      stdDevDays: 5.8,
      annualRainfallMm: 730,
      kharifRainfallMm: 580,
      historicalBreakProbabilityPct: 38,
      soilType: 'Medium Black Loam',
      soilTypeMr: 'मध्यम काळी जमीन',
      soilTypeHi: 'मध्यम काली दोमट',
      dominantCrops: ['Soybean', 'Pigeon Pea', 'Groundnut', 'Sunflower'],
      waterHoldingCapacityMm: 130
    }
  },

  // --- SOLAPUR ---
  solapur_north: {
    id: 'solapur_north',
    name: 'North Solapur',
    nameMr: 'उत्तर सोलापूर',
    nameHi: 'उत्तर सोलापुर',
    districtId: 'solapur',
    districtName: 'Solapur',
    state: 'Maharashtra',
    coordinates: { lat: 17.68, lng: 75.91 },
    polygon: createBlockPolygon(17.68, 75.91, 0.09, 0.10, 0.01),
    climatology: {
      normalOnsetDate: 'June 09',
      normalOnsetDayOfYear: 160,
      stdDevDays: 6.8,
      annualRainfallMm: 520,
      kharifRainfallMm: 370,
      historicalBreakProbabilityPct: 48,
      soilType: 'Medium Calcareous Black Soil',
      soilTypeMr: 'मध्यम चुनखडीयुक्त काळी जमीन',
      soilTypeHi: 'मध्यम चूनायुक्त काली मिट्टी',
      dominantCrops: ['Pigeon Pea', 'Pearl Millet (Bajra)', 'Soybean', 'Sunflower'],
      waterHoldingCapacityMm: 110
    }
  },
  pandharpur: {
    id: 'pandharpur',
    name: 'Pandharpur',
    nameMr: 'पंढरपूर',
    nameHi: 'पंढरपुर',
    districtId: 'solapur',
    districtName: 'Solapur',
    state: 'Maharashtra',
    coordinates: { lat: 17.67, lng: 75.32 },
    polygon: createBlockPolygon(17.67, 75.32, 0.09, 0.10, -0.015),
    climatology: {
      normalOnsetDate: 'June 09',
      normalOnsetDayOfYear: 160,
      stdDevDays: 6.5,
      annualRainfallMm: 540,
      kharifRainfallMm: 390,
      historicalBreakProbabilityPct: 46,
      soilType: 'Bhima Basin Alluvial Vertisol',
      soilTypeMr: 'भीमा खोरे गाळाची काळी जमीन',
      soilTypeHi: 'भीमा घाटी जलोढ़ काली मिट्टी',
      dominantCrops: ['Sugarcane', 'Maize', 'Soybean', 'Pomegranate'],
      waterHoldingCapacityMm: 150
    }
  },
  barshi: {
    id: 'barshi',
    name: 'Barshi',
    nameMr: 'बार्शी',
    nameHi: 'बार्शी',
    districtId: 'solapur',
    districtName: 'Solapur',
    state: 'Maharashtra',
    coordinates: { lat: 18.23, lng: 75.69 },
    polygon: createBlockPolygon(18.23, 75.69, 0.10, 0.10, 0.01),
    climatology: {
      normalOnsetDate: 'June 10',
      normalOnsetDayOfYear: 161,
      stdDevDays: 6.3,
      annualRainfallMm: 580,
      kharifRainfallMm: 420,
      historicalBreakProbabilityPct: 42,
      soilType: 'Medium Black Soil',
      soilTypeMr: 'मध्यम काळी जमीन',
      soilTypeHi: 'मध्यम काली मिट्टी',
      dominantCrops: ['Tur (Arhar)', 'Soybean', 'Bajra', 'Kharif Onion'],
      waterHoldingCapacityMm: 125
    }
  },
  malshiras: {
    id: 'malshiras',
    name: 'Malshiras',
    nameMr: 'माळशिरस',
    nameHi: 'मालशिरस',
    districtId: 'solapur',
    districtName: 'Solapur',
    state: 'Maharashtra',
    coordinates: { lat: 17.85, lng: 74.90 },
    polygon: createBlockPolygon(17.85, 74.90, 0.09, 0.10, -0.01),
    climatology: {
      normalOnsetDate: 'June 09',
      normalOnsetDayOfYear: 160,
      stdDevDays: 6.9,
      annualRainfallMm: 460,
      kharifRainfallMm: 310,
      historicalBreakProbabilityPct: 54,
      soilType: 'Light Murrum & Shallow Black Soil',
      soilTypeMr: 'हलकी मुरमाड व उथळ काळी जमीन',
      soilTypeHi: 'हल्की पथरीली और उथली काली मिट्टी',
      dominantCrops: ['Pearl Millet', 'Pomegranate', 'Pulses', 'Maize'],
      waterHoldingCapacityMm: 85
    }
  },

  // ================= TELANGANA =================
  // --- WARANGAL ---
  warangal_urban: {
    id: 'warangal_urban',
    name: 'Warangal Sadar',
    nameMr: 'वारंगल सदर',
    nameHi: 'वारंगल सदर',
    districtId: 'warangal',
    districtName: 'Warangal',
    state: 'Telangana',
    coordinates: { lat: 17.97, lng: 79.59 },
    polygon: createBlockPolygon(17.97, 79.59, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 08',
      normalOnsetDayOfYear: 159,
      stdDevDays: 4.9,
      annualRainfallMm: 995,
      kharifRainfallMm: 820,
      historicalBreakProbabilityPct: 22,
      soilType: 'Red Sandy Loam (Chalka) & Black Soil',
      soilTypeMr: 'लाल वालुकामय व काळी जमीन',
      soilTypeHi: 'लाल बलुई दोमट और काली मिट्टी',
      dominantCrops: ['Bt Cotton', 'Chilli', 'Paddy', 'Maize'],
      waterHoldingCapacityMm: 135
    }
  },
  narsampet: {
    id: 'narsampet',
    name: 'Narsampet',
    nameMr: 'नारसमपेट',
    nameHi: 'नरसमपेट',
    districtId: 'warangal',
    districtName: 'Warangal',
    state: 'Telangana',
    coordinates: { lat: 17.92, lng: 79.89 },
    polygon: createBlockPolygon(17.92, 79.89, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 08',
      normalOnsetDayOfYear: 159,
      stdDevDays: 4.8,
      annualRainfallMm: 1040,
      kharifRainfallMm: 870,
      historicalBreakProbabilityPct: 20,
      soilType: 'Fertile Red Sandy Clay',
      soilTypeMr: 'सुपीक लाल चिकणमाती',
      soilTypeHi: 'उपजाऊ लाल चिकनी मिट्टी',
      dominantCrops: ['Paddy', 'Cotton', 'Chilli', 'Turmeric'],
      waterHoldingCapacityMm: 150
    }
  },
  parkal: {
    id: 'parkal',
    name: 'Parkal',
    nameMr: 'परकल',
    nameHi: 'परकाल',
    districtId: 'warangal',
    districtName: 'Warangal',
    state: 'Telangana',
    coordinates: { lat: 18.20, lng: 79.71 },
    polygon: createBlockPolygon(18.20, 79.71, 0.09, 0.10, 0.015),
    climatology: {
      normalOnsetDate: 'June 09',
      normalOnsetDayOfYear: 160,
      stdDevDays: 5.1,
      annualRainfallMm: 980,
      kharifRainfallMm: 810,
      historicalBreakProbabilityPct: 24,
      soilType: 'Deep Black Cotton Soil',
      soilTypeMr: 'खोल काळी जमीन',
      soilTypeHi: 'गहरी काली मिट्टी',
      dominantCrops: ['Cotton', 'Paddy', 'Pigeon Pea', 'Green Gram'],
      waterHoldingCapacityMm: 165
    }
  },
  wardhannapet: {
    id: 'wardhannapet',
    name: 'Wardhannapet',
    nameMr: 'वर्धनपेट',
    nameHi: 'वर्धनपेट',
    districtId: 'warangal',
    districtName: 'Warangal',
    state: 'Telangana',
    coordinates: { lat: 17.76, lng: 79.60 },
    polygon: createBlockPolygon(17.76, 79.60, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 08',
      normalOnsetDayOfYear: 159,
      stdDevDays: 5.0,
      annualRainfallMm: 920,
      kharifRainfallMm: 760,
      historicalBreakProbabilityPct: 27,
      soilType: 'Mixed Red & Black Loam',
      soilTypeMr: 'मिश्र लाल व काळी जमीन',
      soilTypeHi: 'मिश्रित लाल और काली दोमट',
      dominantCrops: ['Cotton', 'Maize', 'Chilli', 'Groundnut'],
      waterHoldingCapacityMm: 125
    }
  },

  // --- NALGONDA ---
  nalgonda_sadar: {
    id: 'nalgonda_sadar',
    name: 'Nalgonda Sadar',
    nameMr: 'नलगोंडा सदर',
    nameHi: 'नलगोंडा सदर',
    districtId: 'nalgonda',
    districtName: 'Nalgonda',
    state: 'Telangana',
    coordinates: { lat: 17.05, lng: 79.27 },
    polygon: createBlockPolygon(17.05, 79.27, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 07',
      normalOnsetDayOfYear: 158,
      stdDevDays: 5.3,
      annualRainfallMm: 750,
      kharifRainfallMm: 580,
      historicalBreakProbabilityPct: 36,
      soilType: 'Red Chalka & Granitic Soil',
      soilTypeMr: 'लाल खडकाळ जमीन',
      soilTypeHi: 'लाल बलुई पथरीली मिट्टी',
      dominantCrops: ['Cotton', 'Paddy', 'Sweet Orange', 'Pigeon Pea'],
      waterHoldingCapacityMm: 105
    }
  },
  miryalaguda: {
    id: 'miryalaguda',
    name: 'Miryalaguda',
    nameMr: 'मिर्यालगुडा',
    nameHi: 'मिर्यालगुड़ा',
    districtId: 'nalgonda',
    districtName: 'Nalgonda',
    state: 'Telangana',
    coordinates: { lat: 16.87, lng: 79.56 },
    polygon: createBlockPolygon(16.87, 79.56, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 06',
      normalOnsetDayOfYear: 157,
      stdDevDays: 5.1,
      annualRainfallMm: 810,
      kharifRainfallMm: 640,
      historicalBreakProbabilityPct: 30,
      soilType: 'Krishna Canal Heavy Alluvial Vertisol',
      soilTypeMr: 'कृष्णा कालवा सुपीक काळी जमीन',
      soilTypeHi: 'कृष्णा नहर उपजाऊ काली मिट्टी',
      dominantCrops: ['Paddy', 'Cotton', 'Green Gram', 'Sesame'],
      waterHoldingCapacityMm: 170
    }
  },
  devarakonda: {
    id: 'devarakonda',
    name: 'Devarakonda',
    nameMr: 'देवराकोंडा',
    nameHi: 'देवराकोंडा',
    districtId: 'nalgonda',
    districtName: 'Nalgonda',
    state: 'Telangana',
    coordinates: { lat: 16.69, lng: 78.92 },
    polygon: createBlockPolygon(16.69, 78.92, 0.10, 0.10, 0.015),
    climatology: {
      normalOnsetDate: 'June 07',
      normalOnsetDayOfYear: 158,
      stdDevDays: 5.8,
      annualRainfallMm: 660,
      kharifRainfallMm: 490,
      historicalBreakProbabilityPct: 44,
      soilType: 'Shallow Red Sandy Gravel',
      soilTypeMr: 'उथळ लाल रेताड जमीन',
      soilTypeHi: 'उथली लाल बलुई मिट्टी',
      dominantCrops: ['Pearl Millet (Bajra)', 'Cotton', 'Castor', 'Pigeon Pea'],
      waterHoldingCapacityMm: 85
    }
  },
  nakrekal: {
    id: 'nakrekal',
    name: 'Nakrekal',
    nameMr: 'नक्रेकल',
    nameHi: 'नक्रेकल',
    districtId: 'nalgonda',
    districtName: 'Nalgonda',
    state: 'Telangana',
    coordinates: { lat: 17.17, lng: 79.43 },
    polygon: createBlockPolygon(17.17, 79.43, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 08',
      normalOnsetDayOfYear: 159,
      stdDevDays: 5.2,
      annualRainfallMm: 780,
      kharifRainfallMm: 610,
      historicalBreakProbabilityPct: 33,
      soilType: 'Medium Black & Red Loam',
      soilTypeMr: 'मध्यम काळी व लाल जमीन',
      soilTypeHi: 'मध्यम काली और लाल मिट्टी',
      dominantCrops: ['Cotton', 'Paddy', 'Chilli', 'Pigeon Pea'],
      waterHoldingCapacityMm: 120
    }
  },

  // --- NIZAMABAD ---
  nizamabad_north: {
    id: 'nizamabad_north',
    name: 'Nizamabad Sadar',
    nameMr: 'निझामाबाद सदर',
    nameHi: 'निज़ामाबाद सदर',
    districtId: 'nizamabad',
    districtName: 'Nizamabad',
    state: 'Telangana',
    coordinates: { lat: 18.67, lng: 78.10 },
    polygon: createBlockPolygon(18.67, 78.10, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 10',
      normalOnsetDayOfYear: 161,
      stdDevDays: 4.8,
      annualRainfallMm: 1050,
      kharifRainfallMm: 890,
      historicalBreakProbabilityPct: 21,
      soilType: 'Deep Alluvial Black Clay',
      soilTypeMr: 'खोल गाळाची काळी चिकणमाती',
      soilTypeHi: 'गहरी जलोढ़ काली मिट्टी',
      dominantCrops: ['Soybean', 'Paddy', 'Turmeric', 'Maize'],
      waterHoldingCapacityMm: 175
    }
  },
  bodhan: {
    id: 'bodhan',
    name: 'Bodhan',
    nameMr: 'बोधन',
    nameHi: 'बोधन',
    districtId: 'nizamabad',
    districtName: 'Nizamabad',
    state: 'Telangana',
    coordinates: { lat: 18.66, lng: 77.88 },
    polygon: createBlockPolygon(18.66, 77.88, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 10',
      normalOnsetDayOfYear: 161,
      stdDevDays: 4.9,
      annualRainfallMm: 1080,
      kharifRainfallMm: 910,
      historicalBreakProbabilityPct: 19,
      soilType: 'Rich Godavari Basin Black Soil',
      soilTypeMr: 'गोदावरी खोरे कसदार काळी जमीन',
      soilTypeHi: 'गोदावरी घाटी उपजाऊ काली मिट्टी',
      dominantCrops: ['Sugarcane', 'Paddy', 'Soybean', 'Cotton'],
      waterHoldingCapacityMm: 180
    }
  },
  armoor: {
    id: 'armoor',
    name: 'Armoor',
    nameMr: 'आरमूर',
    nameHi: 'आरमूर',
    districtId: 'nizamabad',
    districtName: 'Nizamabad',
    state: 'Telangana',
    coordinates: { lat: 18.79, lng: 78.29 },
    polygon: createBlockPolygon(18.79, 78.29, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 11',
      normalOnsetDayOfYear: 162,
      stdDevDays: 5.0,
      annualRainfallMm: 1010,
      kharifRainfallMm: 850,
      historicalBreakProbabilityPct: 23,
      soilType: 'Red Sandy Loam to Black Loam',
      soilTypeMr: 'लाल रेताड ते काळी जमीन',
      soilTypeHi: 'लाल बलुई से काली दोमट',
      dominantCrops: ['Turmeric', 'Soybean', 'Maize', 'Paddy'],
      waterHoldingCapacityMm: 140
    }
  },
  banswada: {
    id: 'banswada',
    name: 'Banswada',
    nameMr: 'बांसवाडा',
    nameHi: 'बांसवाड़ा',
    districtId: 'nizamabad',
    districtName: 'Nizamabad',
    state: 'Telangana',
    coordinates: { lat: 18.38, lng: 77.88 },
    polygon: createBlockPolygon(18.38, 77.88, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 09',
      normalOnsetDayOfYear: 160,
      stdDevDays: 4.7,
      annualRainfallMm: 1060,
      kharifRainfallMm: 890,
      historicalBreakProbabilityPct: 20,
      soilType: 'Deep Irrigated Clay Loam',
      soilTypeMr: 'ओलिताखालील चिकणमाती',
      soilTypeHi: 'सिंचित चिकनी दोमट',
      dominantCrops: ['Paddy', 'Sugarcane', 'Soybean', 'Vegetables'],
      waterHoldingCapacityMm: 170
    }
  },

  // ================= ANDHRA PRADESH =================
  // --- ANANTAPUR ---
  anantapur_sadar: {
    id: 'anantapur_sadar',
    name: 'Anantapur Sadar',
    nameMr: 'अनंतपूर सदर',
    nameHi: 'अनंतपुर सदर',
    districtId: 'anantapur',
    districtName: 'Anantapur',
    state: 'Andhra Pradesh',
    coordinates: { lat: 14.68, lng: 77.60 },
    polygon: createBlockPolygon(14.68, 77.60, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 05',
      normalOnsetDayOfYear: 156,
      stdDevDays: 7.2,
      annualRainfallMm: 540,
      kharifRainfallMm: 330,
      historicalBreakProbabilityPct: 58,
      soilType: 'Red Sandy Loam (Alfisols)',
      soilTypeMr: 'लाल रेताड जमीन',
      soilTypeHi: 'लाल बलुई दोमट मिट्टी',
      dominantCrops: ['Groundnut (Bhuimug)', 'Pigeon Pea (Tur)', 'Pearl Millet', 'Castor'],
      waterHoldingCapacityMm: 75
    }
  },
  dharmavaram: {
    id: 'dharmavaram',
    name: 'Dharmavaram',
    nameMr: 'धर्मावरम',
    nameHi: 'धर्मावरम',
    districtId: 'anantapur',
    districtName: 'Anantapur',
    state: 'Andhra Pradesh',
    coordinates: { lat: 14.41, lng: 77.72 },
    polygon: createBlockPolygon(14.41, 77.72, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 05',
      normalOnsetDayOfYear: 156,
      stdDevDays: 7.0,
      annualRainfallMm: 520,
      kharifRainfallMm: 310,
      historicalBreakProbabilityPct: 60,
      soilType: 'Shallow Gravelly Red Soil',
      soilTypeMr: 'उथळ मुरमाड लाल जमीन',
      soilTypeHi: 'उथली पथरीली लाल मिट्टी',
      dominantCrops: ['Groundnut', 'Red Gram', 'Bajra', 'Millets'],
      waterHoldingCapacityMm: 70
    }
  },
  kadiri: {
    id: 'kadiri',
    name: 'Kadiri',
    nameMr: 'कादिरी',
    nameHi: 'कादिरी',
    districtId: 'anantapur',
    districtName: 'Anantapur',
    state: 'Andhra Pradesh',
    coordinates: { lat: 14.11, lng: 78.16 },
    polygon: createBlockPolygon(14.11, 78.16, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 04',
      normalOnsetDayOfYear: 155,
      stdDevDays: 6.8,
      annualRainfallMm: 610,
      kharifRainfallMm: 380,
      historicalBreakProbabilityPct: 50,
      soilType: 'Mixed Red and Black Soils',
      soilTypeMr: 'मिश्र लाल व काळी जमीन',
      soilTypeHi: 'मिश्रित लाल और काली मिट्टी',
      dominantCrops: ['Groundnut', 'Sunflower', 'Pigeon Pea', 'Cotton'],
      waterHoldingCapacityMm: 95
    }
  },
  guntakal: {
    id: 'guntakal',
    name: 'Guntakal',
    nameMr: 'गुंटकल',
    nameHi: 'गुंतकल',
    districtId: 'anantapur',
    districtName: 'Anantapur',
    state: 'Andhra Pradesh',
    coordinates: { lat: 15.17, lng: 77.38 },
    polygon: createBlockPolygon(15.17, 77.38, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 06',
      normalOnsetDayOfYear: 157,
      stdDevDays: 6.9,
      annualRainfallMm: 560,
      kharifRainfallMm: 350,
      historicalBreakProbabilityPct: 54,
      soilType: 'Medium Deep Black Vertisol',
      soilTypeMr: 'मध्यम खोल काळी जमीन',
      soilTypeHi: 'मध्यम गहरी काली मिट्टी',
      dominantCrops: ['Cotton', 'Groundnut', 'Bajra', 'Jowar'],
      waterHoldingCapacityMm: 130
    }
  },

  // --- KURNOOL ---
  kurnool_sadar: {
    id: 'kurnool_sadar',
    name: 'Kurnool Sadar',
    nameMr: 'कुर्नूल सदर',
    nameHi: 'कर्नूल सदर',
    districtId: 'kurnool',
    districtName: 'Kurnool',
    state: 'Andhra Pradesh',
    coordinates: { lat: 15.82, lng: 78.03 },
    polygon: createBlockPolygon(15.82, 78.03, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 06',
      normalOnsetDayOfYear: 157,
      stdDevDays: 6.2,
      annualRainfallMm: 670,
      kharifRainfallMm: 480,
      historicalBreakProbabilityPct: 42,
      soilType: 'Deep Vertisols & Black Loam',
      soilTypeMr: 'खोल काळी चिकणमाती',
      soilTypeHi: 'गहरी काली दोमट',
      dominantCrops: ['Cotton', 'Groundnut', 'Sunflower', 'Pigeon Pea'],
      waterHoldingCapacityMm: 150
    }
  },
  nandyal: {
    id: 'nandyal',
    name: 'Nandyal',
    nameMr: 'नांद्याल',
    nameHi: 'नांद्याल',
    districtId: 'kurnool',
    districtName: 'Kurnool',
    state: 'Andhra Pradesh',
    coordinates: { lat: 15.48, lng: 78.48 },
    polygon: createBlockPolygon(15.48, 78.48, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 05',
      normalOnsetDayOfYear: 156,
      stdDevDays: 5.9,
      annualRainfallMm: 740,
      kharifRainfallMm: 540,
      historicalBreakProbabilityPct: 37,
      soilType: 'Rich Alluvial Black Valley Soil',
      soilTypeMr: 'सुपीक गाळाची काळी जमीन',
      soilTypeHi: 'उपजाऊ जलोढ़ काली मिट्टी',
      dominantCrops: ['Paddy', 'Cotton', 'Bengal Gram', 'Maize'],
      waterHoldingCapacityMm: 170
    }
  },
  adoni: {
    id: 'adoni',
    name: 'Adoni',
    nameMr: 'अदोनी',
    nameHi: 'अदोनी',
    districtId: 'kurnool',
    districtName: 'Kurnool',
    state: 'Andhra Pradesh',
    coordinates: { lat: 15.63, lng: 77.27 },
    polygon: createBlockPolygon(15.63, 77.27, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 07',
      normalOnsetDayOfYear: 158,
      stdDevDays: 6.5,
      annualRainfallMm: 620,
      kharifRainfallMm: 430,
      historicalBreakProbabilityPct: 47,
      soilType: 'Heavy Black Cotton Soil',
      soilTypeMr: 'भारी काळी कापसाची जमीन',
      soilTypeHi: 'भारी काली कपास मिट्टी',
      dominantCrops: ['Bt Cotton', 'Groundnut', 'Jowar', 'Sunflower'],
      waterHoldingCapacityMm: 160
    }
  },
  dhone: {
    id: 'dhone',
    name: 'Dhone',
    nameMr: 'ढोण',
    nameHi: 'ढोन',
    districtId: 'kurnool',
    districtName: 'Kurnool',
    state: 'Andhra Pradesh',
    coordinates: { lat: 15.42, lng: 77.87 },
    polygon: createBlockPolygon(15.42, 77.87, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 06',
      normalOnsetDayOfYear: 157,
      stdDevDays: 6.3,
      annualRainfallMm: 640,
      kharifRainfallMm: 450,
      historicalBreakProbabilityPct: 45,
      soilType: 'Red Sandy Loam with Limestone Boulders',
      soilTypeMr: 'लाल चुनखडीयुक्त जमीन',
      soilTypeHi: 'लाल चूनायुक्त दोमट',
      dominantCrops: ['Groundnut', 'Pigeon Pea', 'Bajra', 'Castor'],
      waterHoldingCapacityMm: 90
    }
  },

  // ================= MADHYA PRADESH =================
  // --- INDORE ---
  indore_sadar: {
    id: 'indore_sadar',
    name: 'Indore Sadar',
    nameMr: 'इंदूर सदर',
    nameHi: 'इंदौर सदर',
    districtId: 'indore',
    districtName: 'Indore',
    state: 'Madhya Pradesh',
    coordinates: { lat: 22.71, lng: 75.85 },
    polygon: createBlockPolygon(22.71, 75.85, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 17',
      normalOnsetDayOfYear: 168,
      stdDevDays: 5.2,
      annualRainfallMm: 950,
      kharifRainfallMm: 830,
      historicalBreakProbabilityPct: 25,
      soilType: 'Deep Malwa Vertisols (Black Clay)',
      soilTypeMr: 'खोल माळवा काळी जमीन',
      soilTypeHi: 'गहरी मालवा काली मिट्टी',
      dominantCrops: ['Soybean', 'Maize', 'Pigeon Pea (Tur)', 'Wheat (Rabi)'],
      waterHoldingCapacityMm: 170
    }
  },
  depalpur: {
    id: 'depalpur',
    name: 'Depalpur',
    nameMr: 'देपालपूर',
    nameHi: 'देपालपुर',
    districtId: 'indore',
    districtName: 'Indore',
    state: 'Madhya Pradesh',
    coordinates: { lat: 22.85, lng: 75.55 },
    polygon: createBlockPolygon(22.85, 75.55, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 17',
      normalOnsetDayOfYear: 168,
      stdDevDays: 5.3,
      annualRainfallMm: 920,
      kharifRainfallMm: 800,
      historicalBreakProbabilityPct: 27,
      soilType: 'Fertile Heavy Black Soil',
      soilTypeMr: 'सुपीक भारी काळी जमीन',
      soilTypeHi: 'उपजाऊ भारी काली मिट्टी',
      dominantCrops: ['Soybean', 'Maize', 'Garlic', 'Gram'],
      waterHoldingCapacityMm: 165
    }
  },
  mhow: {
    id: 'mhow',
    name: 'Mhow (Dr. Ambedkar Nagar)',
    nameMr: 'महू',
    nameHi: 'महू',
    districtId: 'indore',
    districtName: 'Indore',
    state: 'Madhya Pradesh',
    coordinates: { lat: 22.55, lng: 75.76 },
    polygon: createBlockPolygon(22.55, 75.76, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 16',
      normalOnsetDayOfYear: 167,
      stdDevDays: 5.0,
      annualRainfallMm: 980,
      kharifRainfallMm: 860,
      historicalBreakProbabilityPct: 23,
      soilType: 'Medium Black & Hilly Loam',
      soilTypeMr: 'मध्यम काळी व डोंगराळ जमीन',
      soilTypeHi: 'मध्यम काली और पहाड़ी दोमट',
      dominantCrops: ['Soybean', 'Maize', 'Vegetables', 'Pulses'],
      waterHoldingCapacityMm: 145
    }
  },
  sanwer: {
    id: 'sanwer',
    name: 'Sanwer',
    nameMr: 'सांवेर',
    nameHi: 'सांवेर',
    districtId: 'indore',
    districtName: 'Indore',
    state: 'Madhya Pradesh',
    coordinates: { lat: 22.97, lng: 75.83 },
    polygon: createBlockPolygon(22.97, 75.83, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 18',
      normalOnsetDayOfYear: 169,
      stdDevDays: 5.4,
      annualRainfallMm: 910,
      kharifRainfallMm: 790,
      historicalBreakProbabilityPct: 28,
      soilType: 'Rich Deep Vertisol',
      soilTypeMr: 'कसदार खोल काळी जमीन',
      soilTypeHi: 'उपजाऊ गहरी काली मिट्टी',
      dominantCrops: ['Soybean', 'Cotton', 'Pigeon Pea', 'Onion'],
      waterHoldingCapacityMm: 165
    }
  },

  // --- UJJAIN ---
  ujjain_sadar: {
    id: 'ujjain_sadar',
    name: 'Ujjain Sadar',
    nameMr: 'उज्जैन सदर',
    nameHi: 'उज्जैन सदर',
    districtId: 'ujjain',
    districtName: 'Ujjain',
    state: 'Madhya Pradesh',
    coordinates: { lat: 23.17, lng: 75.78 },
    polygon: createBlockPolygon(23.17, 75.78, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 18',
      normalOnsetDayOfYear: 169,
      stdDevDays: 5.5,
      annualRainfallMm: 890,
      kharifRainfallMm: 770,
      historicalBreakProbabilityPct: 29,
      soilType: 'Medium Deep Vertisols',
      soilTypeMr: 'मध्यम खोल काळी जमीन',
      soilTypeHi: 'मध्यम गहरी काली मिट्टी',
      dominantCrops: ['Soybean', 'Maize', 'Tur', 'Gram'],
      waterHoldingCapacityMm: 160
    }
  },
  nagda: {
    id: 'nagda',
    name: 'Nagda',
    nameMr: 'नागदा',
    nameHi: 'नागदा',
    districtId: 'ujjain',
    districtName: 'Ujjain',
    state: 'Madhya Pradesh',
    coordinates: { lat: 23.45, lng: 75.41 },
    polygon: createBlockPolygon(23.45, 75.41, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 19',
      normalOnsetDayOfYear: 170,
      stdDevDays: 5.6,
      annualRainfallMm: 860,
      kharifRainfallMm: 740,
      historicalBreakProbabilityPct: 31,
      soilType: 'Chambal Basin Heavy Clay',
      soilTypeMr: 'चंबळ खोरे भारी चिकणमाती',
      soilTypeHi: 'चंबल घाटी भारी चिकनी मिट्टी',
      dominantCrops: ['Soybean', 'Wheat', 'Gram', 'Mustard'],
      waterHoldingCapacityMm: 170
    }
  },
  mahidpur: {
    id: 'mahidpur',
    name: 'Mahidpur',
    nameMr: 'महिदपूर',
    nameHi: 'महिदपुर',
    districtId: 'ujjain',
    districtName: 'Ujjain',
    state: 'Madhya Pradesh',
    coordinates: { lat: 23.48, lng: 75.65 },
    polygon: createBlockPolygon(23.48, 75.65, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 19',
      normalOnsetDayOfYear: 170,
      stdDevDays: 5.7,
      annualRainfallMm: 850,
      kharifRainfallMm: 730,
      historicalBreakProbabilityPct: 32,
      soilType: 'Deep Alluvial Black Soil',
      soilTypeMr: 'खोल गाळाची काळी जमीन',
      soilTypeHi: 'गहरी जलोढ़ काली मिट्टी',
      dominantCrops: ['Soybean', 'Maize', 'Pigeon Pea', 'Garlic'],
      waterHoldingCapacityMm: 165
    }
  },
  tarana: {
    id: 'tarana',
    name: 'Tarana',
    nameMr: 'तराणा',
    nameHi: 'तराना',
    districtId: 'ujjain',
    districtName: 'Ujjain',
    state: 'Madhya Pradesh',
    coordinates: { lat: 23.20, lng: 76.04 },
    polygon: createBlockPolygon(23.20, 76.04, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 18',
      normalOnsetDayOfYear: 169,
      stdDevDays: 5.4,
      annualRainfallMm: 880,
      kharifRainfallMm: 760,
      historicalBreakProbabilityPct: 30,
      soilType: 'Medium Black Loamy Soil',
      soilTypeMr: 'मध्यम काळी जमीन',
      soilTypeHi: 'मध्यम काली दोमट मिट्टी',
      dominantCrops: ['Soybean', 'Tur', 'Maize', 'Urad'],
      waterHoldingCapacityMm: 155
    }
  },

  // ================= KARNATAKA =================
  // --- DHARWAD ---
  dharwad_sadar: {
    id: 'dharwad_sadar',
    name: 'Dharwad Sadar',
    nameMr: 'धारवाड सदर',
    nameHi: 'धारवाड़ सदर',
    districtId: 'dharwad',
    districtName: 'Dharwad',
    state: 'Karnataka',
    coordinates: { lat: 15.45, lng: 75.00 },
    polygon: createBlockPolygon(15.45, 75.00, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 05',
      normalOnsetDayOfYear: 156,
      stdDevDays: 5.0,
      annualRainfallMm: 810,
      kharifRainfallMm: 580,
      historicalBreakProbabilityPct: 26,
      soilType: 'Medium Black & Red Sandy Loam',
      soilTypeMr: 'मध्यम काळी व लाल जमीन',
      soilTypeHi: 'मध्यम काली और लाल बलुई दोमट',
      dominantCrops: ['Soybean', 'Cotton', 'Groundnut', 'Chilli'],
      waterHoldingCapacityMm: 135
    }
  },
  hubballi: {
    id: 'hubballi',
    name: 'Hubballi',
    nameMr: 'हुबळी',
    nameHi: 'हुबली',
    districtId: 'dharwad',
    districtName: 'Dharwad',
    state: 'Karnataka',
    coordinates: { lat: 15.36, lng: 75.12 },
    polygon: createBlockPolygon(15.36, 75.12, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 05',
      normalOnsetDayOfYear: 156,
      stdDevDays: 5.1,
      annualRainfallMm: 780,
      kharifRainfallMm: 550,
      historicalBreakProbabilityPct: 28,
      soilType: 'Deep Vertisol Black Soil',
      soilTypeMr: 'खोल काळी जमीन',
      soilTypeHi: 'गहरी काली मिट्टी',
      dominantCrops: ['Cotton', 'Soybean', 'Maize', 'Pigeon Pea'],
      waterHoldingCapacityMm: 155
    }
  },
  kalghatgi: {
    id: 'kalghatgi',
    name: 'Kalghatgi',
    nameMr: 'कळघाटगी',
    nameHi: 'कलघाटगी',
    districtId: 'dharwad',
    districtName: 'Dharwad',
    state: 'Karnataka',
    coordinates: { lat: 15.18, lng: 74.97 },
    polygon: createBlockPolygon(15.18, 74.97, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 04',
      normalOnsetDayOfYear: 155,
      stdDevDays: 4.6,
      annualRainfallMm: 980,
      kharifRainfallMm: 780,
      historicalBreakProbabilityPct: 18,
      soilType: 'Red Lateritic & Forest Loam',
      soilTypeMr: 'तांबडी जांभी जमीन',
      soilTypeHi: 'लाल लैटराइट मिट्टी',
      dominantCrops: ['Paddy', 'Soybean', 'Sugarcane', 'Vegetables'],
      waterHoldingCapacityMm: 110
    }
  },
  kundgol: {
    id: 'kundgol',
    name: 'Kundgol',
    nameMr: 'कुंदगोळ',
    nameHi: 'कुंदगोल',
    districtId: 'dharwad',
    districtName: 'Dharwad',
    state: 'Karnataka',
    coordinates: { lat: 15.25, lng: 75.25 },
    polygon: createBlockPolygon(15.25, 75.25, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 06',
      normalOnsetDayOfYear: 157,
      stdDevDays: 5.4,
      annualRainfallMm: 720,
      kharifRainfallMm: 500,
      historicalBreakProbabilityPct: 34,
      soilType: 'Heavy Deep Black Vertisol',
      soilTypeMr: 'भारी खोल काळी जमीन',
      soilTypeHi: 'भारी गहरी काली मिट्टी',
      dominantCrops: ['Cotton', 'Groundnut', 'Chilli', 'Pigeon Pea'],
      waterHoldingCapacityMm: 165
    }
  },

  // --- KALABURAGI ---
  kalaburagi_sadar: {
    id: 'kalaburagi_sadar',
    name: 'Kalaburagi Sadar',
    nameMr: 'कलबुर्गी सदर',
    nameHi: 'कलबुर्गी सदर',
    districtId: 'kalaburagi',
    districtName: 'Kalaburagi',
    state: 'Karnataka',
    coordinates: { lat: 17.33, lng: 76.83 },
    polygon: createBlockPolygon(17.33, 76.83, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 08',
      normalOnsetDayOfYear: 159,
      stdDevDays: 5.6,
      annualRainfallMm: 750,
      kharifRainfallMm: 590,
      historicalBreakProbabilityPct: 35,
      soilType: 'Heavy Deep Vertisols (Tur Bowl)',
      soilTypeMr: 'भारी खोल काळी तूर जमीन',
      soilTypeHi: 'भारी गहरी काली अरहर मिट्टी',
      dominantCrops: ['Pigeon Pea (Tur / Arhar)', 'Bt Cotton', 'Soybean', 'Bajra'],
      waterHoldingCapacityMm: 175
    }
  },
  aland: {
    id: 'aland',
    name: 'Aland',
    nameMr: 'आळंद',
    nameHi: 'आलंद',
    districtId: 'kalaburagi',
    districtName: 'Kalaburagi',
    state: 'Karnataka',
    coordinates: { lat: 17.56, lng: 76.57 },
    polygon: createBlockPolygon(17.56, 76.57, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 09',
      normalOnsetDayOfYear: 160,
      stdDevDays: 5.8,
      annualRainfallMm: 730,
      kharifRainfallMm: 570,
      historicalBreakProbabilityPct: 37,
      soilType: 'Deep Black Cotton Soil',
      soilTypeMr: 'खोल काळी जमीन',
      soilTypeHi: 'गहरी काली मिट्टी',
      dominantCrops: ['Pigeon Pea', 'Soybean', 'Black Gram', 'Sunflower'],
      waterHoldingCapacityMm: 165
    }
  },
  afzalpur: {
    id: 'afzalpur',
    name: 'Afzalpur',
    nameMr: 'अफझलपूर',
    nameHi: 'अफज़लपुर',
    districtId: 'kalaburagi',
    districtName: 'Kalaburagi',
    state: 'Karnataka',
    coordinates: { lat: 17.20, lng: 76.35 },
    polygon: createBlockPolygon(17.20, 76.35, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 08',
      normalOnsetDayOfYear: 159,
      stdDevDays: 6.0,
      annualRainfallMm: 690,
      kharifRainfallMm: 530,
      historicalBreakProbabilityPct: 41,
      soilType: 'Bhima Basin Alluvial Vertisol',
      soilTypeMr: 'भीमा खोरे गाळाची काळी जमीन',
      soilTypeHi: 'भीमा घाटी जलोढ़ काली मिट्टी',
      dominantCrops: ['Sugarcane', 'Pigeon Pea', 'Cotton', 'Bajra'],
      waterHoldingCapacityMm: 160
    }
  },
  sedam: {
    id: 'sedam',
    name: 'Sedam',
    nameMr: 'सेडम',
    nameHi: 'सेडम',
    districtId: 'kalaburagi',
    districtName: 'Kalaburagi',
    state: 'Karnataka',
    coordinates: { lat: 17.18, lng: 77.28 },
    polygon: createBlockPolygon(17.18, 77.28, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 08',
      normalOnsetDayOfYear: 159,
      stdDevDays: 5.5,
      annualRainfallMm: 770,
      kharifRainfallMm: 610,
      historicalBreakProbabilityPct: 33,
      soilType: 'Calcareous Black & Red Loam',
      soilTypeMr: 'चुनखडीयुक्त काळी व लाल जमीन',
      soilTypeHi: 'चूनायुक्त काली और लाल दोमट',
      dominantCrops: ['Pigeon Pea', 'Cotton', 'Paddy', 'Groundnut'],
      waterHoldingCapacityMm: 140
    }
  },

  // ================= GUJARAT =================
  // --- RAJKOT ---
  rajkot_sadar: {
    id: 'rajkot_sadar',
    name: 'Rajkot Sadar',
    nameMr: 'राजकोट सदर',
    nameHi: 'राजकोट सदर',
    districtId: 'rajkot',
    districtName: 'Rajkot',
    state: 'Gujarat',
    coordinates: { lat: 22.30, lng: 70.80 },
    polygon: createBlockPolygon(22.30, 70.80, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 18',
      normalOnsetDayOfYear: 169,
      stdDevDays: 7.0,
      annualRainfallMm: 610,
      kharifRainfallMm: 510,
      historicalBreakProbabilityPct: 45,
      soilType: 'Medium Black & Gravelly Loam',
      soilTypeMr: 'मध्यम काळी व मुरमाड जमीन',
      soilTypeHi: 'मध्यम काली और पथरीली दोमट',
      dominantCrops: ['Groundnut (Bhuimug)', 'Bt Cotton', 'Sesame', 'Castor'],
      waterHoldingCapacityMm: 115
    }
  },
  gondal: {
    id: 'gondal',
    name: 'Gondal',
    nameMr: 'गोंडल',
    nameHi: 'गोंडल',
    districtId: 'rajkot',
    districtName: 'Rajkot',
    state: 'Gujarat',
    coordinates: { lat: 21.96, lng: 70.79 },
    polygon: createBlockPolygon(21.96, 70.79, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 17',
      normalOnsetDayOfYear: 168,
      stdDevDays: 6.8,
      annualRainfallMm: 640,
      kharifRainfallMm: 540,
      historicalBreakProbabilityPct: 42,
      soilType: 'Deep Alluvial Black Soil (Groundnut Belt)',
      soilTypeMr: 'खोल सुपीक काळी जमीन',
      soilTypeHi: 'गहरी उपजाऊ काली मिट्टी',
      dominantCrops: ['Groundnut', 'Bt Cotton', 'Chilli', 'Onion'],
      waterHoldingCapacityMm: 150
    }
  },
  jasdan: {
    id: 'jasdan',
    name: 'Jasdan',
    nameMr: 'जसदण',
    nameHi: 'जसदण',
    districtId: 'rajkot',
    districtName: 'Rajkot',
    state: 'Gujarat',
    coordinates: { lat: 22.03, lng: 71.20 },
    polygon: createBlockPolygon(22.03, 71.20, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 18',
      normalOnsetDayOfYear: 169,
      stdDevDays: 7.2,
      annualRainfallMm: 570,
      kharifRainfallMm: 470,
      historicalBreakProbabilityPct: 49,
      soilType: 'Shallow Rocky to Medium Loam',
      soilTypeMr: 'खडकाळ ते मध्यम जमीन',
      soilTypeHi: 'पथरीली से मध्यम दोमट',
      dominantCrops: ['Groundnut', 'Pearl Millet (Bajra)', 'Sesame', 'Castor'],
      waterHoldingCapacityMm: 95
    }
  },
  jetpur: {
    id: 'jetpur',
    name: 'Jetpur',
    nameMr: 'जेतपूर',
    nameHi: 'जेतपुर',
    districtId: 'rajkot',
    districtName: 'Rajkot',
    state: 'Gujarat',
    coordinates: { lat: 21.75, lng: 70.62 },
    polygon: createBlockPolygon(21.75, 70.62, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 17',
      normalOnsetDayOfYear: 168,
      stdDevDays: 6.9,
      annualRainfallMm: 660,
      kharifRainfallMm: 560,
      historicalBreakProbabilityPct: 40,
      soilType: 'Bhadar Basin Rich Black Soil',
      soilTypeMr: 'भादर खोरे कसदार काळी जमीन',
      soilTypeHi: 'भादर घाटी उपजाऊ काली मिट्टी',
      dominantCrops: ['Bt Cotton', 'Groundnut', 'Sugarcane', 'Maize'],
      waterHoldingCapacityMm: 160
    }
  },

  // ================= RAJASTHAN =================
  // --- KOTA ---
  kota_sadar: {
    id: 'kota_sadar',
    name: 'Kota Sadar',
    nameMr: 'कोटा सदर',
    nameHi: 'कोटा सदर',
    districtId: 'kota',
    districtName: 'Kota',
    state: 'Rajasthan',
    coordinates: { lat: 25.18, lng: 75.83 },
    polygon: createBlockPolygon(25.18, 75.83, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 25',
      normalOnsetDayOfYear: 176,
      stdDevDays: 6.4,
      annualRainfallMm: 820,
      kharifRainfallMm: 720,
      historicalBreakProbabilityPct: 30,
      soilType: 'Deep Chambal Basin Vertisol',
      soilTypeMr: 'खोल चंबळ काळी जमीन',
      soilTypeHi: 'गहरी चंबल काली मिट्टी',
      dominantCrops: ['Soybean', 'Paddy', 'Maize', 'Mustard (Rabi)'],
      waterHoldingCapacityMm: 170
    }
  },
  ladpura: {
    id: 'ladpura',
    name: 'Ladpura',
    nameMr: 'लाडपुरा',
    nameHi: 'लाडपुरा',
    districtId: 'kota',
    districtName: 'Kota',
    state: 'Rajasthan',
    coordinates: { lat: 25.08, lng: 75.85 },
    polygon: createBlockPolygon(25.08, 75.85, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 25',
      normalOnsetDayOfYear: 176,
      stdDevDays: 6.3,
      annualRainfallMm: 840,
      kharifRainfallMm: 740,
      historicalBreakProbabilityPct: 29,
      soilType: 'Fertile Alluvial Clay Loam',
      soilTypeMr: 'सुपीक गाळाची चिकणमाती',
      soilTypeHi: 'उपजाऊ जलोढ़ चिकनी दोमट',
      dominantCrops: ['Soybean', 'Paddy', 'Vegetables', 'Wheat'],
      waterHoldingCapacityMm: 165
    }
  },
  sangod: {
    id: 'sangod',
    name: 'Sangod',
    nameMr: 'सांगोद',
    nameHi: 'सांगोद',
    districtId: 'kota',
    districtName: 'Kota',
    state: 'Rajasthan',
    coordinates: { lat: 24.92, lng: 76.28 },
    polygon: createBlockPolygon(24.92, 76.28, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 26',
      normalOnsetDayOfYear: 177,
      stdDevDays: 6.5,
      annualRainfallMm: 800,
      kharifRainfallMm: 700,
      historicalBreakProbabilityPct: 32,
      soilType: 'Heavy Black Clay',
      soilTypeMr: 'भारी काळी चिकणमाती',
      soilTypeHi: 'भारी काली चिकनी मिट्टी',
      dominantCrops: ['Soybean', 'Mustard', 'Gram', 'Maize'],
      waterHoldingCapacityMm: 170
    }
  },
  ramganj_mandi: {
    id: 'ramganj_mandi',
    name: 'Ramganj Mandi',
    nameMr: 'रामगंज मंडी',
    nameHi: 'रामगंज मंडी',
    districtId: 'kota',
    districtName: 'Kota',
    state: 'Rajasthan',
    coordinates: { lat: 24.65, lng: 75.95 },
    polygon: createBlockPolygon(24.65, 75.95, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 24',
      normalOnsetDayOfYear: 175,
      stdDevDays: 6.2,
      annualRainfallMm: 860,
      kharifRainfallMm: 760,
      historicalBreakProbabilityPct: 28,
      soilType: 'Deep Vertisols with Stone Formations',
      soilTypeMr: 'खोल काळी कसदार जमीन',
      soilTypeHi: 'गहरी काली उपजाऊ मिट्टी',
      dominantCrops: ['Soybean', 'Coriander', 'Garlic', 'Maize'],
      waterHoldingCapacityMm: 160
    }
  },

  // ================= PUNJAB =================
  // --- LUDHIANA ---
  ludhiana_sadar: {
    id: 'ludhiana_sadar',
    name: 'Ludhiana Sadar',
    nameMr: 'लुधियाना सदर',
    nameHi: 'लुधियाना सदर',
    districtId: 'ludhiana',
    districtName: 'Ludhiana',
    state: 'Punjab',
    coordinates: { lat: 30.90, lng: 75.85 },
    polygon: createBlockPolygon(30.90, 75.85, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 30',
      normalOnsetDayOfYear: 181,
      stdDevDays: 6.8,
      annualRainfallMm: 680,
      kharifRainfallMm: 540,
      historicalBreakProbabilityPct: 35,
      soilType: 'Deep Alluvial Sandy Loam (Indo-Gangetic)',
      soilTypeMr: 'खोल गाळाची सुपीक जमीन',
      soilTypeHi: 'गहरी जलोढ़ उपजाऊ मिट्टी',
      dominantCrops: ['Paddy (Basmati/Parmal)', 'Maize', 'Cotton', 'Sugarcane'],
      waterHoldingCapacityMm: 140
    }
  },
  jagraon: {
    id: 'jagraon',
    name: 'Jagraon',
    nameMr: 'जग्राओं',
    nameHi: 'जग्राओं',
    districtId: 'ludhiana',
    districtName: 'Ludhiana',
    state: 'Punjab',
    coordinates: { lat: 30.78, lng: 75.48 },
    polygon: createBlockPolygon(30.78, 75.48, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 30',
      normalOnsetDayOfYear: 181,
      stdDevDays: 7.0,
      annualRainfallMm: 650,
      kharifRainfallMm: 510,
      historicalBreakProbabilityPct: 38,
      soilType: 'Alluvial Loam',
      soilTypeMr: 'गाळाची जमीन',
      soilTypeHi: 'जलोढ़ दोमट मिट्टी',
      dominantCrops: ['Paddy', 'Maize', 'Fodder', 'Vegetables'],
      waterHoldingCapacityMm: 135
    }
  },
  khanna: {
    id: 'khanna',
    name: 'Khanna',
    nameMr: 'खन्ना',
    nameHi: 'खन्ना',
    districtId: 'ludhiana',
    districtName: 'Ludhiana',
    state: 'Punjab',
    coordinates: { lat: 30.70, lng: 76.22 },
    polygon: createBlockPolygon(30.70, 76.22, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 29',
      normalOnsetDayOfYear: 180,
      stdDevDays: 6.5,
      annualRainfallMm: 720,
      kharifRainfallMm: 580,
      historicalBreakProbabilityPct: 32,
      soilType: 'Rich Fertile Alluvium (Grain Hub)',
      soilTypeMr: 'अत्यंत सुपीक गाळाची जमीन',
      soilTypeHi: 'अति उपजाऊ जलोढ़ मिट्टी',
      dominantCrops: ['Paddy', 'Wheat (Rabi)', 'Maize', 'Pulses'],
      waterHoldingCapacityMm: 150
    }
  },
  samrala: {
    id: 'samrala',
    name: 'Samrala',
    nameMr: 'समराला',
    nameHi: 'समराला',
    districtId: 'ludhiana',
    districtName: 'Ludhiana',
    state: 'Punjab',
    coordinates: { lat: 30.84, lng: 76.19 },
    polygon: createBlockPolygon(30.84, 76.19, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 29',
      normalOnsetDayOfYear: 180,
      stdDevDays: 6.6,
      annualRainfallMm: 710,
      kharifRainfallMm: 570,
      historicalBreakProbabilityPct: 33,
      soilType: 'Deep Loamy Alluvial Soil',
      soilTypeMr: 'खोल गाळाची जमीन',
      soilTypeHi: 'गहरी दोमट जलोढ़ मिट्टी',
      dominantCrops: ['Paddy', 'Sugarcane', 'Maize', 'Poplar'],
      waterHoldingCapacityMm: 145
    }
  },

  // ================= UTTAR PRADESH =================
  // --- VARANASI ---
  varanasi_sadar: {
    id: 'varanasi_sadar',
    name: 'Varanasi Sadar',
    nameMr: 'वाराणसी सदर',
    nameHi: 'वाराणसी सदर',
    districtId: 'varanasi',
    districtName: 'Varanasi',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.32, lng: 82.97 },
    polygon: createBlockPolygon(25.32, 82.97, 0.09, 0.09, 0.01),
    climatology: {
      normalOnsetDate: 'June 20',
      normalOnsetDayOfYear: 171,
      stdDevDays: 5.8,
      annualRainfallMm: 1020,
      kharifRainfallMm: 890,
      historicalBreakProbabilityPct: 24,
      soilType: 'Deep Gangetic Alluvial Silt Loam',
      soilTypeMr: 'गंगा खोरे खोल गाळाची जमीन',
      soilTypeHi: 'गंगा घाटी गहरी जलोढ़ गाद दोमट',
      dominantCrops: ['Paddy', 'Maize', 'Pigeon Pea (Tur)', 'Vegetables'],
      waterHoldingCapacityMm: 165
    }
  },
  pindra: {
    id: 'pindra',
    name: 'Pindra',
    nameMr: 'पिंडरा',
    nameHi: 'पिंडरा',
    districtId: 'varanasi',
    districtName: 'Varanasi',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.48, lng: 82.85 },
    polygon: createBlockPolygon(25.48, 82.85, 0.08, 0.09, -0.01),
    climatology: {
      normalOnsetDate: 'June 20',
      normalOnsetDayOfYear: 171,
      stdDevDays: 5.9,
      annualRainfallMm: 1000,
      kharifRainfallMm: 870,
      historicalBreakProbabilityPct: 25,
      soilType: 'Fertile Alluvial Loam',
      soilTypeMr: 'सुपीक गाळाची जमीन',
      soilTypeHi: 'उपजाऊ जलोढ़ दोमट',
      dominantCrops: ['Paddy', 'Pigeon Pea', 'Mustard', 'Chilli'],
      waterHoldingCapacityMm: 155
    }
  },
  rohaniya: {
    id: 'rohaniya',
    name: 'Rohaniya',
    nameMr: 'रोहनिया',
    nameHi: 'रोहनिया',
    districtId: 'varanasi',
    districtName: 'Varanasi',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.26, lng: 82.91 },
    polygon: createBlockPolygon(25.26, 82.91, 0.09, 0.09, 0.015),
    climatology: {
      normalOnsetDate: 'June 20',
      normalOnsetDayOfYear: 171,
      stdDevDays: 5.7,
      annualRainfallMm: 1040,
      kharifRainfallMm: 910,
      historicalBreakProbabilityPct: 22,
      soilType: 'Heavy Silt Loam & Clay',
      soilTypeMr: 'चिकणमाती व गाळाची जमीन',
      soilTypeHi: 'चिकनी दोमट और जलोढ़ मिट्टी',
      dominantCrops: ['Paddy', 'Vegetables', 'Maize', 'Urad'],
      waterHoldingCapacityMm: 170
    }
  }
};

export const CROPS: Record<string, CropInfo> = {
  cotton: {
    id: 'cotton',
    name: 'Bt Cotton (Kapus)',
    nameMr: 'कापूस (बीटी)',
    nameHi: 'कपास (बीटी)',
    scientificName: 'Gossypium hirsutum',
    minSoilMoistureThresholdMm: 75,
    consecutiveDryDaysSensitivity: 7,
    sowingWindowStart: 'June 15',
    sowingWindowEnd: 'July 10',
    droughtTolerance: 'Moderate',
    waterloggingTolerance: 'Low',
    idealSoil: 'Deep Vertisols (Black cotton soil with >140mm water holding capacity)'
  },
  soybean: {
    id: 'soybean',
    name: 'Soybean',
    nameMr: 'सोयाबीन',
    nameHi: 'सोयाबीन',
    scientificName: 'Glycine max',
    minSoilMoistureThresholdMm: 85, // High germination moisture requirement
    consecutiveDryDaysSensitivity: 5, // Highly vulnerable to post-germination dry spells
    sowingWindowStart: 'June 12',
    sowingWindowEnd: 'July 05',
    droughtTolerance: 'Low',
    waterloggingTolerance: 'Moderate',
    idealSoil: 'Well-drained medium to heavy black soils'
  },
  tur: {
    id: 'tur',
    name: 'Pigeon Pea / Red Gram (Tur / Arhar)',
    nameMr: 'तूर',
    nameHi: 'अरहर / तुअर',
    scientificName: 'Cajanus cajan',
    minSoilMoistureThresholdMm: 65,
    consecutiveDryDaysSensitivity: 10,
    sowingWindowStart: 'June 15',
    sowingWindowEnd: 'July 15',
    droughtTolerance: 'High',
    waterloggingTolerance: 'Low',
    idealSoil: 'Medium to deep loamy black soil, excellent intercrop with cotton/soybean'
  },
  bajra: {
    id: 'bajra',
    name: 'Pearl Millet (Bajra)',
    nameMr: 'बाजरी',
    nameHi: 'बाजरा',
    scientificName: 'Pennisetum glaucum',
    minSoilMoistureThresholdMm: 45,
    consecutiveDryDaysSensitivity: 12,
    sowingWindowStart: 'June 20',
    sowingWindowEnd: 'July 25',
    droughtTolerance: 'High',
    waterloggingTolerance: 'Low',
    idealSoil: 'Light shallow soils, rain-shadow and drought-prone tracts'
  },
  maize: {
    id: 'maize',
    name: 'Maize (Makka)',
    nameMr: 'मका',
    nameHi: 'मक्का',
    scientificName: 'Zea mays',
    minSoilMoistureThresholdMm: 60,
    consecutiveDryDaysSensitivity: 6,
    sowingWindowStart: 'June 10',
    sowingWindowEnd: 'July 10',
    droughtTolerance: 'Moderate',
    waterloggingTolerance: 'Low',
    idealSoil: 'Fertile well-drained loams to medium black soils'
  },
  onion: {
    id: 'onion',
    name: 'Kharif Onion (Kanda)',
    nameMr: 'खरीप कांदा',
    nameHi: 'खरीफ प्याज',
    scientificName: 'Allium cepa',
    minSoilMoistureThresholdMm: 90,
    consecutiveDryDaysSensitivity: 4,
    sowingWindowStart: 'June 25',
    sowingWindowEnd: 'August 05',
    droughtTolerance: 'Low',
    waterloggingTolerance: 'Low',
    idealSoil: 'Friable sandy loam to medium black with high organic matter'
  },
  groundnut: {
    id: 'groundnut',
    name: 'Groundnut (Bhuimug)',
    nameMr: 'भुईमूग',
    nameHi: 'मूंगफली',
    scientificName: 'Arachis hypogaea',
    minSoilMoistureThresholdMm: 70,
    consecutiveDryDaysSensitivity: 8,
    sowingWindowStart: 'June 15',
    sowingWindowEnd: 'July 10',
    droughtTolerance: 'Moderate',
    waterloggingTolerance: 'Low',
    idealSoil: 'Light sandy loam, well-drained'
  },
  paddy: {
    id: 'paddy',
    name: 'Paddy / Rice (Bhat / Dhan)',
    nameMr: 'भात / धान',
    nameHi: 'धान / चावल',
    scientificName: 'Oryza sativa',
    minSoilMoistureThresholdMm: 120,
    consecutiveDryDaysSensitivity: 4,
    sowingWindowStart: 'June 05',
    sowingWindowEnd: 'June 30',
    droughtTolerance: 'Low',
    waterloggingTolerance: 'High',
    idealSoil: 'Clayey water-retentive soils in Ghats/high-rainfall and canal pockets'
  }
};
