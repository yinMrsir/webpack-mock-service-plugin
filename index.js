const express = require('express')
const Mock = require('mockjs')
const fs = require('fs')
const path = require('path')
const net = require('net')
const Watcher = require('./Watcher.js')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
      console.info(`mock服务启动成功： http://localhost:${this.port}`)
      /**
       * 开启监听目录，当目录或文件有更新时重新生成路由
       * @type {Watcher}
       */
      this.watcher = new Watcher(this.mockDir)
      this.watcher.on('process', dir => {
        // 文件发生改变时重新生成路由
        this.createRoute()
        // 之前没有创建目录没有绑定监听
        // 所以创建了新的目录时要重新执行监听
        this.watcher.start()
      })
      this.watcher.start()
    })
  }

  readFile(filePath) {
    const firstPosition = filePath.indexOf('/')
    const lastPosition = filePath.lastIndexOf('/')
    const file = filePath.substring(lastPosition + 1)
    // 提取到上级目录 /user/login/index.json -> user/login
    const parentDir = filePath.substring(firstPosition +1, lastPosition)
    if (/\.js$/.test(filePath)) {
      const textArr = file.match(/(\w+).?(\w+)?.js/)
      if (textArr) {
        const type = textArr[2] || 'get'
        app.route(textArr[1] === 'index' ? `/${parentDir}` : `/${parentDir}/${textArr[1]}`)
          [type]((req, res) => {
            try {
              res.json(Mock.mock(require(filePath)(req)))
            } catch(e) {
              res.json(Mock.mock({message: `${filePath} 不存在或内容为空`}))
            }
          })
      }
    } else if(/\.json$/.test(filePath)) {
      const textArr = file.match(/(\w+).?(\w+)?.json/)
      if (textArr) {
        // type -> 请求类型
        const type = textArr[2] || 'get'
        /**
         * 根据文件格式生成路由
         * userinfo/index.json -> /userinfo [get]
         * userinfo/update.post.json -> /userinfo/update [post]
         */
        app.route(textArr[1] === 'index' ? `/${parentDir}` : `/${parentDir}/${textArr[1]}`)
          [type]((req, res) => {
          const content = fs.readFileSync(filePath)
          if (content.toString()) {
            const data = JSON.parse(content.toString().replace(/\n/g, ''))
            res.json(Mock.mock(data))
          } else {
            res.json(Mock.mock({}))
          }
        })
      }
    } else {
      console.log('不支持的文件格式')
    }
  }

  readDir(mkdir) {
    // 读取文件夹
    fs.readdir(mkdir, (err, dirs) => {
      if (err) throw err
      // 便利文件夹中的每个文件
      dirs.forEach(dir => {
        // 如果是目录
        if (fs.lstatSync(`${mkdir}/${dir}`).isDirectory()) {
          this.readDir(`${mkdir}/${dir}`)
        } else {
          this.readFile(`${mkdir}/${dir}`)
        }
      })
    })
  }

  createRoute() {
    // 如果文件目录不存在，就创建该目录
    !fs.existsSync(this.mockDir) && fs.mkdirSync(this.mockDir)
    // 读取目录生成路由
    this.readDir(this.mockDir)
  }
}

module.exports = WebpackMockServicePlugin
