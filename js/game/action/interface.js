define(['event/event'], function(Event){
    function ActionInterface() {}
    ActionInterface.prototype = new Event();
    ActionInterface.prototype.run = function() {};
    ActionInterface.prototype.finish = function() { return false };
    ActionInterface.prototype.canStop = function() {};
    ActionInterface.prototype.canRemove = function() { return this.canStop() };

    return ActionInterface;
});
