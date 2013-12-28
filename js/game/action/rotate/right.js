define(['game/action/interface'], function(ActionInterface) {
    function ActionShowRightEdge(gameStage, speed, rightAngle) {
        this.events = {};
        this.gameStage = gameStage;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.init();
        this.on('finish', this.init.bind(this));
    }

    ActionShowRightEdge.prototype = new ActionInterface();
    ActionShowRightEdge.prototype.init = function() {
        this.counter = 0;
    }
    ActionShowRightEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.gameStage.rotateY(-this.speed);

        this.counter += this.speed;
    }
    ActionShowRightEdge.prototype.finish = function() {
        return this.canStop();
    }
    ActionShowRightEdge.prototype.canStop = function() {
        return this.counter >= this.rightAngle;
    }

    return ActionShowRightEdge;
});

