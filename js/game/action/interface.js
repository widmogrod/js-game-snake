define(function(){
    function ActionInterface() {}
    ActionInterface.prototype.run = function() {};
    ActionInterface.prototype.canStop = function() {};

    return ActionInterface;
});
