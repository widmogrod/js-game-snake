define(['game/action/interface'], function(ActionInterface) {
    function ActionShowUpEdge(game, speed, rightAngle) {
        this.game = game;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.counter = 0;
    }

    ActionShowUpEdge.prototype = new ActionInterface();

    ActionShowUpEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.game.projection.rotateX(this.game.stage, this.speed);

        this.counter += this.speed;
    }
    ActionShowUpEdge.prototype.canStop = function() {
        return this.counter > this.rightAngle;
    }

    return ActionShowUpEdge;
});

