define(['game/action/interface'], function(ActionInterface) {
    function ActionShowDownEdge(game, speed, rightAngle) {
        this.game = game;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.counter = 0;
    }

    ActionShowDownEdge.prototype = new ActionInterface();

    ActionShowDownEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.game.projection.rotateX(this.game.stage, -this.speed);

        this.counter += this.speed;
    }
    ActionShowDownEdge.prototype.canStop = function() {
        return this.counter > this.rightAngle;
    }

    return ActionShowDownEdge;
});

