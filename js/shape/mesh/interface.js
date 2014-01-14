define(['math/matrix4', 'math/vector3'], function(Matrix4, Vector3){
    'use strict';

    function MeshInterface(x, y, z) {
        this.rotation = new Vector3(0, 0, 0);
        this.translation = new Vector3(x, y, z);
        this.scale = new Vector3(1, 1, 1);
        this.vertices = [];
        this.faces = [];
    }

    MeshInterface.prototype.wordMatrix = function() {
        return Matrix4.scale(this.scale).multiply(
            Matrix4.translation(this.translation).multiply(
                Matrix4.rotation(this.rotation)
            )
        );
    }

    return MeshInterface;
})
