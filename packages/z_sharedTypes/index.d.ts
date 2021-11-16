export type cacheableAny = (...args: any[]) => any;
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

export type getterFunc = (key: string, maxAge?: number) => Promise<any>;

export type deleteFunc = (key: string) => Promise<void>;

export type setterFunc = (key: string, value: any) => Promise<void>;

export interface cacheItem {
    key: string;
    value: any;
    age: number;
    lastAccess: number;
}

export interface Cacheable {

    get: getterFunc;
    set: setterFunc;

}
