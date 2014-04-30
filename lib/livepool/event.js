var util = require('util');
var eventEmitter = require('events').EventEmitter;
var EventCenter = function() {
    eventEmitter.call(this);
};
util.inherits(EventCenter, eventEmitter);
module.exports = new EventCenter;
