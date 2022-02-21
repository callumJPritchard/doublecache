# doublecache

## what is it?  

Mem-limited caching backed up by disk-based caching.  
sets are written both to memory and disk, as mem usage creeps too high the least-recently accessed keys are trimmed from the memory cache.  
these keys will still be available on disk.  

## who is it aimed at?
probably not those looking for absolute highest performance. While this lib does aim to get good performance, its main goal is for caching expensive calls/functions where waiting for disk reads/writes is preferable  
    
## how does it work?
The memory storage simply stores on an object. as v8-reported memory usage reaches a threshold it will evict entries.
the disk storage uses shorthash to determine which file to store the entry in. This should ensure good-enough parallelism though a queue is also implemented to ensure safety in the case of collisions of concurrent writes

## using it

### install
```
npm i doublecache
```
### wrapping a function
all wrapped functions will become async
```
import { cacheify } from 'doublecache'

function slowFunction(parameter) {
    // some very slow logic:
    // .
    // .
    // .

    console.log(parameter)
}

const wrapped = cacheify(slowFunction)

console.log(await wrapped('test1')) // the first call will be as slow as usual

console.log(await wrapped('test1')) // the next call will be fast, as it is in the cache

console.log(await wrapped('test2')) // this will be slow again as we dont have a cached result with this parameter

// lets try with test1 again, but we dont want a result older than 5s
// this will call slowFunction again if it has been more than 5s since the last call to wrapped('test1')
const returned = await wrapped.config{maxAge: 5 * 1000})('test1') 


```
### setting and getting a key manually
```
import doublecache from 'doublecache'

await doublecache.set('key a', 'value a: values can be of any type')

console.log(await doublecache.get('key a'))  // logs  'value a: values can be of any type'

console.log(await doublecache.get('unused key'))  // logs  undefined
```
