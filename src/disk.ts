import { mkdtempSync } from "fs";
import os from 'os'
import { FileReaderWriter } from './fileReader'



class DiskCache {

    readerLimit: number

    directory: string

    fileReaders: { [key: string]: FileReaderWriter } = {}

    constructor(readerLimit?: number) {
        const base = (process.env.CACHE_DIRECTORY || os.tmpdir()) + `/cacheDirectory`
        this.directory = mkdtempSync(base)

        this.readerLimit = readerLimit || 64
    }

    async get(key: string): Promise<cacheEntry | undefined> {
        return this.getFileReader(key).get(key)
    }

    async set(key: string, value: cacheEntry): Promise<void> {
        return this.getFileReader(key).set(key, value)
    }

    private getFileReader(key: string): FileReaderWriter {
        const shortCode = this.shortCode(key)
        if (!this.fileReaders[shortCode]) this.fileReaders[shortCode] = new FileReaderWriter(this.directory)
        return this.fileReaders[shortCode]
    }

    private shortCode(key: string): string {
        let hash = 5381
        let index = key.length

        while (index) hash = (hash * 33) ^ key.charCodeAt(--index);

        return ((hash >>> 0) % this.readerLimit) + '';
    }
}


export { DiskCache };

