const MAX_CARDS = 15;

export function tunisiaToday(now = new Date()) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Tunis', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function newestFirst(items) {
    return [...items].sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0) || b.id - a.id).slice(0, MAX_CARDS);
}

export function upcomingDays(events, today) {
    const days = new Map();
    for (const event of events) {
        for (const slot of event.event_dates || []) {
            const date = slot.date?.slice(0, 10);
            if (!date || date < today) continue;
            if (!days.has(date)) days.set(date, []);
            days.get(date).push({ event, slot });
        }
    }
    let remaining = MAX_CARDS;
    return [...days].sort(([a], [b]) => a.localeCompare(b)).flatMap(([date, entries]) => {
        if (!remaining) return [];
        const visibleEntries = entries
            .sort((a, b) => a.slot.start_at.localeCompare(b.slot.start_at) || a.event.id - b.event.id)
            .slice(0, remaining);
        remaining -= visibleEntries.length;
        return [{ date, entries: visibleEntries }];
    });
}
