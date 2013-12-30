define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function(Shape, Point, PointCollection) {
    "use strict";

    var faces = [
        [0,1,2,3],
        [0,1,5,4],
        [0,3,7,4],
        [3,2,6,7],
        [1,2,6,5],
        [4,5,6,7]
    ];

    /**
     * Cube shape
     */
    function CubeShape(x, y, z, width, color) {
        this.state_ = this.STATE_CLEAN;
        this.points_ = new PointCollection(new Point(x, y, z));

        this.width = width || 10;
        this.color = color || '#333333';

        var halfWidth = this.width / 2;

        this.points_.push(new Point(x - halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z + halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z + halfWidth));
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = Object.create(Shape.prototype);
    CubeShape.prototype.render = function(stage) {
        var face, point;
        var i = 0, length = faces.length;
        for (; i < length; i++) {
            face = faces[i];
            point = this.points_.get(face[0]);
            stage.beginPath();
            stage.moveTo(point);
            for (var j = 3; j > 0; j--) {
                point = this.points_.get(face[j]);
                stage.lineTo(point);
            }
            // stage.closePath();
            stage.fillStyle(this.color);
            // stage.stroke();
            stage.fill();
        }
    }

    return CubeShape;
});
