import shorthash from 'short-hash'
import { existsSync, mkdirSync, promises as fsPromises } from "fs";
import os from 'os'


type diskData = {
    [key: string]: cacheEntry
}

type lockIndex = {
    [key: string]: ((value?: any) => void)[]
}

class DiskCache {

    directory: string

    lockIndex: lockIndex = {}

    constructor() {
        this.directory = (process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory`
        let index = 0
        // increase index until directory is unique
        while (existsSync(this.directory)) this.directory = (process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory${index++}`
        mkdirSync(this.directory)
    }
    async get(key: string): Promise<cacheEntry | undefined> {
        const file = await this.getFile(key)
        return file[key]
    }
    async set(key: string, value: cacheEntry): Promise<void> {
        const existing = await this.getFile(key)
        existing[key] = value
        await this.writeFile(key, JSON.stringify(existing))
    }

    async getFile(key: string): Promise<diskData> {
        try {
            const file = await this.readFile(key)
            return JSON.parse(file.toString())
        } catch (e) {
            return {}
        }
    }

    private async readFile(key: string) {
        const shortcode = this.shortCode(key)
        this.lockIndex[shortcode] = this.lockIndex[shortcode] || []
        await new Promise<void>(resolve => {
            this.lockIndex[shortcode].push(resolve)

            if (this.lockIndex[shortcode].length === 1) resolve()
        })
        const res = fsPromises.readFile(this.getFilePath(key))
        this.lockIndex[shortcode][0] && this.lockIndex[shortcode][0]()
        this.lockIndex[shortcode].shift()
        return res
    }

    private async writeFile(key: string, data: string) {
        const shortcode = this.shortCode(key)
        this.lockIndex[shortcode] = this.lockIndex[shortcode] || []
        await new Promise<void>(resolve => {
            this.lockIndex[shortcode].push(resolve)

            if (this.lockIndex[shortcode].length === 1) resolve()
        })
        const res = fsPromises.writeFile(this.getFilePath(key), data)
        this.lockIndex[shortcode][0] && this.lockIndex[shortcode][0]()
        this.lockIndex[shortcode].shift()
        return res
    }

    private shortCode(key: string): string {
        return shorthash(key).slice(0, 2)
    }

    private getFilePath(key: string): string {
        return (`${this.directory}/${this.shortCode(key)}`)
    }
}
export { DiskCache };

