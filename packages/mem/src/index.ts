import { Cacheable, cacheItem } from '@multicache/types'
import os from 'os'

class MemoryCache implements Cacheable {
    cache: cacheItem[] = []

    maxSize: number
    trimThreshold: number
    thresholdCounter = 0

    constructor(maxSize: number, trimThreshold?: number) {
        this.maxSize = maxSize
        this.trimThreshold = trimThreshold || Math.ceil(this.maxSize * 0.5)
    }

    async get(key: string, maxAge?: number): Promise<void> {
        const val = this.cache.find(item => item.key === key)
        if (!val) return

        if (maxAge && val.age + maxAge < Date.now()) return // too old, return early

        // update last accessed
        this.setBase({ key, value: val.value, age: val.age, lastAccess: Date.now() })

        return val.value
    }

    setBase(data: cacheItem): void {
        const index = this.cache.findIndex(item => item.key === data.key)

        index > -1 ? this.cache[index] = data : this.cache.push(data) // either update the other entry or push a new one
    }

    async set(key: string, data: any): Promise<void> {
        this.setBase({ key, value: data, age: Date.now(), lastAccess: Date.now() })
        // trim if we are oversized
        if (this.thresholdCounter++ >= this.trimThreshold) {
            this.thresholdCounter = 0
            this.trim()
        }
    }

    trim() {
        this.cache.sort((a, b) => b.lastAccess - a.lastAccess)
        this.cache.length = Math.min(this.maxSize, this.cache.length)
    }
}

type AutoConfig = {
    initialMaxSize: number
    minimumSize?: number
    targetMemPercent: number
}

class AutoAdjustingMemoryCache extends MemoryCache {
    targetMemFrac: number
    minimumSize: number

    constructor(config: AutoConfig) {
        super(config.initialMaxSize)
        this.targetMemFrac = config.targetMemPercent / 100
        this.minimumSize = config.minimumSize || 10
    }

    trim() {
        
        const maxRam = os.totalmem();
        const freeRam = os.freemem();

        const currentUse = freeRam / maxRam;
        if (currentUse < this.targetMemFrac) return // we dont need to trim if we are below the target

        // we are over: how much are we over?
        const overFraction = currentUse - this.targetMemFrac;

        this.cache.sort((a, b) => b.lastAccess - a.lastAccess)
        this.cache.length = Math.min(Math.floor(this.cache.length - (this.cache.length * overFraction * 0.5)), this.minimumSize); // we want to trim half the amount we are over. Ensure we dont go below minimum size
    }
}

export { MemoryCache, AutoAdjustingMemoryCache }