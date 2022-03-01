import { MemCache } from "./mem";

describe('test memory cache', () => {
    test('set a huge number of keys then trim', async () => {
        const cache = new MemCache();
        for (let i = 0; i < 200_000; i++) {
            await cache.set(`key${i}`, {value: `example data${i}`, created: Date.now(), lastAccessed: Date.now()});
        }
        cache.trim();
    }, 30 * 1000)
})