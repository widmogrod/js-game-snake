define([
    'shape/mesh/interface',
    'math/vector3',
    'math/vector4',
    'shape/utils/vector',
    'math/matrix4',
    'shape/face'
], function(
    MeshInterface,
    Vector3,
    Vector4,
    VectorUtil,
    Matrix4,
    Face
)
{
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
    CubeMesh.prototype.at = function() {
        var face = this.faces[this.faces.length - 1];
        var vertexA = this.vertices[face.a];
        vertexA = new Vector4(vertexA.x, vertexA.y, vertexA.z, 1);
        vertexA = this.wordMatrix().multiply(vertexA);
        vertexA = new Vector3(vertexA.getAt(0, 0), vertexA.getAt(1, 0), vertexA.getAt(2, 0));
        console.log(vertexA.toString())
        return vertexA;
    }
    CubeMesh.prototype.eye = function() {
        // return this.at().add(this.normal().scale(5));
        var face = this.faces[this.faces.length - 1];
        var vertexA = this.vertices[face.a];
        vertexA = vertexA.add(this.normal().scale(2));
        vertexA = new Vector4(vertexA.x, vertexA.y, vertexA.z, 1);
        vertexA = this.wordMatrix().multiply(vertexA);
        vertexA = new Vector3(vertexA.getAt(0, 0), vertexA.getAt(1, 0), vertexA.getAt(2, 0));
        return vertexA
    }
    CubeMesh.prototype.normal = function() {
        var face = this.faces[this.faces.length - 1];

        var vertexA = this.vertices[face.a];
        var vertexB = this.vertices[face.b];
        var vertexC = this.vertices[face.c];

        // var w = this.wordMatrix();

        var normal = vertexA.subtract(vertexB).cross(vertexA.subtract(vertexC)).normalize().scale(2);
        // console.log('normal test', normal.toString())

        return normal;
    }
    CubeMesh.prototype.render = function(stage) {
        var face, point, normal;

        stage.fillStyle(this.color);

        for (var i = 0; i < 6; i++) {
            face = faces[i];

            // normal = VectorUtil.normalFromVector3s(
            //     this.vertices[face[2]],
            //     this.vertices[face[1]],
            //     this.vertices[face[0]]
            // );
            // normal = normal.normalize();

            point = this.vertices[face[0]];
            stage.beginPath();
            stage.moveTo(point);
            for (var j = 3; j >= 0; j--) {
                point = this.vertices[face[j]];
                stage.lineTo(point);
            }
            stage.closePath();
            // stage.stroke();

            // var v = new MeshInterface();
            // v.translation = this.translation;
            // v.rotation = this.rotation;
            // v.vertices.push(this.vertices[face[2]].clone());
            // v.vertices.push(this.vertices[face[2]].add(normal.scale(20)));
            // console.log(v.vertices)

            // stage.projection.project(v);

            // stage.beginPath();
            // stage.moveTo(v.vertices[0]);
            // stage.lineTo(v.vertices[1]);
            // stage.closePath();
            // stage.stroke();
        }
        normal = this.normal();
        var v = new MeshInterface();
        v.translation = this.translation;
        // v.rotation = this.rotation;
        v.vertices.push(this.vertices[face[2]].clone());
        v.vertices.push(this.vertices[face[2]].add(normal.scale(20)));

        stage.projection.project(v);

        // stage.beginPath();
        stage.moveTo(v.vertices[0]);
        stage.lineTo(v.vertices[1]);

        // stage.closePath();
        stage.stroke();
    }

    return CubeMesh;
})
