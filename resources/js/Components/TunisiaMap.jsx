import { clusterPoints } from '@/lib/mapClusters';
import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import tunisiaOutline from './tunisia-outline.json';
import governorateLabels from './tunisia-labels.json';
import VintageMapFlowers from './VintageMapFlowers';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useLanguage, localizedValue } from '@/i18n';
import rtlTextPluginUrl from '../../../node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js?url';

// Vite must bundle the worker and its imports instead of guessing a sibling URL.
maplibregl.setWorkerUrl(workerUrl);
maplibregl.setRTLTextPlugin(rtlTextPluginUrl, true);

const bounds = [[7.5, 30.2], [11.7, 37.6]];
// A world polygon with Tunisia cut out keeps all basemap layers inside the country.
const countryPolygons = tunisiaOutline.type === 'Polygon'
    ? [tunisiaOutline.coordinates] : tunisiaOutline.coordinates;
const outsideTunisia = {
    type: 'MultiPolygon',
    coordinates: [
        [
            [[-180, -85.051129], [180, -85.051129], [180, 85.051129], [-180, 85.051129], [-180, -85.051129]],
            ...countryPolygons.map(([ring]) => [...ring].reverse()),
        ],
        ...countryPolygons.flatMap((polygon) => polygon.slice(1).map((ring) => [[...ring].reverse()])),
    ],
};
const emptyItems = [];
const hasCoordinates = (p) => p && p.longitude !== null && p.latitude !== null
    && p.longitude !== '' && p.latitude !== ''
    && Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude));

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
            'outside-tunisia': { type: 'geojson', data: outsideTunisia },
            governorates: {
                type: 'geojson', data: '/maps/tunisia-governorates.geojson',
                attribution: '<a href="https://www.geoboundaries.org/">geoBoundaries</a> · <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors · ODbL</a>',
            },
        },
        layers: [
            { id: 'background', type: 'background', paint: { 'background-color': '#d9e5df' } },
            { id: 'satellite', type: 'raster', source: 'satellite', layout: { visibility: 'none' }, paint: { 'raster-opacity': 1 } },
            { id: 'topography-landcover', type: 'fill', source: 'topography', 'source-layer': 'landcover', paint: { 'fill-color': '#b9c9a6', 'fill-opacity': 0.42 } },
            { id: 'topography-water', type: 'fill', source: 'topography', 'source-layer': 'water', paint: { 'fill-color': '#82b7c5', 'fill-opacity': 0.72 } },
            { id: 'topography-waterway', type: 'line', source: 'topography', 'source-layer': 'waterway', paint: { 'line-color': '#5b9eb2', 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 10, 2.2] } },
            { id: 'governorates-fill', type: 'fill', source: 'governorates', paint: { 'fill-color': '#e6d5ab', 'fill-opacity': 0.52 } },
            { id: 'selected-governorate', type: 'fill', source: 'governorates', filter: ['==', ['get', 'name'], ''], paint: { 'fill-color': '#8f3527', 'fill-opacity': 0.26 } },
            { id: 'governorates-border', type: 'line', source: 'governorates', paint: { 'line-color': '#92744c', 'line-width': 1.3 } },
            { id: 'outside-tunisia-mask', type: 'fill', source: 'outside-tunisia', paint: { 'fill-color': '#f7ead0', 'fill-opacity': 1, 'fill-antialias': true } },
            { id: 'topography-peaks', type: 'symbol', source: 'topography', 'source-layer': 'poi', minzoom: 7, filter: ['all', ['==', ['get', 'class'], 'peak'], ['within', tunisiaOutline]], layout: { 'text-field': ['coalesce', ['get', 'name'], ['get', 'name:en']], 'text-size': 11, 'text-font': ['Open Sans Regular'], 'text-offset': [0, 0.8], 'text-anchor': 'top' }, paint: { 'text-color': '#536346', 'text-halo-color': '#f4ead1', 'text-halo-width': 1.2 } },
            { id: 'governorates-labels', type: 'symbol', source: 'governorate-labels', maxzoom: 8, layout: { 'text-field': ['get', labelField], 'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10, 8, 14], 'text-font': ['Open Sans Bold'], 'text-allow-overlap': false, 'text-ignore-placement': false, 'text-variable-anchor': ['center', 'top', 'bottom', 'left', 'right'], 'text-radial-offset': 0.4, 'text-padding': 3 }, paint: { 'text-color': '#49351f', 'text-halo-color': '#f7ead0', 'text-halo-width': 1.5 } },
            { id: 'places-city-labels', type: 'symbol', source: 'topography', 'source-layer': 'place', minzoom: 8, maxzoom: 10, filter: ['all', ['==', ['get', 'class'], 'city'], ['within', tunisiaOutline]], layout: { 'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']], 'text-size': ['interpolate', ['linear'], ['zoom'], 6, 10, 10, 14], 'text-font': ['Open Sans Bold'], 'text-allow-overlap': false, 'text-ignore-placement': false, 'text-anchor': 'top' }, paint: { 'text-color': '#49351f', 'text-halo-color': '#f7ead0', 'text-halo-width': 1.5 } },
            { id: 'places-town-labels', type: 'symbol', source: 'topography', 'source-layer': 'place', minzoom: 8, maxzoom: 11, filter: ['all', ['==', ['get', 'class'], 'town'], ['within', tunisiaOutline]], layout: { 'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']], 'text-size': 11, 'text-font': ['Open Sans Regular'], 'text-allow-overlap': false, 'text-ignore-placement': false, 'text-anchor': 'top' }, paint: { 'text-color': '#60452f', 'text-halo-color': '#f7ead0', 'text-halo-width': 1.2 } },
            { id: 'places-village-labels', type: 'symbol', source: 'topography', 'source-layer': 'place', minzoom: 10, filter: ['all', ['==', ['get', 'class'], 'village'], ['within', tunisiaOutline]], layout: { 'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']], 'text-size': 10, 'text-font': ['Open Sans Regular'], 'text-allow-overlap': false, 'text-ignore-placement': false, 'text-anchor': 'top' }, paint: { 'text-color': '#80674c', 'text-halo-color': '#f7ead0', 'text-halo-width': 1 } },
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

    useEffect(() => {
        let map;
        let cancelled = false;
        setReady(false);
        setError('');
        try {
            map = new maplibregl.Map({ container: container.current, style: mapStyle(locale), bounds,
                fitBoundsOptions: { padding: 35 }, maxZoom: 16, minZoom: 4,
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
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
        map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'OpenStreetMap' }), 'bottom-right');
        // MapLibre initializes compact attribution expanded; collapse it once per map mount.
        const attribution = map.getContainer().querySelector('.maplibregl-ctrl-attrib');
        if (attribution) {
            attribution.classList.remove('maplibregl-compact-show');
            attribution.removeAttribute('open');
        }
        map.on('load', () => { if (!cancelled) setReady(true); });
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
        return () => { cancelled = true; setReady(false); observer.disconnect(); map.remove(); if (mapRef.current === map) mapRef.current = null; };
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
        ['topography-landcover', 'topography-water', 'topography-waterway', 'topography-peaks'].forEach((layerId) => {
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
                const color = item.categories?.[0]?.color || '#8f3527';
                const colors = [...new Set(members.map(member => member.categories?.[0]?.color || '#8f3527'))];
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `map-point${grouped ? ' map-cluster' : ''}${members.some(member => member.kind === 'event' && member.glow) ? ' map-point-glow' : ''}`;
                const size = grouped ? Math.min(80, 30 + Math.sqrt(members.length) * 5) : 15;
                button.style.width = `${size}px`;
                button.style.height = `${size}px`;
                button.style.setProperty('--point-color', color);
                button.style.background = grouped && colors.length > 1 ? `conic-gradient(${colors.map((c, i) => `${c} ${i / colors.length * 100}% ${(i + 1) / colors.length * 100}%`).join(',')})` : color;
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
        const markers = categoryGroups.filter(group => group.position).map(group => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'category-map-point';
            button.style.backgroundColor = group.category.color || '#8f3527';
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

    return <div className="relative h-full w-full">
        <div ref={container} className="h-full w-full" aria-label="Interactive map of Tunisia's 24 governorates" />
        {ready && <VintageMapFlowers map={mapRef.current} polygons={countryPolygons} />}
        {error && <p role="alert" className="absolute inset-x-4 top-20 rounded-lg bg-white p-3 text-sm text-red-800">{error}</p>}
        {region && <p dir={dir} className="pointer-events-none absolute bottom-12 left-4 rounded-lg bg-[#f7ead0] px-3 py-2 text-sm font-semibold shadow">{localizedValue({ en: region, fr: region, ar: region }, locale)}</p>}
    </div>;
}
