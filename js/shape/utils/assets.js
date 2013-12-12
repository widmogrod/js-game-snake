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
