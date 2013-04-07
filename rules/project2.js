module.exports = {
    name: "project2",
    index: 0,
    enabled: 1,
    base: "E:/connect/bapp/widget_trunk/web/chat/src/",
    handler: [{
        match: "chat.qq.com/index.html",
        action: "./__index.html",
        enabled: 1
    }, {
        match: "chat.qq.com/js/chat.all.js",
        action: "./tools/chat.all.qzmin",
        enabled: 1
    }, {
        match: "chat.qq.com/css/main.css",
        action: ["./css/sub1.css", "./css/sub2.css"],
        enabled: 1
    }, {
        match: "chat.qq.com/css/remote.css",
        action: "http://chat.qq.com/css/remote2.css",
        enabled: 1
    }, {
        match: "chat.qq.com/ *.url.cn/chat/",
        action: "./",
        enabled: 1
    }],
    router: [{
        match: "chat.qq.com/cgi-bin/ srv.chat.qq.com",
        action: "-",
        enabled: 1
    }, {
        match: "chat.qq.com",
        action: "172.23.136.86",
        enabled: 1
    }]
};