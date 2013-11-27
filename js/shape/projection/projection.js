define(['shape/projection/interface'], function(ProjectionInterface){
    "use strict";

    function Projection(viewerAngle, x, y) {
        this.viewerAngle = viewerAngle;
        this.x = x;
        this.y = y;
    }
    Projection.constructor = Projection;
    Projection.prototype = new ProjectionInterface();
    Projection.prototype.project = function(point) {
        if (point.z > -this.viewerAngle) {
            var scale = this.viewerAngle / (this.viewerAngle + point.z);
            point.xpos = this.x + point.x * scale;
            point.ypos = this.y + point.y * scale;
        }
    }
    Projection.prototype.rotateY = function(point, angle) {
        var cos = Math.cos(angle), sin = Math.sin(angle);

        point.each(function(point){
            var x1 = point.x * cos - point.z * sin,
                z1 = point.z * cos + point.x * sin;

            point.x = x1;
            point.z = z1;
        })
    }
    Projection.prototype.rotateX = function(point, angle) {
        var cos = Math.cos(angle), sin = Math.sin(angle);

        point.each(function(point) {
            var y1 = point.y * cos - point.z * sin,
                z1 = point.z * cos + point.y * sin;

            point.y = y1;
            point.z = z1;
        })
    }

    return Projection;
})
