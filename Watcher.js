const event = require('events')
const fs = require('fs')

class Watcher extends event.EventEmitter {
  constructor(watchDir) {
    super();
    this.watchDir = watchDir
    this.watchList = new Set()
  }

  watch() {
    this.watchList.forEach(value => {
      fs.watchFile(value, () => {
        this.emit('process', value)
      })
    })
  }

  start() {
    this.watchList.add(this.watchDir)
    fs.readdir(this.watchDir, ((err, files) => {
      if (files) {
        files.forEach(value => {
          this.watchList.add(`${this.watchDir}/${value}`)
        })
      }
      this.watch()
    }))
  }

}

module.exports = Watcher
