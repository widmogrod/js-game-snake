define(function(){
    function ImageDataUtil(image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.fillStyle = 'rgba(255,255,255,1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        this.data = context.getImageData(0, 0, image.width, image.height);
    }
    ImageDataUtil.prototype.getImageData = function() {
        return this.data;
    }
    ImageDataUtil.prototype.getRange = function(from, to) {

    }

    return ImageDataUtil;
})
