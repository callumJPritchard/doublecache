"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoAdjustingMemoryCache = exports.MemoryCache = void 0;
const os_1 = __importDefault(require("os"));
class MemoryCache {
    constructor(maxSize, trimThreshold) {
        this.cache = [];
        this.thresholdCounter = 0;
        this.maxSize = maxSize;
        this.trimThreshold = trimThreshold || Math.ceil(this.maxSize * 0.5);
    }
    async get(key, maxAge) {
        const val = this.cache.find(item => item.key === key);
        if (!val)
            return;
        if (maxAge && val.age + maxAge < Date.now())
            return; // too old, return early
        // update last accessed
        this.setBase({ key, value: val.value, age: val.age, lastAccess: Date.now() });
        return val.value;
    }
    setBase(data) {
        const index = this.cache.findIndex(item => item.key === data.key);
        index > -1 ? this.cache[index] = data : this.cache.push(data); // either update the other entry or push a new one
    }
    async set(key, data) {
        this.setBase({ key, value: data, age: Date.now(), lastAccess: Date.now() });
        // trim if we are oversized
        if (this.thresholdCounter++ >= this.trimThreshold) {
            this.thresholdCounter = 0;
            this.trim();
        }
    }
    trim() {
        this.cache.sort((a, b) => b.lastAccess - a.lastAccess);
        this.cache.length = Math.min(this.maxSize, this.cache.length);
    }
}
exports.MemoryCache = MemoryCache;
class AutoAdjustingMemoryCache extends MemoryCache {
    constructor(config) {
        super(config.initialMaxSize);
        this.targetMemFrac = config.targetMemPercent / 100;
        this.minimumSize = config.minimumSize || 10;
    }
    trim() {
        const maxRam = os_1.default.totalmem();
        const freeRam = os_1.default.freemem();
        const currentUse = freeRam / maxRam;
        if (currentUse < this.targetMemFrac)
            return; // we dont need to trim if we are below the target
        // we are over: how much are we over?
        const overFraction = currentUse - this.targetMemFrac;
        this.cache.sort((a, b) => b.lastAccess - a.lastAccess);
        this.cache.length = Math.min(Math.floor(this.cache.length - (this.cache.length * overFraction * 0.5)), this.minimumSize); // we want to trim half the amount we are over. Ensure we dont go below minimum size
    }
}
exports.AutoAdjustingMemoryCache = AutoAdjustingMemoryCache;
