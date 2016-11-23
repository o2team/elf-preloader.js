# preloader.js [![NPM version][npm-version-image]][npm-version-url]

[English Readme](https://github.com/o2team/elf-preloader.js/blob/master/README.md)

一个简单的 Javascript 库，用于预加载`图片`和`音频`。主要功能：
- 设置并发数
- 设置资源最小加载时间，模拟慢加载


## 安装
```
npm install --save preloader.js
```

## 使用

引入
```
var Preloader = require('preloader.js')
```

执行
```javascript
var preloader = new Preloader({
    resources: ['assert/images/logo.png', 'assert/audios/bg.mp3'],
    concurrency: 4
})
preloader.addProgressListener(function (loaded, length) {
    console.log('loading ', loaded, length, loaded / length)
})
preloader.addCompletionListener(function () {
    console.log('load completed')
})
preloader.start()
```

PS: 如果没有使用打包工具（例如：webpack、browserify），则直接引入
```
<script src="src/preloader.js"></script>
```

## 说明

### 配置项
- **resources** `Array`

  默认: `[]`.

  预加载的资源列表。这些后缀 `['mp3', 'ogg', 'wav']` 的文件按 `audio` 处理，其他的按 `image` 处理。

  PS：资源除了这里配置的外，还有包括配置了 `attr` 值的 DOM 标签。

- **concurrency** `Number`

  默认: `0`.

  并发数。0 表示无限制。

- **perMinTime** `Number`

  默认: `0`. 单位: `ms`

  单个资源的最小加载时间。一般用来模拟慢加载。

- **attr** `String`

  默认: `preload`.

  DOM 标签预加载的属性。例如：`<img src="img/logo.png" preload/>`，则 `'img/logo.png'` 也会加入到 `resources` 里。

- **onProgress** `Function`

  默认: `null`.

  单个资源加载完成时的回调函数。与实例方法 `addProgressListener` 等效。

- **onCompletion** `Function`

  默认: `null`.

  所有加载都完成时的回调函数。与实例方法 `addCompletionListener` 等效。


### 实例方法

#### addProgressListener(Function)
设置单个资源加载完成时的回调函数

#### addCompletionListener(Function)
设置所有加载都完成时的回调函数

#### get(String)
获取资源加载完成后的实例

#### start()
开始加载。


## 许可

MIT

[npm-version-image]: https://img.shields.io/npm/v/preloader.js.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/preloader.js
