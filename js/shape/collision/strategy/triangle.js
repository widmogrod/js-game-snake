define([
    'shape/collision/interface'
], function(
    CollisionStrategyInterface
){
    'use strict';

    /**
     * Möller–Trumbore intersection algorithm
     *
     * http://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm
     */
    function CollisionStrategyTriangle() {}

    CollisionStrategyTriangle.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyTriangle.prototype.isCollision = function(ray, mesh) {
        var v1, v2, v3;
        var O, D;
    }

    return CollisionStrategyTriangle;
})
