import { DiskCache } from './disk';
import { AutoAdjustingMemoryCache } from './mem'
import { CombineCaches, cacheifyFunc } from './common'

type AutoConfig = {
    initialMaxSize: number
    minimumSize?: number
    targetMemPercent: number
}


class Cache implements Cacheable {

    private static _instance: Cache

    combinedCache: CombineCaches

    get: getterFunc

    set: setterFunc

    constructor(config?: AutoConfig) {
        this.combinedCache = new CombineCaches(
            new AutoAdjustingMemoryCache(
                {
                    minimumSize: config?.minimumSize || 10,
                    initialMaxSize: config?.initialMaxSize || 1000,
                    targetMemPercent: config?.targetMemPercent || 90
                }),
            new DiskCache())

        this.get = this.combinedCache.get
        this.set = this.combinedCache.set
    }

    static getInstance() {
        if (!this._instance) this._instance = new Cache();

        return this._instance;
    }
}

const multicache = Cache.getInstance()

function cacheify(fn: Parameters<typeof cacheifyFunc>[1]) {
    return cacheifyFunc(multicache, fn)
}

export { multicache, cacheify }