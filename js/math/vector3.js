define(['math/matrix'], function(Matrix) {
    'use strict';

    var abs = Math.abs,
        sqrt = Math.sqrt,
        acos = Math.acos;

    var TO_DEGREE = 180/Math.PI;

    var keys = ['x', 'y', 'z'];

    function Vector3(x, y, z) {
        Matrix.call(this, 3, [x, y, z]);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Vector3.left = function() {
        return new Vector3(-1, 0, 0);
    }
    Vector3.right = function() {
        return new Vector3(1, 0, 0);
    }
    Vector3.forward = function() {
        return new Vector3(0, 0, 1);
    }
    Vector3.back = function() {
        return new Vector3(0, 0, -1);
    }
    Vector3.up = function() {
        return new Vector3(0, 1, 0);
    }
    Vector3.down = function() {
        return new Vector3(0, -1, 0);
    }
    Vector3.zero = function() {
        return new Vector3(0, 0, 0);
    }
    Vector3.one = function() {
        return new Vector3(1, 1, 1);
    }

    Vector3.constructor = Vector3;
    Vector3.prototype = Object.create(Matrix.prototype);
    Vector3.prototype.toString = function() {
        return 'Vector3(' + this.x.toFixed(3) +','+ this.y.toFixed(3) +','+ this.z.toFixed(3) + ')';
    }
    Vector3.prototype.clone = function() {
        return new Vector3(this.x, this.y, this.z);
    }
    Vector3.prototype.get = function(index) {
        return this[keys[index]];
    }
    Vector3.prototype.set = function(index, value) {
        this[keys[index]] = value;
    }
    Vector3.prototype.normalize = function() {
        var length = this.length();
        return new Vector3(
            this.x / length,
            this.y / length,
            this.z / length
        );
    }
    Vector3.prototype.length = function() {
        return sqrt(this.lengthSqrt());
    }
    Vector3.prototype.lengthSqrt = function() {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
    }
    Vector3.prototype.compare = function(vector) {
        var a = this.lengthSqrt();
        var b = vector.lengthSqrt();
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    }
    Vector3.prototype.subtract = function(vector) {
        return new Vector3(
            (this.x - vector.x), (this.y - vector.y), (this.z - vector.z)
        );
    }
    Vector3.prototype.add = function(vector) {
        return new Vector3(
            (this.x + vector.x), (this.y + vector.y), (this.z + vector.z)
        );
    }
    Vector3.prototype.scale = function(scale) {
        return new Vector3(
            (this.x * scale), (this.y * scale), (this.z * scale)
        );
    }
    Vector3.prototype.dot = function(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
    }
    Vector3.prototype.angle = function(vector) {
        var divisor = this.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) angle = -1;
        if (angle > 1) angle = 1;

        return acos(angle) * TO_DEGREE;
    }
    Vector3.prototype.cross = function(vector) {
        return new Vector3(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }
    Vector3.prototype.abs = function() {
        return new Vector3(
            abs(this.x),
            abs(this.y),
            abs(this.z)
        );
    }
    Vector3.prototype.round = function() {
        return new Vector3(
            this.x >> 0,
            this.y >> 0,
            this.z >> 0
        );
    }

    return Vector3;
})
