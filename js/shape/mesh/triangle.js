define([
    'shape/mesh/interface',
    'math/vector2',
    'math/vector3',
    'shape/face'
], function(
    MeshInterface,
    Vector2,
    Vector3,
    Face
) {
    'use strict';

    function TriangleMesh(x, y, z, width, texture) {
        // invoke parent constructor
        MeshInterface.call(this, x, y, z, texture);

        var hw = width/2 >> 0;

        this.vertices.push({
            coordinates: new Vector3(- hw,   hw, - hw),
            word: null,
            normal: null,
            projection: null,
            faces: [],
            texture: new Vector2(0, 0)
        });
        this.vertices.push({
            coordinates: new Vector3(  hw,   hw, - hw),
            word: null,
            normal: null,
            projection: null,
            faces: [],
            texture: new Vector2(0, hw)
        })
        this.vertices.push({
            coordinates: new Vector3(  hw, - hw, - hw),
            word: null,
            normal: null,
            projection: null,
            faces: [],
            texture: new Vector2(hw, hw)
        })

        this.faces.push({
            face: new Face(1, 0, 2),
            normal: null
        });

        this.vertices.forEach(function(object) {
            object.normal = object.coordinates.subtract(Vector3.zero()).normalize();
        }.bind(this));

        this.width = width;
    }
    TriangleMesh.prototype = Object.create(MeshInterface.prototype);

    return TriangleMesh;
})
