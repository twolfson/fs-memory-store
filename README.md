# fs-memory-store [![Build status](https://travis-ci.org/twolfson/fs-memory-store.png?branch=master)](https://travis-ci.org/twolfson/fs-memory-store)

Filesystem store with in-memory cache

This was built for usage with [`eight-track`][], an HTTP fixture library. It is designed for ease-of-access while debugging. By default, items will be stored to separate `.json` files in the folder.

[`eight-track`]: https://github.com/uber/eight-track

## Getting Started
Install the module with: `npm install fs-memory-store`

```javascript
// Generate a store inside of `http-fixtures`
var Store = require('fs-memory-store');
var store = new Store(__dirname + '/http-fixtures');

// Save a value
store.set('hello', {world: true}, function (err) {
  // If there was an error, `err` will be it

  // We have created `http-fixtures/hello.json`
  /*
  {
    "world": true
  }
  */

  // Load the value
  store.get('hello', function (err, val) {
    // If there was an error, `err` will be it
    // Log our value
    console.log(val); /* {world: true} */
  });

  // Load an non-existent value
  store.get('wat', function (err, val) {
    // If there was an error, `err` will be it
    // Log our value
    console.log(val); /* null */
  });
});
```

## Documentation
`fs-memory-store` returns `Store` as its `module.exports`.

### `Store(dir, options)`
Constructor for a new store

- dir `String`, Directory to generate our store inside of
- options `Object`, Container for options/flags
    - ext `String`, Extension to save values under. By default, this is `.json`
    - stringify `Function`, Stringifier to pass values through when saving to disk
        - By default, this is `JSON.stringify` with an indenation of 2
    - parse `Function`, Parser to pass values through when loading from disk
        - By default, this is `JSON.parse`

#### `Store#get(key, cb)`
Retrieve an item from memory with a fallback to disk.

- key `String`, Identifier to retrieve item by
- cb `Function`, Error-first callback function to receive item value
    - Signature should be `(err, val)`
    - err `Error|null`, If there was an error, this will be it
    - val `Mixed|null`, If the value was found, this will be it. If it was not found, this will be `null`.

#### `Store#set(key, val, cb)`
Save an item to memory and disk

- key `String`, Identifier to save item under
- val `Mixed`, Value to save under the `key`
- cb `Function`, Error-first callback function to handle errors
    - Signature should be `(err)`
    - err `Error|null`, If there was an error, this will be it

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## License
Copyright (c) 2014 Todd Wolfson

Licensed under the MIT license.
