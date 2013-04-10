
var _ = require('underscore'),
    path = require('path'),
    fs = require('fs');

var util = module.exports = {};

util._ = _;

util.endsWith = function(src, str){
    return str.length > 0 && src.substring(src.length - str.length, src.length) === str;
}

util.detectDestType = function(target) {
    return (util.endsWith(target, '\\') || util.endsWith(target, '/')) ? 'dir' : 'file';
};
