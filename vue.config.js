const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,  //强烈建议关闭ES语法规范检查,常见问题就是不准用驼峰命名和大写命名
  devServer: {   //配置代理服务器
      // 简单配置
    // proxy: 'http://localhost:8081'
    // https: true, 配置不了,上线时如果不是https协议有隐私问题会导致扫码失败
    proxy: {
      '^/': {
        target: 'http://localhost:8081',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    },
    
  },
})
