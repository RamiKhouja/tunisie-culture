import { clusterPoints } from '@/lib/mapClusters';
import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import tunisiaOutline from './tunisia-outline.json';
import governorateLabels from './tunisia-labels.json';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useLanguage, localizedValue } from '@/i18n';
import rtlTextPluginUrl from '../../../node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js?url';

// Vite must bundle the worker and its imports instead of guessing a sibling URL.
maplibregl.setWorkerUrl(workerUrl);
maplibregl.setRTLTextPlugin(rtlTextPluginUrl, true);

// Keep the original Tunisia-sized frame. The unmasked basemap lets the
// neighboring countries show naturally around its edges without zooming out.
const bounds = [[7.5, 30.2], [11.7, 37.6]];
const mapDotsFrame = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [[[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]]] },
};
const emptyItems = [];
const hasCoordinates = (p) => p && p.longitude !== null && p.latitude !== null
    && p.longitude !== '' && p.latitude !== ''
    && Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude));
const hasMapPosition = (position) => Array.isArray(position) && position.length >= 2
    && Number.isFinite(Number(position[0])) && Number.isFinite(Number(position[1]));

// Keep geographic sources separate from presentation so terrain can be added later.
function mapStyle(locale) {
    const labelField = locale === 'ar' ? 'name_ar' : locale === 'fr' ? 'name_fr' : 'name';
    return {
        version: 8,
        glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
        sources: {
            topography: {
                type: 'vector',
                url: 'https://tiles.openfreemap.org/planet',
                attribution: '<a href="https://openfreemap.org/">OpenFreeMap</a> · <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors · ODbL</a>',
            },
            satellite: {
                type: 'raster',
                tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                tileSize: 256,
                attribution: '<a href="https://www.esri.com/en-us/legal/terms/full-text">Esri</a>',
            },
            'governorate-labels': { type: 'geojson', data: governorateLabels },
            'tunisia-outline': { type: 'geojson', data: tunisiaOutline },
            governorates: {
                type: 'geojson', data: '/maps/tunisia-governorates.geojson',
                attribution: '<a href="https://www.geoboundaries.org/">geoBoundaries</a> · <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors · ODbL</a>',
            },
        },
        layers: [
            { id: 'background', type: 'background', paint: { 'background-color': '#f0e4c8' } },
            { id: 'satellite', type: 'raster', source: 'satellite', layout: { visibility: 'none' }, paint: { 'raster-opacity': 1 } },
            { id: 'topography-landcover', type: 'fill', source: 'topography', 'source-layer': 'landcover', paint: { 'fill-color': '#f0e4c8', 'fill-opacity': 0.92 } },
            { id: 'topography-water', type: 'fill', source: 'topography', 'source-layer': 'water', paint: { 'fill-color': '#1f6386', 'fill-opacity': 0.92 } },
            { id: 'topography-waterway', type: 'line', source: 'topography', 'source-layer': 'waterway', paint: { 'line-color': '#6fa9b5', 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 10, 2.2] } },
            { id: 'governorates-fill', type: 'fill', source: 'governorates', paint: { 'fill-color': '#9CAF78', 'fill-opacity': 1 } },
            { id: 'selected-governorate', type: 'fill', source: 'governorates', filter: ['==', ['get', 'name'], ''], paint: { 'fill-color': '#a4502a', 'fill-opacity': 0.26 } },
            { id: 'governorates-border', type: 'line', source: 'governorates', paint: { 'line-color': '#F3E5C8', 'line-width': 1.5 } },
            { id: 'tunisia-outline-border', type: 'line', source: 'tunisia-outline', paint: { 'line-color': '#3e4a26', 'line-width': 2.2 } },
            { id: 'governorates-labels', type: 'symbol', source: 'governorate-labels', maxzoom: 8, layout: { 'text-field': ['get', labelField], 'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10, 8, 14], 'text-font': ['Noto Sans Regular'], 'text-allow-overlap': false, 'text-ignore-placement': false, 'text-variable-anchor': ['center', 'top', 'bottom', 'left', 'right'], 'text-radial-offset': 0.4, 'text-padding': 3 }, paint: { 'text-color': '#49351f', 'text-halo-color': '#f7ead0', 'text-halo-width': 1.5 } },
            { id: 'places-city-labels', type: 'symbol', source: 'topography', 'source-layer': 'place', minzoom: 8, maxzoom: 10, filter: ['all', ['==', ['get', 'class'], 'city'], ['within', tunisiaOutline]], layout: { 'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']], 'text-size': ['interpolate', ['linear'], ['zoom'], 6, 10, 10, 14], 'text-font': ['Noto Sans Regular'], 'text-allow-overlap': false, 'text-ignore-placement': false, 'text-anchor': 'top' }, paint: { 'text-color': '#49351f', 'text-halo-color': '#f7ead0', 'text-halo-width': 1.5 } },
            { id: 'places-town-labels', type: 'symbol', source: 'topography', 'source-layer': 'place', minzoom: 8, maxzoom: 11, filter: ['all', ['==', ['get', 'class'], 'town'], ['within', tunisiaOutline]], layout: { 'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']], 'text-size': 11, 'text-font': ['Noto Sans Regular'], 'text-allow-overlap': false, 'text-ignore-placement': false, 'text-anchor': 'top' }, paint: { 'text-color': '#60452f', 'text-halo-color': '#f7ead0', 'text-halo-width': 1.2 } },
            { id: 'places-village-labels', type: 'symbol', source: 'topography', 'source-layer': 'place', minzoom: 10, filter: ['all', ['==', ['get', 'class'], 'village'], ['within', tunisiaOutline]], layout: { 'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']], 'text-size': 10, 'text-font': ['Noto Sans Regular'], 'text-allow-overlap': false, 'text-ignore-placement': false, 'text-anchor': 'top' }, paint: { 'text-color': '#80674c', 'text-halo-color': '#f7ead0', 'text-halo-width': 1 } },
        ],
    };
}

function extendBounds(boundsObject, coordinates) {
    if (typeof coordinates[0] === 'number') {
        boundsObject.extend(coordinates);
        return;
    }
    coordinates.forEach((part) => extendBounds(boundsObject, part));
}

export default function TunisiaMap({ items = emptyItems, categoryGroups = emptyItems, onSelectCategory, onSelectItem, point, onChoosePoint, showNames = true, showPlacesNames = true, mapMode = 'vector', selectedState = '' }) {
    const { locale, dir, t } = useLanguage();
    const container = useRef(null);
    const mapRef = useRef(null);
    const governoratesRef = useRef(null);
    const callbacks = useRef({ onSelectItem, onChoosePoint, onSelectCategory });
    callbacks.current = { onSelectItem, onChoosePoint, onSelectCategory };
    const [ready, setReady] = useState(false);
    const [error, setError] = useState('');
    const [region, setRegion] = useState('');
    const [governoratesLoaded, setGovernoratesLoaded] = useState(false);
    const [decorOpacity, setDecorOpacity] = useState(1);

    useEffect(() => {
        let map;
        let cancelled = false;
        setReady(false);
        setError('');
        try {
            map = new maplibregl.Map({ container: container.current, style: mapStyle(locale), bounds,
                fitBoundsOptions: { padding: 0 }, maxZoom: 16, minZoom: 4,
                dragRotate: false, touchPitch: false, maxPitch: 0,
                renderWorldCopies: false, attributionControl: false });
        } catch {
            setError('The map could not start. Please use a browser with WebGL enabled.');
            return;
        }
        // The first fitted viewport is the outer limit at every zoom level.
        map.setMaxBounds(map.getBounds());
        map.setMinZoom(map.getZoom());
        map.touchZoomRotate.disableRotation();
        map.keyboard.disableRotation();
        mapRef.current = map;

        // MapLibre prevents the browser's default touch scrolling while a
        // one-finger pan is active. At a vertical map bound there is no more
        // map movement to consume, so hand the rest of that gesture to the
        // page instead of leaving the user stuck inside the map.
        const touchState = { lastY: null, handedOff: false };
        const atVerticalBound = (deltaY) => {
            const maxBounds = map.getMaxBounds();
            if (!maxBounds) return false;

            const viewport = map.getBounds();
            const epsilon = 0.0005;
            return deltaY > 0
                ? viewport.getSouth() <= maxBounds.getSouth() + epsilon
                : viewport.getNorth() >= maxBounds.getNorth() - epsilon;
        };
        const onTouchStart = (event) => {
            touchState.lastY = event.touches.length === 1 ? event.touches[0].clientY : null;
            touchState.handedOff = false;
        };
        const onTouchMove = (event) => {
            if (event.touches.length !== 1 || touchState.lastY === null) return;

            const currentY = event.touches[0].clientY;
            const deltaY = currentY - touchState.lastY;
            touchState.lastY = currentY;

            if (!touchState.handedOff && atVerticalBound(deltaY)) {
                touchState.handedOff = true;
                map.dragPan.disable();
                container.current.style.touchAction = 'pan-y';
            }

            if (touchState.handedOff && deltaY) {
                // Finger-up means page-down, matching native mobile scrolling.
                event.preventDefault();
                window.scrollBy(0, -deltaY);
            }
        };
        const onTouchEnd = () => {
            touchState.lastY = null;
            if (touchState.handedOff) map.dragPan.enable();
            touchState.handedOff = false;
            container.current.style.touchAction = '';
        };
        const mapContainer = container.current;
        mapContainer.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });
        mapContainer.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
        mapContainer.addEventListener('touchend', onTouchEnd, { capture: true, passive: true });
        mapContainer.addEventListener('touchcancel', onTouchEnd, { capture: true, passive: true });
        const initialZoom = map.getZoom();
        const updateDecorOpacity = () => {
            const progress = Math.max(0, Math.min(1, (map.getZoom() - initialZoom) / 2));
            setDecorOpacity(Number((1 - progress).toFixed(3)));
        };
        map.on('zoom', updateDecorOpacity);
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
        map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'OpenStreetMap' }), 'bottom-right');
        // MapLibre initializes compact attribution expanded; collapse it once per map mount.
        const attribution = map.getContainer().querySelector('.maplibregl-ctrl-attrib');
        if (attribution) {
            attribution.classList.remove('maplibregl-compact-show');
            attribution.removeAttribute('open');
        }
        map.on('load', () => {
            map.setPaintProperty('governorates-fill', 'fill-opacity', 1);
            map.setPaintProperty('governorates-fill', 'fill-color', '#9CAF78');
            map.setPaintProperty('topography-landcover', 'fill-opacity', 0);
            const dotsImage = new Image();
            dotsImage.onload = () => {
                if (cancelled) return;
                const tile = document.createElement('canvas');
                tile.width = 110;
                tile.height = 110;
                const tileContext = tile.getContext('2d');
                tileContext.drawImage(dotsImage, 0, 0, 110, 110);
                const imageData = tileContext.getImageData(0, 0, 110, 110);
                if (!map.hasImage('map-dots-pattern')) map.addImage('map-dots-pattern', imageData);
                if (!map.getSource('map-dots-frame')) map.addSource('map-dots-frame', { type: 'geojson', data: mapDotsFrame });
                if (!map.getLayer('neighbor-land-dots')) {
                    map.addLayer({
                        id: 'neighbor-land-dots',
                        type: 'fill',
                        source: 'map-dots-frame',
                        paint: { 'fill-pattern': 'map-dots-pattern', 'fill-opacity': 1 },
                    }, 'topography-water');
                }
            };
            dotsImage.src = '/storage/images/map-dots-pattern.svg';
            if (!cancelled) setReady(true);
        });
        map.on('error', () => setError('Map data could not load. Please reload to try again.'));
        map.on('mousemove', 'governorates-fill', (event) => {
            setRegion(event.features[0]?.properties.name || '');
            map.getCanvas().style.cursor = callbacks.current.onChoosePoint ? 'crosshair' : 'grab';
        });
        map.on('mouseleave', 'governorates-fill', () => setRegion(''));
        map.on('click', 'governorates-fill', (event) => {
            callbacks.current.onChoosePoint?.({ longitude: Number(event.lngLat.lng.toFixed(6)), latitude: Number(event.lngLat.lat.toFixed(6)) });
        });
        const observer = new ResizeObserver(() => map.resize());
        observer.observe(container.current);
        return () => {
            cancelled = true;
            setReady(false);
            map.off('zoom', updateDecorOpacity);
            observer.disconnect();
            mapContainer.removeEventListener('touchstart', onTouchStart, { capture: true });
            mapContainer.removeEventListener('touchmove', onTouchMove, { capture: true });
            mapContainer.removeEventListener('touchend', onTouchEnd, { capture: true });
            mapContainer.removeEventListener('touchcancel', onTouchEnd, { capture: true });
            map.remove();
            if (mapRef.current === map) mapRef.current = null;
        };
    }, [locale]);

    useEffect(() => {
        fetch('/maps/tunisia-governorates.geojson')
            .then((response) => response.ok ? response.json() : Promise.reject(new Error('Governorates could not load')))
            .then((data) => {
                governoratesRef.current = data.features || [];
                setGovernoratesLoaded(true);
            })
            .catch(() => setError('Map data could not load. Please reload to try again.'));
    }, []);

    useEffect(() => {
        if (!ready || !mapRef.current?.getLayer('governorates-labels')) return;
        mapRef.current.setLayoutProperty('governorates-labels', 'visibility', showNames ? 'visible' : 'none');
    }, [ready, showNames]);

    useEffect(() => {
        if (!ready || !governoratesLoaded) return;
        ['places-city-labels', 'places-town-labels', 'places-village-labels'].forEach((layerId) => {
            if (mapRef.current.getLayer(layerId)) mapRef.current.setLayoutProperty(layerId, 'visibility', showPlacesNames ? 'visible' : 'none');
        });
    }, [ready, governoratesLoaded, showPlacesNames]);

    useEffect(() => {
        if (!ready) return;
        const map = mapRef.current;
        const satelliteVisible = mapMode === 'real';
        map.setLayoutProperty('satellite', 'visibility', satelliteVisible ? 'visible' : 'none');
        ['topography-landcover', 'topography-water', 'topography-waterway', 'neighbor-land-dots'].forEach((layerId) => {
            if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', satelliteVisible ? 'none' : 'visible');
        });
    }, [ready, mapMode]);

    useEffect(() => {
        if (!ready) return;
        const map = mapRef.current;
        map.setFilter('selected-governorate', ['==', ['get', 'name'], selectedState]);
        if (!selectedState) {
            map.fitBounds(bounds, { padding: 35, duration: 500 });
            return;
        }
        const feature = governoratesRef.current?.find((candidate) => candidate.properties?.name === selectedState);
        if (!feature?.geometry?.coordinates) return;
        const selectedBounds = new maplibregl.LngLatBounds();
        extendBounds(selectedBounds, feature.geometry.coordinates);
        map.fitBounds(selectedBounds, { padding: 55, maxZoom: 9, duration: 700 });
    }, [ready, governoratesLoaded, selectedState]);

    useEffect(() => {
        if (!ready) return;
        const map = mapRef.current;
        let markers = [];
        let popup;
        const visible = items.filter(item => hasCoordinates(item) && (!selectedState || item.state === selectedState));
        const draw = () => {
            markers.forEach(marker => marker.remove());
            markers = clusterPoints(visible, coordinates => map.project(coordinates)).map(cluster => {
                const members = cluster.items;
                const item = members[0];
                const grouped = members.length > 1;
                const isCulturalPoint = !grouped && item.kind !== 'event';
                const groupedEvents = grouped && members.every(member => member.kind === 'event');
                const color = item.categories?.[0]?.color || '#8f3527';
                const colors = [...new Set(members.map(member => member.categories?.[0]?.color || '#8f3527'))];
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `map-point${grouped ? ' map-cluster' : ''}${groupedEvents ? ' map-event-cluster' : ''}${isCulturalPoint ? ' map-cultural-point' : ''}${members.some(member => member.kind === 'event' && member.glow) ? ' map-point-glow' : ''}`;
                const size = grouped ? Math.min(80, 30 + Math.sqrt(members.length) * 5) : (isCulturalPoint ? 22 : 15);
                button.style.width = `${size}px`;
                button.style.height = `${size}px`;
                button.style.setProperty('--point-color', color);
                if (groupedEvents) {
                    button.style.backgroundColor = '#d2a266';
                } else if (grouped && colors.length > 1) {
                    button.style.background = `conic-gradient(${colors.map((c, i) => `${c} ${i / colors.length * 100}% ${(i + 1) / colors.length * 100}%`).join(',')})`;
                } else {
                    button.style.backgroundColor = color;
                }
                const name = item.name?.en || item.name?.fr || item.name?.ar || 'Item';
                const eventCount = members.filter(member => member.kind === 'event').length;
                const title = grouped ? `${members.length} items: ${eventCount} events, ${members.length - eventCount} cultural items. Click to explore.` : name;
                button.title = title;
                button.setAttribute('aria-label', title);
                if (grouped) {
                    const label = document.createElement('span');
                    label.textContent = String(members.length);
                    button.append(label);
                }
                const center = [members.reduce((sum, m) => sum + Number(m.longitude), 0) / members.length, members.reduce((sum, m) => sum + Number(m.latitude), 0) / members.length];
                button.addEventListener('click', event => {
                    event.stopPropagation();
                    popup?.remove();
                    if (!grouped) { callbacks.current.onSelectItem?.(item); return; }
                    const samePosition = members.every(m => Math.abs(m.longitude - item.longitude) < 0.00001 && Math.abs(m.latitude - item.latitude) < 0.00001);
                    if (map.getZoom() >= 15 || samePosition) {
                        const list = document.createElement('div');
                        list.className = 'max-h-64 overflow-y-auto p-2';
                        members.forEach(member => {
                            const entry = document.createElement('button');
                            entry.className = 'block w-full border-b p-3 text-left text-sm';
                            entry.textContent = member.name?.en || member.name?.fr || member.name?.ar;
                            entry.onclick = () => { popup.remove(); callbacks.current.onSelectItem?.(member); };
                            list.append(entry);
                        });
                        popup = new maplibregl.Popup().setLngLat(center).setDOMContent(list).addTo(map);
                    } else {
                        const clusterBounds = new maplibregl.LngLatBounds();
                        members.forEach(member => clusterBounds.extend([member.longitude, member.latitude]));
                        map.fitBounds(clusterBounds, { padding: 90, maxZoom: Math.min(16, map.getZoom() + 3), duration: 500 });
                    }
                });
                return new maplibregl.Marker({ element: button }).setLngLat(center).addTo(map);
            });
        };
        draw();
        map.on('moveend', draw);
        map.on('resize', draw);
        return () => { map.off('moveend', draw); map.off('resize', draw); markers.forEach(marker => marker.remove()); popup?.remove(); };
    }, [items, ready, selectedState]);

    useEffect(() => {
        if (!ready) return;
        const map = mapRef.current;
        const groups = categoryGroups.filter(group => hasMapPosition(group.position));
        const markers = groups.map(group => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'category-map-point';
                button.style.setProperty('--point-color', group.category.color || '#8f3527');
                const name = group.category.name?.en || group.category.name?.fr || group.category.name?.ar || 'Category';
                button.title = `${name} · ${group.place} · ${group.items.length} cultural items`;
                button.setAttribute('aria-label', button.title);
                if (group.category.icon_url) {
                    const icon = document.createElement('img');
                    icon.src = group.category.icon_url;
                    icon.alt = '';
                    button.append(icon);
                } else {
                    button.textContent = name.slice(0, 1);
                }
                button.addEventListener('click', event => {
                    event.stopPropagation();
                    callbacks.current.onSelectCategory?.(group.key);
                });
                return new maplibregl.Marker({ element: button }).setLngLat(group.position).addTo(map);
        });
        const arrange = () => {
            const occupied = [];
            markers.forEach(marker => {
                const anchor = map.project(marker.getLngLat());
                let offset = [0, 0];
                for (let step = 0; step < 200; step++) {
                    const candidate = { x: anchor.x + offset[0], y: anchor.y + offset[1] };
                    if (occupied.every(other => Math.hypot(other.x - candidate.x, other.y - candidate.y) >= 32)) {
                        occupied.push(candidate);
                        break;
                    }
                    const angle = step * 2.4;
                    const radius = 16 * Math.sqrt(step + 1);
                    offset = [Math.cos(angle) * radius, Math.sin(angle) * radius];
                }
                marker.setOffset(offset);
            });
        };
        arrange();
        map.on('moveend', arrange);
        map.on('resize', arrange);
        return () => { map.off('moveend', arrange); map.off('resize', arrange); markers.forEach(marker => marker.remove()); };
    }, [ready, categoryGroups]);

    useEffect(() => {
        if (!ready || !hasCoordinates(point)) return;
        const marker = new maplibregl.Marker({ color: '#8f3527' }).setLngLat([point.longitude, point.latitude]).addTo(mapRef.current);
        return () => marker.remove();
    }, [point, ready]);

    const label = locale === 'ar'
        ? { sea: 'البحر الأبيض المتوسط', algeria: 'الجزائر', libya: 'ليبيا' }
        : locale === 'fr'
            ? { sea: 'Mer Méditerranée', algeria: 'Algérie', libya: 'Libye' }
            : { sea: 'Mediterranean Sea', algeria: 'Algeria', libya: 'Libya' };
    return <div className={`maqamat-map relative h-full w-full${locale === 'ar' ? ' maqamat-map-ar' : ''}`}>
        <div ref={container} className="h-full w-full" aria-label="Interactive map of Tunisia's 24 governorates" />
        <div className="map-zoom-fade" style={{ opacity: decorOpacity }} aria-hidden="true">
            <SeaWaves mapRef={mapRef} ready={ready} />
            <div className="map-label map-label-sea">{label.sea}</div>
            <div className="map-label map-label-algeria">{label.algeria}</div>
            <div className="map-label map-label-libya">{label.libya}</div>
            <MapIllustrations />
            <img className="map-compass" src="/storage/images/compass-rose.svg" alt="" />
        </div>
        {error && <p role="alert" className="absolute inset-x-4 top-20 rounded-lg bg-white p-3 text-sm text-red-800">{error}</p>}
        {region && <p dir={dir} className="pointer-events-none absolute bottom-12 left-4 rounded-lg bg-[#f7ead0] px-3 py-2 text-sm font-semibold shadow">{localizedValue({ en: region, fr: region, ar: region }, locale)}</p>}
    </div>;
}

function SeaWaves({ mapRef, ready }) {
    const canvasRef = useRef(null);
    const patternRef = useRef(null);
    const waterPathRef = useRef(null);
    const tunisiaPathRef = useRef(null);
    const animationRef = useRef(null);
    const offsetRef = useRef(0);

    useEffect(() => {
        if (!ready || !mapRef.current || !canvasRef.current) return undefined;
        const map = mapRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let cancelled = false;

        const resizeCanvas = () => {
            const width = map.getContainer().clientWidth;
            const height = map.getContainer().clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const refreshWaterMask = () => {
            const path = new Path2D();
            map.queryRenderedFeatures({ layers: ['topography-water'] }).forEach((feature) => {
                const geometry = feature.geometry;
                if (!geometry || !['Polygon', 'MultiPolygon'].includes(geometry.type)) return;
                const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
                polygons.forEach((polygon) => polygon.forEach((ring) => {
                    ring.forEach(([longitude, latitude], index) => {
                        const point = map.project([longitude, latitude]);
                        if (index === 0) path.moveTo(point.x, point.y);
                        else path.lineTo(point.x, point.y);
                    });
                    path.closePath();
                }));
            });
            waterPathRef.current = path;

            const tunisiaPath = new Path2D();
            const polygons = tunisiaOutline.coordinates;
            polygons.forEach((polygon) => polygon.forEach((ring) => {
                ring.forEach(([longitude, latitude], index) => {
                    const point = map.project([longitude, latitude]);
                    if (index === 0) tunisiaPath.moveTo(point.x, point.y);
                    else tunisiaPath.lineTo(point.x, point.y);
                });
                tunisiaPath.closePath();
            }));
            tunisiaPathRef.current = tunisiaPath;
        };

        const draw = () => {
            if (cancelled) return;
            const width = map.getContainer().clientWidth;
            const height = map.getContainer().clientHeight;
            context.clearRect(0, 0, width, height);
            if (patternRef.current && waterPathRef.current) {
                context.save();
                // Use the normal winding rule so overlapping vector-tile water
                // polygons form one continuous sea instead of cancelling out.
                context.clip(waterPathRef.current);
                context.globalAlpha = 0.6;
                // Drift from north-east toward south-west: left and down.
                context.translate(-offsetRef.current, offsetRef.current);
                context.fillStyle = patternRef.current;
                context.fillRect(-192, -128, width + 384, height + 256);
                context.restore();

                // The basemap water layer can include tile artifacts at the
                // country edge. Remove Tunisia explicitly from the final
                // canvas so waves can never appear over its governorates.
                if (tunisiaPathRef.current) {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fill(tunisiaPathRef.current, 'evenodd');
                    context.restore();
                }
            }
            offsetRef.current = (offsetRef.current + 0.08) % 128;
            animationRef.current = window.requestAnimationFrame(draw);
        };

        const onMapChange = () => {
            resizeCanvas();
            refreshWaterMask();
        };

        resizeCanvas();
        refreshWaterMask();
        map.on('move', onMapChange);
        map.on('resize', onMapChange);

        const image = new Image();
        image.onload = () => {
            if (!cancelled) {
                patternRef.current = context.createPattern(image, 'repeat');
                animationRef.current = window.requestAnimationFrame(draw);
            }
        };
        image.src = '/storage/images/sea-waves-pattern.svg';

        return () => {
            cancelled = true;
            map.off('move', onMapChange);
            map.off('resize', onMapChange);
            if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
        };
    }, [mapRef, ready]);

    return <canvas ref={canvasRef} className="map-sea-waves" aria-hidden="true" />;
}

function MapIllustrations() {
    return <div className="map-illustrations" aria-hidden="true">
        <img className="map-cloud map-cloud-one" src="/storage/images/persian-cloud-motif.svg" alt="" />
        <img className="map-cloud map-cloud-two" src="/storage/images/persian-cloud-motif.svg" alt="" />
        <img className="map-cloud map-cloud-three" src="/storage/images/persian-cloud-motif.svg" alt="" />
        <img className="map-bird-flight map-bird-flight-top" src="/storage/images/flying-bird.gif" alt="" />
        <img className="map-bird-flight map-bird-flight-middle" src="/storage/images/flying-bird.gif" alt="" />
        <img className="map-boat" src="/storage/images/boat.webp" alt="" />
    </div>;
}
