define([
    'math/vector3'
], function(
    Vector3
) {
    'use strict';

    var TO_RADIAN = Math.PI / 180;
    var cos = Math.cos,
        sin = Math.sin;

    /**
     * https://github.com/BSVino/MathForGameDevelopers/blob/quaternion-transform/math/quaternion.cpp
     */
    function Quaternion(vector, alpha) {
        if (arguments.length == 2) {
            alpha = alpha * TO_RADIAN / 2;
            this.w = cos(alpha)
            this.v = vector.scale(sin(alpha));
        } else {
            this.w = 0;
            this.v = Vector3.zero();
        }
    }

    Quaternion.prototype.toString = function() {
        return 'Quaternion('+ this.w +', '+ this.v.toString() +')';
    }
    Quaternion.prototype.inverted = function() {
        return new Quaternion(
            this.v.scale(-1),
            this.w
        );
    }
    Quaternion.prototype.multiply = function(quaterionOrVector) {
        return quaterionOrVector instanceof Quaternion
            ? this.multiplyQuaternion(quaterionOrVector)
            : this.multiplyVector(quaterionOrVector)

    }
    Quaternion.prototype.multiplyQuaternion = function(q2) {
        var result = new Quaternion(), q1 = this;

        result.w   = q1.w * q2.w - q1.v.x * q2.v.x  - q1.v.y * q2.v.y - q1.v. z* q2.v.z;
        result.v.x = q1.w * q2.v.x + q1.v.x * q2.w + q1.v.y * q2.v.z - q1.v.z * q2.v.y;
        result.v.y = q1.w * q2.v.y + q1.v.y * q2.w + q1.v.z * q2.v.x - q1.v.x * q2.v.z;
        result.v.z = q1.w * q2.v.z + q1.v.z * q2.w + q1.v.x * q2.v.y - q1.v.y * q2.v.x;

        return result;
    }
    // Quaternion.prototype.multiplyQuaternion = function(quaterion) {
    //     var result = new Quaternion();

    //     result.w = this.w * quaterion.w + this.v.dot(quaterion.v);
    //     result.v = this.v.scale(quaterion.w).add(quaterion.v.scale(this.w)).add(this.v.cross(quaterion.v));

    //     return result;
    // }
    Quaternion.prototype.multiplyVector = function(v) {
        var p = new Quaternion();
        p.w = 0;
        p.v = v;

        var q = this;
        return q.multiply(p).multiply(q.inverted());
    }
    // Quaternion.prototype.multiplyVector = function(v) {
    //     var result = new Quaternion(), q = this;

    //     result.w = - (q.v.x * v.x + q.v.y * v.y + q.v.z * v.z),
    //     result.v.x = q.w * v.x + q.v.y * v.y - q.v.y * v.z;
    //     result.v.y = q.w * v.y + q.v.x * v.z - q.v.z * v.x;
    //     result.v.z = q.w * v.z + q.v.y * v.x - q.v.x * v.y;

    //     return result;
    // }
    // Quaternion.prototype.multiplyVector = function(v) {
    //     var result = new Quaternion(), q = this;

    //     result.w = - (q.v.x * v.x + q.v.y * v.y + q.v.z * v.z);
    //     result.v.x = (q.w * v.x) + (q.v.y * v.z) - (q.v.z * v.y);
    //     result.v.y = (q.w * v.y) + (q.v.z * v.x) - (q.v.x * v.z);
    //     result.v.z = (q.w * v.z) + (q.v.x * v.y) - (q.v.y * v.x);

    //     return result;
    // }

    return Quaternion;
})
