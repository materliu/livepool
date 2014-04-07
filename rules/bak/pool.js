module.exports = {
    name: 'livepool',
    children: [{
        name: "project1",
        match: "/Users/rehorn/Documents/Code/node/livepool/test/examples/",
        children: [{
            name: 'handler',
            children: [{
                match: "find.qq.com/index.html",
                action: "./__index.html"
            }, {
                match: "find.qq.com/js/find.all.js",
                action: "./tools/find.all.qzmin"
            }, {
                match: "find.qq.com/js/find.combo.js",
                action: "./js/jquery.js|./js/main.js"
            }, {
                match: "find.qq.com/css/comp.css",
                action: "./css/main.css|./css/sub1.css"
            }, {
                match: "find.qq.com/js/catalog.js",
                action: "http://pub.idqqimg.com/qqfind/js/groupcatalog.js"
            }, {
                match: "find.qq.com/|*.idqqimg.com/qqfind/",
                action: "./"
            }]
        }, {
            name: 'router',
            children: [{
                match: "find.qq.com/cgi-bin/|cgi.find.qq.com",
                action: "-"
            }, {
                match: "find.qq.com|idqqimg.com/qqfind/",
                action: "172.23.136.84"
            }]
        }]
    }]
};
