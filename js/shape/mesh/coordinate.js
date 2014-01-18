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

    function CoordinateMesh(x, y, z) {
        // invoke parent constructor
        MeshInterface.call(this, x, y, z);

        var w = 1;

        this.vertices.push(new Vector3(0, 0, 0));
        this.vertices.push(new Vector3(w, 0, 0));
        this.vertices.push(new Vector3(0, w, 0));
        this.vertices.push(new Vector3(0, 0, w));

        // in render step this will contains vertices projected on word space
        this.verticesInWord = Array(this.vertices.length);

        this.faces.push(new Face(0, 1, 0));
        this.faces.push(new Face(0, 2, 0));
        this.faces.push(new Face(0, 3, 0));
    }
    CoordinateMesh.prototype = Object.create(MeshInterface.prototype);

    return CoordinateMesh;
})
