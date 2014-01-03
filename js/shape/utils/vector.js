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
    VectorUtil.normalFromPoints = function(point0, point1, point2) {
        // vectors on the plane
        var U = new Point(point1.x - point0.x, point1.y - point0.y, point1.z - point0.z);
        var V = new Point(point2.x - point0.x, point2.y - point0.y, point2.z - point0.z);

        return cross(U, V);
    }
    VectorUtil.cross = cross;
    function cross(U, V) {
        var i, j, k;

        i = U.y * V.z - U.z * V.y;
        j = U.z * V.x - U.x * V.z;
        k = U.x * V.y - U.y * V.x;

        return new Point(i, -j, k);
    }
    return VectorUtil;
})
