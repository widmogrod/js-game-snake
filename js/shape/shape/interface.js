define(['shape/point/collection'], function(PointCollection) {
    "use strict";

    /**
     * Shape prototype
     */
    function Shape() {
        this.state_ = this.STATE_CLEAN;
    }

    Shape.constructor = Shape;
    // Shape.prototype = Object.create(PointCollection.prototype);
    Shape.prototype.STATE_CLEAN = 0;
    Shape.prototype.STATE_DIRTY = 1;
    Shape.prototype.STATE_RENDERED = 2;
    Shape.prototype.render = function(context) {};
    Shape.prototype.state = function(state) {
        if (arguments.length) {
            this.state_ = state;
            return this;
        }
        return this.state_;
    }

    return Shape;
})
