import test from 'node:test';
import assert from 'node:assert/strict';
import { categoryGroups, categoryMatcher } from '../../resources/js/lib/categoryGroups.js';

test('roots include descendants once, retain unlocated items, and exclude events', () => {
    const categories = [{ id: 1, parent_id: null }, { id: 2, parent_id: 1 }, { id: 3, parent_id: 2 }, { id: 4, parent_id: null }];
    const items = [
        { id: 1, kind: 'cultural', state: 'Tunis', city: 'Carthage', categories: [{ id: 1 }, { id: 3 }], longitude: 10, latitude: 36 },
        { id: 2, kind: 'cultural', state: 'Tunis', city: 'Carthage', categories: [{ id: 2 }], longitude: null, latitude: null },
        { id: 3, kind: 'event', categories: [{ id: 1 }], longitude: 11, latitude: 35 },
    ];
    const groups = categoryGroups(categories, items);
    assert.deepEqual(groups.map(group => group.category.id), [1]);
    assert.deepEqual(groups[0].items.map(item => item.id), [1, 2]);
    assert.deepEqual(groups[0].position, [10, 36]);

});

test('broken or cyclic parent chains do not hang or leak into root categories', () => {
    const categories = [{ id: 1, parent_id: null }, { id: 2, parent_id: 3 }, { id: 3, parent_id: 2 }, { id: 4, parent_id: 99 }];
    assert.deepEqual(categoryGroups(categories, [{ kind: 'cultural', categories: [{ id: 2 }, { id: 4 }] }]), []);
});

test('same category produces separate local groups with stable selection keys', () => {
    const categories = [{ id: 1, parent_id: null }];
    const item = (id, state, city, longitude = 10, latitude = 36) => ({ id, kind: 'cultural', categories: [{ id: 1 }], state, city, longitude, latitude });
    const groups = categoryGroups(categories, [item(1, 'Tunis', 'Carthage'), item(2, 'Tunis', ' carthage '), item(3, 'Nabeul', 'Carthage'), item(4, 'Tunis', 'Tunis'), item(5, 'Sfax', '', null, null)]);
    assert.equal(groups.length, 4);
    assert.deepEqual(groups.map(group => group.items.map(item => item.id)), [[1, 2], [3], [4], [5]]);
    assert.equal(new Set(groups.map(group => group.key)).size, 4);
    assert.equal(groups[3].position, null);
    assert.equal(groups[0].place, 'Carthage · Tunis');
});

test('unlocated Music in Douz uses another category’s local item position', () => {
    const categories = [{ id: 1, parent_id: null }, { id: 2, parent_id: null }];
    const groups = categoryGroups(categories, [
        { id: 8, kind: 'cultural', state: 'Kébili', city: 'Douz', categories: [{ id: 1 }], longitude: 9.02, latitude: 33.46 },
        { id: 9, kind: 'cultural', state: 'Kébili', city: 'Douz', categories: [{ id: 2 }], longitude: null, latitude: null },
    ]);
    assert.deepEqual(groups[1].position, [9.02, 33.46]);
    assert.equal(groups[1].approximate, true);
    assert.deepEqual(groups[1].items.map(item => item.id), [9]);
});

test('unlocated groups fall back to their governorate when no local peer exists', () => {
    const groups = categoryGroups([{ id: 1, parent_id: null }], [
        { id: 1, kind: 'cultural', state: 'Kébili', city: 'Douz', categories: [{ id: 1 }] },
    ], { 'Kébili': [9, 33] });
    assert.deepEqual(groups[0].position, [9, 33]);
    assert.equal(groups[0].approximate, true);
});

test('category filtering includes events and cultural items under the same root', () => {
    const matches = categoryMatcher([{ id: 1, parent_id: null }, { id: 2, parent_id: 1 }, { id: 3, parent_id: null }]);
    const items = [
        { id: 1, kind: 'event', categories: [{ id: '2' }] },
        { id: 2, kind: 'cultural', categories: [{ id: 1 }, { id: 2 }] },
        { id: 3, kind: 'event', categories: [{ id: 3 }] },
        { id: 4, kind: 'event', categories: [] },
    ];
    assert.deepEqual(items.filter(item => matches(item, 1)).map(item => item.id), [1, 2]);
    assert.deepEqual(items.filter(item => item.kind === 'event' && matches(item, 1)).map(item => item.id), [1]);
    assert.deepEqual(items.filter(item => item.kind === 'cultural' && matches(item, 1)).map(item => item.id), [2]);
    assert.equal(matches({ categories: [{ id: 99 }] }, 1), false);
});
