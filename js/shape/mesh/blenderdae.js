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

    function toint(item) { return +item; }

    function BlenderDaeMesh(xml) {
        MeshInterface.call(this, 0, 0, 0);

        var vertices = xml.querySelectorAll("float_array")[0].textContent.split(' ');
        for (var i = 0, length = vertices.length; i < length; i += 3) {
            this.vertices.push({
                coordinates: new Vector3(+vertices[i], +vertices[i+1], +vertices[i+2]),
                normal: null,
                word: null,
            });
        }

        // var polylist = xml.querySelectorAll('polylist p')[0].textContent.split(' ');
        var polylist = xml.querySelector('polylist');

        var offsets = {};
        var source = {};
        var counts = [];
        var points = [];

        for (var i = 0; i < polylist.childNodes.length; i++) {
            var tag = polylist.childNodes[i];
            switch(tag.tagName) {
                case 'input':
                    var name = tag.attributes['semantic'].toLower();
                    offsets[name] = +tag.attributes['offset'];

                    var vertices = xml.querySelector(tag.attributes['source']).childNodes[0].textContent.split(' ');
                    vertices = vertices.map(toint);

                    source[name] = [];
                    for(var j = 0; j < vertices.length; j += 3) {
                        source.push(new Vector3(
                           vertices[i],
                           vertices[i + 2],
                           vertices[i + 3],
                        ));
                    }
                    break;

                case 'vcount':
                    counts = tag.textContent.split(' ');
                    counts = points.map(toint);
                    break;

                case 'p':
                    points = tag.textContent.split(' ');
                    points = points.map(toint);
                    break;
            }
        }

        for (var i = 0; i < )


        for (var i = 0, length = polylist.length; i < length; i += 6) {
            this.faces.push({
                face: new Face(+polylist[i], +polylist[i+2], +polylist[i + 4]),
                normal: null
            });
        }
    }

    BlenderDaeMesh.prototype = Object.create(MeshInterface.prototype);

    return BlenderDaeMesh;
})
