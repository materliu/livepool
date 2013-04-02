module.exports = {
    name: "project1",
    index: 0,
    base: "E:\connect\bapp\widget_trunk\web\chat\src",
    enabled: 1,
    handlerAll: 0,
    handler: [{
        match: "chat.qq.com",
        action: "./",
        enabled: 1
    }, {
        match: "*.url.cn",
        action: "./",
        enabled: 1
    }],
    router: [{
        match: "chat.qq.com/cgi-bin/",
        action: "-",
        enabled: 1
    }, {
        match: "srv.chat.qq.com",
        action: "172.23.136.86",
        enabled: 1
    }, {
        match: "chat.qq.com",
        action: "172.23.136.86",
        enabled: 1
    }]
};