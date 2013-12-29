define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function (Shape, Point, PointCollection) {
    "use strict";

    function ImageShape(x, y, z, width, height) {
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
    ImageShape.constructor = ImageShape;
    ImageShape.prototype = Object.create(Shape.prototype);
    ImageShape.prototype.setImage = function(image) {
        this.image = image;
    }
    ImageShape.prototype.render = function(stage) {
        var center = this.center();
        var width = this.points_.get(0).xpos - this.points_.get(1).xpos;
        var height = this.points_.get(0).ypos - this.points_.get(2).ypos;

        if (!this.image) {
            return;
        }

        // stage.drawImage(this.image, center.xpos, center.ypos, width, height);
        stage.drawImage(this.image, center.xpos, center.ypos, this.width, this.height);
    }

    return ImageShape;
});
