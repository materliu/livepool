module.exports = {
    name: "project2",
    base: "E:/connect/bapp/qqfind_v2/",
    handler: [{
        match: "find.qq.com/index.html",
        action: "./__index.html"
    }, {
        match: "find.qq.com/js/find.all.js",
        action: "./tools/find.all.js.qzmin"
    }, {
        match: "find.qq.com/css/comp.css",
        action: ["./css/loading.css", "./css/tab.css"]
    }, {
        match: "find.qq.com/js/catalog.js",
        action: "http://pub.idqqimg.com/qqfind/js/groupcatalog.js"
    }, {
        match: "find.qq.com/ *.idqqimg.com/qqfind/",
        action: "./"
    }],
    router: [{
        match: "find.qq.com/cgi-bin/ cgi.find.qq.com",
        action: "-"
    }, {
        match: "find.qq.com idqqimg.com/qqfind/",
        action: "172.23.136.84"
    }]
};
