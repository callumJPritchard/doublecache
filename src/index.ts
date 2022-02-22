import * as doublecache from './combo'

import cacheifyFunc from './cacheify'

import { DiskCache } from './disk'

const cacheify = (fn: Parameters<typeof cacheifyFunc>[1]) => cacheifyFunc(doublecache, fn)

export default {
    ...doublecache,
    cacheify
}

export {
    doublecache,
    cacheify
}