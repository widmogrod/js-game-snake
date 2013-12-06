define(['game/action/interface'], function(ActionInterface) {
    function ActionMoveLeft(shape, speed, step) {
        this.shape = shape;
        this.speed = speed;
        this.step = step;
        this.counter = 0;
    }

    ActionMoveLeft.prototype = new ActionInterface();

    ActionMoveLeft.prototype.run = function() {
        this.shape.points().moveBy(-this.speed, 0, 0);
        ++this.counter;
    }
    ActionMoveLeft.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveLeft;
});
