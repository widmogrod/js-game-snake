define(['game/action/interface'], function(ActionInterface) {
    function ActionMoveUp(shape, speed, step) {
        this.events = {};
        this.shape = shape;
        this.speed = speed;
        this.step = step;
        this.counter = 0;
    }

    ActionMoveUp.prototype = new ActionInterface();

    ActionMoveUp.prototype.run = function() {
        this.shape.points().moveBy(0, this.speed, 0);
        ++this.counter;
    }
    ActionMoveUp.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveUp;
});
