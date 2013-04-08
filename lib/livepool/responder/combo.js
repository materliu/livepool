
var fs =require('fs'),
    _ = require('underscore');

function respond404(res){
    // logger 
    res.writeHead(404);
    res.end();
}

function comboFiles(target, combos){

}

function respondFile(target, res){

}

function comboResponder(handler, req, res) {
    if(handler && _.isArray(handler.action)){
        var filepath = [], fileNotFound = false, maxMTime = new Date('1970').getTime();
        var target = handler.respond.filepath;
        var targetMTime, targetStat;
        // check all action file is exists
        _.each(handler.action, function(item){
            item = path.resolve(handler.base, item);
            filepath.push(item);
            // fileNotFound
            if(!fs.existSync(item)){
                fileNotFound = true;
                return ;
            }

            var stat = fs.statSync(item);
            if(stat && stat.mtime.getTime() > maxMTime){
                maxMTime = stat.mtime.getTime();
            }
        });

        // one of th combo file not found
        if(fileNotFound){
            respond404(res);
            return ;
        }

        // check target is exits and modify time is shorten than 500ms
        if(fs.existSync(target) && targetStat = fs.statSync(target) && (targetStat.mtime.getTime() - maxMTime) < 500){
            // nothing to do 
        }else{
            comboFiles(target, filepath);
        }
        respondFile(target, res);
    }else{
        respond404(res);
    }
}

module.exports = comboResponder;