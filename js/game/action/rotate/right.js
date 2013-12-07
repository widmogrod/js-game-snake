define(['game/action/interface'], function(ActionInterface) {
    function ActionShowRightEdge(game, speed, rightAngle) {
        this.events = {};
        this.game = game;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.counter = 0;
    }

    ActionShowRightEdge.prototype = new ActionInterface();

    ActionShowRightEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.game.projection.rotateY(this.game.stage, -this.speed);

        this.counter += this.speed;
    }
    ActionShowRightEdge.prototype.finish = function() {
        return this.canStop() && (this.counter = 0 || true);
    }
    ActionShowRightEdge.prototype.canStop = function() {
        return this.counter > this.rightAngle;
    }

    return ActionShowRightEdge;
});

