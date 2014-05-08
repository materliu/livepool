var path = require('path');
var fs = require('fs');
var url = require('url');
var mime = require('mime');
var config = require('../../livepool/config');
var proxy = require('../../livepool/proxy');
var util = require('../../livepool/util');
var liveapp = require('../liveapp');
var other = require('./other');
var that = exports;
var iconv = require('iconv-lite');
var _ = require('underscore');
var exec = require('child_process').exec;
var request = require('request');

var imageTypes = [
    'image/bmp',
    'image/jpeg',
    'image/png',
    'image/x-icon',
    'image/webp',
    'image/tiff',
    'image/gif'
];

function getUUId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

function removeChild(arr, record, isRoot) {
    // remove rules
    var parent = config.pool;
    if (!isRoot) {
        parent = _.find(arr, function(group) {
            return group.id == record.parentId;
        });
    }
    parent.children = _.filter(parent.children, function(item) {
        return item.id !== record.id;
    });
};

function sortChild(arr, records) {
    var parent = _.find(arr, function(group) {
        return group.id == records[0].parentId;
    });
    parent.children = _.sortBy(parent.children, function(item) {
        var r = _.find(records, function(newItem) {
            return item.id == newItem.id;
        });
        return r.sort;
    });
};

function sortProj(arr, records) {
    config.pool.children = _.sortBy(config.pool.children, function(item) {
        var r = _.find(records, function(newItem) {
            return item.id == newItem.id;
        });
        return r.sort;
    });
};

function updateChild(arr, record) {
    _.each(arr, function(child) {
        if (child.id == record.id) {
            child.name = record.name;
            child.match = record.match;
            child.action = record.action;
            child.checked = record.checked;
        }
    });
};

exports.index = function(req, res) {
    res.sendfile(path.join(__dirname, '../public/index.html'));
};

exports.getResRaw = function(req, res) {
    var socket = liveapp.socket;
    var filepath = config.global.tempDir + socket.id + '/' + req.param('idx') + '_s.txt';
    if (fs.existsSync(filepath)) {
        res.statusCode = 200;
        res.setHeader('Server', 'livepool');

        fs.createReadStream(filepath).pipe(res);
    }
};

exports.getResGet = function(req, res) {
    var socket = liveapp.socket;
    var filepath = config.global.tempDir + socket.id + '/' + req.param('idx') + '_b.txt';
    var ext = req.param('ext');
    fs.existsSync(filepath) && fs.stat(filepath, function(err, stat) {
        if (err) {
            throw err;
        }

        if (!stat.isFile()) {
            throw new Error('The responder is not a file!');
        }

        if (ext && stat.size == 0) {
            res.redirect('/img/no-img-data.jpg');
            return;
        }

        res.statusCode = 200;
        // res.setHeader('Content-Length', stat.size);
        if (ext) {
            res.setHeader('Content-Type', mime.lookup(ext));
        }
        res.setHeader('Server', 'livepool');
        // fs.createReadStream(filepath).pipe(res);
        fs.readFile(filepath, function(err, data) {
            if (err) throw err;
            // 除图片外，处理中文字符
            if (imageTypes.indexOf(ext) >= 0) {
                res.write(data);
            } else {
                var str = iconv.decode(data, 'utf-8');
                // 编码不对试着用GBK编码
                if (str.indexOf('�') != -1) {
                    str = iconv.decode(data, 'gbk');
                }
                res.write(str);
            }
            res.end();
        });
    });
};

exports.resEdit = function(req, res) {
    var socket = liveapp.socket;
    var filepath = config.global.tempDir + socket.id + '/' + req.param('idx') + '_b.txt';
    var idx = req.param('idx');
    var data = req.param('data');
    if (fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, data);
    }
    res.json({
        code: 0
    });
};

exports.resDown = function(req, res) {
    var socket = liveapp.socket;
    var filepath = config.global.tempDir + socket.id + '/' + req.param('idx') + '_b.txt';
    res.download(filepath, req.param('name'), function(err) {
        if (err) {
            throw err;
        }
    })
};

exports.getResBeautify = function(req, res) {
    var socket = liveapp.socket;
    var idx = req.param('idx');
    var ctype = req.param('ctype');
    var filepath = config.global.tempDir + socket.id + '/' + idx + '_b.txt';
    fs.existsSync(filepath) && fs.stat(filepath, function(err, stat) {
        if (err) {
            throw err;
        }
        res.statusCode = 200;
        // res.setHeader('Content-Length', stat.size);
        res.setHeader('Server', 'livepool');
        // fs.createReadStream(filepath).pipe(res);

        var data = fs.readFileSync(filepath);
        var str = iconv.decode(data, 'utf-8');
        // 编码不对试着用GBK编码
        if (str.indexOf('�') != -1) {
            str = iconv.decode(data, 'gbk');
            fs.writeFileSync(filepath, str);
        }

        function pipe(str) {
            res.write(str);
            res.end();
        };

        if (ctype.indexOf('javascript') >= 0 || ctype.indexOf('css') >= 0 || ctype.indexOf('html') >= 0) {
            var type = '.html';
            if (ctype.indexOf('javascript') >= 0) {
                type = '.js';
            } else if (ctype.indexOf('css') >= 0) {
                type = '.css';
            }

            var cmd = 'node ';
            var tmppath = filepath + '.bak';
            var ctypepath = filepath + type;
            var args = [
                './lib/tools/beautify/scripts/run.js',
                filepath,
                ctypepath
            ];
            exec(cmd + args.join(' '), {
                maxBuffer: 2000000 * 1024
            }, function(err, stdout, stderr) {
                if (err) throw err;
                pipe(stdout);
            });
        } else {
            pipe(str);
        }
    });
};

exports.poolGet = function(req, res) {
    res.send(config.pool);
};

exports.poolUpdate = function(req, res) {
    var records = req.param('records');
    // update nodes
    if (_.isUndefined(records[0].sort) || records[0].sort === '') {
        _.each(records, function(record) {
            if (record.type == 'proj') {
                updateChild(config.projs, record);
            } else if (record.type == 'group') {
                // remove rule group
                updateChild(config.groups, record);
            } else if (!record.type) {
                updateChild(config.rules, record);
            }
        });
    } else {
        if (records[0].parentId == '-1') {
            // sorting proj
            sortProj(config.projs, records);
        } else {
            // sorting rule
            sortChild(config.groups, records);
        }
    }

    config.saveRules();
    res.send({
        success: true
    });
};

exports.poolRemove = function(req, res) {
    var record = req.param('records')[0];
    // remove proj
    if (record.type == 'proj') {
        removeChild(config.pool, record, true);
    } else if (record.type == 'group') {
        // remove rule group
        removeChild(config.projs, record);
    } else if (!record.type) {
        removeChild(config.groups, record);
    }
    config.saveRules();
    res.send({
        success: true
    });
};

exports.poolCreate = function(req, res) {
    var record = req.param('records')[0];
    var rs = [];
    // create proj
    if (record.parentId == '-1') {
        var pid = getUUId();
        var newProj = {
            id: pid,
            name: record.name,
            match: record.match,
            type: 'proj'
        };
        var clone = _.extend({}, newProj);
        rs.push(clone);
        newProj.children = [];
        _.each(req.param('records'), function(child) {
            if (child.type != 'proj') {
                var newGroup = {
                    id: getUUId(),
                    type: 'group',
                    name: child.name,
                    checked: true,
                    children: []
                };
                rs.push(newGroup);
                newProj.children.push(newGroup);
            }
        });
        config.pool.children.push(newProj);
    } else {
        // create rule
        var parent = _.find(config.groups, function(group) {
            return group.id == record.parentId;
        });
        var newGroup = {
            id: getUUId(),
            match: record.match,
            action: record.action,
            checked: true,
            leaf: true
        };
        rs.push(newGroup);
        parent.children.push(newGroup);
    }
    config.saveRules();
    res.send({
        success: true,
        children: rs
    });
};

exports.menuSet = function(req, res) {
    var value = req.param('value');
    var key = req.param('key');
    if (key) {
        // change settings
        if (value == 'true' || value == 'false') {
            config.settings[key] = value === 'true';
        } else {
            config.settings[key] = value;
        }

        // additinal actions
        switch (key) {
            case 'proxy':
                if (value == 'true') {
                    proxy.setProxy();
                } else {
                    proxy.initProxy();
                }
                break;
            default:
                break;
        }

        // save setting to file
        config.saveSettings();
    }
    res.send({
        code: 0
    });
};

exports.handlerAdd = function(req, res) {
    var socket = liveapp.socket;
    var idx = req.param('idx');
    var projBase = req.param('projBase');
    var ruleAction = req.param('ruleAction');
    var target = path.join(projBase, ruleAction);
    var targetDir = path.dirname(target);
    var filepath = config.global.tempDir + socket.id + '/' + idx + '_b.txt';
    util.mkdirpSync(targetDir);
    fs.existsSync(filepath) && util.copyFile(filepath, target, function() {
        res.json({
            code: 0
        });
    });
};

exports.compose = function(req, res) {
    var r = request.defaults({
        'proxy': 'http://127.0.0.1:' + config.global.http
    });
    var options = {
        url: req.param('url'),
        method: req.param('method'),
        headers: JSON.parse(req.param('headers') || '{}'),
        body: req.param('body')
    };
    r(options, function(err, response, body) {
        res.json({
            code: 0
        });
    });
};

exports.pac = function(req, res) {
    var pac = path.join(__dirname, '../public/libs/pac/livepool.pac');
    fs.createReadStream(pac).pipe(res);
};

exports.viewSet = function(req, res) {
    config.settings.layout = req.param('layout') || 'wide';
    config.settings.tabSetting = req.param('tabSetting') || [];
    config.settings.sessionColumns = req.param('sessionColumns') || [];
    config.saveSettings();
    res.json({
        code: 0
    });
};

exports.viewGet = function(req, res) {
    res.json({
        code: 0,
        data: {
            layout: config.settings.layout,
            tabSetting: config.settings.tabSetting,
            sessionColumns: config.settings.sessionColumns
        }
    });
};

exports.ruleExportAll = function(req, res) {
    var rules = path.resolve(__dirname, '../../../', 'rules/pool.js');
    res.download(rules, 'pool.js', function(err) {
        if (err) {
            throw err;
        }
    });
};

exports.ruleExport = function(req, res) {
    var projs = [];
    _.each(config.projs, function(proj) {
        if (proj.checked) {
            projs.push(proj);
        }
    });
    var socket = liveapp.socket;
    var filepath = config.global.tempDir + socket.id + '/pool-selected.js';
    var pool = 'module.exports=' + JSON.stringify(projs, null, 4);
    fs.writeFile(filepath, pool, function(err) {
        if (err) throw err;

        res.download(filepath, 'pool-selected.js', function(err) {
            if (err) {
                throw err;
            }
        });
    });
};

exports.ruleImport = function(req, res) {
    var socket = liveapp.socket;
    var filepath = config.global.tempDir + socket.id + '/pool-to-import.js';
    var rules = req.param('rules');
    fs.writeFileSync(filepath, rules);
    var rules = require(filepath);
    if (rules.children) {
        rules = rules.children;
    }
    config.pool.children = config.pool.children.concat(rules);
    // fix: remove all id -> avoid conflict
    (function removeId(arr) {
        _.each(arr, function(item) {
            delete item.id;
            if (item.children) {
                removeId(item.children);
            }
        });
    })(config.pool.children);

    config.saveRules();
    socket.emit('rulesImport');
    res.json({
        code: 0
    });
};

module.exports = function(liveapp) {
    liveapp.get('/', that.index);
    liveapp.get('/res/raw', that.getResRaw);
    liveapp.get('/res/get', that.getResGet);
    liveapp.post('/res/edit', that.resEdit);
    liveapp.get('/res/down/:idx/:name', that.resDown);
    liveapp.get('/res/beautify', that.getResBeautify);
    liveapp.get('/pool/get', that.poolGet);
    liveapp.post('/pool/update', that.poolUpdate);
    liveapp.post('/pool/remove', that.poolRemove);
    liveapp.post('/pool/create', that.poolCreate);
    liveapp.post('/menu/set', that.menuSet);
    liveapp.post('/view/set', that.viewSet);
    liveapp.get('/view/get', that.viewGet);
    liveapp.post('/handler/add', that.handlerAdd);
    liveapp.post('/compose', that.compose);
    liveapp.get('/livepool.pac', that.pac);
    liveapp.get('/rule/exportall', that.ruleExportAll);
    liveapp.get('/rule/export', that.ruleExport);
    liveapp.post('/rule/import', that.ruleImport);

    // other page route and event
    liveapp.get('/404', other.other);
};
