// Generate a store inside of `http-fixtures`
var Store = require('../');
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
