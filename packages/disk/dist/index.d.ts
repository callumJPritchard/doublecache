import { Cacheable, cacheItem } from "@multicache/types";
interface config {
    directory?: string;
    maxMemoryItems?: number;
}
declare class DiskCache implements Cacheable {
    directory: string;
    constructor(config?: config);
    get(key: string, maxAge?: number): Promise<cacheItem | undefined>;
    setBase(data: cacheItem): Promise<void>;
    set(key: string, data: any): Promise<void>;
    getFile(key: string): Promise<cacheItem[]>;
    setFile(key: string, fileData: any): Promise<void>;
    private keyToFileName;
}
export { DiskCache };
//# sourceMappingURL=index.d.ts.map