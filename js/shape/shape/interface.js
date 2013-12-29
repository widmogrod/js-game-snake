define(['shape/point/collection'], function(PointCollection) {
    "use strict";

    /**
     * Shape prototype
     */
    function Shape() {
        this.state_ = this.STATE_CLEAN;
        this.points_ = new PointCollection();
    }

    Shape.constructor = Shape;
    Shape.prototype.STATE_CLEAN = 0;
    Shape.prototype.STATE_DIRTY = 1;
    Shape.prototype.STATE_RENDERED = 2;
    Shape.prototype.render = function(context) {};
    Shape.prototype.points = function() {
        return this.points_;
    };
    Shape.prototype.center = function() {
        return this.points_.center;
    };
    Shape.prototype.area = function() {
        return this.poinst_.area
    }
    Shape.prototype.state = function(state) {
        if (arguments.length) {
            this.state_ = state;
            return this;
        }
        return this.state_;
    }

    return Shape;
})
