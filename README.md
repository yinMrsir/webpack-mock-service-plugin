# webpack-mock-service-plugin

mockjs适用于webpack的插件

## 简介

1、启动一个新的接口服务，真实的接口访问

2、根据目录自动生成接口

3、支持mockjs格式生成数据

4、支持get、post、delete、put方式请求

## 安装下载

- 下载地址：https://github.com/yinMrsir/webpack-mock-service-plugin/releases

```
npm install webpack-mock-service-plugin --save-dev
or
yarn add webpack-mock-service-plugin -D
```

## 快速使用

```
const WebpackMockServicePlugin = require('webpack-mock-service-plugin')

module.exports = {
    ...
    plugins: [
        new WebpackMockServicePlugin({
            port: 8000, // 不传默认3000
            mockDir: '' // 不传默认mock目录
        })
    ]
}
```

目录结构：

```
├─ mock
│  ├─ user
│  │  ├─ index.js                        // [get]     /user
│  │  ├─ del.delete.js                   // [delete]  /user/del
│  │  ├─ update.put.js                   // [put]     /user/update
│  │  └─ add.post.js                     // [post]    /user/add
│  ├─ news
│  │  ├─ hot
│  │  │  ├─ update.post.js               // [post]    /news/hot/update
│  │  │  └─ index.js                     // [get]     /news/hot
│  │  └─ index.js                        // [get]     /news
```

生成数据：

- js文件生成数据(推荐)

req：请求信息

```
module.exports = req => {
  const obj = {
    "goodsClass": "女装",
    "goodsId|+1": 1,
    "goodsName": "@ctitle(10)",
    "goodsAddress": "@county(true)",
    "goodsStar|1-5": "★",
    "goodsImg": "@Image('100x100','@color','小甜甜')",
    "goodsSale|30-500": 30
  }
  const list = []
  const pageSize = req.query.pageSize || 10
  for (let i = 0; i < pageSize; i++) {
    list.push(obj)
  }
  return {
    code: 200,
    list,
    page: req.query.page || 1,
    pageSize
  }
}
```

- json文件生成数据

```
{
    "code": 200,
    "list": {
        "goodsClass": "女装",
        "goodsId|+1": 1,
        "goodsName": "@ctitle(10)",
        "goodsAddress": "@county(true)",
        "goodsStar|1-5": "★",
        "goodsImg": "@Image('100x100','@color','小甜甜')",
        "goodsSale|30-500": 30
  }
}
```

## 注意事项

- webpack-mock-service-plugin主要是为了在开发过程中，后端还未提供接口，前端开发者可以通过模拟接口进行开发，所以主要用于开发环境。

- demo: https://github.com/yinMrsir/typescript-admin

## 交流 & 提问

提问：https://github.com/yinMrsir/webpack-mock-service-plugin/issues
