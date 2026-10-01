import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clusterPoints } from '../../resources/js/lib/mapClusters.js';
const items = [{ id: 1, longitude: 10, latitude: 10 }, { id: 2, longitude: 12, latitude: 12 }, { id: 3, longitude: 100, latitude: 100 }];
test('nearby points cluster and separate when zoomed in', () => {
    assert.deepEqual(clusterPoints(items, ([x, y]) => ({ x, y })).map(c => c.items.length), [2, 1]);
    assert.equal(clusterPoints(items, ([x, y]) => ({ x: x * 100, y: y * 100 })).length, 3);
});
test('identical coordinates remain accessible in a shared cluster', () => {
    assert.equal(clusterPoints([items[0], { ...items[0], id: 4 }], ([x, y]) => ({ x, y }))[0].items.length, 2);
    assert.deepEqual(clusterPoints([], () => null), []);
});
