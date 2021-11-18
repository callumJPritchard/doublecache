import shorthash from 'short-hash';
import os from 'os';
import v8 from 'v8'

type cacheMap = Map<string, cacheEntry>

type cache = {
    [key: string]: cacheMap
}

class MemCache {
    private cache: cache = {}

    trimCounter = 0
    entryCounter = 0
    maxMemFrac = 0.9
    maxHeapFrac = 0.8

    private static _instance: MemCache;

    get(key: string): cacheEntry | undefined {
        return this.getCache(key).get(key);
    }
    set(key: string, value: cacheEntry): void {
        this.entryCounter++
        this.getCache(key).set(key, value);
        this.tryTrim()
    }
    private getCache(key: string): cacheMap {
        const cacheKey = shorthash(key).slice(0, 2)
        if (!this.cache[cacheKey]) this.cache[cacheKey] = new Map()
        return this.cache[cacheKey];
    }

    tryTrim() {
        if (this.trimCounter--) return

        this.trimCounter = 10

        const maxRam = os.totalmem();
        const freeRam = os.freemem();

        const maxHeap = v8.getHeapStatistics().heap_size_limit
        const usedHeap = v8.getHeapStatistics().used_heap_size

        const currentRamUse = 1 - (freeRam / maxRam)
        const currentHeapUse = usedHeap / maxHeap

        const overFraction = Math.max(currentRamUse - this.maxMemFrac, currentHeapUse - this.maxHeapFrac)

        if (overFraction <=0 ) return // we dont need to trim if we are below the targets on both

        const toTrim = (this.entryCounter * overFraction)

        const deleteGoal = Math.floor(Math.min(this.entryCounter * 0.1, toTrim))

        this.trim(deleteGoal)
    }

    trim(count: number): void {
        const oldest: { key: string, lastAccessed: number }[] = []

        for (let cacheKey in this.cache) {
            const cache = this.cache[cacheKey]

            for (let [key, value] of cache) {
                // push to end of oldest if this is older than the last entry
                if (!oldest.length || value.lastAccessed > oldest[oldest.length - 1].lastAccessed) {
                    oldest.push({ key: key, lastAccessed: value.lastAccessed })
                    oldest.sort((a, b) => a.lastAccessed - b.lastAccessed)
                    oldest.length = Math.min(oldest.length, count) // shrink if too big
                }
            }
        }
        // remove the oldest
        for (let entry of oldest) {
            this.getCache(entry.key).delete(entry.key)
            this.entryCounter--
        }
    }

    static getInstance() {
        if (!MemCache._instance) MemCache._instance = new this();

        return MemCache._instance;
    }
}
export { MemCache };