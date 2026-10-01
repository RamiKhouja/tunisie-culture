import { useEffect, useId, useRef } from 'react';

export default function VintageMapFlowers({ map, polygons }) {
    const maskId = `flowers-${useId().replace(/:/g, '')}`;
    const rockMaskId = `${maskId}-rock-mask`;
    const land = useRef(null);
    const rockLand = useRef(null);
    const flowers = useRef(null);
    useEffect(() => {
        const update = () => {
            if (!land.current) return;
            const path = polygons.flatMap((polygon) => polygon.map((ring) =>
                ring.map((coordinate, index) => {
                    const { x, y } = map.project(coordinate);
                    return `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
                }).join('') + 'Z',
            )).join('');
            land.current.setAttribute('d', path);
            rockLand.current?.setAttribute('d', path);

            // Keep the flowers decorative at the country view, then smoothly
            // remove them as the map becomes the user's focus.
            const zoomProgress = Math.max(0, Math.min(1, (map.getZoom() - map.getMinZoom()) / 2));
            const flowerOpacity = 0.5 * (1 - zoomProgress);
            flowers.current?.setAttribute('opacity', flowerOpacity.toFixed(3));
            if (flowers.current) flowers.current.style.visibility = flowerOpacity > 0 ? 'visible' : 'hidden';
        };
        update();
        map.on('render', update);
        return () => map.off('render', update);
    }, [map, polygons]);

    return <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
        <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style={{ maskType: 'luminance' }}>
                <rect width="100%" height="100%" fill="white" />
                <path ref={land} fill="black" fillRule="evenodd" stroke="black" strokeWidth="4" />
            </mask>
            <mask id={rockMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style={{ maskType: 'luminance' }}>
                <rect width="100%" height="100%" fill="black" />
                <path ref={rockLand} fill="white" fillRule="evenodd" />
            </mask>
        </defs>
        <rect width="100%" height="100%" fill="#81745c" opacity="0.20"
            mask={`url(#${rockMaskId})`} style={{ mixBlendMode: 'multiply' }} />
        <image href="/images/tunisia-limestone-texture.png" width="100%" height="100%"
            preserveAspectRatio="xMidYMid slice" opacity="0.28"
            mask={`url(#${rockMaskId})`} style={{ mixBlendMode: 'multiply' }} />
        <g ref={flowers} mask={`url(#${maskId})`} opacity="0.50">
            <image href="/images/vintage-jasmine-1.png" x="2%" y="6%" width="23%" height="30%" preserveAspectRatio="xMidYMid meet" />
            <image href="/images/vintage-jasmine-2.png" x="76%" y="31%" width="22%" height="29%" preserveAspectRatio="xMidYMid meet" />
            <image href="/images/vintage-jasmine-3.png" x="3%" y="69%" width="26%" height="25%" preserveAspectRatio="xMidYMid meet" />
        </g>
    </svg>;
}
