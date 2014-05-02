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
                            "checked": true,
                            "name": "",
                            "id": "039e2788-a1b5-1b9f-ab7d-f78abcd0a69d"
                        },
                        {
                            "match": "find.qq.com/css/comp.css",
                            "action": "./css/main.css|./css/sub1.css",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "aeb067c6-32e7-7777-9661-bec871e28273"
                        },
                        {
                            "match": "find.qq.com/js/catalog.js",
                            "action": "http://pub.idqqimg.com/qqfind/js/groupcatalog.js",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "8744208c-4318-83f2-562e-06d92cd00c1f"
                        },
                        {
                            "match": "find.qq.com/|*.idqqimg.com/qqfind/",
                            "action": "./",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "e405b30d-d948-5325-ea79-1d6e5b4d622a"
                        },
                        {
                            "match": "find.qq.com/index.html",
                            "action": "./__index.html",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "10c7d1a6-b2e8-5f71-72b3-d1bfc085325d"
                        }
                    ],
                    "checked": false,
                    "match": "",
                    "action": "",
                    "enableDrag": false,
                    "id": "d9264cce-a9d8-7f09-4965-03406f1d9e84"
                },
                {
                    "name": "router",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "fff7d845-8aab-4907-4dca-b34f997c0873"
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "10.12.23.156",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "a2c59c79-c1f1-65b8-5345-b661d4b0dfb6"
                        }
                    ],
                    "checked": true,
                    "match": "",
                    "action": "",
                    "enableDrag": false,
                    "id": "bcb2006b-e677-9437-53f6-e1b1bcf3098f"
                }
            ],
            "checked": true,
            "action": "",
            "id": "2ee68ecb-e327-f15f-d06c-e1798ffa7ee9"
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
                            "checked": false,
                            "name": "",
                            "id": "db4ffed2-0157-90ce-869d-3b0cbb936e56"
                        },
                        {
                            "match": "find.qq.com/js/find.all.js",
                            "action": "./tools/find.all.qzmin",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "31d0ae96-8a6f-b833-8517-766b414cee87"
                        },
                        {
                            "match": "find.qq.com/js/find.combo.js",
                            "action": "./js/jquery.js|./js/main.js",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "71ea7191-fb04-3ef5-cc71-0d8670f0b3a4"
                        },
                        {
                            "match": "find.qq.com/css/comp.css",
                            "action": "./css/main.css|./css/sub1.css",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "08f0132f-1ac7-9777-6fa4-7dd9d55e4db7"
                        },
                        {
                            "match": "find.qq.com/js/catalog.js",
                            "action": "http://pub.idqqimg.com/qqfind/js/groupcatalog.js",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "232cc734-fafa-695d-e715-661d2daa36ab"
                        },
                        {
                            "match": "find.qq.com/|*.idqqimg.com/qqfind/",
                            "action": "./",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "a1c53684-9afe-08ff-e1c6-29c8b5997066"
                        }
                    ],
                    "checked": false,
                    "match": "",
                    "action": "",
                    "enableDrag": false,
                    "id": "ce10f004-b0d4-7d6a-e2a7-bf1e6fe64f4d"
                },
                {
                    "name": "router",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "f6fd1a9a-d9b2-4bbb-fccb-5930da4dca74"
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "172.23.136.84",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "414effc8-49ee-2487-62f3-c54873443864"
                        }
                    ],
                    "checked": false,
                    "match": "",
                    "action": "",
                    "enableDrag": false,
                    "id": "7a0f1280-aab5-54e5-4427-b729ed795c50"
                }
            ],
            "checked": false,
            "action": "",
            "id": "2be63459-0234-504f-416c-be2de6c34777"
        }
    ]
}