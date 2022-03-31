
let nameIndex = 0;

function cacheifyFunc(cache: Cacheable, fn: (...args: any[]) => any, ...args: any[]) {

    type params = Parameters<typeof fn>
    type returnType = Awaited<ReturnType<typeof fn>>

    type proxyConfig = {
        maxAge?: number,
        dontCache?: boolean,
    }

    const nameStart = `cacheifiedfn${nameIndex}`
    nameIndex++

    const cFn = async function (config: proxyConfig, ...args: params): Promise<returnType> {
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

export default cacheifyFunc