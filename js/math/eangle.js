define(['math/vector3'], function(Vector3){

    var sin = Math.sin,
        cos = Math.cos;

    function EAngle(pitch, yaw, roll) {
        this.p = pitch;
        this.y = yaw;
        this.r = roll;
    }

    EAngle.prototype.toVector = function() {
        var result = Vector3.zero();

        result.x = cos(this.y) * cos(this.p);
        result.y = sin(this.p);
        result.z = sin(this.y) * cos(this.p);

        return result;
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
