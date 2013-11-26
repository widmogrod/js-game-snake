define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function(Shape, Point, PointCollection){
    "use strict";

    function RectShape(x, y, z, width, height) {
        this.state_ = this.STATE_CLEAN;

        this.width = width;
        this.height = height;

        width /= 2;
        height /= 2;

        this.points = new PointCollection(new Point(x, y, z));

        // top left corner
        this.points.push(new Point(x - width, y - height, z - width));
        // top right corner
        this.points.push(new Point(x + width, y - height, z - width));
        // bottom right corner
        this.points.push(new Point(x + width, y + height, z - width));
        // bottom left corner
        this.points.push(new Point(x - width, y + height, z - width));
    }
    RectShape.constructor = RectShape;
    RectShape.prototype = new Shape();
    RectShape.prototype.projection = function(projection) {
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
    RectShape.prototype.render = function(stage) {
        this.points.each(function(point, i){
            if (i == 0) {
                stage.beginPath();
                stage.moveTo(point.xpos, point.ypos);
            } else {
                stage.lineTo(point.xpos, point.ypos);
            }
        })
        stage.fillStyle(this.color);
        stage.closePath();
        stage.fill();
    }

    return RectShape;
});
