# LivePool
Fiddler Like debugging proxy for web developers base on NodeJS

LivePool 是一个基于 NodeJS，类似 Fiddler 支持抓包和本地替换的 Web 开发调试工具，是 Tencent AlloyTeam 在开发实践过程总结出的一套的便捷的 WorkFlow 以及调试方案。

## 版本
version: 0.7.2

## 特性
- 基于 NodeJS, 跨平台
- 便捷的 UI 界面，跟 Fiddler 类似，降低学习成本
- 支持 http 抓包和本地替换调试，Https/WebSockets 直接代理，暂不支持本地替换
- 基于项目的替换规则管理，方便高效，规则支持拖曳排序
- 支持规则替换，host 配置
- 替换类型支持：文件/文件夹替换，combo合并替换，qzmin替换（批量combo)，delay延时等
- 支持自动设置系统代理
- 支持规则过滤，只显示关注的请求
- 提供构建 http get/post 请求界面，方便接口调试
- 特色功能：模拟gprs/3g等低网速（mac only）
- 特色功能：支持离线站点到本地，并自动代码格式化

## 安装
- 先安装 nodejs, 参考官网 http://nodejs.org

### 从 git 下载安装
- 下载， 运行 livepool
``` shell
git clone https://github.com/rehorn/livepool
```
- 安装依赖
```shell
cd ~/livepool
npm install
```
- 运行 livepool
```shell
node livepool.js
```

### 使用 npm 进行全局安装
``` shell
node install livepool -g
```

- 运行 livepool
```shell
livepool
```

### 使用测试
- 将浏览器的代理设置为 http://127.0.0.1:8090, chrome 可以通过 switchsharp 进行
- 打开浏览器，http://127.0.0.1:8002
- 打开需要调试页面地址，如 http://im.qq.com
- 效果如下
![效果图](http://raw.github.com/rehorn/livepool/master/test/screenshot/shot1.png)

## 界面说明
1.

## 使用 LivePool 进行抓包
### 设置代理
- 浏览器代理
- 
- 系统全局代理
### 查看请求内容
- http request
- http response
- 视图切换

## 本地替换开发
### 新建项目
- 点击新建
- 
### 新建替换规则
- 点击新建 

### 替换类型

## 过滤器

## 请求构建器

## 错误日志

## 模拟低网速[mac]

## 离线站点到本地

## 快捷操作
- 

## 快捷键

## 

## TODO
- 完善 Timeline时间轴、Stat统计界面
- LiveReload、AlloyDesinger集成，
- 支持构建工具 task 管理与运行，如 Grunt, Gulp, Mod
- More....