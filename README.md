# fs-memory-store [![Build status](https://travis-ci.org/twolfson/fs-memory-store.png?branch=master)](https://travis-ci.org/twolfson/fs-memory-store)

Filesystem store with in-memory cache

This was built for usage with [`eight-track`][], an HTTP fixture library. It is designed for ease-of-access while debugging. By default, items will be stored to separate `.json` files in the folder.

[`eight-track`]: https://github.com/uber/eight-track

## Getting Started
Install the module with: `npm install fs-memory-store`

```javascript
var fs_memory_store = require('fs-memory-store');
fs_memory_store.awesome(); // "awesome"
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
