
var fs =require('fs'),
    comboResponder = require('./combo');

var qzminCache = [];

function js2json(jsString){
    var result = jsString.replace(/([^"\s]\S+[^"])\s*:/g, '"$1":');
    return result.replace(/\'/g, '"');
};

function respond404(res){
    // logger 
    res.writeHead(404);
    res.end();
}

function qzminResponder(handler, req, res) {
    var qzminFilepath = path.join(handler.base, handler.actionRaw);
    if(!fs.existSync(qzminResponder)){
        respond404(res);
        return ;
    }

    var qzminDirPath = path.basename(qzminFilepath);
    var qzminJson = js2json(fs.readFileSync(qzminFilepath));
    var qzmin = JSON.parse(qzminJson);
    // qzmin 要配合willow其实只有projects有效
    var project = qzmin.projects[0];
    var target = path.join(qzminDirPath, project.target);

    var options = {},
        qzminStat;
    // check if qzmin combo out of date
    if(!qzminCache[qzminFilepath] && !(qzminStat = fs.statSync(qzminFilepath) && (qzminStat.mtime.getTime() - qzminCache[qzminFilepath]) < 500)){
        // resolve include path
        var includes = _.map(project.include, function(value){
            return path.join(qzminDirPath, value);
        });

        handler.action = includes;
        qzminCache[qzminFilepath] = new Date().getTime();
        options.forceUpdate = true;
    }

    comboResponder(handler, req, res, options);
};

module.exports = qzminResponder;