define(['math/matrix', 'math/vector3'], function(Matrix, Vector3){
    'use strict';

    function MeshInterface() {
        this.rotation = new Vector3(0, 0, 0);
        this.translation = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.vertices = [];
    }

    MeshInterface.prototype.center = function() { return this.translation; }
    MeshInterface.prototype.modelMatrix = function() {
        return new Matrix(4, [
            this.scale.x, 0, 0, this.translation.x,
            0, this.scale.y, 0, this.translation.y,
            0, 0, this.scale.z, this.translation.z,
            0, 0, 0, 1
        ]);
    }
    MeshInterface.prototype.render = function(stage) {

    }

    return MeshInterface;
})
