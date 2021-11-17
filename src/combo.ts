import {MemCache} from './mem'
import {DiskCache} from './disk'

// get a singleton mem cache instance
const Mem = MemCache.getInstance()
const Disk = new DiskCache()


async function getFromCaches(key: string): Promise<cacheEntry | undefined> {
    // try the memory cache
    let val = Mem.get(key)
    // if not found, try the disk cache
    if (!val) val = await Disk.get(key)
    // if not found, return undefined
    return val;
}

async function setToCaches(key: string, value: cacheEntry): Promise<void> {
    // set to memory cache
    Mem.set(key, value)
    // set to disk cache
    await Disk.set(key, value)
}

async function get(key: string, maxAge?: number): Promise<any | undefined> {
    // get from caches 
    const entry = await getFromCaches(key)
    // if not found, return undefined
    if (!entry) return
    // if found, 
    // check it isnt too old
    if (maxAge && entry.created + maxAge < Date.now()) return
    // update lastAccessed
    await setToCaches(key, {
        value: entry.value,
        created: entry.created,
        lastAccessed: Date.now()
    })
    //return the value
    return entry.value
}

async function set(key: string, value: any): Promise<void> {
    // set to caches
    await setToCaches(key, {
        value,
        created: Date.now(),
        lastAccessed: Date.now()
    })
}

export {
    get, 
    set
}