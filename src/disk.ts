import shorthash from 'short-hash'
import { existsSync, mkdirSync, promises as fsPromises } from "fs";
import os from 'os'
import { FileReaderWriter } from './fileReader'



class DiskCache {

    directory: string

    fileReaders: { [key: string]: FileReaderWriter } = {}

    constructor() {
        this.directory = (process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory`
        let index = 0
        // increase index until directory is unique
        while (existsSync(this.directory)) this.directory = (process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory${index++}`
        mkdirSync(this.directory)
    }

    async get(key: string): Promise<cacheEntry | undefined> {
        return this.getFileReader(key).get(key)
    }

    async set(key: string, value: cacheEntry): Promise<void> {
        return this.getFileReader(key).set(key, value)
    }

    private getFileReader(key: string): FileReaderWriter {
        const shortCode = this.shortCode(key)
        if (!this.fileReaders[shortCode]) this.fileReaders[shortCode] = new FileReaderWriter(this.getFilePath(key))
        return this.fileReaders[shortCode]
    }

    private shortCode(key: string): string {
        return shorthash(key).slice(0, 2)
    }

    private getFilePath(key: string): string {
        return (`${this.directory}/${this.shortCode(key)}`)
    }
}
export { DiskCache };

