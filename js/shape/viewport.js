define(function() {
    'use strict';

    function Viewport(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Viewport.constructor = Viewport;
    Viewport.prototype.isIn = function(x, y) {
        return (x >= this.x || x <= (this.x + this.width)) && (y >= this.y || y <= (this.y + this.height));
    }

    return Viewport;
})
