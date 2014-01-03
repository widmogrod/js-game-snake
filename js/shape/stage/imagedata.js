define(['shape/stage/interface', 'shape/point/point'], function(Stage, Point){
    "use strict";

    function ImageDataStage(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.buffer = [];
        // this.imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
        this.zbuffer = Array(this.width * this.height);
        this.nullPoint = new Point(0,0,0);
        this.position = this.nullPoint;
        this.color = {r:0, g:0, b:0, a:255};
    }

    ImageDataStage.constructor = ImageDataStage;
    ImageDataStage.prototype = new Stage();
    ImageDataStage.prototype.each = function(callback) {
        var i = 0, length = this.childs.length;
        for (; i < length; i++) {
            callback(this.childs[i], i);
        }
    }
    ImageDataStage.prototype.addChild = function(shape) {
        this.childs.push(shape);
    };
    ImageDataStage.prototype.removeChild = function(shape) {
        var index = this.childs.indexOf(shape);
        if (-1 !== index) {
            this.childs.splice(index, 1);
        }
    }
    ImageDataStage.prototype.clean = function() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.buffer = []
        this.zbuffer = []
        this.position = this.nullPoint;
        this.color = {r:0, g:0, b:0, a:255};
   }
    ImageDataStage.prototype.render = function() {
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
    ImageDataStage.prototype.flush = function() {
        var method, args;
        var i = 0,
        buffer = this.buffer,
        length = buffer.length;

        this.buffer = [];
        this.position = this.nullPoint;
        this.color = {r:0, g:0, b:0, a:255};
        var fill = [];

        for (; i < length; i++) {
            method = buffer[i][0];
            args = buffer[i][1];
            switch(method) {
                case 'stroke':
                    // fill = [];
                    break;

                case 'fill':
                    if (fill.length < 3) break;
                    // console.log(fill);
                    // console.log(fill.pop(), fill.pop(), fill.pop())
                        this.fillTriangle(fill[0], fill[1], fill[2]);
                        this.fillTriangle(fill[2], fill[3], fill[0]);
                    fill = [];
                    break;

                // case 'fillRect':     this.context.fillRect(args[0].xpos, args[0].ypos, args[1], args[2]); break;
                case 'fillStyle':
                    this.color = typeof args[0] === 'object' ? args[0] : {r:0, g:0, b:0, a:255};
                    // this.context.fillStyle = 'rgba('+ this.color.r +','+ this.color.g +','+ this.color.b +',1)';
                    break;

                // case 'fillText':     this.context.fillText(args[0], args[1].xpos, args[1].ypos); break;
                case 'beginPath':
                    fill = [];
                    break;

                // case 'closePath':    this.context.closePath(); break;
                case 'moveTo':
                    // this.context.moveTo(args[0].xpos, args[0].ypos);
                    this.position = args[0];
                    // fill.push(args[0]);
                    break;

                case 'lineTo':
                    // this.context.lineTo(args[0].xpos, args[0].ypos);
                // this.context.stroke();
                    this.drawCline(this.position, args[0]);
                // this.drawBline(this.position, args[0]);
                // this.drawLine(this.position, args[0]);
                    this.position = args[0];
                    fill.push(args[0]);
                    break;

                // case 'font':         this.context.font = args[0]; break;
                // case 'textBaseline': this.context.textBaseline = args[0]; break;
                // case 'putImageData': this.context.putImageData(args[0], args[1], args[2], args[3], args[4], args[5], args[6]); break;
                // case 'drawImage':    this.context.drawImage(args[0], args[1].xpos, args[1].ypos, args[2], args[3]); break;
            }
        }

        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height)
    }
    ImageDataStage.prototype.fillTriangle = function(p1, p2, p3) {
        var top, middle, bottom, a;

        var min = Math.min(p1.ypos, p2.ypos, p3.ypos);
        var max = Math.max(p1.ypos, p2.ypos, p3.ypos);

        for (var i = 0; i < 3; i++) {
            a = arguments[i];
            switch(true) {
                case min === a.ypos && !top: top = a;
                case max === a.ypos && !bottom: bottom = a;
                default: middle = a;
            }
        }

        // console.log(top, middle, bottom)

        var x, y, x0, x1, y0, y1, z = 0;
        var z0, z1, lz, rz;

        var lx, rx;
        var fromX, toX;
        var lineX, lineY;

        x0 = top.xpos;
        y0 = top.ypos;
        z0 = top.z;
        // console.log(top.ypos, middle.ypos);
        for (var y = top.ypos; y < middle.ypos; y++) {
            x1 = middle.xpos;
            y1 = middle.ypos;
            z1 = middle.z;

            // lx = x0;
            // if (x0 !== x1) {
            lx = this.interpolate(y0, y1, x0, x1, y);
            lz = this.interpolate(y0, y1, z0, z1, y);
            // }
            // console.log(lz);

            // rx = 116;
            // console.log(y0 != y1 && x0 != x1);
            x1 = bottom.xpos;
            y1 = bottom.ypos;
            z1 = bottom.z;
            rx = x1;
            rz = lz;
            // console.log(x0, x1, y0, y1);
            if (x0 !== x1) {
                rx = this.interpolate(y0, y1, x0, x1, y);
                rz = this.interpolate(y0, y1, z0, z1, y);
            }
            // console.log(lx, rx)
                // console.log(lz, rz);

            fromX = Math.min(lx, rx);
            toX = Math.max(lx, rx);

            if (fromX === toX) continue;

            var blz = lz;
            if (fromX !== lx) {
                lz = rz;
                rz = blz;
            }
            // lz = fromX === lx ? lz : rx;

            // console.log(fromX, toX)

            for (lineX = fromX; lineX < toX; lineX++) {
                z = this.interpolate(fromX, toX, lz, rz, lineX);
                // console.log(z)
                this.drawPoint(new Point(lineX, y, z), this.color);
            }
        }
    }
    ImageDataStage.prototype.drawCline = function(point0, point1) {
        var x, y, x0, x1, y0, y1, z = 0;

        if (point1.ypos > point0.ypos) {
            x0 = point0.xpos >> 0;
            y0 = point0.ypos >> 0;
            x1 = point1.xpos >> 0;
            y1 = point1.ypos >> 0;
            for (y = y0; y < y1; y++) {
                x = this.interpolate(y0, y1, x0, x1, y);
                this.drawPoint(new Point(x, y, z), this.color);
            }
        } else if (point1.ypos < point0.ypos) {
            x0 = point1.xpos >> 0;
            y0 = point1.ypos >> 0;
            x1 = point0.xpos >> 0;
            y1 = point0.ypos >> 0;
            for (y = y0; y < y1; y++) {
                x = this.interpolate(y0, y1, x0, x1, y);
                this.drawPoint(new Point(x, y, z), this.color);
            }
        }

        if (point1.xpos > point0.xpos) {
            x0 = point0.xpos;
            y0 = point0.ypos;
            x1 = point1.xpos;
            y1 = point1.ypos;
            for (x = x0; x < x1; x++) {
                y = this.interpolate(x0, x1, y0, y1, x);
                this.drawPoint(new Point(x, y, z), this.color);
            }
        } else if (point1.xpos < point0.xpos) {
            x0 = point1.xpos >> 0;
            y0 = point1.ypos >> 0;
            x1 = point0.xpos >> 0;
            y1 = point0.ypos >> 0;
            for (x = x0; x < x1; x++) {
                y = this.interpolate(x0, x1, y0, y1, x);
                this.drawPoint(new Point(x, y, z), this.color);
            }
        }
    }
    ImageDataStage.prototype.drawLine = function (point0, point1) {
        var dist = point1.subtract(point0).length2();

        // If the distance between the 2 points is less than 2 pixels
        // We're exiting
        if(dist < 2) {
            return;
        }

        // Find the middle point between first & second point
        var middlePoint = point0.add((point1.subtract(point0)).scale(0.5));
        // We draw this point on screen
        this.drawPoint(middlePoint);
        // Recursive algorithm launched between first & middle point
        // and between middle & second point
        this.drawLine(point0, middlePoint);
        this.drawLine(middlePoint, point1);
    };
    ImageDataStage.prototype.drawBline = function (point0, point1) {
        var x0 = point0.xpos >> 0;
        var y0 = point0.ypos >> 0;
        var x1 = point1.xpos >> 0;
        var y1 = point1.ypos >> 0;
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
        while(true) {
            this.drawPoint(new Point(x0, y0, 0));
            if((x0 == x1) && (y0 == y1)) break;
            var e2 = 2 * err;
            if(e2 > -dy) { err -= dy; x0 += sx; }
            if(e2 < dx) { err += dx; y0 += sy; }
        }
    };
    ImageDataStage.prototype.interpolate = function(x0, x1, y0, y1, x) {
        return (y0 + ((y1 - y0) * (x - x0) / (x1- x0))) >> 0;
    }
    ImageDataStage.prototype.drawPoint = function(point) {
        this.drawPixel(point.x, point.y, point.z, this.color)
    }
    ImageDataStage.prototype.drawPixel = function(x, y, z, color) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) return;
        this.putPixel(x, y, z, color);
    }
    ImageDataStage.prototype.putPixel = function(x, y, z, color) {
        var index = (y * this.width) + x;
        var index4 = index * 4;

        if (this.zbuffer[index] < z) return;
        this.zbuffer[index] = z;

        this.imageData.data[index4]     = color.r;
        this.imageData.data[index4 + 1] = color.g;
        this.imageData.data[index4 + 2] = color.b;
        this.imageData.data[index4 + 3] = color.a;
    }
    ImageDataStage.prototype.fillRect = function(point, width, height) {
        this.buffer.push(['fillRect', [point, width, height]]);
    }
    ImageDataStage.prototype.beginPath = function() {
        this.buffer.push(['beginPath']);
    }
    ImageDataStage.prototype.closePath = function() {
        this.buffer.push(['closePath']);
    }
    ImageDataStage.prototype.fill = function() {
        this.buffer.push(['fill']);
    }
    ImageDataStage.prototype.stroke = function() {
        this.buffer.push(['stroke']);
    }
    ImageDataStage.prototype.moveTo = function(point) {
        this.buffer.push(['moveTo', [point]]);
    }
    ImageDataStage.prototype.lineTo = function(point) {
        this.buffer.push(['lineTo', [point]]);
    }
    ImageDataStage.prototype.fillStyle = function(style) {
        this.buffer.push(['fillStyle', [style]]);
    }
    ImageDataStage.prototype.fillText = function(text, point, options) {
        this.buffer.push(['font', [options.style + ' ' + options.weigth + ' ' + options.size + ' ' + options.font]]);
        this.buffer.push(['textBaseline', [options.baseline]]);
        this.buffer.push(['fillText', [text, point]]);
    }
    ImageDataStage.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    ImageDataStage.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.buffer.push(['putImageData', [imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight]]);
    }
    ImageDataStage.prototype.drawImage = function(img, point, width, height) {
        this.buffer.push(['drawImage', [img, point, width, height]]);
    }

    return ImageDataStage;
})
