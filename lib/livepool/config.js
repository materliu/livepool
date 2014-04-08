var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    _ = require('underscore'),
    util = require('./util');

var config = module.exports = {};

config.global = {
    http: 8090,
    https: 8001,
    uiport: 8002,
    index: 'index.html',
    tempDir: path.join(process.cwd(), 'tmp/http/')
    // proxy: 'proxy.tencent.com:8080'
};

// rule sample
var ruleGroup = {
    name: "__project__",
    index: 0,
    enabled: 0,
    base: '',
    host: '*',
    handler: [],
    router: []
};

config.pool = {};
config.projs = [];
config.rules = [];
config.groups = [];
// handlers(本地替换) 的优先级高级 routers(远程资源)
config.handlers = [];
config.routers = [];

function parseUrl(urlString) {

    var pathname = '/',
        hostname = '';
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

config.loadRules = function() {
    var module = path.join(process.cwd(), 'rules/pool.js');
    if (!util.exists(module)) {
        logger = require('./logger');
        logger.error('rules/pool.js data file no found');
        return;
    }

    config.rules = [];
    var id = 1;
    var poolData = require(module);
    poolData.type = 'root';
    config.pool = poolData;

    _.each(poolData.children, function(proj) {
        proj.id = id++;
        proj.type = 'proj';
        proj.checked = _.isUndefined(proj.checked) ? true : proj.checked;
        // proj.sort = _.isUndefined(proj.sort) ? 0 : proj.sort;
        var handler = [],
            router = [];

        // process data, 适配tree
        _.each(proj.children, function(ch) {
            ch.id = id++;
            ch.type = 'group';
            ch.checked = _.isUndefined(ch.checked) ? true : ch.checked;
            _.each(ch.children, function(rule) {
                rule.leaf = true;
                rule.id = id++;
                rule.checked = _.isUndefined(rule.enabled) ? true : rule.checked;
                config.rules.push(rule);
            });
            if (ch.name == 'handler') {
                handler = ch.children;
            } else if (ch.name == 'router') {
                router = ch.children;
            }
            config.groups.push(ch);
        });

        handler.forEach(function(item) {
            if (!item.checked)
                return;

            item.match = item.match || '';
            var split = item.match.split(/\s+/);
            split.forEach(function(match) {
                var urlInfo = parseUrl(match);
                config.handlers.push({
                    // 数据兼容, 将match映射为base
                    base: proj.match,
                    matchResolve: match.replace(/\./g, '\\.').replace(/\*/g, '.*'),
                    match: match,
                    actionResolve: item.action,
                    action: item.action,
                    indexPage: proj.index || config.global.index,
                    hostname: urlInfo.hostname,
                    pathname: urlInfo.pathname,
                    enabled: _.isUndefined(item.enabled) ? 1 : item.enabled
                });
            });
        });

        router.forEach(function(item) {
            if (!item.checked)
                return;

            item.match = item.match || '';
            // var split = item.match.split(/\s+/);
            var split = item.match.split('|');
            var pathname = '/',
                hostname = '';
            split.forEach(function(match) {
                var urlInfo = parseUrl(match);
                config.routers.push({
                    matchResolve: match.replace(/\./g, '\\.').replace(/\*/g, '.*'),
                    match: match,
                    actionResolve: item.action,
                    action: item.action,
                    hostname: urlInfo.hostname,
                    pathname: urlInfo.pathname,
                    enabled: _.isUndefined(item.enabled) ? 1 : item.enabled
                });
            });
        });
        config.projs.push(proj);
    });
    // console.log(config.handlers);
    // console.log(config.routers);
};

config.saveRules = function(rules) {
    var module = path.join(process.cwd(), 'rules/pool.js');
    var backup = path.join(process.cwd(), 'rules/pool-bak-' + util.formatDate(new Date(), 'yyyyMMdd-hh') + '.js');
    var pool = 'module.exports=' + JSON.stringify(config.pool, null, 4);
    var fs = require('fs');

    util.copyFile(module, backup, function(err) {
        if (err) throw err;
        fs.writeFile(module, pool, function(err) {
            if (err) throw err;
            config.loadRules();
        });
    });
};

config.getHandler = function(reqInfo) {
    var action, extname, filepath;
    var urlRaw = reqInfo.url;
    var reqUrl = url.parse(urlRaw);
    var pathname = reqUrl.pathname;

    return _.find(config.handlers, function(handler) {
        if (new RegExp(handler.matchResolve).test(urlRaw)) {
            // 处理默认页访问 www.livepool.com
            pathname = (pathname == '/') ? ('/' + handler.indexPage) : pathname;
            action = handler.action;

            var respond = {
                type: 'local'
            };

            // if (_.isArray(action)) {
            if (action.indexOf('|') >= 0) {
                respond.type = 'combo';
                filepath = path.resolve(handler.base, pathname.replace('/', ''));
            } else if (action.match(/http[s]?/)) {
                respond.type = 'remote';
            } else if (path.extname(action) == '.qzmin') {
                respond.type = 'qzmin';
            } else {

                if (util.detectDestType(action) == 'file') {
                    filepath = path.resolve(handler.base, action);
                } else {
                    filepath = path.resolve(handler.base, action, pathname.replace(handler.pathname, ''));
                }

                if (fs.existsSync(filepath)) {
                    respond.type = 'local';
                } else {
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

config.getRouter = function(reqInfo) {
    var urlRaw = reqInfo.url;
    return _.find(config.routers, function(router) {
        if (new RegExp(router.matchResolve).test(urlRaw)) {
            return true;
        }
        return false;
    });
};
