import { MemCache } from "./mem";

describe('test memory cache', () => {
    test('set a huge number of keys then trim', async () => {
        const cache = new MemCache();
        for (let i = 0; i < 200_000; i++) {
            await cache.set(`key${i}`, {value: `example data${i}`, created: Date.now(), lastAccessed: Date.now()});
        }
        cache.trim(100);
    }, 30 * 1000)

    test('set many keys with low max mem perc', async () => {
        const cache = new MemCache();
        cache.maxMemFrac = 0.1;
        for (let i = 0; i < 10_000; i++) {
            await cache.set(`key${i}`, {value: `example data${i}`, created: Date.now(), lastAccessed: Date.now()});
        }
    })
})