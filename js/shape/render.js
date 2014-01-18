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
    }
    ShapeRender.prototype.render = function(meshes) {
        var wordMatrix, mesh, face;

        for (var i = 0, length = meshes.length; i < length; i++) {
            mesh = meshes[i];
            wordMatrix = mesh.wordMatrix();

            // Store vertices information in word matrix. Usefull for collision detection
            mesh.vertices.forEach(function(vertex, index) {
                mesh.verticesInWord[index] = wordMatrix.multiply(vertex);
            })

            this.transformationMatrix = this.projectionMatrix.multiply(this.viewMatrix)

            for (var f = 0, fl = mesh.faces.length; f < fl; f++) {
                face = mesh.faces[f];

                var vertexA = mesh.verticesInWord[face.a];
                var vertexB = mesh.verticesInWord[face.b];
                var vertexC = mesh.verticesInWord[face.c];

                // var normal = vertexA.subtract(vertexB).cross(vertexA.subtract(vertexC)).normalize().scale(2);
                // var pointN = this.project(vertexA.add(normal));

                var pointA = this.project(vertexA);
                var pointB = this.project(vertexB);
                var pointC = this.project(vertexC);
                // console.log(pointA.toString())

                if (pointA.z > 0 && pointB.z > 0 && pointC.z > 0) continue;
                this.renderer.fillStyle(mesh.color)
                this.drawTriangle(pointA, pointB, pointC);
                // this.renderer.fillStyle(Color.fromName('blue'));
                // this.drawLine(pointA, pointN);
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
    ShapeRender.prototype.transformCoordinates = function(vector4) {
        var result = Vector3.zero(), w = vector4.w;

        if (w > 0) {
            result.x = vector4.x / w;
            result.y = vector4.y / w;
            result.z = vector4.z / w;
        } else if (w < 0) {
            result.x = -vector4.x / w;
            result.y = -vector4.y / w;
            result.z = -vector4.z / w;
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
