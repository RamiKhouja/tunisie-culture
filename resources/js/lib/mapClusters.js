// Screen-space clustering changes naturally with zoom and works for both map modes.
export function clusterPoints(items, project, radius = 44) {
    const clusters = [];
    const cells = new Map();
    for (const item of items) {
        const point = project([Number(item.longitude), Number(item.latitude)]);
        const x = Math.floor(point.x / radius), y = Math.floor(point.y / radius);
        let cluster;
        for (let dx = -1; dx <= 1 && !cluster; dx++) {
            for (let dy = -1; dy <= 1 && !cluster; dy++) {
                cluster = (cells.get(`${x + dx},${y + dy}`) || []).find(c => Math.hypot(c.x - point.x, c.y - point.y) < radius);
            }
        }
        if (cluster) cluster.items.push(item);
        else {
            cluster = { x: point.x, y: point.y, items: [item] };
            clusters.push(cluster);
            const key = `${x},${y}`;
            cells.set(key, [...(cells.get(key) || []), cluster]);
        }
    }
    return clusters;
}
