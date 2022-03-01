class MemCache {
    private cache: Map<string, cacheEntry> = new Map()

    private maxEntries = 1000

    private static _instance: MemCache;

    constructor(maxEntries?: number) {
        this.maxEntries = maxEntries || this.maxEntries
    }

    get(key: string): cacheEntry | undefined {
        return this.cache.get(key);
    }
    set(key: string, value: cacheEntry): void {
        this.cache.set(key, value);
        this.trim()
    }
    trim() {
        let toDelete = this.cache.size - this.maxEntries
        while (toDelete-- > 0) {
            // get the oldest entry
            let oldest: (cacheEntry & { key: string }) | undefined
            this.cache.forEach((entry, key) => {
                if (!oldest || entry.lastAccessed < oldest.lastAccessed) oldest = { ...entry, key }
            })
            if (oldest) this.cache.delete(oldest.key)
        }
    }

    static getInstance(...args: ConstructorParameters<typeof MemCache>) {
        if (!MemCache._instance) MemCache._instance = new this();

        return MemCache._instance;
    }
}
export { MemCache };