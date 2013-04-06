
var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    _ = require('underscore');

var config = module.exports = {};

var eventCenter;

config.init = function (eventCenter){
    eventCenter = eventCenter;
};

config.global = {
    http: 8000,
    https: 8001,
    proxy: "proxy.tencent.com:8080"
};

var ruleGroup = {
    name: "__project__",
    index: 0,
    enabled: 0,
    base: '',
    host: '*',
    handler: [],
    router: []
};

config.rulesGroup = [];
// handlers(本地替换) 的优先级高级 routers(远程资源)
config.handlers = [];
config.routers = [];

config.loadRules = function(){
    var rulePath = 'rules/';
    var dirList = fs.readdirSync(rulePath);
    var fileList = [];
    dirList.forEach(function(item){
        var filePath = rulePath + item;
        if(fs.statSync(filePath).isFile() && path.extname(filePath) == '.js'){
            fileList.push(filePath);
        }
    });
    fileList.forEach(function(item){
        var module = '../../' + path.dirname(item) + '/' + path.basename(item, '.js');
        var rules = require(module);
        rules.file = item;
        config.rulesGroup.push(rules);
        rules = _.extend(ruleGroup, rules);

        // 保存所有handler
        var handler = rules.handler;
        handler.forEach(function(item){
            item.match = item.match || '';
            var pathname = '/';
            var split = item.match.split(/\s+/);
            split.forEach(function(match){

                // 处理match，获取pathname
                var urlpath = match.match(/http[s]?/) ? match : 'http://' + match;
                pathname = url.parse(urlpath.replace(/\*/g, '__ls__')).pathname.replace(/__ls__/g, '\*');
                pathname = pathname.indexOf('*') > -1 ? pathname.substring(0, pathname.indexOf('*')) : pathname;
                pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1); 

                config.handlers.push({
                    base: rules.base,
                    match: match.replace(/\./g, '\\.').replace(/\*/g, '.*'),
                    matchRaw: match,
                    pathname: pathname,
                    action: item.action,
                    enabled: item.enabled
                });
            });
        });

        // 保存所有router
        var router = rules.router;
        router.forEach(function(item){
            item.match = item.match || '';
            var split = item.match.split(/\s+/);
            split.forEach(function(match){
                config.routers.push({
                    match: match.replace(/\./g, '\\.').replace(/\*/g, '.*'),
                    matchRaw: match,
                    action: item.action,
                    enabled: item.enabled
                });
            });
        });
    });
    console.log(config.handlers)
};

config.updateRules = function(rules){

};

config.getHandler = function(reqInfo){
    var urlRaw = reqInfo.url;
    var reqUrl = url.parse(urlRaw);
    var pathname = reqUrl.pathname;
    return _.find(config.handlers, function(handler){
        if(new RegExp(handler.match).test(urlRaw)){
            var filepath = path.resolve(handler.base, pathname.replace(handler.pathname, ''));
            if(fs.existsSync(filepath)){
                handler.filepath = filepath;
                return true;    
            }
        }
        return false;
    });
};

config.getRouter = function(reqInfo){
    
};


