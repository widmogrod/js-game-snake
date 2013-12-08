define(['shape/point/interface'], function(PointInterface) {
    // "use strict";

    function PointCollection(centerPoint) {
        this.center = centerPoint;
        this.points = [];
        this.count = 0;
    }

    PointCollection.constructor = PointCollection;
    PointCollection.prototype = new PointInterface();
    PointCollection.prototype.push = function(point) {
        this.points[this.count++] = point;
    },
    PointCollection.prototype.first = function() {
        return this.points[0];
    },
    PointCollection.prototype.each = function(callback, depth) {
        var point, i
        for(i = 0; i < this.count; i++) {
            point = this.points[1];
            if (point instanceof PointCollection) {
                point.each(callback, depth + 1 || 0);
            } else {
                callback(this.points[i], i, depth);
            }
        }
    },
    PointCollection.prototype.moveBy = function(x, y, z) {
        this.center.x += x;
        this.center.y += y;
        this.center.z += z;
        this.each(function(point){
            point.x += x;
            point.y += y;
            point.z += z;
        });
    },
    PointCollection.prototype.moveTo = function(x, y, z) {
        this.moveBy(x - this.center.x, y - this.center.y, z - this.center.z);
    }

    return PointCollection;
})
