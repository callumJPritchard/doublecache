type cacheableAny = (...args: any[]) => any;
type Awaited<T> = T extends PromiseLike<infer U> ? U : T

type getterFunc = (key: string, maxAge?: number) => Promise<any>;

type deleteFunc = (key: string) => Promise<void>;

type setterFunc = (key: string, value: any) => Promise<void>;

interface cacheItem {
    key: string;
    value: any;
    age: number;
    lastAccess: number;
}

interface Cacheable {

    get: getterFunc;
    set: setterFunc;

}
