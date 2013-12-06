define(['game/action/interface'], function(ActionInterface) {
    function ActionShowLeftEdge(game, speed, rightAngle) {
        this.game = game;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.counter = 0;
    }

    ActionShowLeftEdge.prototype = new ActionInterface();

    ActionShowLeftEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.game.projection.rotateY(this.game.stage, this.speed);

        this.counter += this.speed;
    }
    ActionShowLeftEdge.prototype.canStop = function() {
        return this.counter > this.rightAngle;
    }

    return ActionShowLeftEdge;
});

