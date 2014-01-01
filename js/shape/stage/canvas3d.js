define(['shape/stage/imagedata', 'shape/point/point'], function(BufferedCanvasStage, Point){
    "use strict";

    function Canvas3DStage(canvas, projection) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.projection = projection;
        this.buffer = [];
        this.imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
        this.zbuffer = Array(this.width * this.height);
        this.nullPoint = new Point(0,0,0);
    }
    Canvas3DStage.constructor = Canvas3DStage;
    Canvas3DStage.prototype = Object.create(BufferedCanvasStage.prototype);

    Canvas3DStage.prototype.render = function() {
        var state, self = this;
        this.clean();
        this.each(function(child){
            // state = child.state();
            state = child.STATE_DIRTY;
            if (child.STATE_RENDERED !== state) {
                self.projection.project(child.points());
                child.render(self);
                child.state(child.STATE_RENDERED);
            } else {
                child.area();
            }
        })

        this.flush();
    }

    return Canvas3DStage;
})
