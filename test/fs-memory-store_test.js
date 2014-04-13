// Load in dependencies and library
var fixtureUtils = require('mocha-fixture-dir')(require('fixture-dir'));
var Store = require('../');

// Set up our /tmp namespace
fixtureUtils.init('fs-memory-store-tests');

// Start our tests
describe('An `fs-memory-store`', function () {
  describe('loading a non-existent value (from memory and disk)', function () {
    fixtureUtils.mkdir({folderName: 'non-existent'});

    it('calls back with `null`', function () {

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
