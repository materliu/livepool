var path = require('path');
var localFileResponder = require('./local');

function templateResponder(tpl, req, res, options) {
    options = options || {};
    var _handler = {};
    var filepath = path.join(__dirname, '../../template', tpl);
    _handler.respond = {
        filepath: filepath
    };
    localFileResponder(_handler, req, res, {
        statusCode: options.statusCode
    });
};

module.exports = templateResponder;
