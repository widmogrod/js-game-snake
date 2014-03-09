define([
    'shape/viewport'
], function(
    Viewport
) {
    'use strict';

    function Renderer(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.viewport = new Viewport(0, 0, this.width, this.height);
        this.zbuffer = Array(this.width * this.height);
    }

    Renderer.constructor = Renderer;
    Renderer.prototype.clean = function() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.zbuffer = Array(this.width * this.height)
    }
    Renderer.prototype.render = function() {
        this.flush();
    };
    Renderer.prototype.flush = function() {
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
        var result = {
            bottom: v1,
            middle: v2,
            top: v3
        };

        if(result.bottom.projection.y > result.middle.projection.y) {
            this.swap(result, 'bottom', 'middle');
        }
        if(result.middle.projection.y > result.top.projection.y) {
            this.swap(result, 'top', 'middle');
        }
        if(result.bottom.projection.y > result.middle.projection.y) {
            this.swap(result, 'bottom', 'middle');
        }

        return result;
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
        data.u1 = this.interpolate(t1.x, t2.x, p1.y, p2.y, y);
        data.u2 = this.interpolate(t1.x, t3.x, p1.y, p3.y, y);
        data.v1 = this.interpolate(t1.y, t2.y, p1.x, p2.x, data.x1);
        data.v2 = this.interpolate(t1.y, t3.y, p1.x, p3.x, data.x2);

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
    Renderer.prototype.clipTo = function(viewport) {
        this.viewport = viewport;
    }
    Renderer.prototype.drawPoint = function(point, color) {
        this.drawPixel(point.x, point.y, point.z, color);
    }
    Renderer.prototype.drawPixel = function(x, y, z, color) {
        if (this.viewport.isIn(x, y)) {
            this.putPixel(x, y, z, color);
        }
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

    return Renderer;
});
