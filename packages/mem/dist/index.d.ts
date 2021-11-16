import { Cacheable, cacheItem } from '@multicache/types';
declare class MemoryCache implements Cacheable {
    cache: cacheItem[];
    maxSize: number;
    trimThreshold: number;
    thresholdCounter: number;
    constructor(maxSize: number, trimThreshold?: number);
    get(key: string, maxAge?: number): Promise<void>;
    setBase(data: cacheItem): void;
    set(key: string, data: any): Promise<void>;
    trim(): void;
}
declare type AutoConfig = {
    initialMaxSize: number;
    minimumSize?: number;
    targetMemPercent: number;
};
declare class AutoAdjustingMemoryCache extends MemoryCache {
    targetMemFrac: number;
    minimumSize: number;
    constructor(config: AutoConfig);
    trim(): void;
}
export { MemoryCache, AutoAdjustingMemoryCache };
//# sourceMappingURL=index.d.ts.map