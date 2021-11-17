import doublecache, { cacheify } from '.'

describe('basic caching tests', () => {
    const keysToTest = 10

    test('add and get some keys', async () => {
        for (let i = 0; i < keysToTest; i++) {
            await doublecache.set(`key${i}`, `value${i}`)
        }
        for (let i = 0; i < keysToTest; i++) {
            const value = await doublecache.get(`key${i}`)
            expect(value).toBe(`value${i}`)
        }
    })
})