var assert = require('assert');
var binding = require("../build/Release/openproxy_setting");
assert.equal('world', binding.hello());

console.log('binding.hello() =', binding.hello())
