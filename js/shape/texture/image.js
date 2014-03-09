define([
    'shape/texture/interface',
    'shape/color'
], function(
    TextureInterface,
    Color
) {
    'use strict';

    var abs = Math.abs;

    function ImageTexture(path, width, height) {
        this.width = width;
        this.height = height;
        this.internalBuffer = null;
        this.cache = Array(width * height);
        this.load(path);
    }

    ImageTexture.prototype = Object.create(TextureInterface.prototype);
    ImageTexture.prototype.load = function (path) {
        var imageTexture = new Image();
        imageTexture.height = this.height;
        imageTexture.width = this.width;

        imageTexture.onload = function () {
            this.loaded = true;
            var internalCanvas = document.createElement("canvas");
            internalCanvas.width = this.width;
            internalCanvas.height = this.height;
            var internalContext = internalCanvas.getContext("2d");
            internalContext.drawImage(imageTexture, 0, 0);
            this.internalBuffer = internalContext.getImageData(0, 0, this.width, this.height);
        }.bind(this);

        imageTexture.src = path;
    };
    ImageTexture.prototype.map = function (tu, tv) {
        if (this.internalBuffer) {
            // using a % operator to cycle/repeat the texture if needed
            var u = abs(((tu + this.width) % this.width)) >> 0;
            var v = abs(((tv + this.height) % this.height)) >> 0;

            var index = (u + v * this.width);

            if (this.cache[index]) {
                return this.cache[index];
            }

            var intex4 = index * 4;

            var r = this.internalBuffer.data[intex4];
            var g = this.internalBuffer.data[intex4 + 1];
            var b = this.internalBuffer.data[intex4 + 2];
            var a = this.internalBuffer.data[intex4 + 3];

            return this.cache[index] = new Color(r, g, b, a);
        } else {
            return Color.fromName('back');
        }
    }

    return ImageTexture;
});
