
var fs =require('fs'),
    comboResponder = require('./combo');

function js2json(jsString){
    var result = jsString.replace(/([^"\s]\S+[^"])\s*:/g, '"$1":');
    return result.replace(/\'/g, '"');
};

function qzminResponder(handler, req, res) {
    var qzminJson = js2json(file.read(filepath));
    var qzmin = JSON.parse(qzminJson);
    
    // qzmin 要配合willow其实只有projects有效
    var project = qzmin.projects[0];

    // resolve include path
    var includes = _.map(project.include, function(value){
        return path.join(path.dirname(filepath), value);
    });

    handler.action = includes;

    comboResponder(handler, req, res);
};

module.exports = qzminResponder;