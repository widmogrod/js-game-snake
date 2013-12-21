define(function(){
    function ImageDataUtil(image) {
        this.image = image;
        this.raw = null;
        // var r, g, b, a = null;
        // for (var i = 0, length = this.raw.data.length; i < length; i += 4) {
        //     r = this.raw.data[i],
        //     g = this.raw.data[i+1],
        //     b = this.raw.data[i+2],
        //     a = this.raw.data[i+3];

        //     if (r === red && g === green && b === blue) {
        //         this.raw.data[i+3] = 0;
        //     }
        // }
    }

    ImageDataUtil.prototype.load = function() {
        if (this.raw) return this;
        var canvas = document.createElement("canvas");
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        var context = canvas.getContext("2d");
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(this.image, 0, 0);
        this.raw = context.getImageData(0, 0, this.image.width, this.image.height);
        return this;
    }

    ImageDataUtil.prototype.patch = function(stage, x, y, dw) {
        var canvas = document.createElement("canvas");
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        var context = canvas.getContext("2d");
        var frameNumber = this.image.width / dw >> 0;
        var background = stage.getImageData(x, y, dw, this.image.height);
        for (var i = 0; i < frameNumber; i++) {
            context.putImageData(
                background,
                dw * i, 0, 0, 0, this.image.width, this.image.height
            );
        }

        context.drawImage(this.image, 0, 0);
        this.raw = context.getImageData(0, 0, this.image.width, this.image.height);
        return this;
    }

    ImageDataUtil.prototype.width = function() {
        return this.image.width;
    }
    ImageDataUtil.prototype.height = function() {
        return this.image.height;
    }
    ImageDataUtil.prototype.data = function() {
        return this.load().raw;
    }

    return ImageDataUtil;
})
