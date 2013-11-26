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
        this.points = new PointCollection(x, y, z);

        this.points.push(new Point(this.x - this.size, this.y - this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y - this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z - this.size));
        this.points.push(new Point(this.x - this.size, this.y + this.size, this.z - this.size));

        this.points.push(new Point(this.x - this.size, this.y - this.size, this.z - this.size));
        this.points.push(new Point(this.x - this.size, this.y + this.size, this.z - this.size));
        this.points.push(new Point(this.x - this.size, this.y + this.size, this.z + this.size));
        this.points.push(new Point(this.x - this.size, this.y - this.size, this.z + this.size));

        this.points.push(new Point(this.x + this.size, this.y - this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points.push(new Point(this.x + this.size, this.y - this.size, this.z + this.size));

        this.points.push(new Point(this.x - this.size, this.y - this.size, this.z + this.size));
        this.points.push(new Point(this.x + this.size, this.y - this.size, this.z + this.size));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points.push(new Point(this.x - this.size, this.y + this.size, this.z + this.size));

        this.points.push(new Point(this.x - this.size, this.y - this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y - this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y - this.size, this.z + this.size));
        this.points.push(new Point(this.x - this.size, this.y - this.size, this.z + this.size));

        this.points.push(new Point(this.x - this.size, this.y + this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points.push(new Point(this.x - this.size, this.y + this.size, this.z + this.size));
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = new Shape();
    CubeShape.prototype.moveTo = function(point) {
        this.points.moveBy(point.x, point.y, point.z);
        this.x = this.points.center.x;
        this.y = this.points.center.y;
        this.z = this.points.center.z;
    }
    CubeShape.prototype.projection = function(projection) {
        this.points.each(projection.project.bind(projection));
        var self = this;
        return {
            rotateY : function(angle) {
                self.state(self.STATE_DIRTY);
                self.points.each(function(point){
                    projection.rotateY(point, angle);
                })
            },
            rotateX : function(angle) {
                self.state(self.STATE_DIRTY);
                self.points.each(function(point){
                    projection.rotateX(point, angle);
                })
            }
        }
    }
    CubeShape.prototype.render = function(stage) {
        var color = this.color;
        this.points.each(function(point, i) {
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
