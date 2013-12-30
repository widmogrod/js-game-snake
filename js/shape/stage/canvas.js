define(['shape/stage/interface'], function(Stage){
    "use strict";

    function CanvasStage(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
    }

    CanvasStage.constructor = CanvasStage;
    CanvasStage.prototype = new Stage();
    CanvasStage.prototype.each = function(callback) {
        var i = 0, length = this.childs.length;
        for (; i < length; i++) {
            callback(this.childs[i], i);
        }
    }
    CanvasStage.prototype.addChild = function(shape) {
        this.childs.push(shape);
    };
    CanvasStage.prototype.removeChild = function(shape) {
        var index = this.childs.indexOf(shape);
        if (-1 !== index) {
            this.childs.splice(index, 1);
        }
    }
    CanvasStage.prototype.clean = function() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    CanvasStage.prototype.render = function() {
        var self = this;
        this.clean();
        this.each(function(child) {
            if (child.STATE_RENDERED !== child.state()) {
                child.render(self);
                child.state(child.STATE_RENDERED);
            }
        })
    };
    CanvasStage.prototype.fillRect = function(point, width, height) {
        this.context.fillRect(point.xpos, point.ypos, width, height);
    }
    CanvasStage.prototype.beginPath = function() {
        this.context.beginPath();
    }
    CanvasStage.prototype.closePath = function() {
        this.context.closePath();
    }
    CanvasStage.prototype.fill = function() {
        this.context.fill();
    }
    CanvasStage.prototype.stroke = function() {
        this.context.stroke();
    }
    CanvasStage.prototype.moveTo = function(point) {
        this.context.moveTo(point.xpos, point.ypos);
    }
    CanvasStage.prototype.lineTo = function(point) {
        this.context.lineTo(point.xpos, point.ypos);
    }
    CanvasStage.prototype.fillStyle = function(style) {
        this.context.fillStyle = style;
    }
    CanvasStage.prototype.fillText = function(text, point, options) {
        this.context.font = options.style + ' ' + options.weigth + ' ' + options.size + ' ' + options.font; //' italic bold 12px sans-serif';
        this.context.textBaseline = options.baseline;
        this.context.fillText(text, point.xpos, point.ypos);
    }
    CanvasStage.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    CanvasStage.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.context.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
    }
    CanvasStage.prototype.drawImage = function(img, point, width, height) {
        this.context.drawImage(img, point.xpos, point.ypos, width, height);
    }

    return CanvasStage;
})
