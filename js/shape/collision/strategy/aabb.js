define([
    'shape/collision/strategy/interface',
    'shape/collision/mesh2aabb',
], function(
    CollisionStrategyInterface,
    Mesh2AABB
){
    'use strict';

    /**
     * AABB
     */
    function CollisionStrategyAABB() {}

    CollisionStrategyAABB.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyAABB.prototype.raycast2 = function(ray, object) {
        var t1, t2, tmp, amin, amax, d, o,
            a = 0,
            tnear = -Infinity,
            tfar = Infinity,
            AABB = new Mesh2AABB(object);


        for (; a < 3; a++) {
            amin = AABB.min.get(a);
            amax = AABB.max.get(a);
            d = ray.direction.get(a);
            o = ray.origin.get(a);

            if (d === 0) {
                if (o < amin || o > amax) {
                    return false;
                }
                continue;
            }

            t1 = (amin - o) / d;
            t2 = (amax - o) / d;

            if (t1 > t2) {
                tmp = t1;
                t1 = t2;
                t2 = tmp;
            }

            if (t1 > tnear) {
                tnear = t1;
            }
            if (t2 < tfar) {
                tfar = t2;
            }
            if (tnear > tfar) {
                return false;
            }
            if (tfar < 0) {
                return false;
            }
        }

        ray.distance(tnear);
        ray.distance(tfar);

        return true;
    }
    CollisionStrategyAABB.prototype.isCollision = function(one, two) {
        var a = new Mesh2AABB(one);
        var b = new Mesh2AABB(two);

        for(var i = 0; i < 3; i++) {
            if (a.min.get(i) > b.max.get(i)) return false;
            if (a.max.get(i) < b.min.get(i)) return false;
        }

        return true;
    }

    return CollisionStrategyAABB;
})
