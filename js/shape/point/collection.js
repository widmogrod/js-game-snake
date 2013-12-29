define(['shape/point/interface'], function(PointInterface) {
    // "use strict";

    function PointCollection(center) {
        this.center = center;
        this.points = [];
        this.count = 0;
        this.area = {
            minX: center.xpos,
            minY: center.ypos,
            maxX: center.xpos,
            maxY: center.ypos
        };
    }

    PointCollection.constructor = PointCollection;
    PointCollection.prototype = new PointInterface();
    PointCollection.prototype.push = function(point) {
        this.points[this.count++] = point;
    }
    PointCollection.prototype.get = function(index) {
        return this.points[index];
    }
    PointCollection.prototype.first = function() {
        return this.get(0);
    }
    PointCollection.prototype.each = function(callback, depth) {
        var point, i
        for(i = 0; i < this.count; i++) {
            point = this.points[i];
            if (point instanceof PointCollection) {
                point.each(callback, depth + 1 || 0);
            } else {
                callback(point, i, depth);
                this.area.minX = point.xpos < this.area.minX ? point.xpos : this.area.minX;
                this.area.minY = point.ypos < this.area.minY ? point.ypos : this.area.minY;
                this.area.maxX = point.xpos < this.area.maxX ? point.xpos : this.area.maxX;
                this.area.maxY = point.ypos < this.area.maxY ? point.ypos : this.area.maxY;
            }
        }
    }
    PointCollection.prototype.moveBy = function(x, y, z) {
        this.center.x += x;
        this.center.y += y;
        this.center.z += z;
        this.each(function(point){
            point.x += x;
            point.y += y;
            point.z += z;
        });
    }
    PointCollection.prototype.moveTo = function(x, y, z) {
        this.moveBy(x - this.center.x, y - this.center.y, z - this.center.z);
    }

    return PointCollection;
})
