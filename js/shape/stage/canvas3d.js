define(['shape/stage/canvas'], function(CanvasStage){
    function Canvas3DStage(canvas, projection) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.projection = projection;
    }
    Canvas3DStage.constructor = Canvas3DStage;
    Canvas3DStage.prototype = Object.create(CanvasStage.prototype);
    Canvas3DStage.prototype.update = function() {
        var child, state,
            i = 0,
            length = this.childs.length;


        this.context.clearRect(0,0,this.width, this.height);

        for (; i < length; i++) {
            child = this.childs[i];
            // state = child.state();
            state = child.STATE_DIRTY;
            if (child.STATE_RENDERED !== state) {
                child.projection(this.projection);
                child.render(this);
                child.state(child.STATE_RENDERED);
            }
        }
    }

    return Canvas3DStage;
})
