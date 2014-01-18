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

    function CubeMesh(x, y, z, width, color) {
        // invoke parent constructor
        MeshInterface.call(this, x, y, z);

        var hw = width/2 >> 0;

        this.vertices.push(new Vector3(- hw,   hw, - hw));
        this.vertices.push(new Vector3(  hw,   hw, - hw));
        this.vertices.push(new Vector3(  hw, - hw, - hw));
        this.vertices.push(new Vector3(- hw, - hw, - hw));
        this.vertices.push(new Vector3(- hw,   hw,   hw));
        this.vertices.push(new Vector3(  hw,   hw,   hw));
        this.vertices.push(new Vector3(  hw, - hw,   hw));
        this.vertices.push(new Vector3(- hw, - hw,   hw));

        // in render step this will contains vertices projected on word space
        this.verticesInWord = Array(this.vertices.length);

        this.faces.push(new Face(0, 1, 5));
        this.faces.push(new Face(5, 4, 0));
        this.faces.push(new Face(1, 2, 3));
        this.faces.push(new Face(3, 0, 1));
        this.faces.push(new Face(3, 6, 2));
        this.faces.push(new Face(3, 7, 6));
        this.faces.push(new Face(1, 6, 2));
        this.faces.push(new Face(5, 6, 1));
        this.faces.push(new Face(0, 3, 7));
        this.faces.push(new Face(7, 4, 0));
        this.faces.push(new Face(4, 6, 5));
        this.faces.push(new Face(7, 6, 4));

        this.width = width;
        this.color = color;
    }
    CubeMesh.prototype = Object.create(MeshInterface.prototype);

    return CubeMesh;
})
