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
                            "match": "find.qq.com/js/find.all.js",
                            "action": "./tools/find.all.qzmin",
                            "leaf": true,
                            "id": 4,
                            "checked": true,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/css/comp.css",
                            "action": "./css/main.css|./css/sub1.css",
                            "leaf": true,
                            "id": 5,
                            "checked": true,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/js/catalog.js",
                            "action": "http://pub.idqqimg.com/qqfind/js/groupcatalog.js",
                            "leaf": true,
                            "id": 6,
                            "checked": true,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/|*.idqqimg.com/qqfind/",
                            "action": "./",
                            "leaf": true,
                            "id": 7,
                            "checked": true,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/index.html",
                            "action": "./__index.html",
                            "leaf": true,
                            "id": 3,
                            "checked": true,
                            "name": ""
                        }
                    ],
                    "id": 2,
                    "checked": false,
                    "match": "",
                    "action": "",
                    "enableDrag": false
                },
                {
                    "name": "router",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "id": 11,
                            "checked": true,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "10.12.23.156",
                            "leaf": true,
                            "id": 12,
                            "checked": true,
                            "name": ""
                        }
                    ],
                    "id": 10,
                    "checked": true,
                    "match": "",
                    "action": "",
                    "enableDrag": false
                }
            ],
            "id": 1,
            "checked": true,
            "action": ""
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
                            "id": 15,
                            "checked": false,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/js/find.all.js",
                            "action": "./tools/find.all.qzmin",
                            "leaf": true,
                            "id": 16,
                            "checked": false,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/js/find.combo.js",
                            "action": "./js/jquery.js|./js/main.js",
                            "leaf": true,
                            "id": 17,
                            "checked": false,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/css/comp.css",
                            "action": "./css/main.css|./css/sub1.css",
                            "leaf": true,
                            "id": 18,
                            "checked": false,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/js/catalog.js",
                            "action": "http://pub.idqqimg.com/qqfind/js/groupcatalog.js",
                            "leaf": true,
                            "id": 19,
                            "checked": false,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com/|*.idqqimg.com/qqfind/",
                            "action": "./",
                            "leaf": true,
                            "id": 20,
                            "checked": false,
                            "name": ""
                        }
                    ],
                    "id": 14,
                    "checked": false,
                    "match": "",
                    "action": "",
                    "enableDrag": false
                },
                {
                    "name": "router",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "id": 25,
                            "checked": false,
                            "name": ""
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "172.23.136.84",
                            "leaf": true,
                            "id": 26,
                            "checked": false,
                            "name": ""
                        }
                    ],
                    "id": 24,
                    "checked": false,
                    "match": "",
                    "action": "",
                    "enableDrag": false
                }
            ],
            "id": 13,
            "checked": false,
            "action": ""
        }
    ]
}