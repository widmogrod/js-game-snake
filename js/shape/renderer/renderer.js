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
        this.zbuffer = []
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
    Renderer.prototype.fillTriangle = function(p1, p2, p3, fn) {
        var top, middle, bottom, a;
        var min = Math.min(p1.y, p2.y, p3.y);
        var max = Math.max(p1.y, p2.y, p3.y);

        // TODO: Experiment, make it better
        var angle = this.lightPosition.dot(fn);
        this.angle = Math.max(0, angle);

        for (var i = 0; i < 3; i++) {
            a = arguments[i];
            switch(true) {
                case min === a.y && !bottom: bottom = a; break;
                case max === a.y && !top: top = a; break;
                default: middle = a; break;
            }
        }

        var vectorTB = top.subtract(bottom);
        var vectorMB = middle.subtract(bottom);
        var vectorTM = top.subtract(middle);

        var slopeTBy = this.slopeYX(vectorTB);
        var slopeMBy = this.slopeYX(vectorMB);
        var slopeTMy = this.slopeYX(vectorTM);

        var slopeTBz = this.slopeYZ(vectorTB);
        var slopeMBz = this.slopeYZ(vectorMB);
        var slopeTMz = this.slopeYZ(vectorTM);


        var by1 = this.offset(bottom.y, bottom.x, slopeTBy); // b = y - (x * slope)
        console.log('[BBB] b1', bottom.y, bottom.x, slopeTBy, by1);
        var x1 = this.calcX(bottom.y, by1, slopeTBy); // x = (y - b) / slope
        console.log('[BBB] x1', x1);


        var by2 = this.offset(middle.y, middle.x, slopeMBy);
        var by3 = this.offset(top.y, top.x, slopeTMy);

        var bz1 = this.offset(bottom.z, bottom.y, slopeTBz);
        var bz2 = this.offset(middle.z, middle.y, slopeMBz);
        var bz3 = this.offset(top.z, top.y, slopeTMz);


        console.log('top', top.toString())
        console.log('middle', middle.toString())
        console.log('botom', bottom.toString())

        console.log('from', bottom.z)
        console.log('to', middle.z)
        console.log('slope', slopeTBy, slopeMBy, slopeTMy)
        // console.log('TMz', slopeTMz, vectorTM.toString())
        // console.log('slope', slopeTBz, slopeMBz, slopeTMz);
        console.log('offset', bz1, bz2, bz3);

        this.scanLines(
            bottom, middle,
            by1, by2,
            slopeTBy, slopeMBy,
            bz1, bz2,
            slopeTBz, slopeMBz
        );
        // this.scanLines(
        //     middle, top,
        //     by1, by3,
        //     slopeTBy, slopeTMy,
        //     bz1, bz3,
        //     slopeTBz, slopeTMz
        // );
    };
    Renderer.prototype.fillTriangle2 = function(p1, p2, p3, fn) {
        var temp;
        // p1 - bottom
        // p2 - middle
        // p3 - top
        if(p1.y > p2.y) {
            temp = p2;
            p2 = p1;
            p1 = temp;
        }
        if(p2.y > p3.y) {
            temp = p2;
            p2 = p3;
            p3 = temp;
        }
        if(p1.y > p2.y) {
            temp = p2;
            p2 = p1;
            p1 = temp;
        }

        var dot = this.lightPosition.dot(fn);
        this.angle = Math.max(0, dot);

        // Vectors
        var edge1 = p3.subtract(p1); // top - bottom
        var edge2 = p2.subtract(p1); // middle - bottom
        var edge3 = p3.subtract(p2); // top - middle

        var slope1x = edge1.x === 0 ? 0 : edge1.y/edge1.x;
        var slope2x = edge2.x === 0 ? 0 : edge2.y/edge2.x;
        var slope3x = edge3.x === 0 ? 0 : edge3.y/edge3.x;
        var slope1z = edge1.z === 0 ? 0 : edge1.y/edge1.z;
        var slope2z = edge2.z === 0 ? 0 : edge2.y/edge2.z;
        var slope3z = edge3.z === 0 ? 0 : edge3.y/edge3.z;

        var dy = p2.y - p1.y >> 0;
        for (var y = p1.y >> 0; y < p2.y >> 0; y++) {
            this.processLine(y, dy, p1, p2, p3, slope1x, slope2x, slope1z, slope2z);
        }
        for (var y = p2.y >> 0; y < p3.y >> 0; y++) {
            this.processLine(y, dy, p3, p2, p1, slope1x, slope3x, slope1z, slope3z);
        }
    }
    Renderer.prototype.processLine = function(y, dy, p1, p2, p3, slope1x, slope2x, slope1z, slope2z) {
        var x1 = this.interpolate2(y, p1.y, p1.x, slope1x) >> 0;
        var x2 = this.interpolate2(y, p2.y, p2.x, slope2x) >> 0;
        var z1 = this.interpolate2(y, p1.y, p1.z, slope1z);
        var z2 = this.interpolate2(y, p2.y, p2.z, slope2z);

        // swap
        if (x1 > x2) {
            var temp = x1;
            x1 = x2;
            x2 = temp;

            temp = z1;
            z1 = z2;
            z2 = z1;
        }

        var dz = (z2 - z1)/ (x2 - x1);
        var color = this.color.clone();
        color.r *= this.angle;
        color.g *= this.angle;
        color.b *= this.angle;

        for (var x = x1, z = z1; x < x2; x++, z += dz) {
            // this.drawPixel(x, y + dy, z, color);
            this.drawPixel(x, y, z, color);
        }
    }
    Renderer.prototype.interpolate2 = function(y, y1, x1, slope) {
        var b = slope === 0 ? x1 : (y1 - slope * x1);
        return slope === 0 ? (b) : ((y - b)/slope);
    }
    Renderer.prototype.interpolate3 = function(y, y1, x1, slope) {
        // var b = slope === 0 ? x1 : (y1 - slope * x1);
        var b = x1;
        return slope === 0 ? (b) : (y/slope + b);
    }
    Renderer.prototype.slopeYX = function(vector) {
        return vector.y / vector.x;
    }
    Renderer.prototype.slopeYZ = function(vector) {
        return vector.y / vector.z;
    }
    Renderer.prototype.scanLines = function(bottom, top, by1, by2, slope1y, slope2y, bz1, bz2, slope1z, slope2z) {
        if (bottom.y - top.y === 0) {
            console.log('[!!!] y=const');
            return;
        };

        for (var y = bottom.y; y < top.y; y++) {
            var x1 = this.calcX(y, by1, slope1y);
            var x2 = this.calcX(y, by2, slope2y);
            var z1 = this.calcX(y, bz1, slope1z);
            var z2 = this.calcX(y, bz2, slope2z);

            var delta = x1 - x2;
            if (delta < 2 && delta > -2) {
                continue;
            }
            // console.log('y', y, z1, z2);

            this.drawYLine(y, x1, x2, z1, z2);
        }
    }
    Renderer.prototype.calcX = function(y, b, slope) {
        if (isInfinity(slope)) {
            // return y;
            return b;
        }
        if (isNaN(slope)) {
            b = 0;
        }
        return (y - b) / slope >> 0;
    }
    Renderer.prototype.offset = function(y, x, slope) {
        if (isInfinity(slope)) {
            // return 0;
            return x;
        }
        if (isNaN(slope)) {
            slope = 1;
            slope = 0;
        }
        return y - (x * slope);
    }
    Renderer.prototype.drawYLine = function(y, x1, x2, z1, z2) {
        var min = x1,
            max = x2;

        var z = z1;
        var dz = z1 - z2;

        if (min > max) {
            min = x2;
            max = x1;
            dz = z2 - z1;
            z = z2;
        }

        dz /= (max - min);
        // dz = dz >> 0;

        var color = this.color.clone();
        // color.r = this.angle * 255;
        // color.g = this.angle * 255;
        // color.b = this.angle * 255;
        color.r *= this.angle;
        color.g *= this.angle;
        color.b *= this.angle;

        for (var x = min; x < max; x++) {
            z += dz;
            if (y === 485)
                console.log(x, y, z);
            this.drawPixel(x, y, z, color);
        }
    }
    // Renderer.prototype.canScanLine = function(v1, v2) {
    //     return true;
    //     return v1.x != 0 && v2.x != 0;
    //     // return v1.x != 0 && v2.x != 0 && v1.y != 0 && v2.y != 0;
    // }

    Renderer.prototype.drawCline = function(point0, point1) {
        var x, y, x0, x1, y0, y1, z = 0;

        if (point1.y > point0.y) {
            x0 = point0.x >> 0;
            y0 = point0.y >> 0;
            x1 = point1.x >> 0;
            y1 = point1.y >> 0;
            for (y = y0; y < y1; y++) {
                x = this.interpolate(y0, y1, x0, x1, y);
                this.drawPoint(new Vector3(x, y, z), this.color);
            }
        } else if (point1.y < point0.y) {
            x0 = point1.x >> 0;
            y0 = point1.y >> 0;
            x1 = point0.x >> 0;
            y1 = point0.y >> 0;
            for (y = y0; y < y1; y++) {
                x = this.interpolate(y0, y1, x0, x1, y);
                this.drawPoint(new Vector3(x, y, z), this.color);
            }
        }

        if (point1.x > point0.x) {
            x0 = point0.x;
            y0 = point0.y;
            x1 = point1.x;
            y1 = point1.y;
            for (x = x0; x < x1; x++) {
                y = this.interpolate(x0, x1, y0, y1, x);
                this.drawPoint(new Vector3(x, y, z), this.color);
            }
        } else if (point1.x < point0.x) {
            x0 = point1.x >> 0;
            y0 = point1.y >> 0;
            x1 = point0.x >> 0;
            y1 = point0.y >> 0;
            for (x = x0; x < x1; x++) {
                y = this.interpolate(x0, x1, y0, y1, x);
                this.drawPoint(new Vector3(x, y, z), this.color);
            }
        }
    }
    Renderer.prototype.interpolate = function(x0, x1, y0, y1, x) {
        return (y0 + ((y1 - y0) * (x - x0) / (x1- x0))) >> 0;
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

        // Here we need to rememeber that z is negative
        if (this.zbuffer[index] > z) return;
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
