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
```
import doublecache from 'doublecache'

function slowFunction(parameter) {
    // some very slow logic:
    // .
    // .
    // .

    console.log(parameter)
}

const wrapped = doublecache.cacheify(slowFunction)

console.log(wrapped('test1')) // the first call will be as slow as usual

console.log(wrapped('test1')) // the next call will be fast, as it is in the cache

console.log(wrapped('test2')) // this will be slow again as we dont have a cached result with this parameter

// lets try with test1 again, but we dont want a result older than 5s
// this will call slowFunction again if it has been more than 5s since the last call to wrapped('test1')
const returned = wrapped.config{maxAge: 5 * 1000})('test1') 


```
### setting and getting a key manually
```
import doublecache from 'doublecache'

doublecache.set('key a', 'value a: values can be of any type')

console.log(doublecache.get('key a'))  // logs  'value a: values can be of any type'

console.log(doublecache.get('unused key'))  // logs  undefined
```

### overriding default settings
```
import doublecache from 'doublecache'

doublecache.updateSettings({targetMemPercent: 50}) // we dont want to go above 50% memory usage
```

### the disk cache

this stores cache items in temporary files. by default governed by os.tmpdir(). this is not fast but allows storing a lot of data without impacting system memory

### the memory cache

this stores items in memory which is much faster. As memory usage reaches a limit (by default 85%) the least-recently used items will be evicted

### the doublecache

doublecache will try and get keys from memory first, and then try the disk cache if not found in memory
sets will write to both underlying caches

### cacheify (or doublecache.cacheify)

wrap a function with doublecache. the returned, wrapped function can be called as normal but the base function will only be called on cache miss
the key used for this cached function is a combination of function name and the parameters passed in

the returned wrapped function has an additional property: .config()  which can be used to pass options when calling the function

.config has options:   

     dontcache: just call the base function if true
     maxAge: a matching cache entry for this call must be less than <maxAge> millis old


### the parts

    cacheifyFunc
    CombineCaches
    MemoryCache
    AutoAdjustingMemoryCache

the default export is for doublecache:   
this is the instance of the cache, which can be used directly or used to cache-ify functions backed by this instance

## roadmap

coming up:  
- testing
- performance tests
- improve performance?