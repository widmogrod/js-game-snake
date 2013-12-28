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
        this.context.cleanRect(0,0,this.width, this.height);
    }
    CanvasStage.prototype.render = function() {
        var self = this;
        this.context.clearRect(0,0,this.width, this.height);
        this.each(function(child) {
            if (child.STATE_RENDERED !== child.state()) {
                child.render(self);
                child.state(child.STATE_RENDERED);
            }
        })
    };
    CanvasStage.prototype.fillRect = function(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
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
    CanvasStage.prototype.moveTo = function(x, y) {
        this.context.moveTo(x, y);
    }
    CanvasStage.prototype.lineTo = function(x, y) {
        this.context.lineTo(x, y);
    }
    CanvasStage.prototype.fillStyle = function(style) {
        this.context.fillStyle = style;
    }
    CanvasStage.prototype.fillText = function(text, x, y, options) {
        this.context.font = options.style + ' ' + options.weigth + ' ' + options.size + ' ' + options.font; //' italic bold 12px sans-serif';
        this.context.textBaseline = options.baseline;
        this.context.fillText(text, x, y);
    }
    CanvasStage.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    CanvasStage.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.context.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
    }
    CanvasStage.prototype.drawImage = function(img, x, y, width, height) {
        this.context.drawImage(img, x, y, width, height);
    }
    CanvasStage.prototype.fillEllipse = function(x, y, w, h) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        this.context.beginPath();
        this.context.moveTo(x, ym);
        this.context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        this.context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        this.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        this.context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        this.context.closePath();
        this.context.stroke();
    }
    CanvasStage.prototype.setTransform = function(skewX, skewY, scalX, scalY, moveX, moveY) {
        this.context.setTransform(scalX || 1, skewX, skewY, scalY || 1, moveX || 0, 0);
    }

    return CanvasStage;
})
