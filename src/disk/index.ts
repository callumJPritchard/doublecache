import shortHash from "short-hash";
import { promisify } from "util";
import fs from "fs";
import os from "os";

interface config {
    directory?: string;
}


class DiskCache implements Cacheable {
    directory: string

    constructor(config?: config) {
        this.directory = (config?.directory || process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory`

        let index = 0
        // increase index until directory is unique
        while (fs.existsSync(this.directory)) this.directory = (config?.directory || process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory${index++}`

        fs.mkdirSync(this.directory)
    }

    async get(key: string, maxAge?: number): Promise<cacheItem | undefined> {

        const fileData = await this.getFile(key)

        const val = fileData.find(x => x.key === key)

        if (!val) return

        if (maxAge && val.age + maxAge < Date.now()) return // too old, return early

        await this.setBase(val)

        return val.value

    }

    async setBase(data: cacheItem): Promise<void> {
        const existing = await this.getFile(data.key)
        const found = existing.findIndex(x => x.key === data.key)
        const toSet = { key: data.key, value: data.value, age: data.age, lastAccess: Date.now() }

        found >= 0 ? existing[found] = toSet : existing.push(toSet) // either update the other entry or push a new one

        await this.setFile(data.key, existing)
    }

    async set(key: string, data: any): Promise<void> {
        await this.setBase({ key, value: data, age: Date.now(), lastAccess: Date.now() })
    }

    async getFile(key: string): Promise<cacheItem[]> {
        try {
            const data = await promisify(fs.readFile)(this.keyToFileName(key))
            return JSON.parse(data.toString())
        } catch (e) {
            return []
        }
    }

    async setFile(key: string, fileData: any): Promise<void> {
        await promisify(fs.writeFile)(this.keyToFileName(key), JSON.stringify(fileData))
    }

    private keyToFileName(key: string): string {
        return `${this.directory}/${shortHash(key)}`
    }
}

export { DiskCache }