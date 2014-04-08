var path = require('path');
var fs = require('fs');
var mime = require('mime');
var config = require('../../livepool/config');
var liveapp = require('../liveapp');
var other = require('./other');
var that = exports;
var iconv = require('iconv-lite');
var _ = require('underscore');

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

exports.iframe = function(req, res) {
    var idx = req.param()
};

exports.poolGet = function(req, res) {
    res.send(config.pool);
};

exports.poolUpdate = function(req, res) {
    var records = req.param('records');
    // update nodes
    if (records[0].sort == '') {
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
        // sorting nodes
        sortChild(config.groups, records);
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

exports.toolKeep = function(req, res) {
    var pressed = req.param('enable');
    config.tool.keep = pressed;
    res.send({
        code: 0
    });
};

module.exports = function(liveapp) {
    // index page route and event
    // liveapp.io.route('ready', function(req) {
    //     req.io.emit('talk', {
    //         message: 'io event from an io route on the server'
    //     })
    // })

    liveapp.get('/', that.index);
    liveapp.get('/res/raw', that.getResRaw);
    liveapp.get('/res/get', that.getResGet);
    liveapp.get('/res/iframe/:idx', that.iframe);
    liveapp.get('/pool/get', that.poolGet);
    liveapp.post('/pool/update', that.poolUpdate);
    liveapp.post('/pool/remove', that.poolRemove);
    liveapp.post('/pool/create', that.poolCreate);
    liveapp.post('/tool/keep', that.toolKeep);

    // other page route and event
    liveapp.get('/404', other.other);
};
