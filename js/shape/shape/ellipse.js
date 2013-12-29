define(['shape/shape/interface'], function(Shape){
    "use strict";

    function EllipseShape(x, y, width, height) {
        this.state_ = this.STATE_CLEAN;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    EllipseShape.constructor = EllipseShape;
    EllipseShape.prototype = Object.create(Shape);
    EllipseShape.prototype.render = function (state) {
        state.fillEllipse(this.x, this.y, this.width, this.height);
    }

    return EllipseShape;
})
