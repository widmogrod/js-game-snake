define(['shape/point/interface'], function(PointInterface) {
    "use strict";

    function Point(x, y, z) {
        // this.origin = {
        //     x:x, y:y, z:z,
        //     angle: {x:360, y:360,z:360}
        // };
        this.x = x;
        this.y = y;
        this.z = z;
        this.xpos = x;
        this.ypos = y;
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
    Point.prototype.normalize = function() {
        var length = this.length();
        return new Point(
            this.x / length,
            this.y / length,
            this.z / length
        );
    }
    Point.prototype.length = function() {
        return Math.sqrt(
            (this.x * this.x) + (this.y * this.y) + (this.z * this.z)
        );
    }
    Point.prototype.length2 = function() {
        return Math.sqrt(
            (this.xpos * this.xpos) + (this.ypos * this.ypos)
        );
    }
    Point.prototype.subtract = function(point) {
        return new Point(
            (this.xpos - point.xpos), (this.ypos - point.ypos)
        );
    }
    Point.prototype.add = function(point) {
        return new Point(
            (this.xpos + point.xpos), (this.ypos + point.ypos)
        );
    }
    Point.prototype.scale = function(scale) {
        return new Point(
            (this.x * scale), (this.y * scale), (this.z * scale)
        );
    }
    return Point;
})
