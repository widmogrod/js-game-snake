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
    Renderer.prototype.fillTriangle = function(p1, p2, p3, fn) {
        var temp;
        // p1 - bottom
        // p2 - middle
        // p3 - top
        if(p1.y > p2.y) {
            temp = p2;
            p2 = p1;
            p1 = temp;
        } else if (p1.y == p2.y && p1.z < p2.z) {
            temp = p2;
            p2 = p1;
            p1 = temp;
        }

        if(p2.y > p3.y) {
            temp = p2;
            p2 = p3;
            p3 = temp;
        } else if (p2.y === p3.y && p2.z < p3.z) {
            temp = p2;
            p2 = p3;
            p3 = temp;
        }

        if(p1.y > p2.y) {
            temp = p2;
            p2 = p1;
            p1 = temp;
        } else if (p1.y == p2.y && p1.z < p2.y) {
            temp = p2;
            p2 = p1;
            p1 = temp;
        }

        var dot = this.lightPosition.dot(fn);
        this.angle = Math.max(0, dot);

        for (var y = p1.y >> 0; y < p2.y >> 0; y++) {
            this.processLine(y, p1, p2, p3);
        }
        for (var y = p2.y >> 0; y < p3.y >> 0; y++) {
            this.processLine(y, p3, p2, p1);
        }
    }
    Renderer.prototype.processLine = function(y, p1, p2, p3) {
        var x1 = this.interpolate(p1.x, p2.x, p1.y, p2.y, y);
        var x2 = this.interpolate(p1.x, p3.x, p1.y, p3.y, y);
        var z1 = this.interpolate(p1.z, p2.z, p1.y, p2.y, y);
        var z2 = this.interpolate(p1.z, p3.z, p1.y, p3.y, y);

        var color = this.color.clone();
        color.r *= this.angle;
        color.g *= this.angle;
        color.b *= this.angle;


        // swap
        if (x1 > x2) {
            var temp = x1;
            x1 = x2;
            x2 = temp;
            temp = z1;
            z1 = z2;
            z2 = z1;
        }

        var dx = x2 - x1,
        dz = z2 - z1;
        dz /= dx;

        for (var x = x1 >> 0, z = z1; x < x2 >> 0; x++, z += dz) {
            this.drawPixel(x, y, z, color);
        }
    }
    Renderer.prototype.interpolate = function(x1, x2, y1, y2, y) {
        if (y1 === y2) return x1;
        return ((y - y1)/(y2 - y1) * (x2 - x1)) + x1;
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

        var color = this.color.clone();
        color.r *= this.angle;
        color.g *= this.angle;
        color.b *= this.angle;

        for (var x = min; x < max; x++) {
            z += dz;
            this.drawPixel(x, y, z, color);
        }
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

    Renderer.prototype.drawTriangle = function (p1, p2, p3, color) {
        // Sorting the points in order to always have this order on screen p1, p2 & p3
        // with p1 always up (thus having the Y the lowest possible to be near the top screen)
        // then p2 between p1 & p3
        if(p1.y > p2.y) {
            var temp = p2;
            p2 = p1;
            p1 = temp;
        }
        if(p2.y > p3.y) {
            var temp = p2;
            p2 = p3;
            p3 = temp;
        }
        if(p1.y > p2.y) {
            var temp = p2;
            p2 = p1;
            p1 = temp;
        }

        // inverse slopes
        var dP1P2; var dP1P3;

        // http://en.wikipedia.org/wiki/Slope
        // Computing slopes
        if(p2.y - p1.y > 0) {
            dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
        } else {
            dP1P2 = 0;
        }

        if(p3.y - p1.y > 0) {
            dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
        } else {
            dP1P3 = 0;
        }

        // First case where triangles are like that:
        // P1
        // -
        // --
        // - -
        // -  -
        // -   - P2
        // -  -
        // - -
        // -
        // P3
        if(dP1P2 > dP1P3) {
            for(var y = p1.y >> 0; y <= p3.y >> 0; y++) {
                if(y < p2.y) {
                    this.processScanLine(y, p1, p3, p1, p2, color);
                } else {
                    this.processScanLine(y, p1, p3, p2, p3, color);
                }
            }
        }
        // First case where triangles are like that:
        //       P1
        //        -
        //       --
        //      - -
        //     -  -
        // P2 -   -
        //     -  -
        //      - -
        //        -
        //       P3
        else {
            for(var y = p1.y >> 0; y <= p3.y >> 0; y++) {
                if(y < p2.y) {
                    this.processScanLine(y, p1, p2, p1, p3, color);
                } else {
                    this.processScanLine(y, p2, p3, p1, p3, color);
                }
            }
        }
    };
    // Clamping values to keep them between 0 and 1
    Renderer.prototype.clamp = function (value, min, max) {
        if (typeof min === "undefined") { min = 0; }
        if (typeof max === "undefined") { max = 1; }
        return Math.max(min, Math.min(value, max));
    };

    // Interpolating the value between 2 vertices
    // min is the starting point, max the ending point
    // and gradient the % between the 2 points
    Renderer.prototype.interpolate2 = function (min, max, gradient) {
        return min + (max - min) * this.clamp(gradient);
    };

    // drawing line between 2 points from left to right
    // papb -> pcpd
    // pa, pb, pc, pd must then be sorted before
    Renderer.prototype.processScanLine = function (y, pa, pb, pc, pd, color) {
        // Thanks to current Y, we can compute the gradient to compute others values like
        // the starting X (sx) and ending X (ex) to draw between
        // if pa.Y == pb.Y or pc.Y == pd.Y, gradient is forced to 1
        var gradient1 = pa.y != pb.y ? (y - pa.y) / (pb.y - pa.y) : 1;
        var gradient2 = pc.y != pd.y ? (y - pc.y) / (pd.y - pc.y) : 1;

        var sx = this.interpolate2(pa.x, pb.x, gradient1) >> 0;
        var ex = this.interpolate2(pc.x, pd.x, gradient2) >> 0;

        // starting Z & ending Z
        var z1 = this.interpolate2(pa.z, pb.z, gradient1);
        var z2 = this.interpolate2(pc.z, pd.z, gradient2);

        // drawing a line from left (sx) to right (ex)
        for(var x = sx; x < ex; x++) {
            var gradient = (x - sx) / (ex - sx);
            var z = this.interpolate2(z1, z2, gradient);
            this.drawPixel(x, y, z, color);
            // this.drawPoint(new BABYLON.Vector3(x, y, z), color);
        }
    };

    return Renderer;
});
