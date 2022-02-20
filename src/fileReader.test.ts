import { FileReaderWriter } from './fileReader';
import { existsSync, mkdirSync, promises as fsPromises } from "fs";
import os from 'os'


function getDirBase() {
    let index = 0
    const dirBase = `${os.tmpdir()}/cacheDirectory/test`
    let ret = dirBase
    while (existsSync(ret)) ret = `${dirBase}${index++}`
    mkdirSync(ret)
    return ret
}

describe('basic FileReaderWriter tests', () => {
    const dirBase = getDirBase()
    const fileReaderWriter = new FileReaderWriter(dirBase + '/test')

    test('set and get', async () => {
        await fileReaderWriter.set('key', {
            value: 'value',
            created: Date.now(),
            lastAccessed: Date.now(),
        })
        const value = await fileReaderWriter.get('key')
        expect(value && value.value).toBe('value')
    }, 15 * 1000)

    test('set and get many', async () => {
        let promises = []
        const numToTest = 10_000

        for (let i = 0; i < numToTest; i++) {
            promises.push(fileReaderWriter.set(`key${i}`, {
                value: `value${i}`,
                created: Date.now(),
                lastAccessed: Date.now(),
            }))
        }
        await Promise.all(promises)
        promises = []
        for (let i = 0; i < numToTest; i++) {
            promises[i] = fileReaderWriter.get(`key${i}`)
        }
        const values = await Promise.all(promises)
        for (let i = 0; i < numToTest; i++) {
            const val = values[i] as any
            expect(val && val.value).toBe(`value${i}`)
        }
    })

    test('set many, wait, then get', async() => {
        let promises = []
        const numToTest = 10_000
        for (let i = 0; i < numToTest; i++) {
            promises.push(fileReaderWriter.set(`key${i}`, {
                value: `someValue${i}`,
                created: Date.now(),
                lastAccessed: Date.now(),
            }))
        }
        await Promise.all(promises)
        await new Promise(resolve => setTimeout(resolve, 100))

        promises = []
        for (let i = 0; i < numToTest; i++) {
            promises.push(fileReaderWriter.get(`key${i}`))
        }
        const values = await Promise.all(promises)
        for (let i = 0; i < numToTest; i++) {
            const val = values[i] as any
            expect(val && val.value).toBe(`someValue${i}`)
        }
    })
})