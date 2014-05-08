var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    _ = require('underscore'),
    util = require('./util');

var config = module.exports = {};

config.global = require('../../settings');

// default setting in menu bar 
config.settings = require('../../rules/settings') || {};
var defaultSetting = {
    keep: false,
    proxy: false,
    disablePool: false,
    disableCache: false,
    autoScroll: false,
    netSimulate: '10m',
    showSession: 'All',
    layout: 'Wide',
    tabSetting: 'Pool,Inspectors,Filter,Composer,Statistics,Timeline,Log',
    sessionColumns: 'Protocol,Method,Host,Path,ContentType,Caching,Body,Time'
};
config.settings = _.extend(defaultSetting, config.settings);

// rule config root node
config.pool = {};
// project collection
config.projs = [];
// rules groups(handler,router..) of all projs
config.groups = [];
// rules of all projs
config.rules = [];

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
};

config.loadRules = function() {
    var module = path.resolve(__dirname, '../../', 'rules/pool.js');
    if (!util.exists(module)) {
        logger = require('./logger');
        logger.error('rules/pool.js data file no found');
        return;
    }

    // init
    config.pool = {};
    config.projs = [];
    config.groups = [];
    config.rules = [];
    config.handlers = [];
    config.routers = [];

    var poolData = require(module);
    poolData.type = 'root';
    config.pool = poolData;

    _.each(poolData.children, function(proj) {

        proj.id = proj.id || util.getUUId();
        proj.type = 'proj';
        proj.checked = _.isUndefined(proj.checked) ? true : proj.checked;

        // fix base dir /
        var projBase = _.contains(['\\', '/'], proj.match.charAt(proj.match - 1)) ? proj.match : proj.match + path.sep;
        // var 
        var handler = [],
            router = [];

        // process data, 适配tree
        _.each(proj.children, function(ch) {
            ch.id = ch.id || util.getUUId();
            ch.type = 'group';
            ch.checked = _.isUndefined(ch.checked) ? true : ch.checked;
            ch.enableDrag = false;
            _.each(ch.children, function(rule) {
                rule.leaf = true;
                rule.id = rule.id || util.getUUId();
                rule.checked = _.isUndefined(rule.checked) ? true : rule.checked;
                config.rules.push(rule);

                if (proj.checked && ch.checked && rule.checked) {
                    if (ch.name == 'handler') {
                        handler.push(rule);
                    } else if (ch.name == 'router') {
                        router.push(rule);
                    }
                }
            });
            config.groups.push(ch);
        });

        handler.forEach(function(item) {
            item.match = item.match || '';
            // var split = item.match.split(/\s+/);
            var split = item.match.split('|');
            split.forEach(function(match) {
                var urlInfo = parseUrl(match);
                config.handlers.push({
                    // 数据兼容, 将match映射为base
                    base: projBase,
                    matchResolve: match.replace(/\./g, '\\.').replace(/\*/g, '.*'),
                    match: match,
                    actionResolve: item.action,
                    action: item.action,
                    indexPage: proj.index || config.global.index,
                    hostname: urlInfo.hostname,
                    pathname: urlInfo.pathname,
                    checked: _.isUndefined(item.checked) ? true : item.checked
                });
            });
        });

        router.forEach(function(item) {
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
                    checked: _.isUndefined(item.checked) ? true : item.checked
                });
            });
        });
        config.projs.push(proj);
    });
    // console.log(config.handlers);
    // console.log(config.routers);
};

config.saveRules = function(rules) {
    var module = path.resolve(__dirname, '../../', 'rules/pool.js');
    var backup = path.resolve(__dirname, '../../', 'rules/pool-bak-' + util.formatDate(new Date(), 'yyyyMMdd-hh') + '.js');
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

config.saveSettings = function() {
    var module = path.resolve(__dirname, '../../', 'rules/settings.js');
    var pool = 'module.exports=' + JSON.stringify(config.settings, null, 4);
    fs.writeFile(module, pool, function(err) {
        if (err) throw err;
    });
};

config.getHandler = function(reqInfo) {
    var action, extname, filepath, base;
    var urlRaw = reqInfo.url;
    var reqUrl = url.parse(urlRaw);
    var pathname = reqUrl.pathname;

    if (config.settings.disablePool) {
        return;
    }

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
    if (config.settings.disablePool) {
        return;
    }

    var urlRaw = reqInfo.url;
    return _.find(config.routers, function(router) {
        if (new RegExp(router.matchResolve).test(urlRaw)) {
            return true;
        }
        return false;
    });
};
