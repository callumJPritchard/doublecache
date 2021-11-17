type cacheEntry = {
    value: any,
    created: number,
    lastAccessed: number
}

type Cacheable = {
    get: (key: string, maxAge?: number) => Promise<any>;
    set: (key: string, val: any) => Promise<void>;
}

type Awaited<T> = T extends PromiseLike<infer U> ? U : T