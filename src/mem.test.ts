import { MemCache } from "./mem";

describe('test memory cache', () => {
    test('set a huge number of keys', async () => {
        const cache = new MemCache();
        for (let i = 0; i < 2_000_000; i++) {
            await cache.set(`key${i}`, {value: `example data${i}`, created: Date.now(), lastAccessed: Date.now()});
        }
    }, 30 * 1000)
})