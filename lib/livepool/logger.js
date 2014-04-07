/**
 * logger 模块
 * Thanks to Caolan McMahon's work on Jam on which this file is based.
 * https://github.com/caolan/jam/
 */

var util = require('util'),
    colors = require('colors'),
    fs = require('fs');

var notify = require('./notify');

exports.level = 'info';

var forLevels = function(levels, fn) {
    return function(label, val) {
        for (var i = 0; i < levels.length; i++) {
            if (levels[i] === exports.level) {
                return fn(label, val);
            }
        }
    };
};

function log(msg) {
    console.log(msg);
    notify.log(msg.stripColors);
};

function logWithoutNotify(msg) {
    exports.log(msg);
};

/**
 * Logs debug messages, using util.inspect to show the properties of objects
 * (logged for 'debug' level only)
 */
exports.debug = forLevels(['debug'], function(label, val) {
    if (val === undefined) {
        val = label;
        label = null;
    }
    if (typeof val !== 'string') {
        val = util.inspect(val);
    }
    if (label && val) {
        log(label.magenta + ' ' + val);
    } else {
        log(label);
    }
});

/**
 * Logs info messages (logged for 'info' and 'debug' levels)
 */
exports.info = forLevels(['info', 'debug'], function(label, val) {
    if (val === undefined) {
        val = label;
        label = null;
    }
    if (typeof val !== 'string') {
        val = util.inspect(val);
    }
    if (label) {
        log(label.cyan + ' ' + val);
    } else {
        log(val);
    }
});

/**
 * Logs warnings messages (logged for 'warning', 'info' and 'debug' levels)
 */
exports.warn = exports.warning = forLevels(['warning', 'info', 'debug'], function(msg) {
    log(('Warning: '.bold + msg).yellow);
});

/**
 * Logs error messages (always logged)
 */
exports.error = function(err) {
    var msg = err.message || err.error || err;
    if (err.stack) {
        msg = err.stack.replace(/^Error: /, '');
    }
    log(('Error: '.bold + msg).red);
};

exports.log = function(label, val) {
    exports.info(label, val);
};

exports.logWithoutNotify = function(label, val) {
    logWithoutNotify(label, val);
};

exports.writeline = function() {
    exports.log('=========================================');
};

/**
 * Display a failure message if exit is unexpected.
 */
exports.clean_exit = false;
exports.end = function(msg) {
    exports.clean_exit = true;
    exports.success(msg);
};
exports.success = function(msg) {
    exports.log(('\n' + 'OK'.bold + (msg ? ': '.bold + msg : '')).green);
};

var _onExit = function() {
    if (!exports.clean_exit) {
        exports.log('\n' + 'Failed'.bold.red);
        process.removeListener('exit', _onExit);
        process.exit(1);
    }
};
process.on('exit', _onExit);

process.on('uncaughtException', function(err) {
    exports.error('uncaughtException: ' + (err.stack || err));

    // try{
    //     fs.appendFile('log/log.txt', '\r\n' + (err.stack || err), function (err) {
    //         if (err) throw err;
    //     });
    // }catch(e){
    //     exports.error(e);
    // }
});
