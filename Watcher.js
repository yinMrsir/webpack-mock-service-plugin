const event = require('events')
const fs = require('fs')

class Watcher extends event.EventEmitter {
  constructor(watchDir) {
    super()
    this.watchDir = watchDir
    this.watchList = new Set()
  }

  watch() {
    this.watchList.forEach(value => {
      // 先移除 避免多次监听
      fs.unwatchFile(value)
      fs.watchFile(value, { persistent: false },() => {
        this.emit('process', value)
      })
    })
  }

  addFileDir(watchDir) {
    this.watchList.add(watchDir)
    const files = fs.readdirSync(watchDir)
    if (files) {
      files.forEach(value => {
        // 是需要监听目录即可
        if (fs.lstatSync(`${watchDir}/${value}`).isDirectory()) {
          this.addFileDir(`${watchDir}/${value}`)
        } else {
          this.watchList.add(`${watchDir}/${value}`)
        }
      })
    }
  }

  start() {
    this.addFileDir(this.watchDir)
    this.watch()
  }

}

module.exports = Watcher
