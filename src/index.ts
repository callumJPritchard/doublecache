import { DiskCache } from './disk';
import { AutoAdjustingMemoryCache, MemoryCache } from './mem'
import { CombineCaches, cacheifyFunc } from './common'

type AutoConfig = {
    initialMaxSize?: number
    minimumSize?: number
    targetMemPercent?: number
}

const defaultMinimumSize = 10;
const defaultInitialMaxSize = 1000;
const defaultTargetMemPercent = 85;


class Cache implements Cacheable {

    private static _instance: Cache

    combinedCache: CombineCaches

    get: getterFunc

    set: setterFunc

    constructor(config?: AutoConfig) {
        this.combinedCache = new CombineCaches(
            new AutoAdjustingMemoryCache(
                {
                    minimumSize: config?.minimumSize || defaultMinimumSize,
                    initialMaxSize: config?.initialMaxSize || defaultInitialMaxSize,
                    targetMemPercent: config?.targetMemPercent || defaultTargetMemPercent
                }),
            new DiskCache())

        this.get = this.combinedCache.get
        this.set = this.combinedCache.set
    }

    updateSettings(config: AutoConfig) {
        (this.combinedCache.caches[0] as AutoAdjustingMemoryCache).minimumSize = config.minimumSize || defaultMinimumSize;
        (this.combinedCache.caches[0] as AutoAdjustingMemoryCache).maxSize = config.initialMaxSize || defaultInitialMaxSize;
        (this.combinedCache.caches[0] as AutoAdjustingMemoryCache).targetMemFrac = (config.targetMemPercent || defaultTargetMemPercent) / 100;

    }

    static getInstance() {
        if (!this._instance) this._instance = new Cache();

        return this._instance;
    }

    static cacheify(fn: Parameters<typeof cacheifyFunc>[1]) {
        return cacheifyFunc(this.getInstance(), fn)
    }
}

const doublecache = Cache.getInstance()

const cacheify = Cache.cacheify

export default doublecache

export { 
    doublecache, 
    cacheify,
    cacheifyFunc,
    CombineCaches,
    MemoryCache,
    AutoAdjustingMemoryCache
}