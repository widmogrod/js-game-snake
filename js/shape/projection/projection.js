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
                    ? item.each(function(child) { each(child.points(), func) })
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
        function task(point) {
            if (point.z > -this.distance) {
                var scale = this.distance / (this.distance + point.z);
                point.xpos = this.x + point.x * scale >> 0;
                point.ypos = this.y + point.y * scale >> 0;
            }
        }
        each(point, task.bind(this));
    }
    Projection.prototype.rotateY = function(point, angle) {
        function task(point) {
            // angle = angle >= 1 ? point.origin.angle + angle : point.origin.angle;
            point.origin.angle += angle >> 0;
            point.origin.angle = point.origin.angle > 360 ? 1 : point.origin.angle;
            point.origin.angle = point.origin.angle < 1 ? 360 : point.origin.angle;
            angle = point.origin.angle * Math.PI / 180;
            var cos = Math.cos(angle), sin = Math.sin(angle);
            var x1 = point.origin.x * cos - point.origin.z * sin,
                z1 = point.origin.z * cos + point.origin.x * sin;

            point.x = x1;
            point.z = z1;
        }
        each(point, task);
    }
    Projection.prototype.rotateX = function(point, angle) {
        angle = angle * Math.PI / 180;
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
