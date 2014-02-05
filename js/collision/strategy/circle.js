define([
    'shape/collision/interface'
], function(
    CollisionStrategyInterface
){
    'use strict';

    function CollisionStrategyCircle() {}

    CollisionStrategyCircle.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyCircle.prototype.length = function(one, two) {
        var dx = two.x - one.x,
        dy = two.y - one.y,
        dz = two.z - one.z;

        return Math.pow((dx * dx) + (dy * dy) + (dz * dz), 1/2);
    }
    CollisionStrategyCircle.prototype.radius = function(shape) {
        return shape.width / 2;
    }
    CollisionStrategyCircle.prototype.isCollision = function(one, two) {
        // Calculate length
        var length = self.length(one.center(), two.center());
        // Return how close we thoes object are
        var distance = length - (self.radius(one) + self.radius(two));
        return distance < 0 ? true : false;
    }

    return CollisionStrategyCircle;
})
