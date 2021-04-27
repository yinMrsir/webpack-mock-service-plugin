const express = require('express')
const Mock = require('mockjs')
const fs = require('fs')
const path = require('path')
const net = require('net')
const app = express()
const Watcher = require('./Watcher.js')

/**
 * 检测端口是否可以使用
 * @param {Number} port
 * @return {Promise<Boolean>}
 */
function portInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer().listen(port, '0.0.0.0');
    server.on('listening', function () {
      server.close()
      resolve(true)
    })

    server.on('error', function (err) {
      if (err.code === 'EADDRINUSE') {
        resolve(false)
      }
    })
  })
}

class WebpackMockServicePlugin {
    constructor(options = {}) {
      this.port = options.port || 3000
      this.mockDir = path.join(process.cwd(), options.mockDir || 'mock')
    }

    async apply(compile) {
      while (!(await portInUse(this.port))) {
        this.port++
      }
      this.createRoute()
      this.listen()
    }

    listen() {
      app.listen(this.port, () => {
        console.log(`mock服务启动成功： http://localhost:${this.port}`)
        /**
         * 开启监听目录，当目录或文件有更新时重新生成路由
         * @type {Watcher}
         */
        this.watcher = new Watcher(this.mockDir)
        this.watcher.on('process', dir => {
          // 之前没有创建目录没有绑定监听
          // 所以创建了新的目录时要重新执行监听
          this.watcher.start()
          // 文件发生改变时重新生成路由
          this.createRoute()
        })
        this.watcher.start()
      })
    }

    createRoute() {
      // 如果文件目录不存在，就创建该目录
      !fs.existsSync(this.mockDir) && fs.mkdirSync(this.mockDir)
      // 读取目录生成路由
      fs.readdir(this.mockDir, (err, dirs) => {
        if (err) throw err
        dirs.forEach(dir => {
          const files = fs.readdirSync(`${this.mockDir}/${dir}`)
          files.forEach(file => {
            const textArr = file.match(/(\w+).?(\w+)?.json/)
            if (textArr) {
              // type -> 请求类型
              const type = textArr[2] || 'get'
              /**
               * 根据文件格式生成路由
               * userinfo/index.json -> /userinfo [get]
               * userinfo/update.post.json -> /userinfo/update [post]
               */
              app.route(textArr[1] === 'index' ? `/${dir}` : `/${dir}/${textArr[1]}`)
                [type]((req, res) => {
                let mkdir = `${this.mockDir}/${dir}/${file}`
                const content = fs.readFileSync(mkdir)
                const data = JSON.parse(content.toString().replace(/\n/g, ''))
                res.json(Mock.mock(data))
              })
            }
          })
        })
      })
    }
}

module.exports = WebpackMockServicePlugin
