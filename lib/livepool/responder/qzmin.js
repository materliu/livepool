var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    comboResponder = require('./combo');

var qzminCache = {};

function js2json(jsString) {
    // Remove BOM
    if (jsString.charCodeAt(0) === 0xFEFF) {
        jsString = jsString.substring(1);
    }
    var result = jsString.replace(/([^"\s]\S+[^"])\s*:/g, '"$1":');
    return result.replace(/\'/g, '"');
};

function respond404(res) {
    // logger 
    res.writeHead(404);
    res.end();
}

function qzminResponder(handler, req, res, options) {
    var qzminFilepath = path.join(handler.base, handler.action);
    // console.log(qzminFilepath)
    if (!fs.existsSync(qzminFilepath)) {
        respond404(res);
        return;
    }

    var qzminDirPath = path.dirname(qzminFilepath);
    var qzminJson = js2json(fs.readFileSync(qzminFilepath, 'utf8'));
    var qzmin = JSON.parse(qzminJson);
    // qzmin 要配合willow其实只有projects有效
    var project = qzmin.projects[0];
    var target = path.join(qzminDirPath, project.target);

    var options = options || {},
        qzminStat;
    // check if qzmin combo out of date
    if (!qzminCache[qzminFilepath] || !((qzminStat = fs.statSync(qzminFilepath)) &&
        (qzminCache[qzminFilepath] - qzminStat.mtime.getTime()) > 500)) {
        // resolve include path
        var includes = _.map(project.include, function(value) {
            return path.join(qzminDirPath, value);
        });

        handler.action = includes.join('|');
        console.log(handler.action)
        qzminCache[qzminFilepath] = new Date().getTime();
        options.forceUpdate = true;
    }

    handler.respond.filepath = target;
    comboResponder(handler, req, res, options);
};

module.exports = qzminResponder;
