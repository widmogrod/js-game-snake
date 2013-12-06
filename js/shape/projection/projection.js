define([
    'shape/projection/interface',
    'shape/point/collection',
    'shape/shape/interface',
    'shape/stage/interface'
],
function(
    ProjectionInterface,
    PointCollection,
    Shape,
    Stage
) {
    "use strict";

    function each(item, func) {
        item instanceof PointCollection
            ? item.each(func)
            : item instanceof Shape
                ? item.points().each(func)
                : item instanceof Stage
                    ? item.each(function(child) { each(child, func) })
                    : func(item);
    }

    function Projection(distance, x, y) {
        this.distance = distance;
        this.x = x;
        this.y = y;
    }
    Projection.constructor = Projection;
    Projection.prototype = new ProjectionInterface();
    Projection.prototype.project = function(point) {
        var distance = this.distance;
        function task(point) {
            if (point.z > -this.distance) {
                var scale = this.distance / (this.distance + point.z);
                point.xpos = this.x + point.x * scale;
                point.ypos = this.y + point.y * scale;
            }
        }
        each(point, task.bind(this));
    }
    Projection.prototype.rotateY = function(point, angle) {
        var cos = Math.cos(angle), sin = Math.sin(angle);
        function task(point) {
            var x1 = point.x * cos - point.z * sin,
                z1 = point.z * cos + point.x * sin;

            point.x = x1;
            point.z = z1;
        }
        each(point, task);
    }
    Projection.prototype.rotateX = function(point, angle) {
        var cos = Math.cos(angle), sin = Math.sin(angle);
        function task(point) {
            var y1 = point.y * cos - point.z * sin,
                z1 = point.z * cos + point.y * sin;

            point.y = y1;
            point.z = z1;
        }
        each(point, task);
    }

    return Projection;
})
