define(function(){

    /**
     * Shape prototype
     */
    function Shape() {
    }
    Shape.prototype = {
        'STATE_CLEAN' : 0,
        'STATE_DIRTY' : 1,
        'STATE_RENDERED' : 2,
        'render': function(context) {},
        'state': function(state) {}
    };

    /**
     * Cube shape
     */
    function CubeShape() {
        this.rectangles = [

        ];
        this.currentState = this.STATE_CLEAN;
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = new Shape();
    CubeShape.prototype.state = function(state) {
        if(arguments.length) {
            this.state = state;
            return this;
        }
        return this.state;
    }
    CubeShape.prototype.render = function(stage) {
        stage.setTransform(0.4,0);
        stage.fillStyle('#e3e3e3');
        stage.fillRect(10,10,50,50);
    }


    /**
     * Stage prototype
     */
    function Stage(context) {}
    Stage.prototype = {
        'update': function() {},
        'addChild': function() {},
        'fillRect': function(x, y, width, height) {},
        'fillStyle': function(style) {},
        'setTransform': function(skewX, skewY, scalX, scalY, moveX, moveY) {}
    };

    function CanvasStage(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.heigth = canvas.height;
        this.childs = [];
    }

    CanvasStage.constructor = CanvasStage;
    CanvasStage.prototype = new Stage();
    CanvasStage.prototype.addChild = function(shape) {
        this.childs.push(shape);
    };
    CanvasStage.prototype.update = function() {
        var child, state,
            i = 0,
            length = this.childs.length;

        for (; i < length; i++) {
            child = this.childs[i];
            state = child.state();
            if (child.STATE_RENDERED !== state) {
                child.render(this);
                child.state(child.STATE_RENDERED);
            }
        }
    };
    CanvasStage.prototype.fillRect = function(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
    }
    CanvasStage.prototype.fillStyle = function(style) {
        this.context.fillStyle = style;
    }

    CanvasStage.prototype.setTransform = function(skewX, skewY, scalX, scalY, moveX, moveY) {
        this.context.setTransform(scalX || 1, skewX, skewY, scalY || 1, moveX || 0, 0);
    }

    return {
        'Stage' : Stage,
        'Shape' : Shape,
        'CanvasStage' : CanvasStage,
        'CubeShape' : CubeShape
    };
});
