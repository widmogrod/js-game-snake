define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function(Shape, Point, PointCollection) {
    "use strict";

    function VectorShape(x, y, z, color) {
        this.state_ = this.STATE_CLEAN;
        this.points_ = new PointCollection(new Point(x, y, z));
        this.points_.push(new Point(0,0,0));
        this.color = color;
    }
    VectorShape.prototype = Object.create(Shape.prototype);
    VectorShape.prototype.render = function(stage) {
        stage.fillStyle(this.color);
        stage.moveTo(this.points().first());
        stage.lineTo(this.center());
        stage.stroke();
    }

    return VectorShape;
})
