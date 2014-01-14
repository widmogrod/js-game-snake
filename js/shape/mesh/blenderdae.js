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

    function BlenderDaeMesh(xml) {
        MeshInterface.call(this, 0, 0, 0);

        var vertices = xml.querySelectorAll("float_array")[0].textContent.split(' ');
        for (var i = 0, length = vertices.length; i < length; i += 3) {
            this.vertices.push(new Vector3(+vertices[i], +vertices[i+1], +vertices[i+2]));
        }

        var polylist = xml.querySelectorAll('polylist p')[0].textContent.split(' ');
        for (var i = 0, length = polylist.length; i < length; i += 6) {
            this.faces.push(new Face(+polylist[i], +polylist[i+2], +polylist[i + 4]))
        }
    }

    BlenderDaeMesh.prototype = Object.create(MeshInterface.prototype);

    return BlenderDaeMesh;
})
