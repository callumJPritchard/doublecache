import { CombineCaches, cacheifyFunc } from '@multicache/utils';
import { Cacheable, getterFunc, setterFunc } from '@multicache/types';
declare type AutoConfig = {
    initialMaxSize: number;
    minimumSize?: number;
    targetMemPercent: number;
};
declare class Cache implements Cacheable {
    private static _instance;
    combinedCache: CombineCaches;
    get: getterFunc;
    set: setterFunc;
    constructor(config?: AutoConfig);
    static getInstance(): Cache;
}
declare const multicache: Cache;
declare function cacheify(fn: Parameters<typeof cacheifyFunc>[1]): {
    (...args: any[]): Promise<any>;
    config(config: {
        maxAge?: number | undefined;
        dontCache?: boolean | undefined;
    }): (...args: any[]) => Promise<any>;
};
export { multicache, cacheify };
//# sourceMappingURL=index.d.ts.map