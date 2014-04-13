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
_(Coming soon)_

## Examples
_(Coming soon)_

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
