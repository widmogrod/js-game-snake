define(['game/action/interface'], function(ActionInterface) {
    function ActionMoveDown(shape, speed, step) {
        this.events = {};
        this.shape = shape;
        this.speed = speed;
        this.step = step;
        this.counter = 0;
    }

    ActionMoveDown.prototype = new ActionInterface();

    ActionMoveDown.prototype.run = function() {
        this.shape.points().moveBy(0, -this.speed, 0);
        ++this.counter;
    }
    ActionMoveDown.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveDown;
});
