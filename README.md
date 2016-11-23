# preloader.js [![NPM version][npm-version-image]][npm-version-url]

[中文说明](https://github.com/o2team/elf-preloader.js/blob/master/README_CN.md)

A simple Javascript library for preload image and audio. The main feature:
- set concurrency
- set minimum loading time per resouce, for simulate slow load


## Install
```
npm install --save preloader.js
```

## Usage

Import
```
var Preloader = require('preloader.js')
```

Execute
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

PS: If no use module bundler (e.g.: webpack、browserify), you can direct reference
```
<script src="src/preloader.js"></script>
```

## Introduce

### configuration

- **resources** `Array`

  Default: `[]`.

  Preload resouce list. The files of postfix belong to `['mp3', 'ogg', 'wav']` to according audio handle.

  PS：Resources in addition to here configuration, including configured `attr` value DOM node.

- **concurrency** `Number`

  Default: `0`.

  Concurrent number. 0 is no concurrency limit.

- **perMinTime** `Number`

  Default: `0`. Unit: `ms`

  Minimum loading time per resouce. Usually used to simulate load slow.

- **attr** `String`

  Default: `preload`.

  DOM node attribute of preload. Example: `<img src="img/logo.png" preload/>`, the `'img/logo.png'` will been added in `resources`.

- **onProgress** `Function`

  Default: `null`.

  Every resouce load is completed the callback function. The effect same to `addProgressListener`.

- **onCompletion** `Function`

  Default: `null`.

  All resouces load is completed the callback function. The effect same to `addCompletionListener`.


### instance method

#### addProgressListener(Function)
Set every resouce load is completed the callback function

#### addCompletionListener(Function)
Set all resouces load is completed the callback function

#### get(String)
Get instances of completed

#### start()
Begin load. All ready after invoke.


## License

MIT

[npm-version-image]: https://img.shields.io/npm/v/preloader.js.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/preloader.js
