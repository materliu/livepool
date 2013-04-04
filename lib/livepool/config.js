
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

config.ruleGroup = {
    name: "__project__",
    index: 0,
    enabled: 0,
    base: '',
    host: '*',
    // handleAll: 0, // 本地找不到替换版本，直接proxy代理线上
    handler: [],
    router: []
};

config.ruleGroups = [];

config.readConfig = function(){

};

config.updateConfig = function(config){

};

config.getAllHandlers = function(ruleGroups){
    if(!_.isArray(ruleGroups))  {
        ruleGroups = [ruleGroups];
    }
    _.each(ruleGroups, function(group){

    });
};

config.getHandler = function(reqUrl){

};

config.getRouter = function(reqUrl){

};


