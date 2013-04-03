module.exports = {
    name: "project1",
    index: 0,
    enabled: 1,
    global: {
        base: "E:\connect\bapp\widget_trunk\web\chat\src",
        host: "*chat.qq.com *.url.cn",
        handleAll: 0
    },
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
        match: "chat.qq.com/cgi-bin/ srv.chat.qq.com",
        action: "-",
        enabled: 1
    }, {
        match: "chat.qq.com",
        action: "172.23.136.86",
        enabled: 1
    }],
    plugin: {
        backend: {

        }
    }
};