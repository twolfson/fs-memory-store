// Load in dependencies and library
var fs = require('fs');
var expect = require('chai').expect;
var extend = require('obj-extend');
var fixtureUtils = require('mocha-fixture-dir')(require('fixture-dir'));
var Store = require('../');

// Set up our /tmp namespace
fixtureUtils.init('fs-memory-store-tests');

// Define helper utilities for interacting with our store
var storeUtils = {
  init: function (options) {
    before(function createStore () {
      // By default, use the temporary `fixtureUtils` directory
      var params = extend({dir: this.dir.path}, options);
      this.store = new Store(params);
    });
    after(function cleanupStore () {
      delete this.store;
    });
  },
  get: function (key) {
    before(function getValue (done) {
      var that = this;
      this.store.get(key, function handleGet (err, val) {
        that.err = err;
        that.val = val;
        done();
      });
    });
    after(function cleanupValues () {
      delete this.err;
      delete this.val;
    });
  },
  set: function (key, val) {
    before(function setValue (done) {
      var that = this;
      this.store.set(key, val, function handleSet (err) {
        that.err = err;
        done();
      });
    });
    after(function cleanupError () {
      delete this.err;
    });
  }
};

// Start our tests
describe('An `fs-memory-store`', function () {
  describe('loading a non-existent value (from memory and disk)', function () {
    fixtureUtils.mkdir({folderName: 'non-existent'});
    storeUtils.init();
    storeUtils.get('nothing');

    it('calls back with `null`', function () {
      expect(this.err).to.equal(null);
      expect(this.val).to.equal(null);
    });
  });

  describe('loading an existent value from disk', function () {
    fixtureUtils.mkdir({
      folderName: 'existent',
      copyFrom: __dirname + '/test-files/existent'
    });
    storeUtils.init();
    storeUtils.get('hello');

    it('retrieves the value', function () {
      expect(this.err).to.equal(null);
      expect(this.val).to.deep.equal({world: true});
    });
  });

  describe('saving a value', function () {
    fixtureUtils.mkdir({
      folderName: 'save'
    });
    storeUtils.init();
    storeUtils.set('hello', {moon: true});

    it('does not have any errors', function () {
      expect(this.err).to.equal(null);
    });

    it('writes the file to disk', function () {
      var files = fs.readdirSync(this.dir.path);
      expect(files).to.deep.equal(['hello.json']);
    });

    describe('loading the value from memory', function () {
      storeUtils.get('hello');

      it('loads its value', function () {
        expect(this.err).to.equal(null);
        expect(this.val).to.deep.equal({moon: true});
      });
    });
  });
});

// DEV: Previously, we tested loading from memory, now it is from disk
describe('A non-existent value from disk', function () {
  fixtureUtils.mkdir({
    folderName: 'non-existent-disk'
  });

  describe('when written', function () {
    storeUtils.init();
    storeUtils.set('hello', {sun: true});

    describe('and loaded from disk', function () {
      before(function (done) {
        var store = new Store({dir: this.dir.path});
        var that = this;
        store.get('hello', function (err, val) {
          that.val = val;
          done(err);
        });
      });

      it('loads its value', function () {
        expect(this.val).to.deep.equal({sun: true});
      });
    });
  });
});
describe('An existent value on disk', function () {
  fixtureUtils.mkdir({
    folderName: 'existent-disk',
    copyFrom: __dirname + '/test-files/existent'
  });

  describe('when overwritten', function () {
    storeUtils.init();
    storeUtils.set('hello', {stars: true});

    describe('and loaded again', function () {
      before(function (done) {
        var store = new Store({dir: this.dir.path});
        var that = this;
        store.get('hello', function (err, val) {
          that.val = val;
          done(err);
        });
      });

      it('loads its value', function () {
        expect(this.val).to.deep.equal({stars: true});
      });
    });
  });
});

// DEV: Assert that we do not have any contamination from either side to our in-memory cache
describe('A deep object saved to memory', function () {
  fixtureUtils.mkdir({
    folderName: 'deep-object-memory'
  });
  storeUtils.init();
  before(function (done) {
    this.obj = {headers: {host: '1234'}};
    this.store.set('hello', this.obj, done);
  });

  describe.skip('when the source value is modified', function () {
    before(function () {
      this.obj.headers.hai = true;
    });
    storeUtils.get('hello');

    it('does not effect the cached value', function () {
      expect(this.err).to.equal(null);
      expect(this.val).to.deep.equal({headers: {host: '1234'}});
    });
  });

  describe('when a cache-get value is modified', function () {
    storeUtils.get('hello');
    before(function () {
      this.val.headers.hai = true;
    });
    storeUtils.get('hello');

    it('does not effect the cached value', function () {
      expect(this.err).to.equal(null);
      expect(this.val).to.deep.equal({headers: {host: '1234'}});
    });
  });
});

describe.skip('A deep object loaded from disk', function () {
  fixtureUtils.mkdir({
    folderName: 'deep-object-disk'
  });
  storeUtils.init();

  describe('when a cache-get value is modified', function () {
    it('does not effect the cached value', function () {

    });
  });
});

