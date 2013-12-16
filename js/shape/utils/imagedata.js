define(function(){
    function ImageDataUtil(image) {
        var red = 255,
            green = 244,
            blue = 123;

        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ', 1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        this.data = context.getImageData(0, 0, image.width, image.height);
        var r, g, b, a = null;
        for (var i = 0, length = this.data.data.length; i < length; i += 4) {
            r = this.data.data[i],
            g = this.data.data[i+1],
            b = this.data.data[i+2],
            a = this.data.data[i+3];

            if (r === red && g === green && b === blue) {
                this.data.data[i+3] = 0;
            }
        }
    }
    ImageDataUtil.prototype.getImageData = function() {
        return this.data;
    }
    ImageDataUtil.prototype.getRange = function(from, to) {

    }

    return ImageDataUtil;
})
