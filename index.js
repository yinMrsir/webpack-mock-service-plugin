const express = require('express')
const Mock = require('mockjs')
const fs = require('fs')
const path = require('path')

const app = express()

fs.readdir(path.join(process.cwd(), 'mock'), (err, dir) => {
    if (err) throw err
    app.use(`/${dir}`, (req, res) => {
        fs.readFile(path.join(process.cwd(), `mock/${dir}/index.json`), (err, file) => {
            if (err) throw err
            const data = JSON.parse(file.toString().replace(/\n/g, ''))
            res.json(Mock.mock(data))
        })
    })
})

app.listen(3000, () => {
    console.log('3000 端口启动成功')
})

class WebpackMockServicePlugin {
    constructor(options) {}

    apply(complie) {
        
    }
}

module.exports = WebpackMockServicePlugin