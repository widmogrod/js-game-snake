define(['game/action/interface'], function(ActionInterface) {
    function ActionShowLeftEdge(game, speed, rightAngle) {
        this.events = {};
        this.game = game;
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

        this.game.projection.rotateY(this.game.stage, this.speed);

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

