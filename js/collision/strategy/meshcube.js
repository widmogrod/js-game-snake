define([
    'shape/collision/strategy/interface',
    'shape/collision/mesh2aabb',
    'math/vector2',
    'math/vector3'
], function(
    CollisionStrategyInterface,
    Mesh2AABB,
    Vector2,
    Vector3
){
    'use strict';

    var TO_RADIAN = Math.PI/180;

    function between(x, a, b) {
        // if (a > b) swap(a)
        return x >= a && x <= b;
    }

    /**
     * AABB
     */
    function CollisionStrategyMeshCube() {}

    CollisionStrategyMeshCube.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyMeshCube.prototype.interpolate = function(x0, x1, y0, y1, x) {
        return (y0 + ((y1 - y0) * (x - x0) / (x1 - x0)));
    }
    CollisionStrategyMeshCube.prototype.intersectXY = function(d1, d2, A, D, BB, min, max) {
        // if (A.get(d1) < BB.max.get(d1) && D.get(d1) < 0) return false;
        // if (A.get(d1) > BB.max.get(d1) && D.get(d1) > 0) return false;
        // if (A.get(d2) < BB.max.get(d2) && D.get(d2) < 0) return false;
        // if (A.get(d2) > BB.max.get(d2) && D.get(d2) > 0) return false;

        var AD = A.add(D);

        // if (between(A.get(d1), BB.min.get(d1), BB.max.get(d1))) return false;
        // if (between(A.get(d2), BB.min.get(d2), BB.max.get(d2))) return false;

        if (A.get(d1) - AD.get(d1) !== 0) {
            var minY = this.interpolate(A.get(d1), AD.get(d1), A.get(d2), AD.get(d2), BB.min.get(d1));
            var maxY = this.interpolate(A.get(d1), AD.get(d1), A.get(d2), AD.get(d2), BB.max.get(d1));
        } else {
            var minY = A.get(d2);
            var maxY = A.get(d2);
        }

        min.set(d1, BB.min.get(d1));
        min.set(d2, minY);
        max.set(d1, BB.max.get(d1));
        max.set(d2, maxY);

        return true;
    }
    CollisionStrategyMeshCube.prototype.intersect = function(A, B, D) {
        var C = new Vector2(D.x, A.y);
        var CA = C.subtract(A);
        var BA = B.subtract(A);
        var a = CA.angle(BA);

        if (null === a) return D.y;

        var b = CA.length() * Math.tan(a * TO_RADIAN);

        return C.y + b;
    }
    CollisionStrategyMeshCube.prototype.raycast = function(origin, direction, object) {
        var result = true,
            t = 0,
            box = new Mesh2AABB(object),
            min = Vector3.zero(),
            max = Vector3.zero();

        result && (result = this.intersectXY(0, 1, origin, direction, box, min, max));
        result && (result = this.intersectXY(0, 2, origin, direction, box, min, max));

        if (result) {
            t = min.subtract(origin).length();
            // t = max.subtract(origin).length();
            // t = origin.subtract(min).length();
            // console.log('min', min.toString());
            // console.log('max', max.toString());
        }

        return {result: result, min: min, max: max, t: t};
    }
    CollisionStrategyMeshCube.prototype.isCollision = function(one, two) {
        var a = new Mesh2AABB(one);
        var b = new Mesh2AABB(two);

        for(var i = 0; i < 3; i++) {
            if (a.min.get(i) > b.max.get(i)) return false;
            if (a.max.get(i) < b.min.get(i)) return false;
        }

        return true;
    }

    return CollisionStrategyMeshCube;
})
