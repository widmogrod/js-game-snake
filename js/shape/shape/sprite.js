define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function (Shape, Point, PointCollection) {
    "use strict";

    function SpriteShape(x, y, z, width, height) {
        this.state_ = this.STATE_CLEAN;
        this.width = width;
        this.height = height;
        this.image = null;

        width /= 2;
        height /= 2;

        this.points_ = new PointCollection(new Point(x, y, z));
        // top left corner
        this.points_.push(new Point(x - width, y - height, z - width));
        // top right corner
        this.points_.push(new Point(x + width, y - height, z - width));
        // bottom right corner
        this.points_.push(new Point(x + width, y + height, z - width));
        // bottom left corner
        this.points_.push(new Point(x - width, y + height, z - width));
    }
    SpriteShape.constructor = SpriteShape;
    SpriteShape.prototype = Object.create(Shape.prototype);
    SpriteShape.prototype.setSprite = function(image) {
        this.image = image;
    }
    SpriteShape.prototype.render = function(stage) {
        var center = this.center();
        if (!this.image) {
            return;
        }

        this.image.put(stage, center.xpos, center.ypos);
    }

    return SpriteShape;
});
