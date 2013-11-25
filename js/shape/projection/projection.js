define(['shape/projection/interface'], function(ProjectionInterface){
    "use strict";

    function Projection(viewerAngle, x, y) {
        this.viewerAngle = viewerAngle;
        this.x = x;
        this.y = y;
    }
    Projection.constructor = Projection;
    Projection.prototype = new ProjectionInterface();

    return Projection;
})
