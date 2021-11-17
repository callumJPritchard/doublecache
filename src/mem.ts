class MemCache {
    private cache: Map<string, cacheEntry> = new Map<string, cacheEntry> ();

    private static _instance: MemCache;

    get(key: string): cacheEntry | undefined {
        return this.cache.get(key);
    }
    set(key: string, value: cacheEntry): void {
        this.cache.set(key, value);
    }
    static getInstance() {
        if (!MemCache._instance) MemCache._instance = new this();

        return MemCache._instance;
    }
}
export { MemCache };