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
        var transformationMatrix, wordMatrix, mesh, face, cache;

        var self = this;
        var c = function(vertex, transformationMatrix) {
            var index = cache.indexOf(vertex);
            if (-1 === index) {
                cache.push(self.project(vertex, transformationMatrix));
                index = cache.length -1;
            }
            return cache[index];
        }

        for (var i = 0, length = meshes.length; i < length; i++) {
            mesh = meshes[i];
            wordMatrix = mesh.wordMatrix();

            transformationMatrix = this.projectionMatrix.multiply(this.viewMatrix).multiply(wordMatrix);

            cache = [];
            for (var f = 0, fl = mesh.faces.length; f < fl; f++) {
                face = mesh.faces[f];

                var vertexA = mesh.vertices[face.a];
                var vertexB = mesh.vertices[face.b];
                var vertexC = mesh.vertices[face.c];

                var normal = vertexA.subtract(vertexB).cross(vertexA.subtract(vertexC)).normalize().scale(2);
                var pointN = c(vertexA.add(normal), transformationMatrix);

                var pointA = c(vertexA, transformationMatrix);
                var pointB = c(vertexB, transformationMatrix);
                var pointC = c(vertexC, transformationMatrix);

                if (pointA.z > 0 && pointB.z > 0 && pointC.z > 0) continue;
                this.renderer.fillStyle(mesh.color)
                this.drawTriangle(pointA, pointB, pointC);
                // this.renderer.fillStyle(Color.fromName('blue'));
                // this.drawLine(pointA, pointN);
            }
        }
    }
    ShapeRender.prototype.project = function(vertex, transformationMatrix) {
        // Homogeneous coordinates
        var vector4 = new Vector4(vertex.x, vertex.y, vertex.z, 1);
        var vector3 = this.transformCoordinates(
            transformationMatrix.multiply(vector4)
        );

        vector3.x = this.viewport.x + this.viewport.width/2 + vector3.x >> 0;
        vector3.y = this.viewport.y + this.viewport.height/2 - vector3.y >> 0;

        return vector3;
    }
    ShapeRender.prototype.transformCoordinates = function(matrix4x1) {
        var result = Vector3.zero(),
            z = matrix4x1.getAt(2, 0),
            w = matrix4x1.getAt(3, 0);

        if (w > 0) {
            result.x = matrix4x1.getAt(0, 0) / w;
            result.y = matrix4x1.getAt(1, 0) / w;
            result.z = matrix4x1.getAt(2, 0) / w;
        } else if (w < 0) {
            result.x = -matrix4x1.getAt(0, 0) / w;
            result.y = -matrix4x1.getAt(1, 0) / w;
            result.z = -matrix4x1.getAt(2, 0) / w;
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
