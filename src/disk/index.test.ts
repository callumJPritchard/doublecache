import { DiskCache } from ".";

describe('basic cache tests', () => {
    const cache = new DiskCache();

    test('should create a new cache', () => {
        expect(cache).toBeDefined();
    });

    test('should set and get a value', async () => {
        await cache.set('test', 'value');
        const value = await cache.get('test');
        expect(value).toEqual('value');
    });

    test('last access should be updated on get', async () => {
        await cache.set('test', 'value');
        await cache.get('test');
        const val1 = await cache.getFile('test');
        const item = val1.find(i => i.key === 'test');

        const lA1 = (item as any).lastAccess;

        await new Promise(resolve => setTimeout(resolve, 100));

        
        await cache.get('test');
        const val2 = await cache.getFile('test');
        const item2 = val2.find(i => i.key === 'test');

        const lA2 = (item2 as any).lastAccess;

        expect(lA2).toBeGreaterThan(lA1);

    })
})

describe('directory tests', () => {
    test('test a custom directory', async () => {
        const cache = new DiskCache({ directory: './tmp' });
        await cache.set('test', 'value');
        const value = await cache.get('test');
        expect(value).toEqual('value');
    })
    test('test reusing the same custom directory', async () => {
        const cache = new DiskCache({ directory: './tmp' });
        await cache.set('test', 'value');
        const value = await cache.get('test');
        expect(value).toEqual('value');
    })
})

