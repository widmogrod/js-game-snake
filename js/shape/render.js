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

    function ShapeRender(viewport, renderer, viewMatrix, projectionMatrix) {
        this.viewport = viewport;
        this.renderer = renderer;
        this.viewMatrix = viewMatrix;
        this.projectionMatrix = projectionMatrix;
        // temporary callculation
        this.transformationMatrix = this.projectionMatrix.multiply(this.viewMatrix)
    }
    ShapeRender.prototype.render = function(meshes) {
        var wordMatrix, mesh, face;

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
            mesh.faces.forEach(function(object) {
                var vertexA = mesh.vertices[object.face.a].word;
                var vertexB = mesh.vertices[object.face.b].word;
                var vertexC = mesh.vertices[object.face.c].word;

                object.normal = vertexA.subtract(vertexB).cross(vertexA.subtract(vertexC)).normalize();
            })

            this.transformationMatrix = this.projectionMatrix.multiply(this.viewMatrix)

            // var cameraPosition  = new Vector3(0, 0, 1);

            for (var f = 0, fl = mesh.faces.length; f < fl; f++) {
                face = mesh.faces[f];

                // Do not render faces that are at the back
                // if (face.normal.dot(cameraPosition) < 0) continue;

                var vertexA = mesh.vertices[face.face.a].word;
                var vertexB = mesh.vertices[face.face.b].word;
                var vertexC = mesh.vertices[face.face.c].word;

                var n = mesh.vertices[face.face.a].normal;
                // n = this.project(n).normalize();
                // n = wordMatrix.multiply(n).normalize();
                // var pointN = this.project(vertexA.add(n.scale(50)))
                var pointF = this.project(vertexA.add(face.normal.scale(50)));

                var pointA = this.project(vertexA);
                var pointB = this.project(vertexB);
                var pointC = this.project(vertexC);

                // if (pointA.z > 0 && pointB.z > 0 && pointC.z > 0) continue;
                if (pointA.z > 0 || pointB.z > 0 || pointC.z > 0) continue;

                this.renderer.fillStyle(mesh.color)
                // this.drawTriangle(pointA, pointB, pointC);
                this.renderer.color = mesh.color;
                this.renderer.fillTriangle2(pointA, pointB, pointC, face.normal);
                // this.renderer.fillTriangle(pointA, pointB, pointC, face.normal);
                // this.renderer.fillStyle(Color.fromName('blue'));
                // this.drawLine(pointA, pointN);
                this.renderer.fillStyle(Color.fromName('orange'));
                this.drawLine(pointA, pointF);
            }
        }
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
        var result = Vector3.zero(), w = vector4.w;

        if (w > 0) {
            result.x = vector4.x / w;
            result.y = vector4.y / w;
            result.z = vector4.z;
            // result.z = vector4.z / w;
        } else if (w < 0) {
            result.x = -vector4.x / w;
            result.y = -vector4.y / w;
            result.z = -vector4.z;
            // result.z = -vector4.z / w;
        }

        return result;
    }
    ShapeRender.prototype.drawLine = function(a, b) {
        this.renderer.beginPath();
        this.renderer.moveTo(a);
        this.renderer.lineTo(b);
        this.renderer.closePath();
        this.renderer.stroke();
    }
    ShapeRender.prototype.drawTriangle = function(a, b, c) {
        this.renderer.beginPath();
        this.renderer.moveTo(a);
        this.renderer.lineTo(b);
        this.renderer.lineTo(c);
        this.renderer.lineTo(a);
        this.renderer.closePath();
        this.renderer.stroke();
    }

    return ShapeRender;
})
