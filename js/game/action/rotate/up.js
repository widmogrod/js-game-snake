define(['game/action/interface'], function(ActionInterface) {
    function ActionShowUpEdge(game, speed, rightAngle) {
        this.events = {};
        this.game = game;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.init();
        this.on('finish', this.init.bind(this));
    }

    ActionShowUpEdge.prototype = new ActionInterface();

    ActionShowUpEdge.prototype.init = function() {
        this.counter = 0;
    }
    ActionShowUpEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.game.projection.rotateX(this.game.stage, this.speed);

        this.counter += this.speed;
    }
    ActionShowUpEdge.prototype.finish = function() {
        return this.canStop();
    }
    ActionShowUpEdge.prototype.canStop = function() {
        return this.counter > this.rightAngle;
    }

    return ActionShowUpEdge;
});

