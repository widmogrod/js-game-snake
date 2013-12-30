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

        for (; i < length; i++) {
            method = buffer[i][0];
            args = buffer[i][1];
            switch(method) {
                case 'stroke':       this.context.stroke(); break;
                case 'fill':         this.context.fill(); break;
                case 'fillRect':     this.context.fillRect(args[0].xpos, args[0].ypos, args[1], args[2]); break;
                case 'fillStyle':    this.context.fillStyle = args[0]; break;
                case 'fillText':     this.context.fillText(args[0], args[1].xpos, args[1].ypos); break;
                case 'beginPath':    this.context.beginPath(); break;
                case 'closePath':    this.context.closePath(); break;
                case 'moveTo':       this.context.moveTo(args[0].xpos, args[0].ypos); break;
                case 'lineTo':       this.context.lineTo(args[0].xpos, args[0].ypos); break;
                case 'font':         this.context.font = args[0]; break;
                case 'textBaseline': this.context.textBaseline = args[0]; break;
                case 'putImageData': this.context.putImageData(args[0], args[1], args[2], args[3], args[4], args[5], args[6]); break;
                case 'drawImage':    this.context.drawImage(args[0], args[1].xpos, args[1].ypos, args[2], args[3]); break;
            }
        }
    }
    BufferedCanvasStage.prototype.fillRect = function(point, width, height) {
        this.buffer.push(['fillRect', [point, width, height]]);
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
    BufferedCanvasStage.prototype.moveTo = function(point) {
        this.buffer.push(['moveTo', [point]]);
    }
    BufferedCanvasStage.prototype.lineTo = function(point) {
        this.buffer.push(['lineTo', [point]]);
    }
    BufferedCanvasStage.prototype.fillStyle = function(style) {
        this.buffer.push(['fillStyle', [style]]);
    }
    BufferedCanvasStage.prototype.fillText = function(text, point, options) {
        this.buffer.push(['font', [options.style + ' ' + options.weigth + ' ' + options.size + ' ' + options.font]]);
        this.buffer.push(['textBaseline', [options.baseline]]);
        this.buffer.push(['fillText', [text, point]]);
    }
    BufferedCanvasStage.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    BufferedCanvasStage.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.buffer.push(['putImageData', [imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight]]);
    }
    BufferedCanvasStage.prototype.drawImage = function(img, point, width, height) {
        this.buffer.push(['drawImage', [img, point, width, height]]);
    }

    return BufferedCanvasStage;
})
