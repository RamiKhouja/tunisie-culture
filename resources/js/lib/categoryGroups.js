import { hasCoordinates } from './culturalItemPosition.js';

export function categoryMatcher(categories) {
    const byId = new Map(categories.map(category => [String(category.id), category]));
    const rootId = id => {
        let category = byId.get(String(id));
        const visited = new Set();
        while (category?.parent_id != null) {
            if (visited.has(category.id)) return null;
            visited.add(category.id);
            category = byId.get(String(category.parent_id));
        }
        return category?.id;
    };
    return (item, categoryId) => item.categories?.some(member => String(rootId(member.id)) === String(categoryId)) || false;
}

export function categoryGroups(categories, items, governoratePositions = {}) {
    const matchesCategory = categoryMatcher(categories);
    return categories.filter(category => category.parent_id == null).flatMap(category => {
        const members = items.filter(item => item.kind === 'cultural' && matchesCategory(item, category.id));
        const places = new Map();
        members.forEach(item => {
            const state = item.state?.trim() || '';
            const city = item.city?.trim() || '';
            const coordinates = hasCoordinates(item) ? [Number(item.longitude), Number(item.latitude)] : null;
            const placeKey = state || city
                ? JSON.stringify([state.toLocaleLowerCase(), city.toLocaleLowerCase()])
                : coordinates ? JSON.stringify(coordinates) : 'unlocated';
            if (!places.has(placeKey)) places.set(placeKey, {
                key: JSON.stringify([category.id, placeKey]),
                category,
                place: [city, state].filter(Boolean).join(' · ') || (coordinates ? coordinates.join(', ') : 'Location pending'),
                items: [],
            });
            places.get(placeKey).items.push(item);
        });
        return [...places.values()].map(group => {
            const located = group.items.filter(hasCoordinates);
            // Keep the marker at a real item location near this local group's center.
            const center = located.length ? [located.reduce((sum, item) => sum + Number(item.longitude), 0) / located.length, located.reduce((sum, item) => sum + Number(item.latitude), 0) / located.length] : null;
            const anchor = center && located.reduce((best, item) => Math.hypot(item.longitude - center[0], item.latitude - center[1]) < Math.hypot(best.longitude - center[0], best.latitude - center[1]) ? item : best);
            const normalize = value => (value || '').trim().toLocaleLowerCase();
            const first = group.items[0];
            const neighbor = !anchor && first.city?.trim() && items.find(item => hasCoordinates(item)
                && normalize(item.state) === normalize(first.state)
                && normalize(item.city) === normalize(first.city));
            const fallback = neighbor ? [neighbor.longitude, neighbor.latitude] : governoratePositions[first.state?.trim()];
            return { ...group, position: anchor ? [anchor.longitude, anchor.latitude] : fallback || null, approximate: !anchor && Boolean(fallback) };
        });
    });
}
