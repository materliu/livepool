var _ = require('underscore'),
    path = require('path'),
    fs = require('fs');
var exec = require('child_process').exec;

var util = module.exports = {};

util._ = _;

var win32 = process.platform === 'win32',
    windowsDriveRegExp = /^[a-zA-Z]\:\/$/,
    pathSeparatorRe = /[\/\\]/g;

var pathExists = fs.exists || path.exists;
var existsSync = fs.existsSync || path.existsSync;

util.exists = existsSync;

util.endsWith = function(src, str) {
    return str.length > 0 && src.substring(src.length - str.length, src.length) === str;
}

util.detectDestType = function(target) {
    return (util.endsWith(target, '\\') || util.endsWith(target, '/')) ? 'dir' : 'file';
};

util.mkdirpSync = function(dirpath, mode) {
    if (mode == null) {
        mode = parseInt('0777', 8) & (~process.umask());
    }
    // reduce方法把列表中元素归结为一个简单的数值
    dirpath.split(pathSeparatorRe).reduce(function(parts, part) {
        parts += path.join(part, path.sep);
        var subpath = path.resolve(parts);
        if (!existsSync(subpath)) {
            fs.mkdirSync(subpath, mode);
        }
        return parts;
    }, '');
};

/**   
 * 格式化日期
 * <code>
 * yyyy-------年
 * MM---------月
 * dd---------日
 * hh---------时
 * mm---------分
 * formatDate(new Date() , 'yyyy-MM-dd mm:hh');
 * or formateDate(new Date(), 'yyyy/MM/dd mm/hh');
 * </code> * @param {Date}date 需要格式化的日期对象
 * @param {Object} style 样式
 * @return 返回格式化后的当前时间
 */
util.formatDate = function(date, style) {
    var y = date.getFullYear();
    var M = "0" + (date.getMonth() + 1);
    M = M.substring(M.length - 2);
    var d = "0" + date.getDate();
    d = d.substring(d.length - 2);
    var h = "0" + date.getHours();
    h = h.substring(h.length - 2);
    var m = "0" + date.getMinutes();
    m = m.substring(m.length - 2);
    var s = "0" + date.getSeconds();
    s = s.substring(s.length - 2);
    return style.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('hh', h).replace('mm', m).replace('ss', s);
};

util.copyFile = function(source, target, cb) {
    var cbCalled = false;
    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
};

util.getUUId = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

/** chdir **/

function chdir(dir, cb) {
    chdir.push();
    process.chdir(dir);
    if (cb) {
        cb();
    }
    chdir.pop();
}

chdir.stack = [];

chdir.push = function(dir) {
    chdir.stack.push(dir === undefined ? process.cwd() : dir);
};

chdir.pop = function() {
    var dir = chdir.stack.shift();
    if (dir !== undefined) {
        process.chdir(dir);
    }
};

util.chdir = chdir;

util.speedLimitStart = function(type, port) {
    type = type || 'WIFI';
    var delay = 250; //ms
    var map = {
        'WIFI': {
            speed: '2048', // kbit/s
            delay: delay
        },
        'ADSL': {
            speed: '768',
            delay: delay
        },
        '3g': {
            speed: '348',
            delay: delay
        },
        'Edge': {
            speed: '64',
            delay: delay
        },
        'GPRS': {
            speed: '48',
            delay: delay
        }
    };
    var cmd = 'sh speedlimiter start ' + map[type].speed + ' ' + map[type].delay + ' 0 no localhost ' + port;
    var dir = path.resolve(__dirname, '../../', 'lib/tools');
    util.speedLimitStop(function() {
        util.chdir(dir, function() {
            exec(cmd, function(err) {
                if (err) {
                    throw err;
                }
            });
        });
    });
};

util.speedLimitList = function(callback) {
    var dir = path.resolve(__dirname, '../../', 'lib/tools');
    var cmd = 'sh speedlimiter list';
    util.chdir(dir, function() {
        exec(cmd, function(err, result) {
            if (err) {
                // console.log(err);
            }
            if (callback) {
                var lines = result.split('\n');
                var rules = [];
                _.each(lines, function(line) {
                    if (line.indexOf('8090') >= 0) {
                        rules.push(parseInt(line));
                    }
                })
                callback(rules);
            }
        });
    });
};

util.speedLimitStop = function(callback) {
    util.speedLimitList(function(rules) {
        console.log(rules);
        var cmd = 'sh speedlimiter stop ' + rules.join(' ');
        var dir = path.resolve(__dirname, '../../', 'lib/tools');
        util.chdir(dir, function() {
            exec(cmd, function(err) {
                if (err) {
                    // console.log(err);
                }
                if (callback) callback();
            });
        });
    })
};
