define(['shape/point/interface'], function(PointInterface) {
    "use strict";

    function Point(x, y, z) {
        this.origin = {x:x, y:y, z:z, angle:0};
        this.x = x;
        this.y = y;
        this.z = z;
        this.xpos = 0;
        this.ypos = 0;
    }
    Point.constructor = Point;
    Point.prototype = new PointInterface();
    Point.prototype.each = function(callback) {
        callback(this, 0);
    }
    Point.prototype.moveBy = function(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }
    Point.prototype.moveTo = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    return Point;
})
