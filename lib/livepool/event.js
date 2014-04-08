var util = require('util');
var eventEmitter = require('events').EventEmitter;
var EventCenter = function() {
    eventEmitter.call(this);
    this.on('custom', function(value) {
        // console.log('hi!');
    });
};
util.inherits(EventCenter, eventEmitter);
module.exports = EventCenter;
