module.exports = {
    name: "project1",
    index: 0,
    enabled: 1,
    base: "E:/Server/Node/livepool/test/examples",
    handler: [{
        match: "examples.com",
        action: "./",
        enabled: 1
    }, {
        match: "*.url.cn/chat/",
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