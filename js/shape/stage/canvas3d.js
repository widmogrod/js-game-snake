define(['shape/stage/imagedata', 'shape/point/point'], function(ImageDataStage, Point){
    "use strict";

    function Canvas3DStage(canvas, projection) {
        this.canvas = canvas;
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
    Canvas3DStage.prototype = Object.create(ImageDataStage.prototype);
    Canvas3DStage.prototype.project = function() {
        var self = this;
        this.each(function(child){
            self.projection.project(child);
        })
    }
    Canvas3DStage.prototype.render = function() {
        var self = this;
        this.clean();
        this.each(function(child){
            child.render(self);
        })
        this.flush();
    }

    return Canvas3DStage;
})
