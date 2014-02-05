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

    var TO_RADIAN = Math.PI / 180;
    var TO_DEGREE = 180 / Math.PI;

    function CollisionStrategyMeshCube2() {}

    CollisionStrategyMeshCube2.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyMeshCube2.prototype.test = function(d, A, B, AABB) {
        // oposide direction
        if (A.get(d) < AABB.min.get(d) && B.get(d) < AABB.min.get(d)) return false;
        if (A.get(d) > AABB.max.get(d) && B.get(d) > AABB.max.get(d)) return false;

        AABB.max.get(d) - A.get(d);

    }
    CollisionStrategyMeshCube2.prototype.getI = function(A, D, F) {
        var C = new Vector2(F.x, A.y);
        var AC = C.subtract(A);

        var cosAlpha = AC.angle(D);

        // console.log('dot', F.subtract(A).dot(D));
        if (cosAlpha < -89 || cosAlpha > 89) {
            // console.log('towards infinity');
            return new Vector2(0, 0);
        }

        var Alpha = cosAlpha * TO_RADIAN;

        var CIlength = AC.length() * Math.tan(Alpha);
        var I = new Vector2(F.x, A.y + CIlength);

        return I;
    }
    CollisionStrategyMeshCube2.prototype.raycast = function(origin, direction, object) {
        var intersections = [],
        AABB = new Mesh2AABB(object);

        var A = new Vector2(origin.x, origin.y),
        D = new Vector2(direction.x, direction.y),
        E = new Vector2(AABB.max.x, AABB.max.y),
        F = new Vector2(AABB.min.x, AABB.min.y);


        if (A.x < F.x && D.x < 0 || A.x > E.x && D.x > 0) {
            // console.log('x out of bound');
            return false;
        }
        if (A.y < F.y && D.y < 0 || A.y > E.y && D.y > 0) {
            // console.log('y out of bound');
            return false;
        }
        if (A.z < F.z && D.z < 0 || A.z > E.z && D.z > 0) {
            // console.log('z out of bound');
            return false;
        }

        var Ixy = this.getI(A, D, F);
        // console.log('E', E.toString())
        // console.log('F', F.toString())
        // console.log('I', Ixy.toString());


        A = new Vector2(origin.x, origin.z);
        D = new Vector2(direction.x, direction.z);
        E = new Vector2(AABB.max.x, AABB.max.z);
        F = new Vector2(AABB.min.x, AABB.min.z);

        var Ixz = this.getI(A, D, F);
        // console.log('A', A.toString())
        // console.log('D', D.toString())
        // console.log('E', E.toString())
        // console.log('F', F.toString())
        // console.log('I', Ixz.toString());

        if (Ixy.y > E.y || Ixy.y < F.y) return false;

        var min = new Vector3(Ixy.x, Ixy.y, Ixz.y);
        var t = A.subtract(min).length();

        return {result: true, min: min, t: t};
    }
    CollisionStrategyMeshCube2.prototype.isCollision = function(one, two) {
        var a = new Mesh2AABB(one);
        var b = new Mesh2AABB(two);

        for(var i = 0; i < 3; i++) {
            if (a.min.get(i) > b.max.get(i)) return false;
            if (a.max.get(i) < b.min.get(i)) return false;
        }

        return true;
    }

    return CollisionStrategyMeshCube2;
})
