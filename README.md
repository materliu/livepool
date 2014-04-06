# LivePool
Fiddler Like debugging proxy for web developers base on NodeJS

LivePool 是一个基于 NodeJS，类似 Fiddler 支持抓包，本地替换的 Web 开发调试工具，是 Tencent AlloyTeam 在开发实践过程总结出的一套的便捷的 WorkFlow 以及调试方案。

## 版本
version: 0.0.3
pre-alpha

## 特性
- 基于 NodeJS, 跨平台
- 便捷的 UI 界面，跟 Fiddler 类似，降低学习成本
- 支持 HTTP 抓包，后续陆续支持 HTTPS, WebSockets
- 支持本地替换，HOST 配置，配置方便，替换规则强大，支持扩展
- 

## 安装
- 先安装 nodejs, 参考官网 http://nodejs.org

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
- 将浏览器的代理设置为 http://127.0.0.1:8090, chrome 可以通过 switchsharp 进行
- 打开浏览器，http://127.0.0.1:8002
- 打开需要调试页面地址，如 http://im.qq.com
- 效果如下
![效果图](http://raw.github.com/rehorn/livepool/master/test/screenshot/shot1.png)

## 测试

## TODO
- 完善项目管理、本地替换管理界面 Pool tab
- 完善细节，如果行高亮，颜色区分
- 完善Composer，组包调试界面
- 支持插件化
- 完善其他功能：低网速模拟，Session保存到本地等
- LiveReload、AlloyDesinger集成，
- 支持构建工具 task 管理与运行，如 Grunt, Gulp, Mod
- More....