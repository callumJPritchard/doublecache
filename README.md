# doublecache

## what is it?  
get the speed of ram-based caching, with the storage limits of disk-based caching!  also provides an easy way to wrap functions, ensuring they will only be called if there isnt a suitable cached result

this package implements a 2-level cache for node packages, as well as the parts you need to make your own: such as replacing the disk-cache with a database-backed cache.  
the default doublecache uses both a disk-based cache and a memory-based cache

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


## roadmap



coming up:  
- testing
- performance tests
- improve performance with large sets of data and sets of large data
- improve performance around disk access