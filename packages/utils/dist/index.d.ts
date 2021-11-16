import { Cacheable } from '@multicache/types';
declare class CombineCaches implements Cacheable {
    caches: Cacheable[];
    constructor(...caches: Cacheable[]);
    get(key: string, maxAge?: number): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
}
declare function cacheifyFunc(cache: Cacheable, fn: (...args: any[]) => Promise<any>): {
    (...args: any[]): Promise<any>;
    config(config: {
        maxAge?: number | undefined;
        dontCache?: boolean | undefined;
    }): (...args: any[]) => Promise<any>;
};
export { CombineCaches, cacheifyFunc };
//# sourceMappingURL=index.d.ts.map