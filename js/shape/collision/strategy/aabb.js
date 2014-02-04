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

    function Ray(orig, dir) {
        this.orig = orig;
        this.dir = dir;
        this.invdir = new Vector3(1/dir.x, 1/dir.y, 1/dir.z);
        this.sign = [
            this.invdir.x < 0 ? 1 : 0,
            this.invdir.y < 0 ? 1 : 0,
            this.invdir.z < 0 ? 1 : 0
        ];

        this.tmin = 0;
        this.tmax = 0;
    }

    /**
     * AABB
     */
    function CollisionStrategyAABB() {}

    CollisionStrategyAABB.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyAABB.prototype.intersect = function(r, bounds) {
        var tmin, tmax, tymin, tymax, tzmin, tzmax;
        tmin = (bounds[r.sign[0]].x - r.orig.x) * r.invdir.x;
        tmax = (bounds[1-r.sign[0]].x - r.orig.x) * r.invdir.x;
        tymin = (bounds[r.sign[1]].y - r.orig.y) * r.invdir.y;
        tymax = (bounds[1-r.sign[1]].y - r.orig.y) * r.invdir.y;
        if ((tmin > tymax) || (tymin > tmax))
            return false;
        if (tymin > tmin)
            tmin = tymin;
        if (tymax < tmax)
            tmax = tymax;
        tzmin = (bounds[r.sign[2]].z - r.orig.z) * r.invdir.z;
        tzmax = (bounds[1-r.sign[2]].z - r.orig.z) * r.invdir.z;
        if ((tmin > tzmax) || (tzmin > tmax))
            return false;
        if (tzmin > tmin)
            tmin = tzmin;
        if (tzmax < tmax)
            tmax = tzmax;
        if (tmin > r.tmin) r.tmin = tmin;
        if (tmax < r.tmax) r.tmax = tmax;
        return true;
    }
    CollisionStrategyAABB.prototype.raycast = function(origin, direction, object) {
        var AABB = new Mesh2AABB(object);
        var ray = new Ray(origin, direction);
        var result = this.intersect(ray, [AABB.min, AABB.max]);
        var t = ray.tmin;
        var min = ray.orig.add(ray.dir.scale(ray.tmin));

        return {result: result, min: min, t: t};
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
