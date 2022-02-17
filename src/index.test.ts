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

    test('add and get large num of keys', async () => {

        const keysToTest = 500
        const proms = []
        for (let i = 0; i < keysToTest; i++) {
            proms.push(doublecache.set(`key${i}`, `value${i}`))
        }
        await Promise.all(proms)
        proms.length = 0
        for (let i = 0; i < keysToTest; i++) {
            proms.push(doublecache.get(`key${i}`))
        }
        await Promise.all(proms)
        for (let i = 0; i < keysToTest; i++) {
            const value = proms[i]
            expect(value).toBe(`value${i}`)
        }
    }, 60 * 1000)

})

describe('cacheify tests', () => {
    test('cacheified function should only be executed once', async () => {
        let count = 0
        async function fn() {
            count++
            return 'returned'
        }
        const cacheifiedFn = cacheify(fn)
        await cacheifiedFn()
        expect(count).toBe(1)

        await cacheifiedFn()
        expect(count).toBe(1)
    })
    test('unnamed cacheified function should only be executed once', async () => {
        let count = 0

        const cacheifiedFn = cacheify(async function () {
            count++
            return 'returned'
        })
        await cacheifiedFn()
        expect(count).toBe(1)

        await cacheifiedFn()
        expect(count).toBe(1)
    })
    test('dontcache config option on first call should mean function executes twice', async () => {
        let count = 0

        const cacheifiedFn = cacheify(async function () {
            count++
            return 'returned'
        })
        await cacheifiedFn.config({ dontCache: true })()
        expect(count).toBe(1)

        await cacheifiedFn()
        expect(count).toBe(2)
    })
    test('maxAge config option should be obeyed', async () => {
        let count = 0

        const cacheifiedFn = cacheify(async function () {
            count++
            return 'returned'
        })
        await cacheifiedFn()
        expect(count).toBe(1)

        await new Promise(resolve => setTimeout(resolve, 100))

        await cacheifiedFn.config({ maxAge: 1000 })()
        expect(count).toBe(1)

        await new Promise(resolve => setTimeout(resolve, 100))

        await cacheifiedFn.config({ maxAge: 10 })()
        expect(count).toBe(2)
    })
})