define(['shape/mesh/interface', 'math/vector3', 'shape/point/point'], function(MeshInterface, Vector3, Point) {
    'use strict';

    var faces = [
        [0,1,2,3], // back
        [0,4,5,1],
        [0,3,7,4],
        [3,2,6,7],
        [1,5,6,2],
        [4,7,6,5] // front
    ];

    function CubeMesh(x, y, z, width, color) {
        this.rotation = new Vector3(0, 0, 0);
        this.translation = new Vector3(x, y, z);
        this.scale = new Vector3(1, 1, 1);

        var hw = width/2 >> 0;

        this.vertices = [];
        this.vertices.push(new Point(- hw, - hw, - hw));
        this.vertices.push(new Point(  hw, - hw, - hw));
        this.vertices.push(new Point(  hw,   hw, - hw));
        this.vertices.push(new Point(- hw,   hw, - hw));
        this.vertices.push(new Point(- hw, - hw,   hw));
        this.vertices.push(new Point(  hw, - hw,   hw));
        this.vertices.push(new Point(  hw,   hw,   hw));
        this.vertices.push(new Point(- hw, + hw, + hw));

        this.width = width;
        this.color = color;
    }
    CubeMesh.prototype = Object.create(MeshInterface.prototype);
    CubeMesh.prototype.render = function(stage) {
        var face, point;
        var i = 0, length = faces.length;

        stage.fillStyle(this.color);

        for (; i < length; i++) {
            face = faces[i];

            point = this.vertices[face[0]];
            stage.beginPath();
            stage.moveTo(point);
            for (var j = 3; j >= 0; j--) {
                point = this.vertices[face[j]];
                stage.lineTo(point);
            }
            stage.closePath();
            // stage.fill();
            stage.stroke();
        }
    }

    return CubeMesh;
})
