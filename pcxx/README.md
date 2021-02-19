# hxpc_frontend_project

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run start
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### 项目配置相关
```
  1. 添加路由
    yarn add vue-router -S
    新增router/index.js
  2. 使用less
    yarn add less less-loader -D
    vue.config.js文件中添加以下配置
    // 第三方插件配置
    loaderOptions: {
      css: {
        loaderOptions: {
          less: {
            //修改默认样式, 定义全局less变量
            globalVars:{
              // bgColor: '#ccc' 
            }
          },
        },
      },
      postcss: {} // 这里的选项会传递给 postcss-loader
    }, // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [
            //这个是加上自己的路径，
            //注意：试过不能使用别名路径
            path.resolve(__dirname, './src/common/less/global.less'),
        ]
      }
    }
  3. 使用axios
    yarn add axios -S
  4. 安装vuex
    yarn add vuex -S
  5. 安装Vconsole
    yarn add vconsole -S

  6. 配置本地开发环境实时更新(修改vue.config.js)
  chainWebpack: (config) => {
    config.resolve.symlinks(true) // 修复热更新失效
  },
  const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV);
  extract: IS_PROD, // 是否使用css分离插件 ExtractTextPlugin

  npm install image-webpack-loader --save-dev
  config.module
  .rule('images')
  .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  .use('image-webpack-loader')
    .loader('image-webpack-loader')
    .options({
      bypassOnDebug: true
    })


  // 引入压缩插件
  const TerserPlugin = require('terser-webpack-plugin')
  optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'], // 移除console
            },
          },
        }),
      ],
    },

  npm install compression-webpack-plugin --save-dev
  if (process.env.NODE_ENV === 'production') {
      config
        .plugin('gzip-plugin')
        .use('compression-webpack-plugin', [{
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.json$|\.css$|\.ttf$/,
          threshold: 0, // 只有大小大于该值的资源会被处理
          minRatio:0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: true // 删除原文件
        }])
        .end()
    }
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
