define(['shape/stage/interface'], function(Stage){
    "use strict";

    function BufferedCanvasStage(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.buffer = [];
    }

    BufferedCanvasStage.constructor = BufferedCanvasStage;
    BufferedCanvasStage.prototype = new Stage();
    BufferedCanvasStage.prototype.each = function(callback) {
        var i = 0, length = this.childs.length;
        for (; i < length; i++) {
            callback(this.childs[i], i);
        }
    }
    BufferedCanvasStage.prototype.addChild = function(shape) {
        this.childs.push(shape);
    };
    BufferedCanvasStage.prototype.removeChild = function(shape) {
        var index = this.childs.indexOf(shape);
        if (-1 !== index) {
            this.childs.splice(index, 1);
        }
    }
    BufferedCanvasStage.prototype.clean = function() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    BufferedCanvasStage.prototype.render = function() {
        var self = this;
        this.clean();
        this.each(function(child) {
            if (child.STATE_RENDERED !== child.state()) {
                child.render(self);
                child.state(child.STATE_RENDERED);
            }
        })

        this.flush();
    };
    BufferedCanvasStage.prototype.flush = function() {
        var method, args;
        var i = 0,
        buffer = this.buffer,
        length = buffer.length;

        this.buffer = [];

        // console.log(this.context);
        for (; i < length; i++) {
            method = buffer[i][0];
            args = buffer[i][1];
            switch(method) {
                case 'fillRect': this.context.fillRect(args[0], args[1], args[2], args[3]); break;
                case 'beginPath': this.context.beginPath(); break;
                case 'closePath': this.context.closePath(); break;
                case 'fill': this.context.fill(); break;
                case 'stroke': this.context.stroke(); break;
                case 'moveTo': this.context.moveTo(args[0], args[1]); break;
                case 'lineTo': this.context.lineTo(args[0], args[1]); break;
                case 'fillStyle': this.context.fillStyle = args[0]; break;
                case 'font': this.context.font = args[0]; break;
                case 'textBaseline': this.context.textBaseline = args[0]; break;
                case 'fillText': this.context.fillText(args[0], args[1], args[2]); break;
                case 'putImageData': this.context.putImageData(args[0], args[1], args[2], args[3], args[4], args[5], args[6]); break;
                case 'drawImage': this.context.drawImage(args[0], args[1], args[2], args[3], args[4]); break;
                case 'setTransform': this.context.setTransform(args[0], args[1], args[2], args[3], args[4], args[5]); break;
            }
        }
    }
    BufferedCanvasStage.prototype.fillRect = function(x, y, width, height) {
        this.buffer.push(['fillRect', [x, y, width, height]]);
    }
    BufferedCanvasStage.prototype.beginPath = function() {
        this.buffer.push(['beginPath']);
    }
    BufferedCanvasStage.prototype.closePath = function() {
        this.buffer.push(['closePath']);
    }
    BufferedCanvasStage.prototype.fill = function() {
        this.buffer.push(['fill']);
    }
    BufferedCanvasStage.prototype.stroke = function() {
        this.buffer.push(['stroke']);
    }
    BufferedCanvasStage.prototype.moveTo = function(x, y) {
        this.buffer.push(['moveTo', [x, y]]);
    }
    BufferedCanvasStage.prototype.lineTo = function(x, y) {
        this.buffer.push(['lineTo', [x, y]]);
    }
    BufferedCanvasStage.prototype.fillStyle = function(style) {
        this.buffer.push(['fillStyle', [style]]);
    }
    BufferedCanvasStage.prototype.fillText = function(text, x, y, options) {
        this.buffer.push(['font', [options.style + ' ' + options.weigth + ' ' + options.size + ' ' + options.font]]);
        this.buffer.push(['textBaseline', [options.baseline]]);
        this.buffer.push(['fillText', [text, x, y]]);
    }
    BufferedCanvasStage.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    BufferedCanvasStage.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.buffer.push(['putImageData', [imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight]]);
    }
    BufferedCanvasStage.prototype.drawImage = function(img, x, y, width, height) {
        this.buffer.push(['drawImage', [img, x, y, width, height]]);
    }
    BufferedCanvasStage.prototype.fillEllipse = function(x, y, w, h) {
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
    BufferedCanvasStage.prototype.setTransform = function(skewX, skewY, scalX, scalY, moveX, moveY) {
        this.buffer.push(['setTransform', [scalX || 1, skewX, skewY, scalY || 1, moveX || 0, 0]]);
    }

    return BufferedCanvasStage;
})
