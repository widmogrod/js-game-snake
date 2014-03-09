define(['math/vector3', 'shape/color'], function(Vector3, Color){
    'use strict';

    function isInfinity(value) {
        return value === Infinity || value === -Infinity; // || isNaN(value);
    }

    function Renderer(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.buffer = [];
        this.zbuffer = Array(this.width * this.height);
        this.nullPoint = Vector3.zero();
        this.position = this.nullPoint;
        this.color = Color.fromName('black');
        this.lightPosition = new Vector3(0, 0, 1);
    }

    Renderer.constructor = Renderer;
    Renderer.prototype.clean = function() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.buffer = []
        this.zbuffer = Array(this.width * this.height)
        this.position = this.nullPoint;
        this.color = Color.fromName('black');
    }
    Renderer.prototype.render = function() {
        this.flush();
    };
    Renderer.prototype.flush = function() {
        var method, args;
        var i = 0,
        buffer = this.buffer,
        length = buffer.length;

        this.buffer = [];
        this.position = this.nullPoint;
        var colors = [this.color];
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
                // this.fillTriangle(fill[0], fill[1], fill[2]);
                // this.fillTriangle(fill[2], fill[3], fill[0]);
                fill = [];
                break;

                // case 'fillRect':     this.context.fillRect(args[0].x, args[0].y, args[1], args[2]); break;
                case 'fillStyle':
                    colors.push(
                        args[0] instanceof Color ? args[0] : Color.fromName('black')
                );
                // this.context.fillStyle = 'rgba('+ this.color.r +','+ this.color.g +','+ this.color.b +',1)';
                break;

                // case 'fillText':     this.context.fillText(args[0], args[1].x, args[1].y); break;
                case 'beginPath':
                    this.color = colors.length ? colors[colors.length - 1] : this.color;
                break;

                case 'closePath':
                    // colors.shift();
                    break;
                case 'moveTo':
                    // this.context.moveTo(args[0].x, args[0].y);
                    this.position = args[0];
                // fill.push(args[0]);
                break;

                case 'lineTo':
                    // this.context.lineTo(args[0].x, args[0].y);
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
                // case 'drawImage':    this.context.drawImage(args[0], args[1].x, args[1].y, args[2], args[3]); break;
            }
        }

        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height)
    }
    Renderer.prototype.fillTriangle = function(v1, v2, v3, texture) {
        var order = this.topMiddleBottom(v1, v2, v3);

        for (var y = order.bottom.projection.y >> 0; y < order.middle.projection.y >> 0; y++) {
            this.processLine(y, order.bottom, order.middle, order.top, texture);
        }
        for (var y = order.middle.projection.y >> 0; y < order.top.projection.y >> 0; y++) {
            this.processLine(y, order.top, order.middle, order.bottom, texture);
        }
    }
    Renderer.prototype.topMiddleBottom = function(v1, v2, v3) {
        var temp;

        if(v1.projection.y > v2.projection.y) {
            temp = v2;
            v2 = v1;
            v1 = temp;
        }
        if(v2.projection.y > v3.projection.y) {
            temp = v2;
            v2 = v3;
            v3 = temp;
        }
        if(v1.projection.y > v2.projection.y) {
            temp = v2;
            v2 = v1;
            v1 = temp;
        }

        return {
            bottom: v1,
            middle: v2,
            top: v3
        };
    }
    Renderer.prototype.swap = function(object, key1, key2) {
        var temp = object[key2];
        object[key2] = object[key1];
        object[key1] = temp;
    }
    Renderer.prototype.processLine = function(y, v1, v2, v3, texture) {
        var p1 = v1.projection;
        var p2 = v2.projection;
        var p3 = v3.projection;

        var t1 = v1.texture;
        var t2 = v2.texture;
        var t3 = v3.texture;

        var data = {};

        // interpolate start and end x
        data.x1 = this.interpolate(p1.x, p2.x, p1.y, p2.y, y);
        data.x2 = this.interpolate(p1.x, p3.x, p1.y, p3.y, y);
        // interpolate depth
        data.z1 = this.interpolate(p1.z, p2.z, p1.y, p2.y, y);
        data.z2 = this.interpolate(p1.z, p3.z, p1.y, p3.y, y);
        // interpolate start and end texture point
        data.u1 = this.interpolate(t1.x, t2.x, t1.y, t2.y, y);
        data.v1 = this.interpolate(t1.y, t2.y, t1.x, t2.x, data.x1);
        data.u2 = this.interpolate(t1.x, t3.x, t1.y, t3.y, y);
        data.v2 = this.interpolate(t1.y, t3.y, t1.x, t3.x, data.x2);

        if (data.x1 === data.x2) return;

        if (data.x1 > data.x2) {
            this.swap(data, 'x1', 'x2');
            this.swap(data, 'z1', 'z2');
            this.swap(data, 'u1', 'u2');
            this.swap(data, 'v1', 'v2');
        }

        var dx = data.x2 - data.x1;
        var dz = (data.z2 - data.z1)/dx;
        var du = (data.u2 - data.u1)/dx;
        var dv = (data.v2 - data.v1)/dx;

        var x = data.x1 >> 0;
        var z = data.z1;
        var u = data.u1;
        var v = data.v1;

        for (; x < data.x2 >> 0; x++, z += dz, u += du, v += dv) {
            this.drawPixel(x, y, z, texture.map(u, v));
        }
    }
    Renderer.prototype.interpolate = function(x1, x2, y1, y2, y) {
        if (y1 === y2) return x1;
        return ((y - y1)/(y2 - y1) * (x2 - x1)) + x1;
    }
    Renderer.prototype.drawPoint = function(point) {
        this.drawPixel(point.x, point.y, point.z, this.color)
    }
    Renderer.prototype.drawPixel = function(x, y, z, color) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) return;
        this.putPixel(x, y, z, color);
    }
    Renderer.prototype.putPixel = function(x, y, z, color) {
        var index = (y * this.width) + x;
        var index4 = index * 4;

        if (this.zbuffer[index] < z) return;
        this.zbuffer[index] = z;

        this.imageData.data[index4]     = color.r;
        this.imageData.data[index4 + 1] = color.g;
        this.imageData.data[index4 + 2] = color.b;
        this.imageData.data[index4 + 3] = color.a;
    }
    Renderer.prototype.fillRect = function(point, width, height) {
        this.buffer.push(['fillRect', [point, width, height]]);
    }
    Renderer.prototype.beginPath = function() {
        this.buffer.push(['beginPath']);
    }
    Renderer.prototype.closePath = function() {
        this.buffer.push(['closePath']);
    }
    Renderer.prototype.fill = function() {
        this.buffer.push(['fill']);
    }
    Renderer.prototype.stroke = function() {
        this.buffer.push(['stroke']);
    }
    Renderer.prototype.moveTo = function(point) {
        this.buffer.push(['moveTo', [point]]);
    }
    Renderer.prototype.lineTo = function(point) {
        this.buffer.push(['lineTo', [point]]);
    }
    Renderer.prototype.fillStyle = function(style) {
        this.buffer.push(['fillStyle', [style]]);
    }
    Renderer.prototype.fillText = function(text, point, options) {
        this.buffer.push(['font', [options.style + ' ' + options.weigth + ' ' + options.size + ' ' + options.font]]);
        this.buffer.push(['textBaseline', [options.baseline]]);
        this.buffer.push(['fillText', [text, point]]);
    }
    Renderer.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    Renderer.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.buffer.push(['putImageData', [imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight]]);
    }
    Renderer.prototype.drawImage = function(img, point, width, height) {
        this.buffer.push(['drawImage', [img, point, width, height]]);
    }

    return Renderer;
});
