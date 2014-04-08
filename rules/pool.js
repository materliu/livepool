module.exports={
    "name": "livepool",
    "type": "root",
    "children": [
        {
            "name": "project1",
            "type": "proj",
            "match": "/Users/rehorn/Documents/Code/node/livepool/test/examples/",
            "children": [
                {
                    "name": "handler",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/index.html",
                            "action": "./__index.html",
                            "leaf": true,
                            "id": 3,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/js/find.all.js",
                            "action": "./tools/find.all.qzmin",
                            "leaf": true,
                            "id": 4,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/js/find.combo.js",
                            "action": "./js/jquery.js|./js/main.js",
                            "leaf": true,
                            "id": 5,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/css/comp.css",
                            "action": "./css/main.css|./css/sub1.css",
                            "leaf": true,
                            "id": 6,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/js/catalog.js",
                            "action": "http://pub.idqqimg.com/qqfind/js/groupcatalog.js",
                            "leaf": true,
                            "id": 7,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/|*.idqqimg.com/qqfind/",
                            "action": "./",
                            "leaf": true,
                            "id": 8,
                            "checked": true,
                            "name": ""
                        }
                    ],
                    "id": 2,
                    "checked": true
                },
                {
                    "type": "group",
                    "name": "mocker",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/find_v10",
                            "action": "{code:0, data}",
                            "leaf": true,
                            "id": 10,
                            "checked": true
                        }
                    ],
                    "id": 9,
                    "checked": true
                },
                {
                    "name": "router",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "id": 12,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "172.23.136.84",
                            "leaf": true,
                            "id": 13,
                            "checked": true
                        }
                    ],
                    "id": 11,
                    "checked": true
                }
            ],
            "id": 1,
            "checked": true
        },
        {
            "name": "project2",
            "type": "proj",
            "match": "/Users/rehorn/Documents/Code/node/livepool/test/examples/",
            "children": [
                {
                    "name": "handler",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/index.html",
                            "action": "./__index.html",
                            "leaf": true,
                            "id": 16,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/js/find.all.js",
                            "action": "./tools/find.all.qzmin",
                            "leaf": true,
                            "id": 17,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/js/find.combo.js",
                            "action": "./js/jquery.js|./js/main.js",
                            "leaf": true,
                            "id": 18,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/css/comp.css",
                            "action": "./css/main.css|./css/sub1.css",
                            "leaf": true,
                            "id": 19,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/js/catalog.js",
                            "action": "http://pub.idqqimg.com/qqfind/js/groupcatalog.js",
                            "leaf": true,
                            "id": 20,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com/|*.idqqimg.com/qqfind/",
                            "action": "./",
                            "leaf": true,
                            "id": 21,
                            "checked": true
                        }
                    ],
                    "id": 15,
                    "checked": true
                },
                {
                    "type": "group",
                    "name": "mocker",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "id": 23,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "172.23.136.84",
                            "leaf": true,
                            "id": 24,
                            "checked": true
                        }
                    ],
                    "id": 22,
                    "checked": true
                },
                {
                    "name": "router",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "id": 26,
                            "checked": true
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "172.23.136.84",
                            "leaf": true,
                            "id": 27,
                            "checked": true
                        }
                    ],
                    "id": 25,
                    "checked": true
                }
            ],
            "id": 14,
            "checked": true
        }
    ]
}