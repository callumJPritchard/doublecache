import { AutoAdjustingMemoryCache } from ".";

describe('test trim functionality', () => {
    test('set a bunch of keys, lower the memory threshold and trim. expect minimum keys', async () => {
        const cache = new AutoAdjustingMemoryCache({
            initialMaxSize: 10,
            targetMemPercent: 90,
            minimumSize: 53
        })
        for (let i = 0; i < 100; i++) {
            await cache.set(`key${i}`, `value${i}`)
        }
        cache.targetMemFrac = 0.1
        cache.trim()
        expect(cache.cache.length).toBe(53)
    })
})