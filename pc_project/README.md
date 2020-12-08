# mobile_project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install(yarn install)

# serve with hot reload at localhost:3000
npm run dev(yarn dev)

# build for production with minification
npm run build:test (测试包dist)
yarn build:test(测试包dist)

npm run build:prod (生成包prod)
yarn build:prod (生成包prod)

# build for production and view the bundle analyzer report
npm run build --report
```

# 环境变量配置
```
1. yarn add cross-env -D
2. 修改package.json
   "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "build:test": "cross-env NODE_ENV=production env_config=test node build/build.js",
    "build:prod": "cross-env NODE_ENV=production env_config=prod node build/build.js"
   },
3. 修改config/test.env.js
   'use strict'
    module.exports = {
      NODE_ENV: '"testing"',
    }
4. 修改config/index.js
   在build中添加
    testEnv: require('./test.env'),
    prodEnv: require('./prod.env'),
   修改index属性及assetsRoot(若不要求测试环境与生成环境生成不同的目录可不修改index和assetsRoot)
    index: path.resolve(__dirname, `${process.env.env_config === 'prod' ? '../prod/' : '../dist/'} + index.html`),
    assetsRoot: path.resolve(__dirname, `${process.env.env_config === 'prod' ? '../prod' : '../dist'}`),
5. build/build.js
   注释
   // process.env.NODE_ENV = 'production'
   //  const spinner = ora('building for production...')
   添加
   var spinner = ora('building for ' + process.env.NODE_ENV + ' of ' + process.env.env_config+ ' mode...' )
6. build/webpack.prod.conf.js
  注释
  // const env = require('../config/prod.env')
  添加
  const env = config.build[process.env.env_config+'Env'];
7. 然后可以更具process.env.NODE_ENV配置baseUrl等;
```

# 依赖安装
```
  1. 安装less less-loader
  yarn install less -D
  yarn install less-loader -D
  2. 安装vconsole调试工具（方便内嵌页面的调试,不需要可不安装vconsole）
  yarn add vconsole
  在开发环境和测试环境打开调试工具
  import VConsole from 'vconsole'
  const vConsole = new VConsole()

  3. 移动端适配安装postcss-px2rem（也可自己使用rem适配）
  - yarn add postcss-px2rem -D
  - 修改根目录下.postcssrc.js的内容为
    module.exports = {
    "plugins": {
      "postcss-import": {},
      "postcss-url": {},
      // to edit target browsers: use "browserslist" field in package.json
      "autoprefixer": {
        "browsers": ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 8']
      },
      'postcss-px2rem':{'remUnit':75} //配置rem基准值，75是iphone6标准
      }
    }
  - html的字体大小设置为：
    html {
        font-size: 10vw;
    }

  4. 如果要用到状态共享引入vuex
    yarn add vuex -S
  
  5. 安装axios
    yarn add axios -S

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader
