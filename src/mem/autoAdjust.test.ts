import { AutoAdjustingMemoryCache } from ".";

describe('basic tests', () => {
    test('get and set using defaults', async () => {
        const cache = new AutoAdjustingMemoryCache({
            targetMemPercent: 90,
            initialMaxSize: 10
        });
        await cache.set('test123', 'value');
        const value = await cache.get('test123');
        expect(value).toEqual('value');
    })
})

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