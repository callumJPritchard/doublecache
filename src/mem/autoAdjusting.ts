import os from 'os'
import { MemoryCache } from '.'

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

export { AutoAdjustingMemoryCache }