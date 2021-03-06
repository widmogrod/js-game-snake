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

        var w = 50;

        this.vertices.push(new Vector3(0, 0, 0));
        this.vertices.push(new Vector3(w, 0, 0));
        this.vertices.push(new Vector3(0, w, 0));
        this.vertices.push(new Vector3(0, 0, w));

        var p = 10;
        // x
        this.vertices.push(new Vector3(w + p,      p, 0));
        this.vertices.push(new Vector3(w + p + p, -p, 0));
        this.vertices.push(new Vector3(w + p + p,  p, 0));
        this.vertices.push(new Vector3(w + p,     -p, 0));

        // y
        this.vertices.push(new Vector3( p, w + p   , 0));
        this.vertices.push(new Vector3( p, w + 3*p, 0));
        this.vertices.push(new Vector3( p, w + 2*p, 0));
        this.vertices.push(new Vector3(-p, w + 3*p, 0));

        // in render step this will contains vertices projected on word space
        this.verticesInWord = Array(this.vertices.length);

        this.faces.push(new Face(0, 1, 0));
        this.faces.push(new Face(0, 2, 0));
        this.faces.push(new Face(0, 3, 0));

        // x
        this.faces.push(new Face(4, 5, 4));
        this.faces.push(new Face(6, 7, 6));
        // y
        this.faces.push(new Face(8, 9, 8));
        this.faces.push(new Face(10, 11, 10));
    }
    CoordinateMesh.prototype = Object.create(MeshInterface.prototype);

    return CoordinateMesh;
})
