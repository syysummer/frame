module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {
      "browsers": ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 8']
     },
     'postcss-px2rem':{'remUnit':75}    //配置rem基准值，75是iphone6标准
  }
}