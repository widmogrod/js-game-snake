define(['shape/point/interface'], function(PointInterface) {
    "use strict";

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
    PointCollection.prototype.each = function(callback) {
        for(var i = 0; i < this.count; i++) {
            callback(this.points[i], i);
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
        var point = this.first();
        this.moveBy(x - point.x, y - point.y, z - point.z);
    }

    return PointCollection;
})
