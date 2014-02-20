define([
    'math/matrix',
    'math/vector3',
    'math/vector4'
], function(
    Matrix,
    Vector3,
    Vector4
) {
    'use strict';

    var TO_RADIAN = Math.PI / 180;

    function Matrix4(data) {
        this.rows = 4;
        this.data = data;
        this.count = 16;
        this.cols = 4;
    }

    Matrix4.prototype = Object.create(Matrix.prototype);
    Matrix4.prototype.constructor = Matrix4;
    Matrix4.prototype.transpose = function() {
        var result = new Matrix4(Array(this.count));
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                result.setAt(col, row, this.getAt(row, col));
            }
        }
        return result;
    }
    Matrix4.prototype.multiply = function(matrixOrVector) {
        var isVector3 = matrixOrVector instanceof Vector3;
        if (isVector3) {
            matrixOrVector = new Vector4(
                matrixOrVector.x,
                matrixOrVector.y,
                matrixOrVector.z,
                1
            );
        }

        var result = Matrix.prototype.multiply.call(this, matrixOrVector);

        if (isVector3) {
            result = new Vector3(
                result.getAt(0, 0),
                result.getAt(1, 0),
                result.getAt(2, 0)
            );
        } else if (matrixOrVector instanceof Vector4) {
            result = new Vector4(
                result.getAt(0, 0),
                result.getAt(1, 0),
                result.getAt(2, 0),
                result.getAt(3, 0)
            );
        } else {
            result = new Matrix4(result.data);
        }

        return result;
    }
    Matrix4.prototype.setScale = function(x, y, z) {
        this.setAt(0, 0, x);
        this.setAt(1, 1, y);
        this.setAt(2, 2, z);
    }
    Matrix4.prototype.setScaleVector = function(vector) {
        this.setScale(vector.x, vector.y, vector.z);
    }
    Matrix4.prototype.setTranslation = function(x, y, z) {
        this.setAt(0, 3, x);
        this.setAt(1, 3, y);
        this.setAt(2, 3, z);
    }
    Matrix4.prototype.setTranslationVector = function(vector) {
        this.setTranslation(vector.x, vector.y, vector.z);
    }
    Matrix4.prototype.getTranslationVector = function() {
        return new Vector3(
           -this.getAt(0, 3),
           -this.getAt(1, 3),
           -this.getAt(2, 3)
        );
    }

    Matrix4.identity = function() {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.scale = function(vector) {
        var result = Matrix4.identity();
        result.setScaleVector(vector);
        return result;
    }
    Matrix4.translation = function(vector) {
        var result = Matrix4.identity();
        result.setTranslationVector(vector);
        return result;
    }
    Matrix4.rotation = function(vector) {
        var result = Matrix4.identity();
        if (vector.x != 0) {
            result = result.multiply(Matrix4.rotationX(vector.x));
        }
        if (vector.y != 0) {
            result = result.multiply(Matrix4.rotationY(vector.y));
        }
        if (vector.z != 0) {
            result = result.multiply(Matrix4.rotationZ(vector.z));
        }
        return result;
    }
    Matrix4.rotationX = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix4([
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationY = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix4([
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationZ = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix4([
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.lookAtRH = function(eye, at, up) {
        var zaxis = eye.subtract(at).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = zaxis.cross(xaxis);

        // console.log('zaxis', zaxis.toString())

        var Ti = new Matrix4([
            1, 0, 0, -eye.x,
            0, 1, 0, -eye.y,
            0, 0, 1, -eye.z,
            0, 0, 0, 1
        ]);

        var Ri = new Matrix4([
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1,
        ]).transpose();

        return Ri.multiply(Ti);
    }
    Matrix4.orthogonalProjection = function(width, height, angle, d) {
        angle *= TO_RADIAN / 2;
        d = d || -1;

        var ratio = width/height;

        var ew = Math.tan(angle) * Math.abs(d) * 2;
        var eh = ew / ratio;

        return new Matrix4([
            1/ew, 0, 0, 0,
            0, 1/eh, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.perspectiveProjection = function(width, height, angle, near, far) {
        angle *= TO_RADIAN / 2;

        var r = width/height;
        var e = Math.tan(angle);
        var a = (near + far)/(near - far);
        var b = 2*near*far/(near - far);

        return new Matrix4([
            1/e, 0, 0, 0,
            0, r/e, 0, 0,
            0, 0, a, b,
            0, 0, -1, 0
        ]);
    }

    Matrix4.viewportMatrix = function(width, height) {
         var w = width,
             h = height;

         return new Matrix4([
            w, 0, 0, 0,
            0, h, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    return Matrix4;
});
