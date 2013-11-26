define(['shape/shape/interface', 'shape/point/point'], function(Shape, Point) {
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
        this.init();
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = new Shape();
    CubeShape.prototype.init = function() {
        this.points = [];
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
    CubeShape.prototype.moveTo = function(point) {
        this.x += point.x;
        this.y += point.y;
        this.z += point.z;
        this.init();
    }
    CubeShape.prototype.projection = function(projection) {
        for(var i = 0, length = this.points.length; i < length; i++) {
            projection.project(this.points[i]);
        }
        var self = this;
        return {
            rotateY : function(angle) {
                self.state(self.STATE_DIRTY);
                for(var i = 0, length = self.points.length; i < length; i++) {
                    projection.rotateY(self.points[i], angle);
                }
                self.x = self.points[0].x;
                self.y = self.points[0].y;
                self.z = self.points[0].z;
            },
            rotateX : function(angle) {
                self.state(self.STATE_DIRTY);
                for(var i = 0, length = self.points.length; i < length; i++) {
                    projection.rotateX(self.points[i], angle);
                }
                self.x = self.points[0].x;
                self.y = self.points[0].y;
                self.z = self.points[0].z;
            }
        }
    }
    CubeShape.prototype.render = function(stage) {
        var point;

        for(var i = 0, length = this.points.length; i < length; i++) {
            point = this.points[i];
            if (i == 0) {
                stage.beginPath();
                stage.moveTo(point.xpos, point.ypos);
            }
            else if ((i + 1) % 4 == 0) {
                stage.lineTo(point.xpos, point.ypos);
                stage.fillStyle(this.color);
                stage.closePath();
                stage.fill();
                stage.beginPath();
            } else {
                stage.lineTo(point.xpos, point.ypos);
            }
        }
    }

    return CubeShape;
});
