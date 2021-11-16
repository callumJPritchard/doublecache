import shortHash from "short-hash";
import {Cacheable, Awaited} from '@multicache/types'

type Combineable = Cacheable

class CombineCaches implements Cacheable {
    caches: Cacheable[];
    constructor(...caches: Cacheable[]) { this.caches = caches } // just add the caches to array

    async get(key: string, maxAge?: number): Promise<string | undefined> {
        for (let i = 0; i < this.caches.length; i++) {
            const val = await this.caches[i].get(key, maxAge);
            if (val) { // we found it!
                // add to all faster caches
                while (i--) await this.caches[i].set(key, val);
                return val; // return it
            }
        }
    }

    async set(key: string, value: string): Promise<void> {
        for (let cache of this.caches) await cache.set(key, value); // add to all caches
    }
}

function cacheifyFunc(cache: Cacheable, fn: (...args: any[]) => Promise<any>) {

    type params = Parameters<typeof fn>
    type returnType = Awaited<ReturnType<typeof fn>>

    type proxyConfig = {
        maxAge?: number,
        dontCache?: boolean,
    }

    const nameStart = fn.name || shortHash(fn.toString()) // todo: make this more unique 

    const cFn = async function (config: proxyConfig, ...args: params) {
        if (config.dontCache) return await fn(...args)

        const key = `${nameStart}-${JSON.stringify(args)}`
        const val = await cache.get(key, config.maxAge)

        if (val) return val // return it if we found it

        const ret = await fn(...args) // otherwise call the function

        await cache.set(key, ret)   // and set it

        return ret
    }

    const ret = (...args: params) => cFn({}, ...args)

    ret.config = (config: proxyConfig) => (...args: params) => cFn(config, ...args)

    return ret
}

export { CombineCaches, cacheifyFunc  }