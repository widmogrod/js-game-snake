define([
    'math/matrix4',
    'math/vector3',
    'math/vector4',
    'shape/color'
], function(
    Matrix4,
    Vector3,
    Vector4,
    Color
) {
    'use strict';

    function compareNumbers(a, b) {
        return a.z - b.z;
    }

    function ShapeRender(viewport, renderer, viewMatrix, projectionMatrix) {
        this.viewport = viewport;
        this.renderer = renderer;
        this.viewMatrix = viewMatrix;
        this.projectionMatrix = projectionMatrix;
        this.viewportMatrix = Matrix4.viewportMatrix(viewport.width, viewport.height);
        // temporary callculation
        this.transformationMatrix = this.viewportMatrix.multiply(this.projectionMatrix).multiply(this.viewMatrix)
    }
    ShapeRender.prototype.update = function(meshes) {
        var wordMatrix, mesh;

        var depth = [];
        for (var i = 0, length = meshes.length; i < length; i++) {
            mesh = meshes[i];
            wordMatrix = Matrix4.translation(mesh.translation).multiply(
                Matrix4.rotation(mesh.rotation).multiply(
                    Matrix4.scale(mesh.scale)
                )
            );

            // Store vertices information in word matrix. Usefull for collision detection
            mesh.vertices.forEach(function(object) {
                object.word = wordMatrix.multiply(object.coordinates);
                // this is so specific for CUBE...
                // object.normal = object.word.subtract(mesh.translation).normalize();
            });

            // Calculate face normal
            mesh.faces.forEach(function(object, index) {
                var vertexA = mesh.vertices[object.face.a].word;
                var vertexB = mesh.vertices[object.face.b].word;
                var vertexC = mesh.vertices[object.face.c].word;

                object.normal = vertexA.subtract(vertexB).cross(vertexA.subtract(vertexC)).normalize();
            })
        }
    }
    ShapeRender.prototype.render = function(meshes) {
        var mesh, face, facesDepth = [];

        this.renderer.clipTo(this.viewport);

        this.transformationMatrix = this.viewportMatrix.multiply(this.projectionMatrix).multiply(this.viewMatrix)

        for (var i = 0, length = meshes.length; i < length; i++) {
            mesh = meshes[i];

            for (var f = 0, fl = mesh.faces.length; f < fl; f++) {
                face = mesh.faces[f];

                var vertexA = mesh.vertices[face.face.a]
                var vertexB = mesh.vertices[face.face.b]
                var vertexC = mesh.vertices[face.face.c]

                var pointA = this.project(vertexA.word);
                var pointB = this.project(vertexB.word);
                var pointC = this.project(vertexC.word);

                if (pointA.z > 1 || pointA.z < -1) continue;
                if (pointB.z > 1 || pointB.z < -1) continue;
                if (pointC.z > 1 || pointC.z < -1) continue;

                vertexA.projection = pointA;
                vertexB.projection = pointB;
                vertexC.projection = pointC;

                facesDepth.push({
                    z: Math.min(vertexA.z, vertexB.z, vertexC.z),
                    a: vertexA,
                    b: vertexB,
                    c: vertexC,
                    normal: face.normal,
                    texture: mesh.texture
                });
            }
        }

        facesDepth.sort(compareNumbers);
        facesDepth.forEach(function(o) {
            this.renderer.fillTriangle(o.a, o.b, o.c, o.texture);
        }.bind(this));
    }
    ShapeRender.prototype.clean = function() {
        this.renderer.clean();
    }
    ShapeRender.prototype.flush = function() {
        this.renderer.render();
    }
    ShapeRender.prototype.project = function(vertex) {
        // Homogeneous coordinates
        var vector4 = new Vector4(vertex.x, vertex.y, vertex.z, 1);
        vector4 = this.transformationMatrix.multiply(vector4);
        var vector3 = this.transformCoordinates(vector4);

        vector3.x = this.viewport.x + this.viewport.width/2 + vector3.x >> 0;
        vector3.y = this.viewport.y + this.viewport.height/2 - vector3.y >> 0;

        return vector3;
    }
    ShapeRender.prototype.unproject = function(vector) {
        // todo
    }

    ShapeRender.prototype.transformCoordinates = function(vector4) {
        var result = Vector3.zero(),
            w = vector4.w;

        result.x = vector4.x / w;
        result.y = vector4.y / w;
        result.z = vector4.z / w;

        return result;
    }

    return ShapeRender;
})
