import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  BlockInfo, 
  DistrictInfo, 
  ForecastHorizon, 
  ProbabilisticForecast, 
  RiskMetricType,
  Language
} from '../types';
import { BLOCKS, DISTRICTS, STATES } from '../data/climatologyData';
import { TRANSLATIONS, LOCALIZED_DISTRICTS } from '../data/translations';
import { 
  Calendar, 
  CloudLightning, 
  Droplet, 
  SunMedium, 
  Layers, 
  Crosshair,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  Satellite,
  Globe,
  MapPin,
  RotateCcw,
  Info
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface RiskMapLeafletProps {
  district: DistrictInfo;
  onSelectDistrict?: (district: DistrictInfo) => void;
  forecasts: Record<string, ProbabilisticForecast>;
  selectedBlockId: string;
  onSelectBlock: (blockId: string) => void;
  metric: RiskMetricType;
  setMetric: (metric: RiskMetricType) => void;
  horizon: ForecastHorizon;
  setHorizon: (horizon: ForecastHorizon) => void;
  language?: Language;
}

type BasemapStyle = 'dark' | 'satellite' | 'terrain';

export const RiskMapLeaflet: React.FC<RiskMapLeafletProps> = ({
  district,
  onSelectDistrict,
  forecasts,
  selectedBlockId,
  onSelectBlock,
  metric,
  setMetric,
  horizon,
  setHorizon,
  language = 'en'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const currentDistrictIdRef = useRef<string | null>(null);

  // User interactive state & Map Stability controls
  const [isPanUnlocked, setIsPanUnlocked] = useState<boolean>(false);
  const [basemap, setBasemap] = useState<BasemapStyle>('dark');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showScrollHint, setShowScrollHint] = useState<boolean>(false);
  const scrollHintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Color mapping logic for each meteorological risk metric
  const getColorForBlock = (blockId: string): string => {
    const f = forecasts[blockId];
    if (!f) return '#64748b';

    if (metric === 'onset') {
      const p = f.onsetProbabilityPct;
      if (p >= 75) return '#10b981'; // Green (On Schedule)
      if (p >= 50) return '#84cc16'; // Lime (Slight Shift)
      if (p >= 35) return '#eab308'; // Yellow (Moderate Delay)
      if (p >= 20) return '#f97316'; // Orange (High Delay Risk)
      return '#ef4444'; // Red (Severe Delay / Drought Hazard)
    }

    if (metric === 'break') {
      const b = f.breakRiskPct;
      if (b <= 25) return '#10b981'; // Green (Low Break Risk)
      if (b <= 40) return '#84cc16'; // Lime
      if (b <= 55) return '#eab308'; // Yellow (Moderate Break)
      if (b <= 70) return '#f97316'; // Orange (High Break Risk)
      return '#ef4444'; // Red (Severe 10+ Day Dry Spell)
    }

    if (metric === 'heavyRain') {
      const h = f.heavyRainRiskPct;
      if (h <= 20) return '#0ea5e9'; // Light sky
      if (h <= 45) return '#3b82f6'; // Blue
      if (h <= 65) return '#6366f1'; // Indigo
      return '#a855f7'; // Purple (Deluge / Waterlogging Risk)
    }

    if (metric === 'moistureDeficit') {
      const d = f.soilMoistureDeficitPct;
      if (d <= 25) return '#10b981'; // Saturated / Favorable
      if (d <= 45) return '#eab308'; // Moderate Deficit
      if (d <= 65) return '#f97316'; // High Stress
      return '#b91c1c'; // Deep Red (Severe Desiccation)
    }

    return '#3b82f6';
  };

  const getMetricValueDisplay = (blockId: string): string => {
    const f = forecasts[blockId];
    if (!f) return '--';
    if (metric === 'onset') return `${f.onsetProbabilityPct}%`;
    if (metric === 'break') return `${f.breakRiskPct}%`;
    if (metric === 'heavyRain') return `${f.heavyRainRiskPct}%`;
    return `${f.soilMoistureDeficitPct}%`;
  };

  // Switch Tile Layer
  const updateTileLayer = (map: L.Map, style: BasemapStyle) => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';
    let maxZoom = 18;
    let attribution = '&copy; CartoDB, OpenStreetMap';

    if (style === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 17;
      attribution = '&copy; Esri, Maxar, Earthstar Geographics';
    } else if (style === 'terrain') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      maxZoom = 18;
      attribution = '&copy; CartoDB Voyager, OpenStreetMap';
    }

    const newLayer = L.tileLayer(url, {
      maxZoom,
      subdomains: 'abcd',
      attribution
    }).addTo(map);

    tileLayerRef.current = newLayer;
  };

  // Helper to fit bounds to the current district blocks
  const fitDistrictBounds = (map: L.Map, targetDistrict: DistrictInfo) => {
    const districtBlocks = targetDistrict.blocks.map(id => BLOCKS[id]).filter(Boolean);
    if (districtBlocks.length === 0) return;

    // Collect all polygon lat/lngs for precise bounding
    const allCoords: L.LatLngExpression[] = [];
    districtBlocks.forEach(b => {
      b.polygon.forEach(coord => {
        allCoords.push([coord[0], coord[1]]);
      });
    });

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      // Anchor map strictly to district bounds so it cannot drift or move out of place
      const paddedBounds = bounds.pad(0.35);
      map.setMaxBounds(paddedBounds);
      map.fitBounds(bounds, {
        padding: [35, 35],
        maxZoom: 10.5,
        animate: false // Instant fit, no motion jump
      });
    }
  };

  // 1. Initialize Map Instance (Only Once)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const firstBlock = BLOCKS[district.blocks[0]] || BLOCKS['nashik_haveli'];
    const initialCenter: [number, number] = [firstBlock.coordinates.lat, firstBlock.coordinates.lng];

    // Initialize with scrollWheelZoom: false, dragging: false, and doubleClickZoom: false
    // Ensures map is completely stable in its place and page scroll is 100% preserved
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 9,
      zoomControl: false, // Custom positioned zoom controls
      scrollWheelZoom: false, // Never hijack page scroll!
      doubleClickZoom: false, // Prevent accidental camera jumps
      touchZoom: false, // Single and multi-touch swipe passes to page scroll
      dragging: false, // Fixed in place by default (pan lock)
      boxZoom: false,
      attributionControl: false
    });

    // Add zoom control at bottom right to avoid cluttering top bars
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer (Dark Matter)
    updateTileLayer(map, basemap);

    // Layer groups for polygons and text pin markers
    const polygonGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    polygonLayerGroupRef.current = polygonGroup;
    markersLayerGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Support Ctrl + Wheel zooming; regular scrolling continuously scrolls the web page
    const container = mapContainerRef.current;
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Standard embedded map UX: holding Ctrl/Cmd zooms map
        e.preventDefault();
        if (e.deltaY < 0) {
          map.zoomIn();
        } else if (e.deltaY > 0) {
          map.zoomOut();
        }
      } else {
        // Normal scroll: DO NOT preventDefault! Browser scrolls page smoothly across the map
        setShowScrollHint(true);
        if (scrollHintTimeoutRef.current) clearTimeout(scrollHintTimeoutRef.current);
        scrollHintTimeoutRef.current = setTimeout(() => {
          setShowScrollHint(false);
        }, 1500);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    // Initial bounds fit
    fitDistrictBounds(map, district);
    currentDistrictIdRef.current = district.id;

    // ResizeObserver to handle container shifts, window resizes, and tab changes cleanly
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();
      if (scrollHintTimeoutRef.current) clearTimeout(scrollHintTimeoutRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. React to isPanUnlocked Toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isPanUnlocked) {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
  }, [isPanUnlocked]);

  // 3. React to Basemap Style Toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    updateTileLayer(map, basemap);
  }, [basemap]);

  // 4. React to District Changes ONLY for recentering (prevents camera jumps on other clicks!)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentDistrictIdRef.current !== district.id) {
      currentDistrictIdRef.current = district.id;
      fitDistrictBounds(map, district);
    }
  }, [district.id]);

  // 5. Redraw Polygons & Markers Reactively (WITHOUT jerking the map camera!)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polyGroup = polygonLayerGroupRef.current;
    const markerGroup = markersLayerGroupRef.current;
    if (!map || !polyGroup || !markerGroup) return;

    polyGroup.clearLayers();
    markerGroup.clearLayers();

    const districtBlocks = district.blocks.map(id => BLOCKS[id]).filter(Boolean);
    if (districtBlocks.length === 0) return;

    districtBlocks.forEach(block => {
      const isSelected = block.id === selectedBlockId;
      const fillColor = getColorForBlock(block.id);
      const valStr = getMetricValueDisplay(block.id);
      const forecast = forecasts[block.id];

      // Draw Polygon for block
      const polygon = L.polygon(block.polygon, {
        color: isSelected ? '#38BDF8' : '#FFFFFF',
        weight: isSelected ? 3.5 : 1.2,
        opacity: isSelected ? 1 : 0.65,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.65 : (basemap === 'satellite' ? 0.45 : 0.52),
        dashArray: isSelected ? '6, 4' : undefined
      });

      polygon.on('click', () => {
        soundFx.playRadarPing();
        onSelectBlock(block.id);
      });

      polygon.on('mouseover', function (e) {
        const target = e.target;
        target.setStyle({
          fillOpacity: 0.82,
          weight: isSelected ? 4 : 2.5
        });
      });

      polygon.on('mouseout', function (e) {
        const target = e.target;
        target.setStyle({
          fillOpacity: isSelected ? 0.65 : (basemap === 'satellite' ? 0.45 : 0.52),
          weight: isSelected ? 3.5 : 1.2
        });
      });

      // Rich interactive tooltip
      polygon.bindTooltip(`
        <div style="font-family: inherit; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #FFFFFF;">${block.name}</strong>
            <span style="font-family: monospace; font-weight: 700; font-size: 12px; color: #38BDF8; background: #0F172A; padding: 1px 6px; border-radius: 4px;">${valStr}</span>
          </div>
          <div style="font-size: 11px; color: #CBD5E1; line-height: 1.4;">
            <div>• Expected Onset: <strong style="color: #FFFFFF;">${forecast ? forecast.expectedOnsetDate : '--'}</strong></div>
            <div>• Break Risk: <strong style="color: #FCD34D;">${forecast ? forecast.breakRiskPct : '--'}%</strong> (${forecast?.breakRiskCategory || 'Normal'})</div>
            <div>• Soil: <span style="color: #94A3B8;">${block.climatology.soilType}</span></div>
          </div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        className: 'custom-leaflet-tooltip'
      });

      polyGroup.addLayer(polygon);

      // Add HTML Marker Badge at center
      const icon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="cursor-pointer transition-all duration-200 transform hover:scale-110 flex flex-col items-center">
            <div style="background-color: ${fillColor}; color: #020617; box-shadow: 0 0 12px ${fillColor}99;" class="px-2 py-0.5 rounded-full border ${isSelected ? 'border-sky-300 ring-2 ring-sky-400/80 scale-105' : 'border-white/90'} text-[11px] font-mono font-black shadow-md flex items-center gap-1">
              ${valStr}
            </div>
            <div class="text-[10px] font-bold ${isSelected ? 'text-sky-300 bg-sky-950/90 border border-sky-500/50' : 'text-slate-100 bg-slate-900/85 border border-slate-700/50'} px-1.5 py-0.2 rounded mt-0.5 whitespace-nowrap shadow-sm">
              ${block.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [64, 38],
        iconAnchor: [32, 19]
      });

      const marker = L.marker([block.coordinates.lat, block.coordinates.lng], { icon });
      marker.on('click', () => {
        soundFx.playRadarPing();
        onSelectBlock(block.id);
      });
      markerGroup.addLayer(marker);
    });

  }, [district, forecasts, metric, selectedBlockId, horizon, basemap]);

  // Handle Recenter Click
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    fitDistrictBounds(map, district);
  };

  const t = TRANSLATIONS[language];
  const localizedDistrictName = LOCALIZED_DISTRICTS[district.id]?.[language] || district.name;

  return (
    <div className="relative isolate z-0 bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      
      {/* Top Map Controls Bar */}
      <div className="bg-[#1E293B] border-b border-slate-800 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> {t.tabRiskMap}:
          </span>

          <button
            id="metric-btn-onset"
            onClick={() => {
              soundFx.playClick();
              setMetric('onset');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1.5 transition ${
              metric === 'onset' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.metricOnset}</span>
          </button>

          <button
            id="metric-btn-break"
            onClick={() => {
              soundFx.playClick();
              setMetric('break');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1.5 transition ${
              metric === 'break' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <SunMedium className="w-3.5 h-3.5" />
            <span>{t.metricBreak}</span>
          </button>

          <button
            id="metric-btn-heavyrain"
            onClick={() => {
              soundFx.playClick();
              setMetric('heavyRain');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1.5 transition ${
              metric === 'heavyRain' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" />
            <span>{t.metricHeavyRain}</span>
          </button>

          <button
            id="metric-btn-moisture"
            onClick={() => {
              soundFx.playClick();
              setMetric('moistureDeficit');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1.5 transition ${
              metric === 'moistureDeficit' 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>{t.metricMoisture}</span>
          </button>
        </div>

        {/* Forecast Horizon Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0F172A] p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
          <span className="text-[11px] font-semibold text-slate-400 px-1.5">{t.horizonLabel}:</span>
          {([1, 2, 3, 4] as ForecastHorizon[]).map(h => (
            <button
              key={h}
              id={`horizon-btn-${h}`}
              onClick={() => setHorizon(h)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition ${
                horizon === h
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wk {h} ({h * 7}d)
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Bar: District Switcher + Basemap + Stability Controls */}
      <div className="bg-[#141E33] px-3.5 py-2 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
        
        {/* District Fast Selector - Filtered strictly to current state */}
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400 font-semibold">{t.districtLabel}:</span>
          {onSelectDistrict ? (
            <select
              id="map-district-select"
              value={district.id}
              onChange={(e) => {
                const target = DISTRICTS.find(d => d.id === e.target.value);
                if (target) onSelectDistrict(target);
              }}
              className="bg-[#0F172A] text-white font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <optgroup label={`📍 ${district.state}`}>
                {DISTRICTS.filter(d => d.state === district.state).map(d => (
                  <option key={d.id} value={d.id}>
                    {LOCALIZED_DISTRICTS[d.id]?.[language] || d.name} ({d.blocks.length} Blocks)
                  </option>
                ))}
              </optgroup>
            </select>
          ) : (
            <span className="font-bold text-white bg-[#0F172A] px-2.5 py-1 rounded-lg border border-slate-800">
              {localizedDistrictName} ({district.state})
            </span>
          )}
        </div>

        {/* Right Tools: Basemap Switcher + Map Activation Toggle + Recenter + Fullscreen */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Basemap Toggle */}
          <div className="flex items-center bg-[#0F172A] p-0.5 rounded-lg border border-slate-800">
            <button
              id="basemap-dark-btn"
              onClick={() => setBasemap('dark')}
              className={`px-2 py-0.5 text-[11px] rounded transition ${
                basemap === 'dark' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dark Meteorological Basemap"
            >
              Dark Met
            </button>
            <button
              id="basemap-sat-btn"
              onClick={() => setBasemap('satellite')}
              className={`px-2 py-0.5 text-[11px] rounded transition ${
                basemap === 'satellite' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="True Satellite Imagery"
            >
              Satellite
            </button>
            <button
              id="basemap-terrain-btn"
              onClick={() => setBasemap('terrain')}
              className={`px-2 py-0.5 text-[11px] rounded transition ${
                basemap === 'terrain' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Terrain Street Reference"
            >
              Terrain
            </button>
          </div>

          {/* Map Pan Lock / Unlock Stability Toggle */}
          <button
            id="toggle-pan-lock-btn"
            onClick={() => setIsPanUnlocked(!isPanUnlocked)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              isPanUnlocked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
            title={isPanUnlocked ? 'Pan is Unlocked (Click to lock map stable in place)' : 'Map is Stable & Locked (Page scrolling protected; click to unlock pan)'}
          >
            {isPanUnlocked ? <Unlock className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPanUnlocked ? 'Pan: Free' : 'Map: Stable (Locked)'}</span>
          </button>

          {/* Recenter Bounds Button */}
          <button
            id="map-recenter-btn"
            onClick={handleRecenter}
            className="p-1.5 bg-[#0F172A] hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition"
            title="Recenter & Fit District in Place"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          {/* Height Expand Toggle */}
          <button
            id="map-expand-btn"
            onClick={() => {
              setIsExpanded(!isExpanded);
              setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
              }, 300);
            }}
            className="p-1.5 bg-[#0F172A] hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition"
            title={isExpanded ? 'Collapse Height' : 'Expand Height'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Body Container: overflow-hidden & position: relative to prevent bleeding into siblings */}
      <div className={`relative w-full overflow-hidden ${isExpanded ? 'h-[620px]' : 'h-[460px] sm:h-[500px]'}`}>
        <div ref={mapContainerRef} className="w-full h-full overflow-hidden select-none" />

        {/* Scroll Stability Hint Overlay (Shown briefly when user scrolls wheel without Ctrl) */}
        {showScrollHint && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-slate-700 text-slate-200 text-xs px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur pointer-events-none flex items-center gap-2 animate-fade-in">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Page scroll preserved • Hold <strong>Ctrl</strong> or use <strong>+/-</strong> to zoom map</span>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-[#0F172A]/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-[230px] text-xs">
          <div className="font-bold text-slate-200 mb-1.5 flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="capitalize">
              {metric === 'heavyRain' ? 'Heavy Rain Risk' : metric === 'moistureDeficit' ? 'Moisture Deficit' : `${metric} Probability`}
            </span>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">Wk {horizon}</span>
          </div>

          {metric === 'onset' && (
            <div className="space-y-1 text-[10px] text-slate-300 font-mono">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500"></span> <span>&ge;75% (On Schedule)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-lime-500"></span> <span>50-74% (Slight Shift)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500"></span> <span>35-49% (Moderate Delay)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-500"></span> <span>&lt;35% (Severe Delay Risk)</span></div>
            </div>
          )}

          {metric === 'break' && (
            <div className="space-y-1 text-[10px] text-slate-300 font-mono">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500"></span> <span>&le;25% Low Break Risk</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500"></span> <span>26-55% Moderate Break</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500"></span> <span>56-70% High Break Risk</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-600"></span> <span>&gt;70% Severe Dry Spell</span></div>
            </div>
          )}

          {metric === 'heavyRain' && (
            <div className="space-y-1 text-[10px] text-slate-300 font-mono">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-sky-500"></span> <span>&le;20% Normal Spells</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500"></span> <span>21-45% Moderate Inundation</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-indigo-500"></span> <span>46-65% High Inundation</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-600"></span> <span>&gt;65% Severe Deluge Risk</span></div>
            </div>
          )}

          {metric === 'moistureDeficit' && (
            <div className="space-y-1 text-[10px] text-slate-300 font-mono">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500"></span> <span>&le;25% Field Saturated</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500"></span> <span>26-45% Moderate Deficit</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500"></span> <span>46-65% High Stress</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-700"></span> <span>&gt;65% Severe Drought</span></div>
            </div>
          )}

          <div className="mt-2 pt-1 border-t border-slate-800 text-[9px] text-slate-400 font-mono flex items-center justify-between">
            <span>Click block to inspect</span>
            <span className="text-sky-400">Panchayat Scale</span>
          </div>
        </div>

        {/* Top Right Quick Helper Badge */}
        <div className="absolute top-3 right-3 z-20 bg-[#0F172A]/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 flex items-center gap-1.5 shadow-lg backdrop-blur">
          <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
          <span>{localizedDistrictName} • {district.blocks.length} Blocks</span>
        </div>
      </div>
    </div>
  );
};
