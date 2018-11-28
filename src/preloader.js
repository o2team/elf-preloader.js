import assign from './assigin'

var body = document.body || document.getElementsByTagName('body')[0]

var Preloader = function (options) {
  this.opts = assign({
    resources: [],
    concurrency: 0,
    perMinTime: 0,
    attr: 'data-preload',
    crossOrigin: false,
    onProgress: null,
    onCompletion: null,
  }, options)

  var preloads = document.querySelectorAll('[' + this.opts.attr + ']')
  for (var i = 0; i < preloads.length; i++) {
    var preload = preloads[i]
    if (preload.src) this.opts.resources.push(preload.src)
  }

  this.length = this.opts.resources.length
  this.completedCount = 0
  this.loadingIndex = 0
  this.resourceMap = {}
  this.div = document.createElement('div')

  var style = this.div.style
  style.visibility = 'hidden'
  style.position = 'absolute'
  style.top = style.left = '0'
  style.width = style.height = '10px'
  style.overflow = 'hidden'
  style.transform = style.msTransform = style.webkitTransform = style.oTransform = 'translate(-10px, -10px)'
  body.appendChild(this.div)

  this.done = function (resource, instance) {
    if (this.length === 0) return this.onCompletion && this.onCompletion(0)

    this.completedCount += 1
    this.resourceMap[resource] = instance

    this.onProgress && this.onProgress(this.completedCount, this.length, resource)
    if (this.completedCount >= this.length) {
      this.onCompletion && this.onCompletion(this.length)
    } else if (this.opts.concurrency > 0) {
      this.loader()
    }
  }

  this.loader = function () {
    if (this.loadingIndex >= this.length) return
    var resource = this.opts.resources[this.loadingIndex]
    this.loadingIndex++

    if (~['mp3', 'ogg', 'wav'].indexOf(getType(resource))) {
      this.audioLoader(resource)
    } else {
      this.imageLoader(resource)
    }
  }

  this.imageLoader = function (resource) {
    var self = this

    var image = new Image()
    if (self.opts.crossOrigin) image.crossOrigin = 'Anonymous'
    self.div.appendChild(image)
    var startTime = new Date()
    image.onload = image.onerror = function () {
      var duration = new Date() - startTime
      var diff = self.opts.perMinTime - duration

      diff > 0 ? setTimeout(function () {
        self.done(resource, image)
      }, diff) : self.done(resource, image)
    }
    image.src = resource
    image.style.width = 'auto'
    image.style.height = 'auto'
    image.style.maxWidth = 'none'
    image.style.maxHeight = 'none'
  }
  this.audioLoader = function (resource) {
    var self = this

    var audio = new Audio()
    self.div.appendChild(audio)
    var startTime = new Date()
    var handler = function () {
      var duration = new Date() - startTime
      var diff = self.opts.perMinTime - duration

      diff > 0 ? setTimeout(function () {
        self.done(resource, audio)
      }, diff) : self.done(resource, audio)
    }
    audio.addEventListener('canplaythrough', handler)
    audio.addEventListener('error', handler)
    audio.preload = 'auto'
    audio.src = resource
    audio.load()
  }
}

/**
     * add progress event callback
     */
Preloader.prototype.addProgressListener = function (fn) {
  this.onProgress = fn
}

/**
     * add completed event callback
     */
Preloader.prototype.addCompletionListener = function (fn) {
  this.onCompletion = fn
}

/**
     * get resource instance
     */
Preloader.prototype.get = function (resource) {
  return this.resourceMap[resource]
}

/**
     * load begin
     */
Preloader.prototype.start = function () {
  if (!this.length) return this.done(null, null)

  if (this.opts.concurrency === 0) {
    while (this.loadingIndex < this.length) {
      this.loader()
    }
  } else {
    for (var i = 0; i < this.opts.concurrency; i++) {
      this.loader()
    }
  }
}

function getType (resource) {
  var parser = document.createElement('a')
  parser.href = resource
  return parser.pathname.split('.').pop().toLowerCase()
}

export default Preloader
