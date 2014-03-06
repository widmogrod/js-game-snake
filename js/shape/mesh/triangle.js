define([
    'shape/mesh/interface',
    'math/vector3',
    'shape/face'
], function(
    MeshInterface,
    Vector3,
    Face
) {
    'use strict';

    function TriangleMesh(x, y, z, width, color) {
        // invoke parent constructor
        MeshInterface.call(this, x, y, z);

        var hw = width/2 >> 0;

        this.vertices.push({
            coordinates: new Vector3(- hw,   hw, - hw),
            word: null,
            normal: null,
            faces: [],
        });
        this.vertices.push({
            coordinates: new Vector3(  hw,   hw, - hw),
            word: null,
            normal: null,
            faces: [],
        })
        this.vertices.push({
            coordinates: new Vector3(  hw, - hw, - hw),
            word: null,
            normal: null,
            faces: [],
        })

        this.faces.push({
            face: new Face(1, 0, 2),
            normal: null
        });

        this.vertices.forEach(function(object) {
            object.normal = object.coordinates.subtract(Vector3.zero()).normalize();
        }.bind(this));

        this.width = width;
        this.color = color;
    }
    TriangleMesh.prototype = Object.create(MeshInterface.prototype);

    return TriangleMesh;
})
