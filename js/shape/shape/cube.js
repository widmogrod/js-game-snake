define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function(Shape, Point, PointCollection) {
    "use strict";

    /**
     * Cube shape
     */
    function CubeShape(x, y, z, width, color) {
        this.state_ = this.STATE_CLEAN;
        this.width = width || 10;
        this.color = color || '#333333';
        this.points_ = new PointCollection(new Point(x, y, z));
        this.faces = [
            [0,1,2,3],
            [0,1,5,4],
            [0,3,7,4],
            [3,2,6,7],
            [1,2,6,5],
            [4,5,6,7]
        ];

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
    CubeShape.prototype = new Shape();
    CubeShape.prototype.center = function() {
        return this.points().center;
    }
    CubeShape.prototype.render = function(stage) {
        var face, point;
        var i = 0, length = this.faces.length;
        for (; i < length; i++) {
            face = this.faces[i];
            point = this.points_.get(face[0]);
            stage.beginPath();
            stage.moveTo(point.xpos, point.ypos);
            for (var j = 3; j >= 0; j--) {
                point = this.points_.get(face[j]);
                stage.lineTo(point.xpos, point.ypos);
            }
            stage.closePath();
            stage.fillStyle(this.color);
            stage.stroke();
            // stage.fill();
        }
    }

    return CubeShape;
});
