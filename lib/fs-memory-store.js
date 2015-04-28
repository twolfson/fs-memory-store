// Load in requirements
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var deepClone = require('clone');
var escapeRegExp = require('escape-string-regexp');
var glob = require('glob');
var mkdirp = require('mkdirp');

// Define glob escape helper
// TODO: Break out as another module
function escapeGlob(pattern) {
  // https://github.com/isaacs/node-glob/tree/v5.0.5#glob-primer
  return pattern.replace(/\*\?\[\]^\+\*@/g, '\\$&');
}

/**
 * Filesystem storage system with in-memory cache
 * @param dir {String} Directory to generate our store inside of
 * @param options {Object} Container for options/flags
 * @param [options.ext='.json'] {String} Optional extension to save values under
 * @param [options.stringify=JSON.stringify] {Function} Optional stringifier to pass values through
 * @param [options.parse=JSON.parse] {Function} Optional parser to load values through
 */
function Store(dir, options) {
  // Specify the directory and its options
  assert(dir, '`Store` expected a `dir` (directory) to be passed in but it was not defined');
  this.dir = dir;
  this.memoryCache = {};

  // Fallback options
  options = options || {};
  this.ext = options.ext || Store.ext;
  this.stringify = options.stringify || Store.stringify;
  this.parse = options.parse || Store.parse;
}
Store.ext = '.json';
Store.stringify = function (val) {
  return JSON.stringify(val, null, 2);
};
Store.parse = function (val) {
  return JSON.parse(val);
};
Store.prototype = {
  getFilepath: function (key) {
    return path.join(this.dir, key + this.ext);
  },
  get: function (key, cb) {
    var memoryCache = this.memoryCache;
    var cachedData = memoryCache[key];
    var that = this;
    if (cachedData) {
      process.nextTick(function () {
        // Deep clone the data to prevent mutation of internal cache
        cb(null, deepClone(cachedData));
      });
    } else {
      fs.readFile(this.getFilepath(key), function parseResponse (err, content) {
        // If there was an error
        if (err) {
          // If the file was not found, send back nothing
          if (err.code === 'ENOENT') {
            return cb(null, null);
          // Otherwise, send back the error
          } else {
            return cb(err);
          }
        }

        // Otherwise, parse the file
        // DEV: We use a try/catch in case the JSON is invalid
        var data;
        try {
          data = that.parse(content);
        } catch (err2) {
          return cb(err2);
        }
        memoryCache[key] = data;
        cb(null, deepClone(data));
      });
    }
  },
  keys: function (pattern, cb) {
    // Find our matches files
    var that = this;
    var globPattern = pattern + escapeGlob(this.ext);
    glob(globPattern, {cwd: this.dir}, function handleGlobResults (err, filepaths) {
      // If there was an error, callback with it
      if (err) {
        return cb(err);
      }

      // Otherwise, remove the extension and callback
      // DEV: `filepath` could contain a directory (e.g. `hello/world.json`)
      var extRegExp = new RegExp(escapeRegExp(that.ext) + '$');
      var keys = filepaths.map(function getKey (filepath) {
        return filepath.replace(extRegExp, '');
      });
      cb(null, keys);
    });
  },
  set: function (key, data, cb) {
    var filepath = this.getFilepath(key);
    var that = this;
    mkdirp(path.dirname(filepath), function (err) {
      if (err) {
        return cb(err);
      }
      that.memoryCache[key] = deepClone(data);
      fs.writeFile(filepath, that.stringify(data), cb);
    });
  },
  delete: function (key, cb) {
    var filepath = this.getFilepath(key);
    var that = this;
    delete that.memoryCache[key];
    fs.unlink(filepath, cb);
  }
};

// Export the store
module.exports = Store;
