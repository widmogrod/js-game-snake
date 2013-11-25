define(['shape/shape/interface', 'shape/point'], function(Shape, Point){
    "use strict";

    function RectShape(x, y, width, height, angle) {
        this.state_ = this.STATE_CLEAN;
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
        this.angle = angle;

        this.points = [];
        this.points.push(new Point(this.x - this.size, this.y - this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y - this.size, this.z - this.size));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z - this.size));
        this.points.push(new Point(this.x - this.size, this.y + this.size, this.z - this.size));
    }
    RectShape.constructor = RectShape;
    RectShape.prototype = new Shape();
    RectShape.prototype.render = function(stage) {

    }

    return RectShape;
});
