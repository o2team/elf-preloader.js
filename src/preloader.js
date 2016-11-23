(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory)
    } else if (typeof module === 'object' && module.exports) {
        // CMD
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        root.Orientation = factory()
    }
}(this, function () {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    var assign = Object.assign || function (target) {
        'use strict'

        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object')
        }

        var output = Object(target)
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index]
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                        output[nextKey] = source[nextKey]
                    }
                }
            }
        }
        return output
    }


    var Preloader = function (options) {
        this.opts = assign({
            resources: [],
            concurrency: 0,
            perMinTime: 0,
            attr: 'preload',
            onProgress: null,
            onCompletion: null
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

        this.done = function (resource, instance) {
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
            var startTime = new Date()
            image.onload = image.onerror = function () {
                var duration = new Date() - startTime
                var diff = self.opts.perMinTime - duration

                diff > 0 ? setTimeout(function () {
                    self.done(resource, image)
                }, diff) : self.done(resource, image)
            }
            image.src = resource
        }
        this.audioLoader = function (resource) {
            var self = this
            var audio = new Audio()
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

    return Preloader
}))
