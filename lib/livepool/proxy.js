var util = require('./util');
var config = require('./config');
var exec = require('child_process').exec;
var path = require('path');

if (process.platform == 'win32') {
    // var setting = require('../tools/openproxy_setting');
}

exports.setProxy = function setProxy(port, done) {
    if (process.platform == 'win32') {
        var proxy = ["http=127.0.0.1:" + port, "https=127.0.0.1:" + port].join(";");
        exec('reg.exe add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v MigrateProxy /t REG_DWORD /d 0 /f', function(error) {
            exec('reg.exe add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f', function(error) {
                exec('reg.exe add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyHttp1.1 /t REG_DWORD /d 0 /f', function(error) {
                    exec('reg.exe add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /t REG_SZ /d ' + proxy + ' /f', function(error) {
                        setting.RefreshProxy();
                        if (typeof done == 'function') done();
                    });
                });
            });
        });
    } else if (process.platform == 'mac' || process.platform == 'darwin') {
        var dir = path.join(process.cwd(), 'lib/tools');
        var cmd = 'sh proxysetting_mac.sh on ' + config.global.http;
        util.chdir(dir, function() {
            exec(cmd, function(err) {
                if (err) {
                    throw err;
                }
                if (typeof done == 'function') done();
            });
        });
    } else if (process.platform == 'linux') {
        var proxy = 'export HTTP_PROXY=http://127.0.0.1:' + port;
        exec(proxy, function(error) {
            if (error) throw error;
            if (typeof done == 'function') done();
        });
    }
}

exports.initProxy = function initProxy(done) {
    if (process.platform == 'win32') {
        exec('reg.exe add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f', function(error) {
            exec('reg.exe delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /f', function(error) {
                setting.RefreshProxy();
                if (typeof done == 'function') done();
            });
        });
    } else if (process.platform == 'mac' || process.platform == 'darwin') {
        var dir = path.join(process.cwd(), 'lib/tools');
        var cmd = 'sh proxysetting_mac.sh off';
        util.chdir(dir, function() {
            exec(cmd, function(err) {
                if (err) {
                    throw err;
                }
                if (typeof done == 'function') done();
            });
        });
    } else if (process.platform == 'linux') {
        var proxy = 'export HTTP_PROXY=""';
        exec(proxy, function(error) {
            if (error) throw error;
            if (typeof done == 'function') done();
        });
    }
}
