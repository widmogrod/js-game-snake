define(function() {
    function AngleUtil() {};

    AngleUtil.TO_RADIANS = Math.PI/180;
    AngleUtil.normalize = function(angle) {
        angle = angle >> 0;
        if (angle > 360) return angle % 360;
        if (angle < -360) return -(angle % 360);
        if (angle === -360) return 1;
        if (angle < 1) return 360 + angle;
        return angle;
    }

    return AngleUtil;
})
