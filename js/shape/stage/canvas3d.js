define(['shape/stage/canvas'], function(CanvasStage){
    "use strict";

    function Canvas3DStage(canvas, projection) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.projection = projection;
    }
    Canvas3DStage.constructor = Canvas3DStage;
    Canvas3DStage.prototype = Object.create(CanvasStage.prototype);

    Canvas3DStage.prototype.render = function() {
        var state, self = this;
        this.context.clearRect(0,0,this.width, this.height);
        this.each(function(child){
            // state = child.state();
            state = child.STATE_DIRTY;
            if (child.STATE_RENDERED !== state) {
                self.projection.project(child);
                // self.projection.project(child.points());
                // child.projection(this.projection);
                child.render(self);
                child.state(child.STATE_RENDERED);
            }
        })
    }

    return Canvas3DStage;
})
