define(['shape/point/interface'], function(PointInterface) {
    "use strict";

    function Point(x, y, z) {
        this.origin = {
            x:x, y:y, z:z,
            angle: {x:360, y:360,z:360}
        };
        this.x = x;
        this.y = y;
        this.z = z;
        this.xpos = 0;
        this.ypos = 0;
    }
    Point.constructor = Point;
    Point.prototype = new PointInterface();
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
    Point.prototype.length = function() {
        return Math.sqrt(
            (this.x * this.x) + (this.y * this.y) + (this.z * this.z)
        );
    }

    return Point;
})
