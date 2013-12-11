define([
    'shape/projection/interface',
    'shape/point/collection',
    'shape/shape/interface',
    'shape/stage/interface',
    'shape/utils/angle'
],
function(
    ProjectionInterface,
    PointCollection,
    Shape,
    Stage,
    Angle
) {
    "use strict";

    function each(item, func) {
        item instanceof PointCollection
            ? (item.each(func) || func(item.center))
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
                var scale = this.distance / (this.distance + point.z >> 0);
                point.xpos = this.x + point.x * scale >> 0;
                point.ypos = this.y + point.y * scale >> 0;
                point.scale = scale;
            }
        }
        each(point, task.bind(this));
    }
    Projection.prototype.rotateY = function(point, angle) {
        angle = angle * Math.PI / 180;
        var cos = Math.cos(angle), sin = Math.sin(angle);
        function task(point) {
            // point.origin.angle.y = Angle.normalize(point.origin.angle.y + angle);
            // angle = point.origin.angle.y * Math.PI / 180;
            // var cos = Math.cos(angle), sin = Math.sin(angle);
            // var x1 = point.origin.x * cos - point.origin.z * sin,
            //     z1 = point.origin.z * cos + point.origin.x * sin;
            var x1 = point.x * cos - point.z * sin,
                z1 = point.z * cos + point.x * sin;

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
