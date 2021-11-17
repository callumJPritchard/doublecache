import { MemoryCache } from ".";

describe('test trim functionality', () => {
    test('set a bunch of keys, lower the memory threshold and trim. expect minimum keys', async () => {
        const cache = new MemoryCache(50, 1)

        for (let i = 0; i < 100; i++) {
            await cache.set(`key${i}`, `value${i}`)
        }
        expect(cache.cache.length).toBe(50)
    })
})