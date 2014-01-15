define(function(){
    'use strict';

    function CollisionStrategyInterface() {}

    CollisionStrategyInterface.prototype.isCollision = function(one, two) {}

    return CollisionStrategyInterface;
})
