define(function() {
    function Angle() {};
    Angle.normalize = function(angle) {
        angle = angle >> 0;
        if (angle > 360) return angle % 360;
        if (angle < -360) return -(angle % 360);
        if (angle === -360) return 1;
        if (angle < 1) return 360 + angle;
        return angle;
    }
    return Angle;
})
