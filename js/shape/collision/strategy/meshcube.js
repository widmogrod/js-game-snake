define([
    'shape/collision/strategy/interface',
    'math/vector3'
], function(
    CollisionStrategyInterface,
    Vector3
){
    'use strict';

    function CollisionStrategyMeshCube() {}

    CollisionStrategyMeshCube.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyMeshCube.prototype.boundBox = function(mesh) {
        var result = {};
        var vertices = mesh.verticesInWord;
        var vertex = vertices[0];

        result.min = vertex.clone();
        result.max = vertex.clone();

        for (var i = 1, length = vertices.length; i < length; i++) {
            vertex = vertices[i];
            if (result.min.x > vertex.x) result.min.x = vertex.x;
            else if (result.max.x < vertex.x) result.max.x = vertex.x;

            if (result.min.y > vertex.y) result.min.y = vertex.y;
            else if (result.max.y < vertex.y) result.max.y = vertex.y;

            if (result.min.z > vertex.z) result.min.z = vertex.z;
            else if (result.max.z < vertex.z) result.max.z = vertex.z;
        }

        return result;
    }
    CollisionStrategyMeshCube.prototype.isCollision = function(one, two) {
        var a = this.boundBox(one);
        var b = this.boundBox(two);

        for(var i = 0; i < 3; i++) {
            if (a.min.get(i) > b.max.get(i)) return false;
            if (a.max.get(i) < b.min.get(i)) return false;
        }

        return true;
    }

    return CollisionStrategyMeshCube;
})
