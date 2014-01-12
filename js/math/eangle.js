define(['math/vector3'], function(Vector3){

    var sin = Math.sin,
        cos = Math.cos,
        TO_RADIAN = Math.PI / 180;

    function EAngle(pitch, yaw, roll) {
        this.p = pitch || 0;
        this.y = yaw   || 0;
        this.r = roll  || 0;
    }
    EAngle.fromVector = function(vector) {
        var result = new EAngle();
        result.fromVector(vector);
        return result;
    }

    EAngle.prototype.toString = function() {
        return 'EAngle('+ this.p +','+ this.y +','+ this.r +')';
    }
    EAngle.prototype.toVector = function() {
        var result = Vector3.zero();

        result.x = cos(this.y * TO_RADIAN) * cos(this.p * TO_RADIAN);
        result.y = sin(this.p * TO_RADIAN);
        result.z = sin(this.y * TO_RADIAN) * cos(this.p * TO_RADIAN);

        return result;
    }
    EAngle.prototype.fromVector = function(vector) {
        this.p = vector.x;
        this.y = vector.y;
        this.r = vector.z;
        return this;
    }
    EAngle.prototype.normalize = function() {
        if (this.p > 89) this.p = 89;
        if (this.p < -89) this.p = -89;
        while(this.y < -180) this.y += 360;
        while(this.y > 180) this.y -= 360;

        return this;
    }

    return EAngle;
})
