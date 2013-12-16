define(['event/event'], function(Event){
    function onComplete(assets) {
        return function(name, image) {
            assets[name] = image;
        }
    }

    function onError() {
        console.log('cant load asset:', name, image);
    }

    function AssetUtil(baseURL) {
        this.events = {}
        this.baseURL = baseURL;
        this.assets = {};

        this.on('complete', onComplete(this.assets));
        this.on('error', onError);
    }

    AssetUtil.prototype = new Event();
    AssetUtil.prototype.loadImage = function(name, path) {
        var self = this,
            image = new Image();

        image.src = this.baseURL + path;
        image.onload = function() {
            self.trigger('complete', [name, image])
            self.trigger('complete:' + name, [image])
        }
        image.onerror = function() {
            self.trigger('error', [name, image])
            self.trigger('error:'+name, [image])
        }
    }
    AssetUtil.prototype.loadAudio = function(name, path) {
        var self = this,
            audio = new Audio();

        audio.src = this.baseURL + path;
        audio.preload = 'auto';
        audio.addEventListener('canplay', function() {
            self.trigger('complete', [name, audio])
            self.trigger('complete:' + name, [audio])

        })
        audio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.src = this.src;
        })
        audio.addEventListener('error', function() {
            self.trigger('error', [name, audio])
            self.trigger('error:'+name, [audio])
        })
        audio.load();
    }
    AssetUtil.prototype.loadAudio2 = function(name, path) {
        var self = this;
        // Fix up prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();
        var request = new XMLHttpRequest();
        request.open('GET', this.baseURL + path, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                var audio = {
                    play: function() {
                        var source = context.createBufferSource();
                        source.buffer = buffer;
                        source.connect(context.destination);
                        source.start(0);
                    }
                };

                self.trigger('complete', [name, audio])
                self.trigger('complete:' + name, [audio])

            }, function() {
                self.trigger('error', [name, audio])
                self.trigger('error:'+name, [audio])
            });
        }
        request.send();
    }
    AssetUtil.prototype.has = function(name) {
        return this.assets.hasOwnProperty(name);
    }
    AssetUtil.prototype.get = function(name, func) {
        if (this.has(name)) {
            func(this.assets[name]);
        } else {
            this.on('complete:' + name, func)
        }
        return this;
    }

    return AssetUtil;
})
