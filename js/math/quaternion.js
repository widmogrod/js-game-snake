define([
    'math/vector3'
], function(
    Vector3
) {
    'use strict';

    var TO_RADIAN = Math.PI / 180,
        TO_DEGREE = 180 / Math.PI;

    var cos = Math.cos,
        sin = Math.sin,
        acos = Math.acos,
        sqrt = Math.sqrt;

    /**
     * https://github.com/BSVino/MathForGameDevelopers/blob/quaternion-transform/math/quaternion.cpp
     */
    function Quaternion(w, x, y, z) {
        if (arguments.length == 2) {
            w = w * TO_RADIAN;
            this.w = cos(w/2)
            this.v = x.scale(sin(w/2));
        } else if (arguments.length == 4) {
            this.w = w;
            this.v = new Vector3(x, y, z);
        } else {
            this.w = 0;
            this.v = Vector3.zero();
        }
    }

    Quaternion.prototype.toString = function() {
        return 'Quaternion('+ this.w.toFixed(3) +', '+ this.v.toString() +')['+ this.magnitude() +']';
    }
    Quaternion.prototype.inverted = function() {
        var result = new Quaternion();
        result.w = this.w;
        result.v = this.v.scale(-1);
        return result;
    }
    Quaternion.prototype.magnitude = function() {
        return sqrt(this.w * this.w + this.v.x * this.v.x + this.v.y * this.v.y + this.v.z * this.v.z);
    }
    Quaternion.prototype.multiply = function(quaterionOrVector) {
        return quaterionOrVector instanceof Quaternion
            ? this.multiplyQuaternion(quaterionOrVector)
            : this.multiplyVector(quaterionOrVector)
    }
    Quaternion.prototype.multiplyQuaternion = function(q2) {
        var result = new Quaternion(), q1 = this;
        result.v.x =  q1.v.x * q2.w + q1.v.y * q2.v.z - q1.v.z * q2.v.y + q1.w * q2.v.x;
		result.v.y = -q1.v.x * q2.v.z + q1.v.y * q2.w + q1.v.z * q2.v.x + q1.w * q2.v.y;
		result.v.z =  q1.v.x * q2.v.y - q1.v.y * q2.v.x + q1.v.z * q2.w + q1.w * q2.v.z;
		result.w   = -q1.v.x * q2.v.x - q1.v.y * q2.v.y - q1.v.z * q2.v.z + q1.w * q2.w;
        return result;
    }
    Quaternion.prototype.multiplyVector = function(v) {
        var p = new Quaternion(0, v.x, v.y, v.z), q = this;
        return q.multiply(p).multiply(q.inverted());
    }
    Quaternion.prototype.angle = function() {
        return 2 * acos(this.w) * TO_DEGREE >> 0;
    }
    Quaternion.prototype.axis = function() {
        // return this.v.scale(1/this.magnitude());
        var w = this.angle() * TO_RADIAN;
        var a = sin(w/2);
        return this.v.scale(1/a);
    }
    Quaternion.prototype.pow = function(t) {
        var n = this.axis();
        var w = this.angle();
        var wt = w * t;
        return new Quaternion(wt, n);
    }
    Quaternion.prototype.slerp = function(r, t) {
        var q = this;
        return r.multiply(q.inverted()).pow(t).multiply(q);
    }


    return Quaternion;
})
