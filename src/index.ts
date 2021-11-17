import { DiskCache } from './disk';
import { AutoAdjustingMemoryCache, MemoryCache } from './mem'
import { CombineCaches, cacheifyFunc } from './common'
import { cp } from 'fs';

type AutoConfig = {
    initialMaxSize?: number
    minimumSize?: number
    targetMemPercent?: number
}

const defaultMinimumSize = 10;
const defaultInitialMaxSize = 1000;
const defaultTargetMemPercent = 85;


class Cache extends CombineCaches implements Cacheable {

    private static _instance: Cache

    constructor(config?: AutoConfig) {
        super(new AutoAdjustingMemoryCache(
            {
                minimumSize: config?.minimumSize || defaultMinimumSize,
                initialMaxSize: config?.initialMaxSize || defaultInitialMaxSize,
                targetMemPercent: config?.targetMemPercent || defaultTargetMemPercent
            }),
        new DiskCache())
    }

    updateSettings(config: AutoConfig) {
        (this.caches[0] as AutoAdjustingMemoryCache).minimumSize = config.minimumSize || defaultMinimumSize;
        (this.caches[0] as AutoAdjustingMemoryCache).maxSize = config.initialMaxSize || defaultInitialMaxSize;
        (this.caches[0] as AutoAdjustingMemoryCache).targetMemFrac = (config.targetMemPercent || defaultTargetMemPercent) / 100;

    }

    static getInstance() {
        if (!this._instance) this._instance = new Cache();

        return this._instance;
    }

    static cacheify(fn: Parameters<typeof cacheifyFunc>[1]) {
        return cacheifyFunc(Cache.getInstance(), fn)
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