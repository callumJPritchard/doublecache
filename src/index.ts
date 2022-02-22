import * as doublecache from './combo'

import cacheifyFunc from './cacheify'

import { DiskCache } from './disk'

const cacheify = (fn: Parameters<typeof cacheifyFunc>[1]) => cacheifyFunc(doublecache, fn)

export default {
    ...doublecache,
    cacheify
}


async function testLimit(limit: number) {
    const cache = new DiskCache(limit)

    const toTest = 5_000

    const start = Date.now()

    const proms = []

    for (let i = 0; i < toTest; i++) {
        proms.push(cache.set(`key${i}`, {
            value: `value${i}`,
            created: Date.now(),
            lastAccessed: Date.now()
        }))
    }

    await Promise.all(proms)

    const end = Date.now()

    console.log(`${limit}: ${toTest} items in ${end - start}ms`)
}

async function testRange() {
    const ranges = [1, 2, 3, 4, 8, 16, 32, 64, 128, 256, 512]

    for (const range of ranges) {
        await testLimit(range)
    }
}

testRange()

export {
    doublecache,
    cacheify
}