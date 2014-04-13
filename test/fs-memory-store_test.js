// Load in dependencies and library
var expect = require('chai').expect;
var fixtureUtils = require('mocha-fixture-dir')(require('fixture-dir'));
var Store = require('../');

// Set up our /tmp namespace
fixtureUtils.init('fs-memory-store-tests');

// Define helper utilities for interacting with our store
var storeUtils = {
  init: function (options) {
    before(function createStore () {
      this.store = new Store(options);
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
    storeUtils.init({directory: '/tmp/fs-memory-store-tests/non-existent'});
    storeUtils.get('nothing');

    it('calls back with `null`', function () {
      expect(this.err).to.equal(null);
      expect(this.val).to.equal(null);
    });
  });

  describe.skip('loading an existent value from disk', function () {
    it('retrieves the value', function () {

    });
  });

  describe.skip('saving a value', function () {
    it('does not have any errors', function () {

    });

    describe('loading the value from memory', function () {
      it('loads its value', function () {

      });
    });
  });
});

describe.skip('An non-existent value from disk', function () {
  describe('when overwritten', function () {
    describe('and loaded again', function () {
      it('loads its value', function () {

      });
    });
  });
});
