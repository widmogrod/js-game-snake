define(['shape/point/point'], function(Point) {
    function VectorUtil(vector) {
        this.vector = vector instanceof Point ? vector : new Point(0,0,0);
    }

    VectorUtil.prototype.add = function(vector) {
        return new VectorUtil(new Point(
            this.vector.x + vector.x,
            this.vector.y + vector.y,
            this.vector.z + vector.z
        ));
    }
    VectorUtil.prototype.dot = function(vector) {
        return (this.vector.x * vector.x) + (this.vector.y * vector.y) + (this.vector.z * vector.z);
    }
    VectorUtil.prototype.direction = function(vector) {
        return (this.vector.x - vector.x) + (this.vector.y - vector.y) + (this.vector.z - vector.z) > 0 ? 1 : -1;
    }
    VectorUtil.prototype.angle = function(vector) {
        var divisor = this.vector.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) { angle = -1; }
        if (angle > 1) { angle = 1; }

        return Math.acos(angle);
    }

    return VectorUtil;
})
