define(['math/matrix'], function(Matrix) {
    "use strict";

    function Vector4(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.rows = 4;
        this.cols = 1;
        this.data = [this.x, this.y, this.z, this.w]

    }
    Vector4.constructor = Vector4;
    Vector4.prototype = Object.create(Matrix.prototype);
    Vector4.prototype.toString = function() {
        return 'Vector4(' + this.x + ',' + this.y + ',' + this.z + ',' + this.w + ')';
    }
    Vector4.prototype.normalize = function() {
        var length = this.length();
        return new Vector4(
            this.x / length,
            this.y / length,
            this.z / length,
            this.z / length
        );
    }
    Vector4.prototype.length = function() {
        return Math.sqrt(
            (this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w)
        );
    }
    Vector4.prototype.subtract = function(vector) {
        return new Vector4(
            (this.x - vector.x), (this.y - vector.y), (this.z - vector.z), (this.w - vector.w)
        );
    }
    Vector4.prototype.add = function(vector) {
        return new Vector4(
            (this.x + vector.x), (this.y + vector.y), (this.z + vector.z), (this.w + vector.w)
        );
    }
    Vector4.prototype.scale = function(scale) {
        return new Vector4(
            (this.x * scale), (this.y * scale), (this.z * scale), (this.w * scale)
        );
    }
    Vector4.prototype.dot = function(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z) + (this.w * vector.w);
    }
    Vector4.prototype.angle = function(vector) {
        var divisor = this.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) { angle = -1; }
        if (angle > 1) { angle = 1; }

        return Math.acos(angle);
    }

    return Vector4;
})
