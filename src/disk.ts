import shorthash from 'short-hash'
import { existsSync, mkdirSync, promises as fsPromises } from "fs";
import os from 'os'


type diskData = {
    [key: string]: cacheEntry
}

class DiskCache{

    directory: string

    constructor() {
        this.directory = (process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory`
        let index = 0
        // increase index until directory is unique
        while (existsSync(this.directory)) this.directory = (process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory${index++}`
        mkdirSync(this.directory)
    }
    async getFile(key: string): Promise<diskData> {
        try {
            const file = await fsPromises.readFile(this.getFilePath(key))
            return JSON.parse(file.toString())
        } catch (e) {
            return {}
        }
    }
    async get(key: string): Promise<cacheEntry | undefined> {
        const file = await this.getFile(key)
        return file[key]
    }
    async set(key: string, value: cacheEntry): Promise<void> {
        const existing = await this.getFile(key)
        existing[key] = value
        await fsPromises.writeFile(this.getFilePath(key), JSON.stringify(existing))
    }
    getFilePath(key: string): string {
        return (`${this.directory}/${shorthash(key).slice(0,2)}`)
    }
}
export { DiskCache };

/*

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
*/