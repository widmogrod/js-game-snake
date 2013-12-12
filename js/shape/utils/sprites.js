define(function() {
    function SpriteUtil(imageData, frameWidth, frameHeight) {
        this.imageData = imageData;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.tick = 15;
        this.frameNumber = 0;
        this.frames = imageData.width/frameWidth >> 0;
        this.counter = 0;
    }

    SpriteUtil.prototype.put = function(stage, x, y) {
        if (++this.counter % this.tick == 0) {
           this.counter = 0;
           this.frameNumber = this.frames <= ++this.frameNumber ? 0 : this.frameNumber;
        }

        var dx = this.frameNumber * this.frameWidth;
        stage.putImageData(
            this.imageData,
            x - dx,
            y,
            dx,
            0,
            this.frameWidth,
            this.frameHeight
        );
    }

    return SpriteUtil;
})
