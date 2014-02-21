
var _ = require('underscore'),
    path = require('path'),
    fs = require('fs');

var util = module.exports = {};

util._ = _;

var win32 = process.platform === 'win32',
    windowsDriveRegExp = /^[a-zA-Z]\:\/$/,
    pathSeparatorRe = /[\/\\]/g;

var pathExists = fs.exists || path.exists;
var existsSync = fs.existsSync || path.existsSync;

util.exists = existsSync;

util.endsWith = function(src, str){
    return str.length > 0 && src.substring(src.length - str.length, src.length) === str;
}

util.detectDestType = function(target) {
    return (util.endsWith(target, '\\') || util.endsWith(target, '/')) ? 'dir' : 'file';
};

util.mkdirpSync = function(dirpath, mode) {
    if(mode == null) {
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