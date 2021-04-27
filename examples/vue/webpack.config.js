const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const WebpackMockServicePlugin = require('../../index')

module.exports = {
    entry: path.join(__dirname, 'src/main.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
              }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new WebpackMockServicePlugin({
            port: 8000
        })
    ]
}
