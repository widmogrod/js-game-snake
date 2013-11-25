define(['shape/stage/interface'], function(Stage){
    "use strict";

    function CanvasStage(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
    }

    CanvasStage.constructor = CanvasStage;
    CanvasStage.prototype = new Stage();
    CanvasStage.prototype.addChild = function(shape) {
        this.childs.push(shape);
    };
    CanvasStage.prototype.clean = function() {
        this.context.cleanRect(0,0,this.width, this.height);
    }
    CanvasStage.prototype.update = function() {
        var child, state,
            i = 0,
            length = this.childs.length;

        this.context.clearRect(0,0,this.width, this.height);

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
    CanvasStage.prototype.beginPath = function() {
        this.context.beginPath();
    }
    CanvasStage.prototype.closePath = function() {
        this.context.closePath();
    }
    CanvasStage.prototype.fill = function() {
        this.context.fill();
    }
    CanvasStage.prototype.stroke = function() {
        this.context.stroke();
    }
    CanvasStage.prototype.moveTo = function(x, y) {
        this.context.moveTo(x, y);
    }
    CanvasStage.prototype.lineTo = function(x, y) {
        this.context.lineTo(x, y);
    }
    CanvasStage.prototype.fillStyle = function(style) {
        this.context.fillStyle = style;
    }
    CanvasStage.prototype.fillEllipse = function(x, y, w, h) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        this.context.beginPath();
        this.context.moveTo(x, ym);
        this.context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        this.context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        this.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        this.context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        this.context.closePath();
        this.context.stroke();
    }
    CanvasStage.prototype.setTransform = function(skewX, skewY, scalX, scalY, moveX, moveY) {
        this.context.setTransform(scalX || 1, skewX, skewY, scalY || 1, moveX || 0, 0);
    }

    return CanvasStage;
})
