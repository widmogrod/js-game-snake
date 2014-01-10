define([
    'math/matrix4',
    'math/vector3'
],
function(
    Matrix4,
    Vector3
) {
    'use strict';

    function CameraProjection(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width || 450;
        this.height = height || 450;
        this.rotation = new Vector3(0, 0, 0);

        var eye = new Vector3(0, 0, 400);
        var at =  new Vector3(0, 0, 0);
        var up =  Vector3.up();

        this.viewMatrix = Matrix4.lookAtLH(eye, at, up);
        this.projectionMatrix = Matrix4.perspectiveProjection(this.width, this.height, 90);
    }

    CameraProjection.constructor = CameraProjection;
    CameraProjection.prototype.project = function(mesh) {
        var viewMatrix, transformationMatrix, r, x, y, z, w, wordMatrix, self = this;

        wordMatrix = Matrix4.translation(mesh.translation).multiply(
            Matrix4.rotation(mesh.rotation)
        );
        viewMatrix = this.viewMatrix.multiply(Matrix4.rotation(this.rotation));

        transformationMatrix = this.projectionMatrix;
        transformationMatrix = transformationMatrix.multiply(viewMatrix);
        transformationMatrix = transformationMatrix.multiply(wordMatrix);

        mesh.vertices.forEach(function(vertex){
            r = transformationMatrix.multiply(vertex);

            x = r.getAt(0, 0);
            y = r.getAt(1, 0);
            z = r.getAt(2, 0);
            w = r.getAt(3, 0);

            // normalize
            if (z - w  < 0) {
                x = x/w;
                y = y/w;
                z = z/w;
                w = w/w;
            }

            vertex.xpos = self.x + x >> 0;
            vertex.ypos = self.y - y >> 0;
        });
    }

    return CameraProjection;
})
