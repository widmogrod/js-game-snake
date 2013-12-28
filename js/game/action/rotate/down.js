define(['game/action/interface'], function(ActionInterface) {
    function ActionShowDownEdge(gameStage, speed, rightAngle) {
        this.events = {};
        this.gameStage = gameStage;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.init();
        this.on('finish', this.init.bind(this));
    }

    ActionShowDownEdge.prototype = new ActionInterface();
    ActionShowDownEdge.prototype.init = function() {
        this.counter = 0;
    }
    ActionShowDownEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.gameStage.rotateX(-this.speed);

        this.counter += this.speed;
    }
    ActionShowDownEdge.prototype.finish = function() {
        return this.canStop();
    }
    ActionShowDownEdge.prototype.canStop = function() {
        return this.counter >= this.rightAngle;
    }

    return ActionShowDownEdge;
});

