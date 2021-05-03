### HMR
```
HMR: hot module replacement 热模块替换 / 模块热替换
作用：一个模块发生变化, 只会重新打包这一个模块(而不是打包所有模块),极大提升构建速度

样式文件：可以使用HMR功能：因为style-loader内部实现了
js文件：默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
注意：HMR功能对js的处理，只能处理非入口js文件的其他文件。
if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  module.hot.accept('./print.js', function() {
    // 方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
    // 会执行后面的回调函数
    print();
  });
}
html文件: 默认不能使用HMR功能.同时会导致问题：html文件不能热更新了~ （不用做HMR功能）
  解决：修改entry入口，将html文件引入
```

### source-map
```
source-map: 一种提供源代码到构建后代码映射技术（如果构建后代码出错了，通过映射可以追踪源代码错误）
  [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
  source-map：外部
    错误代码准确信息 和 源代码的错误位置
  inline-source-map：内联
    只生成一个内联source-map
    错误代码准确信息 和 源代码的错误位置
  hidden-source-map：外部
    错误代码错误原因，但是没有错误位置
    不能追踪源代码错误，只能提示到构建后代码的错误位置
  eval-source-map：内联
    每一个文件都生成对应的source-map，都在eval
    错误代码准确信息 和 源代码的错误位置
  nosources-source-map：外部
    错误代码准确信息, 但是没有任何源代码信息
  cheap-source-map：外部
    错误代码准确信息 和 源代码的错误位置 
    只能精确的行
  cheap-module-source-map：外部
    错误代码准确信息 和 源代码的错误位置 
    module会将loader的source map加入

  内联 和 外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

  开发环境：速度快，调试更友好
    速度快(eval>inline>cheap>...)
      eval-cheap-souce-map
      eval-source-map
    调试更友好  
      souce-map
      cheap-module-souce-map
      cheap-souce-map

    --> eval-source-map  / eval-cheap-module-souce-map

  生产环境：源代码要不要隐藏? 调试要不要更友好
    内联会让代码体积变大，所以在生产环境不用内联
    nosources-source-map 全部隐藏
    hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

    --> source-map / cheap-module-souce-map
```

### oneOf
```
只匹配一个loader
```

```
缓存：
  babel缓存
    cacheDirectory: true
    --> 让第二次打包构建速度更快
  文件资源缓存
    hash: 每次wepack构建时会生成一个唯一的hash值。
      问题: 因为js和css同时使用一个hash值。
        如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
    chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
      问题: js和css的hash值还是一样的
        因为css是在js中被引入的，所以同属于一个chunk
    contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样    
    --> 让代码上线运行缓存更好使用
```

### tree shaking
```
tree shaking：去除无用代码
  前提：1. 必须使用ES6模块化  2. 开启production环境
  作用: 减少代码体积

  在package.json中配置 
    "sideEffects": false 所有代码都没有副作用（都可以进行tree shaking）
      问题：可能会把css / @babel/polyfill（副作用）文件干掉
    "sideEffects": ["*.css", "*.less"]
```

### code split
```
/*
  1. 可以将node_modules中代码单独打包一个chunk最终输出
  2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk
*/
optimization: {
  splitChunks: {
    chunks: 'all'
  }
},
```

### lazy loading
```
document.getElementById('btn').onclick = function() {
  // 懒加载~：当文件需要使用时才加载~
  // 预加载 prefetch：会在使用之前，提前加载js文件 
  // 正常加载可以认为是并行加载（同一时间加载多个文件）  
  // 预加载 prefetch：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(4, 5));
  });
};
```

### pwa

### 多进程打包

### externals

### dll

