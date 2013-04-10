module.exports = {
    name: "project1",
    // index: 0, // default is 0
    // enabled: 1, // default is 1
    base: "E:/Server/Node/livepool/test/examples/",
    handler: [{
        // test => http://www.livepool.com/index.html
        match: "www.livepool.com/index.html",
        action: "./__index.html"
        // enabled: 1 // default is 1
    }, {
        // test => http://www.livepool.com/static-web/site/index.html
        // test => http://www.livepool.com/static-web/index.html
        match: "www.livepool.com/static-web/",
        action: "./static/"
    }, {
        // test => http://www.livepool.com/js/chat.all.js
        match: "www.livepool.com/js/chat.all.js",
        action: "./tools/chat.all.qzmin"
    }, {
        // test => http://www.livepool.com/css/main.css
        match: "www.livepool.com/css/main.css",
        action: ["./css/sub1.css", "./css/sub2.css"]
    }, {
        match: "www.livepool.com/css/remote.css",
        action: "http://chat.qq.com/css/remote2.css"
    }, {
        match: "www.livepool.com/ *.cdn.livepool.cn/examples/",
        action: "./"
    }],
    router: [{
        match: "www.livepool.com/cgi-bin/ srv.livepool.com/",
        action: "-"
    }, {
        match: "www.livepool.com",
        action: "127.0.0.1"
    }]
};