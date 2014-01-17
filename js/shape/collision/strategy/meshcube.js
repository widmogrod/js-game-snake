define([
    'shape/collision/strategy/interface',
    'math/vector4'
], function(
    CollisionStrategyInterface,
    Vector4
){
    'use strict';

    function BoundBox(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    function CollisionStrategyMeshCube() {}

    CollisionStrategyMeshCube.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyMeshCube.prototype.bounds = function(mesh, plane) {
        var vertex, top, bottom, left, right, a, b;

        switch(plane) {
            case 'x': a = 'y', b = 'z'; break;
            case 'y': a = 'z', b = 'x'; break;
            case 'z': a = 'x', b = 'y'; break;
        }

        // precalculate values
        vertex = mesh.verticesInWord[0];
        top = bottom = vertex[b];
        left = right = vertex[a];

        for (var i = 1, length = mesh.verticesInWord.length; i < length; i++) {
            vertex = mesh.verticesInWord[i];
            if (top < vertex[b]) top = vertex[b];
            else if (bottom > vertex[b]) bottom = vertex[b];

            if (left > vertex[a]) left = vertex[a];
            else if (right < vertex[a]) right = vertex[a];
        }

        return new BoundBox(
            left, top, right - left, top - bottom
        );
    }
    CollisionStrategyMeshCube.prototype.test = function(boundOne, boundTwo) {
        var distanceX = boundOne.x - boundTwo.x;
        var distanceY = boundOne.y - boundTwo.y;
        var intersectX = distanceX < 0 ? Math.abs(distanceX) < boundOne.width : distanceX < boundTwo.width;
        var intersectY = distanceY < 0 ? Math.abs(distanceY) < boundTwo.height : distanceY < boundOne.height;
        return intersectX && intersectY;
    }
    CollisionStrategyMeshCube.prototype.boundsRay = function(origin, target, plane) {
        var x, y, width, height, a, b;

        switch(plane) {
            case 'x': a = 'y', b = 'z'; break;
            case 'y': a = 'z', b = 'x'; break;
            case 'z': a = 'x', b = 'y'; break;
        }

        x = Math.min(origin[a], target[a]);
        y = Math.max(origin[b], target[b]);
        width = Math.abs(origin[a] - target[a]);
        height = Math.abs(origin[b] - target[b]);

        return new BoundBox(x, y, width, height);
    }

    function between(x, a, b) {
        return x > a && x < b;
    }

    CollisionStrategyMeshCube.prototype.testRay = function(boundRay, boundObject) {
        var y = this.interpolate(
            boundRay.x,
            boundRay.x + boundRay.width,
            boundRay.y,
            boundRay.y + boundRay.height,
            boundObject.x
        );

        var intersectY = false;
        if (between(y, boundObject.y,  boundRay.y - boundObject.height))
            intersectY = true;

        var x = this.interpolate(
            boundRay.y,
            boundRay.y + boundRay.height,
            boundRay.x,
            boundRay.x + boundRay.width,
            boundObject.y
        );

        var intersectX = false;
        if (between(x, boundObject.x,  boundRay.x + boundObject.width))
            intersectX = true;

        console.log(intersectX, intersectY);

        return intersectX || intersectY;
    }
    CollisionStrategyMeshCube.prototype.interpolate = function(x0, x1, y0, y1, x) {
        return y0 + ((y1 - y0) * (x - x0) / (x1- x0));
    }
    CollisionStrategyMeshCube.prototype.raycast = function(origin, target, object) {
        console.log(origin.toString(), target.toString())
        var plane, result = true;

        result && (plane = 'x') && (result = this.testRay(this.boundsRay(origin, target, plane), this.bounds(object, plane)));
        result && (plane = 'y') && (result = this.testRay(this.boundsRay(origin, target, plane), this.bounds(object, plane)));
        result && (plane = 'z') && (result = this.testRay(this.boundsRay(origin, target, plane), this.bounds(object, plane)));

        return result;
    }
    CollisionStrategyMeshCube.prototype.isCollision = function(one, two) {
        var plane, result = true;

        result && (plane = 'x') && (result = this.test(this.bounds(one, plane), this.bounds(two, plane)));
        result && (plane = 'y') && (result = this.test(this.bounds(one, plane), this.bounds(two, plane)));
        result && (plane = 'z') && (result = this.test(this.bounds(one, plane), this.bounds(two, plane)));

        return result;
    }

    return CollisionStrategyMeshCube;
})
