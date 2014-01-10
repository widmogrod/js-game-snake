define(['math/matrix'], function(Matrix){
    'use strict';

    var TO_RADIAN = Math.PI / 180;

    function Matrix4(data) {
        this.rows = 4;
        this.data = data;
        this.count = 16;
        this.cols = 4;
    }

    Matrix4.prototype = Object.create(Matrix.prototype);
    Matrix4.prototype.setTranslation = function(x, y, z) {
        this.setAt(0, 3, x);
        this.setAt(1, 3, y);
        this.setAt(2, 3, z);
    }
    Matrix4.prototype.setTranslationVector = function(vector) {
        this.setTranslation(vector.x, vector.y, vector.z);
    }

    Matrix4.identity = function() {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
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
        return new Matrix(4, [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationY = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix(4, [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationZ = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix(4, [
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.lookAtLH = function(eye, at, up) {
        var zaxis = eye.subtract(at).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = xaxis.cross(zaxis);

        var Ti = new Matrix(4, [
            1, 0, 0, -eye.x,
            0, 1, 0, -eye.y,
            0, 0, 1, -eye.z,
            0, 0, 0, 1
        ]);

        var Ri = new Matrix(4, [
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1,
        ]).transpose();

        return Ti.multiply(Ri);
    }
    Matrix4.perspectiveProjection = function(width, height, angle, d) {
        angle *= TO_RADIAN / 2;
        d = d || -1;

        var e = Math.tan(angle) * Math.abs(d) * 2;

        return new Matrix(4, [
            width/e, 0, 0, 0,
            0, height/e, 0, 0,
            0, 0, 1, 0,
            0, 0, 1/d, 0
        ]);
    }

    return Matrix4;
});
