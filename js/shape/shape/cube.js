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

        var halfWidth = width / 2;

        this.points_.push(new Point(x - halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z - halfWidth));

        this.points_.push(new Point(x - halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z + halfWidth));
        this.points_.push(new Point(x - halfWidth, y - halfWidth, z + halfWidth));

        this.points_.push(new Point(x + halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z + halfWidth));

        this.points_.push(new Point(x - halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z + halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z + halfWidth));

        this.points_.push(new Point(x - halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x - halfWidth, y - halfWidth, z + halfWidth));

        this.points_.push(new Point(x - halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z + halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z + halfWidth));
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = new Shape();
    CubeShape.prototype.center = function() {
        return this.points().center;
    }
    CubeShape.prototype.render = function(stage) {
        var color = this.color;
        this.points().each(function(point, i) {
            if (i == 0) {
                stage.beginPath();
                stage.moveTo(point.xpos, point.ypos);
            }
            else if ((i + 1) % 4 == 0) {
                stage.lineTo(point.xpos, point.ypos);
                stage.fillStyle(color);
                stage.closePath();
                stage.fill();
                stage.beginPath();
            } else {
                stage.lineTo(point.xpos, point.ypos);
            }
        })
    }

    return CubeShape;
});
