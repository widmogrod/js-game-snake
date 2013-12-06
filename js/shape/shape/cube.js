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
    function CubeShape(x, y, z, size, color) {
        this.state_ = this.STATE_CLEAN;
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size / 2 || 10;
        this.color = color || '#333333';
        this.points_ = new PointCollection(x, y, z);

        this.points_.push(new Point(this.x - this.size, this.y - this.size, this.z - this.size));
        this.points_.push(new Point(this.x + this.size, this.y - this.size, this.z - this.size));
        this.points_.push(new Point(this.x + this.size, this.y + this.size, this.z - this.size));
        this.points_.push(new Point(this.x - this.size, this.y + this.size, this.z - this.size));

        this.points_.push(new Point(this.x - this.size, this.y - this.size, this.z - this.size));
        this.points_.push(new Point(this.x - this.size, this.y + this.size, this.z - this.size));
        this.points_.push(new Point(this.x - this.size, this.y + this.size, this.z + this.size));
        this.points_.push(new Point(this.x - this.size, this.y - this.size, this.z + this.size));

        this.points_.push(new Point(this.x + this.size, this.y - this.size, this.z - this.size));
        this.points_.push(new Point(this.x + this.size, this.y + this.size, this.z - this.size));
        this.points_.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points_.push(new Point(this.x + this.size, this.y - this.size, this.z + this.size));

        this.points_.push(new Point(this.x - this.size, this.y - this.size, this.z + this.size));
        this.points_.push(new Point(this.x + this.size, this.y - this.size, this.z + this.size));
        this.points_.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points_.push(new Point(this.x - this.size, this.y + this.size, this.z + this.size));

        this.points_.push(new Point(this.x - this.size, this.y - this.size, this.z - this.size));
        this.points_.push(new Point(this.x + this.size, this.y - this.size, this.z - this.size));
        this.points_.push(new Point(this.x + this.size, this.y - this.size, this.z + this.size));
        this.points_.push(new Point(this.x - this.size, this.y - this.size, this.z + this.size));

        this.points_.push(new Point(this.x - this.size, this.y + this.size, this.z - this.size));
        this.points_.push(new Point(this.x + this.size, this.y + this.size, this.z - this.size));
        this.points_.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points_.push(new Point(this.x - this.size, this.y + this.size, this.z + this.size));
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = new Shape();
    CubeShape.prototype.moveTo = function(point) {
        this.points_.moveBy(point.x, point.y, point.z);
        this.x = this.points_.center.x;
        this.y = this.points_.center.y;
        this.z = this.points_.center.z;
    }
    CubeShape.prototype.render = function(stage) {
        var color = this.color;
        this.points_.each(function(point, i) {
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
