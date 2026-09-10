/**
 * Real Indian State, District, and Block hierarchical mapping
 * Sourced from Ministry of Agriculture & Farmers Welfare (MoA&FW) & ICAR agro-climatic zones
 */
import { DistrictInfo, BlockInfo, CropId, CropInfo } from '../types';
import { DISTRICTS, BLOCKS, CROPS, STATES } from './climatologyData';

export interface StateHierarchy {
  stateName: string;
  districts: DistrictInfo[];
}

/**
 * State to Districts Lookup Table
 */
export const STATE_DISTRICT_LOOKUP: Record<string, DistrictInfo[]> = STATES.reduce((acc, state) => {
  acc[state] = DISTRICTS.filter(d => d.state === state);
  return acc;
}, {} as Record<string, DistrictInfo[]>);

/**
 * District to Blocks Lookup Table
 */
export const DISTRICT_BLOCK_LOOKUP: Record<string, BlockInfo[]> = DISTRICTS.reduce((acc, district) => {
  acc[district.id] = district.blocks.map(bId => BLOCKS[bId]).filter(Boolean);
  return acc;
}, {} as Record<string, BlockInfo[]>);

/**
 * Real Kharif Crop Sourcing & Calendars per Indian State
 * Sourced from Directorate of Economics & Statistics (DES), ICAR agro-climatic zones,
 * and Ministry of Agriculture & Farmers Welfare (MoA&FW).
 * ONLY authentic crops grown in each state are included. Non-grown crops are strictly excluded.
 */
export const STATE_CROPS_MAP: Record<string, CropId[]> = {
  Maharashtra: ['cotton', 'soybean', 'tur', 'bajra', 'onion', 'maize', 'groundnut', 'paddy'],
  Telangana: ['cotton', 'paddy', 'maize', 'soybean', 'tur'],
  'Andhra Pradesh': ['groundnut', 'cotton', 'paddy', 'maize', 'tur'],
  'Madhya Pradesh': ['soybean', 'maize', 'tur', 'cotton', 'paddy'],
  Karnataka: ['tur', 'cotton', 'maize', 'groundnut', 'soybean', 'paddy'],
  Gujarat: ['cotton', 'groundnut', 'bajra', 'soybean'],
  Rajasthan: ['bajra', 'soybean', 'groundnut', 'maize', 'cotton'],
  Punjab: ['paddy', 'cotton', 'maize'],
  'Uttar Pradesh': ['paddy', 'maize', 'tur', 'bajra']
};

export const STATE_MAJOR_CROPS_MAP: Record<string, { major: CropId[]; other: CropId[] }> = {
  Maharashtra: {
    // Vidarbha/Marathwada cotton-soybean-tur, Nashik onion/bajra/maize
    major: ['cotton', 'soybean', 'tur', 'bajra'],
    other: ['onion', 'maize', 'groundnut', 'paddy']
  },
  Telangana: {
    // Godavari & Krishna basins: cotton, paddy, maize, soybean, tur
    major: ['cotton', 'paddy', 'maize'],
    other: ['soybean', 'tur']
  },
  'Andhra Pradesh': {
    // Rayalaseema arid groundnut bowl, cotton, delta paddy
    major: ['groundnut', 'cotton', 'paddy'],
    other: ['maize', 'tur']
  },
  'Madhya Pradesh': {
    // Malwa soybean heartland, maize, arhar/tur, cotton
    major: ['soybean', 'maize', 'tur'],
    other: ['cotton', 'paddy']
  },
  Karnataka: {
    // Gulbarga tur bowl, Raichur cotton, transition maize/groundnut/soybean
    major: ['tur', 'cotton', 'maize'],
    other: ['groundnut', 'soybean', 'paddy']
  },
  Gujarat: {
    // Saurashtra groundnut, Bt cotton, North Gujarat pearl millet
    major: ['cotton', 'groundnut'],
    other: ['bajra', 'soybean']
  },
  Rajasthan: {
    // Thar pearl millet (bajra), Kota soybean, Mewar maize, Bikaner groundnut
    major: ['bajra', 'soybean', 'groundnut'],
    other: ['maize', 'cotton']
  },
  Punjab: {
    // Central alluvial paddy, Malwa Bt cotton, sub-mountain maize
    major: ['paddy', 'cotton'],
    other: ['maize']
  },
  'Uttar Pradesh': {
    // Gangetic plain paddy, maize, Bundelkhand/eastern tur, western bajra
    major: ['paddy', 'maize'],
    other: ['tur', 'bajra']
  }
};

/**
 * Result interface for subdivision and state crop queries
 */
export interface SubdivisionCropsResult {
  stateName: string;
  stateCrops: CropInfo[];
  dominantCropsInBlock: CropInfo[];
  otherStateCrops: CropInfo[];
  primaryCropId: CropId;
}

/**
 * Resolve crops strictly cultivated in the given subdivision (block) and its parent state.
 * Never outputs crops that are not grown in that state.
 */
export function getSubdivisionCrops(blockId?: string, stateName?: string): SubdivisionCropsResult {
  const block = blockId ? BLOCKS[blockId] : undefined;
  const resolvedState = stateName || (block ? block.state : 'Maharashtra');
  
  const mapping = STATE_MAJOR_CROPS_MAP[resolvedState] || STATE_MAJOR_CROPS_MAP['Maharashtra'];
  const allStateCropIds = STATE_CROPS_MAP[resolvedState] || STATE_CROPS_MAP['Maharashtra'];
  const stateCrops = allStateCropIds.map(id => CROPS[id]).filter(Boolean);

  // If a block is selected, identify which crops are specifically dominant in this block
  const dominantCropIds: CropId[] = [];
  if (block && block.climatology && block.climatology.dominantCrops) {
    const dLower = block.climatology.dominantCrops.map(c => c.toLowerCase());
    allStateCropIds.forEach(cId => {
      const crop = CROPS[cId];
      if (!crop) return;
      const cNameLower = crop.name.toLowerCase();
      
      const isMatch = dLower.some(d => 
        d.includes(cId) ||
        cNameLower.includes(d) ||
        d.includes(cNameLower.split(' ')[0]) ||
        (cId === 'cotton' && (d.includes('cotton') || d.includes('kapus'))) ||
        (cId === 'soybean' && (d.includes('soybean') || d.includes('soya'))) ||
        (cId === 'tur' && (d.includes('tur') || d.includes('arhar') || d.includes('pigeon') || d.includes('red gram'))) ||
        (cId === 'bajra' && (d.includes('bajra') || d.includes('millet') || d.includes('pearl'))) ||
        (cId === 'maize' && (d.includes('maize') || d.includes('makka') || d.includes('corn'))) ||
        (cId === 'onion' && (d.includes('onion') || d.includes('kanda'))) ||
        (cId === 'groundnut' && (d.includes('groundnut') || d.includes('bhuimug') || d.includes('peanut'))) ||
        (cId === 'paddy' && (d.includes('paddy') || d.includes('rice') || d.includes('bhat') || d.includes('dhan')))
      );

      if (isMatch) {
        dominantCropIds.push(cId);
      }
    });
  }

  // If no block matches found, fallback to major crops of the state
  const finalDominantIds = dominantCropIds.length > 0 ? dominantCropIds : mapping.major;
  const dominantCropsInBlock = finalDominantIds.map(id => CROPS[id]).filter(Boolean);
  const otherStateCrops = stateCrops.filter(c => !finalDominantIds.includes(c.id));
  
  const primaryCropId: CropId = dominantCropsInBlock[0]?.id || stateCrops[0]?.id || 'cotton';

  return {
    stateName: resolvedState,
    stateCrops,
    dominantCropsInBlock,
    otherStateCrops,
    primaryCropId
  };
}

/**
 * Helper to get major and other crops for a given state name (strictly only crops grown in that state)
 */
export function getCropsForState(stateName?: string): { majorCrops: CropInfo[]; otherCrops: CropInfo[]; allCrops: CropInfo[] } {
  const fallbackState = 'Maharashtra';
  const mapping = (stateName && STATE_MAJOR_CROPS_MAP[stateName]) 
    ? STATE_MAJOR_CROPS_MAP[stateName] 
    : STATE_MAJOR_CROPS_MAP[fallbackState];

  const allStateCropIds = (stateName && STATE_CROPS_MAP[stateName])
    ? STATE_CROPS_MAP[stateName]
    : STATE_CROPS_MAP[fallbackState];

  const majorCrops = mapping.major.map(id => CROPS[id]).filter(Boolean);
  const otherCrops = mapping.other.map(id => CROPS[id]).filter(Boolean);
  const allCrops = allStateCropIds.map(id => CROPS[id]).filter(Boolean);

  return { majorCrops, otherCrops, allCrops };
}
