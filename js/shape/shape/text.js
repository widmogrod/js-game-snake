define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function (Shape, Point, PointCollection) {
    "use strict";

    function TextShape(x, y, z, text, options) {
        this.state_ = this.STATE_CLEAN;
        this.points_ = new PointCollection(new Point(x, y, z));
        this.text_ = text;
        this.options(options)
    }
    TextShape.constructor = TextShape;
    TextShape.prototype = Object.create(Shape.prototype);
    TextShape.prototype.options = function(options) {
        if (arguments.length) {
            options = options || {};
            options.color     = options.color || '#000';
            options.style     = options.style || 'normal';
            options.weigth     = options.weigth || 'normal';
            options.size      = options.size  || '12px';
            options.font      = options.font  || 'sans-serif';
            options.baseline  = options.baseline || 'bottom';
            this.options_ = options;
        } else return this.options_;
    }
    TextShape.prototype.render = function(stage) {
        if (!this.text_) return;

        var center = this.center(),
            options = this.options();

        stage.fillStyle(options.color);
        stage.fillText(this.text_, center, options);
    }

    return TextShape;
});
