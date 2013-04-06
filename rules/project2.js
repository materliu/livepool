module.exports = {
    name: "project2",
    index: 0,
    enabled: 1,
    base: "E:/connect/bapp/widget_trunk/web/chat/src",
    handler: [{
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