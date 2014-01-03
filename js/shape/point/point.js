define(['shape/point/interface', 'math/vector3'], function(PointInterface, Vector4) {
    "use strict";

    function Point(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = 1;
        this.rows = 4;
        this.cols = 1;
        this.data = [this.x, this.y, this.z, this.w]
        this.xpos = x;
        this.ypos = y;
    }
    Point.constructor = Point;
    Point.prototype = Object.create(Vector4.prototype);
    Point.prototype.toString = function() {
        return 'Point(' + this.x, this.y, this.z + ')';
    }
    Point.prototype.moveBy = function(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        this.data = [this.x, this.y, this.z, this.w]
    }
    Point.prototype.moveTo = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = [this.x, this.y, this.z, this.w]
    }

    return Point;
})
