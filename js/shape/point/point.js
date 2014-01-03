define(['shape/point/interface', 'math/vector3'], function(PointInterface, Vector3) {
    "use strict";

    function Point(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.xpos = x;
        this.ypos = y;
    }
    Point.constructor = Point;
    Point.prototype = Object.create(Vector3.prototype);
    Point.prototype.toString = function() {
        return 'Point(' + this.x, this.y, this.z + ')';
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
