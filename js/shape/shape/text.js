define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function (Shape, Point, PointCollection) {
    "use strict";

    function TextShape(x, y, z, text, options) {
        this.state_ = this.STATE_CLEAN;
        this.text_ = text;
        this.options(options)
        this.points_ = new PointCollection(new Point(x, y, z));
    }
    TextShape.constructor = TextShape;
    TextShape.prototype = new Shape();
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
        stage.fillText(this.text_, center.xpos, center.ypos, options);
    }

    return TextShape;
});
