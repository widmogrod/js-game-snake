define(['math/matrix'], function(Matrix) {
    'use strict';

    var abs = Math.abs,
        sqrt = Math.sqrt,
        acos = Math.acos;

    var TO_DEGREE = 180/Math.PI;

    var keys = ['x', 'y'];

    function Vector2(x, y) {
        Matrix.call(this, 2, [x, y]);
        this.x = x;
        this.y = y;
    }

    Vector2.constructor = Vector2;
    Vector2.prototype = Object.create(Matrix.prototype);
    Vector2.prototype.toString = function() {
        return 'Vector2(' + this.x.toFixed(3) +','+ this.y.toFixed(3) + ')';
    }
    Vector2.prototype.clone = function() {
        return new Vector2(this.x, this.y);
    }
    Vector2.prototype.get = function(index) {
        return this[keys[index]];
    }
    Vector2.prototype.set = function(index, value) {
        this[keys[index]] = value;
    }
    Vector2.prototype.normalize = function() {
        var length = this.length();
        return new Vector2(
            this.x / length,
            this.y / length
        );
    }
    Vector2.prototype.length = function() {
        return sqrt(this.lengthSqrt());
    }
    Vector2.prototype.lengthSqrt = function() {
        return (this.x * this.x) + (this.y * this.y);
    }
    Vector2.prototype.compare = function(vector) {
        var a = this.lengthSqrt();
        var b = vector.lengthSqrt();
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    }
    Vector2.prototype.subtract = function(vector) {
        return new Vector2(
            (this.x - vector.x), (this.y - vector.y)
        );
    }
    Vector2.prototype.add = function(vector) {
        return new Vector2(
            (this.x + vector.x), (this.y + vector.y)
        );
    }
    Vector2.prototype.scale = function(scale) {
        return new Vector2(
            (this.x * scale), (this.y * scale)
        );
    }
    Vector2.prototype.dot = function(vector) {
        return (this.x * vector.x) + (this.y * vector.y)
    }
    Vector2.prototype.angle = function(vector) {
        var divisor = this.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) angle = -1;
        if (angle > 1) angle = 1;

        return acos(angle) * TO_DEGREE;
    }
    Vector2.prototype.abs = function() {
        return new Vector2(
            abs(this.x),
            abs(this.y)
        );
    }
    Vector2.prototype.round = function() {
        return new Vector2(
            this.x >> 0,
            this.y >> 0
        );
    }

    return Vector2;
})
