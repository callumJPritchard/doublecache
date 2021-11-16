"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheifyFunc = exports.CombineCaches = void 0;
const short_hash_1 = __importDefault(require("short-hash"));
class CombineCaches {
    constructor(...caches) { this.caches = caches; } // just add the caches to array
    async get(key, maxAge) {
        for (let i = 0; i < this.caches.length; i++) {
            const val = await this.caches[i].get(key, maxAge);
            if (val) { // we found it!
                // add to all faster caches
                while (i--)
                    await this.caches[i].set(key, val);
                return val; // return it
            }
        }
    }
    async set(key, value) {
        for (let cache of this.caches)
            await cache.set(key, value); // add to all caches
    }
}
exports.CombineCaches = CombineCaches;
function cacheifyFunc(cache, fn) {
    const nameStart = fn.name || (0, short_hash_1.default)(fn.toString()); // todo: make this more unique 
    const cFn = async function (config, ...args) {
        if (config.dontCache)
            return await fn(...args);
        const key = `${nameStart}-${JSON.stringify(args)}`;
        const val = await cache.get(key, config.maxAge);
        if (val)
            return val; // return it if we found it
        const ret = await fn(...args); // otherwise call the function
        await cache.set(key, ret); // and set it
        return ret;
    };
    const ret = (...args) => cFn({}, ...args);
    ret.config = (config) => (...args) => cFn(config, ...args);
    return ret;
}
exports.cacheifyFunc = cacheifyFunc;
