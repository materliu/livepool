
var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    _ = require('underscore'),
    util = require('./util');

var config = module.exports = {};

var eventCenter;

config.init = function (eventCenter){
    eventCenter = eventCenter;
};

config.global = {
    http: 8090,
    https: 8001,
    uiport: 8002,
    index: 'index.html',
    tempDir: __dirname + '/../../../tmp/http/',
    // proxy: 'proxy.tencent.com:8080'
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

function parseUrl(urlString){
    
    var pathname = '/', hostname = '';
    // 处理match，获取pathname
    var urlpath = urlString.match(/http[s]?/) ? urlString : 'http://' + urlString;
    var urlInfo = url.parse(urlpath.replace(/\*/g, '__ls__'));
    hostname = urlInfo.hostname.replace(/__ls__/g, '\*');
    pathname = urlInfo.pathname.replace(/__ls__/g, '\*');
    pathname = pathname.indexOf('*') > -1 ? pathname.substring(0, pathname.indexOf('*')) : pathname;
    pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1); 
    
    return {
        hostname: hostname,
        pathname: pathname
    };
}

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
        rules.enabled = _.isUndefined(item.enabled) ? 1 : item.enabled;
        rules.index = _.isUndefined(item.index) ? 0 : item.index;
        config.rulesGroup.push(rules);
        rules = _.extend(ruleGroup, rules);

        // 保存所有handler
        var handler = rules.handler;
        handler.forEach(function(item){
            item.match = item.match || '';
            var split = item.match.split(/\s+/);
            split.forEach(function(match){
                var urlInfo = parseUrl(match);
                config.handlers.push({
                    base: rules.base,
                    match: match.replace(/\./g, '\\.').replace(/\*/g, '.*'),
                    matchRaw: match,
                    action: item.action,
                    actionRaw: item.action,
                    indexPage: rules.index || config.global.index,
                    hostname: urlInfo.hostname,
                    pathname: urlInfo.pathname,
                    enabled: _.isUndefined(item.enabled) ? 1 : item.enabled
                });
            });
        });

        // 保存所有router
        var router = rules.router;
        router.forEach(function(item){
            item.match = item.match || '';
            var split = item.match.split(/\s+/);
            var pathname = '/', hostname = '';
            split.forEach(function(match){
                var urlInfo = parseUrl(match);
                config.routers.push({
                    match: match.replace(/\./g, '\\.').replace(/\*/g, '.*'),
                    matchRaw: match,
                    action: item.action,
                    actionRaw: item.action,
                    hostname: urlInfo.hostname,
                    pathname: urlInfo.pathname,
                    enabled: _.isUndefined(item.enabled) ? 1 : item.enabled
                });
            });
        });
    });
    // console.log(config.handlers);
    // console.log(config.routers);
};

config.updateRules = function(rules){

};
  
config.getHandler = function(reqInfo){
    var action, extname, filepath;
    var urlRaw = reqInfo.url;
    var reqUrl = url.parse(urlRaw);
    var pathname = reqUrl.pathname;

    return _.find(config.handlers, function(handler){
        if(new RegExp(handler.match).test(urlRaw)){
            // 处理默认页访问 www.livepool.com
            pathname = (pathname == '/') ? ('/' + handler.indexPage) : pathname;
            action = handler.actionRaw;
            var respond = {
                type: 'local'
            };

            if(_.isArray(action)){
                respond.type = 'combo';
                filepath = path.resolve(handler.base, pathname.replace('/', ''));
            }else if(action.match(/http[s]?/)){
                respond.type = 'remote';
            }else if(path.extname(action) == '.qzmin'){
                respond.type = 'qzmin';
            }else{
                
                if(util.detectDestType(action) == 'file'){
                    filepath = path.resolve(handler.base, action);
                }else{
                    filepath = path.resolve(handler.base, action, pathname.replace(handler.pathname, ''));
                }

                if(fs.existsSync(filepath)){
                    respond.type = 'local';
                }else{
                    return false;
                }
            }
            respond.filepath = filepath;
            handler.respond = respond;
            return true;
        }
        return false;
    });
};

config.getRouter = function(reqInfo){
    var urlRaw = reqInfo.url;
    return _.find(config.routers, function(router){
        if(new RegExp(router.match).test(urlRaw)){
            return true;
        }
        return false;
    });
};


