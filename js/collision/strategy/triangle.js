define([
    'shape/collision/strategy/interface'
], function(
    CollisionStrategyInterface
){
    'use strict';

    var EPSILON = 0.000001;

    /**
     * Möller–Trumbore intersection algorithm
     *
     * http://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm
     */
    function CollisionStrategyTriangle() {}

    CollisionStrategyTriangle.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyTriangle.prototype.raycast = function(origin, direction, mesh) {
        var face, event, closest;

        for (var i = 0, length = mesh.faces.length; i < length; i++) {
            face = mesh.faces[i];
            event = {
                result: false
            };
            if (this.triangle(
                mesh.verticesInWord[face.a],
                mesh.verticesInWord[face.b],
                mesh.verticesInWord[face.c],
                origin,
                direction,
                event
            )) {
                if (!closest || closest.t > event.t) {
                    event.result = true;
                    closest = event;
                }
            }
        }

        return {result: closest && closest.result,  t: closest && closest.t};
    }
    CollisionStrategyTriangle.prototype.isCollision = function(ray, mesh) {}
    CollisionStrategyTriangle.prototype.triangle = function(V1, V2, V3, O, D, event) {
        var e1, e2;  //Edge1, Edge2
        var P, Q, T;
        var det, inv_det, u, v;
        var t;

        //Find vectors for two edges sharing V1
        e1 = V2.subtract(V1);
        e2 = V3.subtract(V1);
        // SUB(e1, V2, V1);
        // SUB(e2, V3, V1);
        //Begin calculating determinant - also used to calculate u parameter
        P = D.cross(e2);
        // CROSS(P, D, e2);
        //if determinant is near zero, ray lies in plane of triangle
        det = e1.dot(P);
        // det = DOT(e1, P);
        //NOT CULLING

        if(det > -EPSILON && det < EPSILON) return false;
        inv_det = 1 / det;

        //calculate distance from V1 to ray origin
        T = O.subtract(V1);
        // SUB(T, O, V1);

        //Calculate u parameter and test bound
        u = T.dot(P) * inv_det;

        event.u = u;

        // u = DOT(T, P) * inv_det;
        //The intersection lies outside of the triangle
        if(u < 0 || u > 1) return false;

        //Prepare to test v parameter
        Q = T.cross(e1);
        // CROSS(Q, T, e1);

        //Calculate V parameter and test bound
        v = D.dot(Q) * inv_det;

        event.v = v;

        // v = DOT(D, Q) * inv_det;
        //The intersection lies outside of the triangle
        if(v < 0 || u + v  > 1) return false;

        t = e2.dot(Q) * inv_det;
        // t = DOT(e2, Q) * inv_det;
        event.t = t;

        if(t > EPSILON) { //ray intersection
            return true;
        }

        // No hit, no win
        return false;
    }

    return CollisionStrategyTriangle;
})
