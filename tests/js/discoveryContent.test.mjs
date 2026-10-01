import test from 'node:test';
import assert from 'node:assert/strict';
import { newestFirst, upcomingDays, tunisiaToday } from '../../resources/js/lib/discoveryContent.js';
import { categoryMatcher } from '../../resources/js/lib/categoryGroups.js';

test('cultural items sort by creation time, with stable ID ties, without mutating input', () => {
    const items = [{ id: 9, created_at: '2026-09-19T12:00:00Z' }, { id: 2, created_at: '2026-09-21T12:00:00Z' }, { id: 3, created_at: '2026-09-21T12:00:00Z' }];
    assert.deepEqual(newestFirst(items).map(item => item.id), [3, 2, 9]);
    assert.deepEqual(items.map(item => item.id), [9, 2, 3]);
});

test('today follows Tunisia at the UTC date boundary', () => {
    assert.equal(tunisiaToday(new Date('2026-09-20T23:30:00Z')), '2026-09-21');
});

test('timeline excludes past slots, skips empty days, and orders dates and times', () => {
    const events = [
        { id: 1, event_dates: [{ id: 1, date: '2026-09-20', start_at: '23:00', end_at: '02:00' }, { id: 2, date: '2026-09-23', start_at: '18:00', end_at: '20:00' }, { id: 3, date: '2026-09-21', start_at: '20:00', end_at: '22:00' }] },
        { id: 2, event_dates: [{ id: 4, date: '2026-09-21', start_at: '09:00', end_at: '12:00' }] },
        { id: 3, event_dates: [] },
    ];
    const days = upcomingDays(events, '2026-09-21');
    assert.deepEqual(days.map(day => day.date), ['2026-09-21', '2026-09-23']);
    assert.deepEqual(days[0].entries.map(({ event }) => event.id), [2, 1]);
    assert.equal(days[1].entries[0].event.id, 1);
    assert.deepEqual(upcomingDays(events, '2026-09-24'), []);
});

test('category descendants and region selection restrict the timeline together', () => {
    const matches = categoryMatcher([{ id: 1 }, { id: 2, parent_id: 1 }, { id: 3 }]);
    const events = [
        { id: 1, state: 'Tunis', categories: [{ id: 2 }] },
        { id: 2, state: 'Sousse', categories: [{ id: 2 }] },
        { id: 3, state: 'Tunis', categories: [{ id: 3 }] },
    ].map(event => ({ ...event, event_dates: [{ id: event.id, date: '2026-09-21', start_at: '18:00', end_at: '20:00' }] }));
    const filtered = events.filter(event => matches(event, 1) && event.state === 'Tunis');
    assert.deepEqual(upcomingDays(filtered, '2026-09-21')[0].entries.map(({ event }) => event.id), [1]);
});
