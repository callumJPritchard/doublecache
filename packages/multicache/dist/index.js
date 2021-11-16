"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disk_1 = require("@multicache/disk");
const mem_1 = require("@multicache/mem");
const utils_1 = require("@multicache/utils");
class Cache {
    constructor(config) {
        this.combinedCache = new utils_1.CombineCaches(new mem_1.AutoAdjustingMemoryCache({
            minimumSize: (config === null || config === void 0 ? void 0 : config.minimumSize) || 10,
            initialMaxSize: (config === null || config === void 0 ? void 0 : config.initialMaxSize) || 1000,
            targetMemPercent: (config === null || config === void 0 ? void 0 : config.targetMemPercent) || 90
        }), new disk_1.DiskCache());
        this.get = this.combinedCache.get;
        this.set = this.combinedCache.set;
    }
    static getInstance() {
        if (!this._instance)
            this._instance = new Cache();
        return this._instance;
    }
}
const multicache = Cache.getInstance();
function cacheify(fn) {
    return (0, utils_1.cacheifyFunc)(multicache, fn);
}
