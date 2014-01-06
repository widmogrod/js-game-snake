define(['game/action/interface'], function(ActionInterface) {
    function ActionMoveRight(shape, speed, step) {
        this.events = {};
        this.shape = shape;
        this.speed = speed;
        this.step = step;
        this.counter = 0;
    }

    ActionMoveRight.prototype = new ActionInterface();

    ActionMoveRight.prototype.run = function() {
        this.shape.translation.x += this.speed;
        // this.shape.points().moveBy(this.speed, 0, 0);
        ++this.counter;
    }
    ActionMoveRight.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveRight;
});
