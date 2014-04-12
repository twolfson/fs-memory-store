// Load in requirements
var fs = require('fs');
var path = require('path');
var deepClone = require('clone');
var mkdirp = require('mkdirp');

/**
 * Filesystem storage system with in-memory cache
 * @param options {Object} Required container for options
 * @param [options.ext='.json'] {String} Optional extension to save values under
 * @param [options.stringify=JSON.stringify] {Function} Optional stringifier to pass values through
 * @param [options.parse=JSON.parse] {Function} Optional parser to load values through
 */
function Store(options) {
  this.dir = options.directory;
  this.memoryCache = {};
  this.ext = options.ext || '.json';
  this.stringify = options.stringify || JSON.stringify;
  this.parse = options.parse || JSON.parse;
}
Store.prototype = {
  getFilepath: function (key) {
    return path.join(this.dir, key + this.ext);
  },
  get: function (key, cb) {
    var memoryCache = this.memoryCache;
    var cachedData = memoryCache[key];
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
          data = this.parse(content);
        } catch (err) {
          return cb(err);
        }
        memoryCache[key] = data;
        cb(null, deepClone(data));
      });
    }
  },
  set: function (key, data, cb) {
    var filepath = this.getFilepath(key);
    var that = this;
    mkdirp(path.dirname(filepath), function (err) {
      if (err) {
        return cb(err);
      }
      that.memoryCache[key] = data;
      fs.writeFile(filepath, this.stringify(data), cb);
    });
  }
};

// Export the store
module.exports = Store;
