"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiskCache = void 0;
const short_hash_1 = __importDefault(require("short-hash"));
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
class DiskCache {
    constructor(config) {
        this.directory = ((config === null || config === void 0 ? void 0 : config.directory) || process.env.CACHE_DIRECTORY || os_1.default.tmpdir()) + `/cacheDirectory`;
        let index = 0;
        // increase index until directory is unique
        while (fs_1.default.existsSync(this.directory))
            this.directory = ((config === null || config === void 0 ? void 0 : config.directory) || process.env.CACHE_DIRECTORY || os_1.default.tmpdir()) + `/cacheDirectory${index++}`;
        fs_1.default.mkdirSync(this.directory);
    }
    async get(key, maxAge) {
        const fileData = await this.getFile(key);
        const val = fileData.find(x => x.key === key);
        if (!val)
            return;
        if (maxAge && val.age + maxAge < Date.now())
            return; // too old, return early
        await this.setBase(val);
        return val.value;
    }
    async setBase(data) {
        const existing = await this.getFile(data.key);
        const found = existing.findIndex(x => x.key === data.key);
        const toSet = { key: data.key, value: data.value, age: data.age, lastAccess: Date.now() };
        found >= 0 ? existing[found] = toSet : existing.push(toSet); // either update the other entry or push a new one
        await this.setFile(data.key, existing);
    }
    async set(key, data) {
        await this.setBase({ key, value: data, age: Date.now(), lastAccess: Date.now() });
    }
    async getFile(key) {
        try {
            const data = await (0, util_1.promisify)(fs_1.default.readFile)(this.keyToFileName(key));
            return JSON.parse(data.toString());
        }
        catch (e) {
            return [];
        }
    }
    async setFile(key, fileData) {
        await (0, util_1.promisify)(fs_1.default.writeFile)(this.keyToFileName(key), JSON.stringify(fileData));
    }
    keyToFileName(key) {
        return `${this.directory}/${(0, short_hash_1.default)(key)}`;
    }
}
exports.DiskCache = DiskCache;
