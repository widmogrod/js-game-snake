define(['game/action/interface'], function(ActionInterface) {
    function ActionShowLeftEdge(gameStage, speed, rightAngle) {
        this.events = {};
        this.gameStage = gameStage;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.init();
        this.on('finish', this.init.bind(this));
    }

    ActionShowLeftEdge.prototype = new ActionInterface();
    ActionShowLeftEdge.prototype.init = function() {
        this.counter = 0;
    }
    ActionShowLeftEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.gameStage.rotateY(-this.speed);

        this.counter += this.speed;
    }
    ActionShowLeftEdge.prototype.finish = function() {
        return this.canStop();
    }
    ActionShowLeftEdge.prototype.canStop = function() {
        return this.counter >+ this.rightAngle;
    }

    return ActionShowLeftEdge;
});

