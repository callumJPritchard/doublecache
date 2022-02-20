import { existsSync, mkdirSync, promises as fsPromises } from "fs";

type diskData = {
    [key: string]: cacheEntry
}

class FileReaderWriter {

    private readonly path: string

    private currentData: diskData | null = null // either null for not opened, or diskData for opened

    private queue: ((data: diskData) => any)[] = []

    constructor(path: string) {
        this.path = path
    }

    async get(key: string): Promise<cacheEntry | undefined> {
        return this.enqueue(async (data: diskData) => {
            return data[key]
        })
    }

    async set(key: string, value: cacheEntry): Promise<void> {
        await this.enqueue(async (data: diskData) => {
            data[key] = value
        })
    }

    private enqueue(fn: (data: diskData) => Promise<any>): ReturnType<typeof fn> {

        const queueLen = this.queue.length

        return new Promise<ReturnType<typeof fn>>(resolve => {
            // push onto queue
            this.queue.push(async (data: diskData) => {
                const value = await fn(data)
                resolve(value)
            })
            // if this is the only item, dequeue
            if (queueLen === 0) this.dequeue()
        })
    }

    private async dequeue(): Promise<void> {

        // get 1st item from queue. dont shift until execution done
        const fn = this.queue[0]

        if (!fn) return // no more items in queue, just return
        
        if (!this.currentData) { // not opened
            this.currentData = await this.readFile()
        }

        await fn(this.currentData) // execute item

        // if we just executed the last item, close file
        if (this.queue.length === 1) {
            if (this.currentData) await this.writeFile(this.currentData) // write to disk
            this.currentData = null
        }

        // remove from queue
        this.queue.shift()

        this.dequeue()
    }

    private async readFile(): Promise<diskData> {

        try {
            const data = await fsPromises.readFile(this.path, 'utf8')
            return JSON.parse(data)
        } catch (e: any) {
            if (e.code === 'ENOENT') return {}
            if (e.code === 'SyntaxError') console.log(await fsPromises.readFile(this.path, 'utf8'))
            throw e
        }
    }

    private async writeFile(data: diskData): Promise<void> {
        await fsPromises.writeFile(this.path, JSON.stringify(data))
    }
}

export { FileReaderWriter };