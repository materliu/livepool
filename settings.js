var path = require('path');
module.exports = {
    http: 8090,
    https: 8001,
    uiport: 8002,
    index: 'index.html',
    tempDir: path.join(process.cwd(), 'tmp/http/'),
    siteDir: path.join(process.cwd(), 'tmp/sites/'),
    proxy: 'http://proxy.tencent.com:8080'
};
