const { defineConfig } = require('@vue/cli-service')
const APP_NAME = require('./package.json').name
const path = require(`path`)
const argv1 = process.argv

const parameters = {}
argv1.forEach((value, index, arr) => {
  if (value.indexOf('--') !== -1) {
    parameters[value] = arr[index + 1]
  }
})
if (parameters['--app-mode']) {
  process.env.VUE_APP_MODE = parameters['--app-mode']
}

module.exports = defineConfig({
  pages: {
    index: {
      entry: 'src/Main.ts'
    }
  },
  transpileDependencies: true,
  devServer: {
    port: 7777,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    client: {
      // 关闭 webpack-dev-server 的 Uncaught runtime errors
      // 当出现错误的时候，页面将不再弹出红框
      overlay: false
    }
  },
  configureWebpack: {
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: APP_NAME,
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd'
    },
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve(`./node_modules/vue`)
      }
    }
  }
})
