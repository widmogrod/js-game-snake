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

    function CubeMesh(x, y, z, width, texture) {
        // invoke parent constructor
        MeshInterface.call(this, x, y, z, texture);

        var hw = width/2 >> 0;

        this.vertices.push({
            coordinates: new Vector3(- hw,   hw, - hw),
            word: null,
            normal: null,
            faces: [],
            texture: new Vector2(0, 0)
        });
        this.vertices.push({
            coordinates: new Vector3(  hw,   hw, - hw),
            word: null,
            normal: null,
            faces: [],
            texture: new Vector2(1, 0)
        })
        this.vertices.push({
            coordinates: new Vector3(  hw, - hw, - hw),
            word: null,
            normal: null,
            faces: [],
            texture: new Vector2(1, 0)
        })
        this.vertices.push({
            coordinates: new Vector3(- hw, - hw, - hw),
            word: null,
            normal: null,
            faces: [],
            texture: new Vector2(1, 1)
        })
        this.vertices.push({
            coordinates: new Vector3(- hw,   hw,   hw),
            word: null,
            normal: null,
            faces: [],
            texture: new Vector2(1, 0)
        })
        this.vertices.push({
            coordinates: new Vector3(  hw,   hw,   hw),
            word: null,
            normal: null,
            faces: [],
            texture: new Vector2(1, 1)
        })
        this.vertices.push({
            coordinates: new Vector3(  hw, - hw,   hw),
            word: null,
            normal: null,
            faces: [],
            texture: new Vector2(0, 1)
        })
        this.vertices.push({
            coordinates: new Vector3(- hw, - hw,   hw),
            word: null,
            normal: null,
            faces: [],
            texture: new Vector2(0, 0)
        })

        this.faces.push({
            face: new Face(1, 0, 5),
            normal: null
        });
        this.faces.push({
            face: new Face(0, 4, 5),
            normal: null
        });
        this.faces.push({
            face: new Face(1, 2, 3),
            normal: null
        });
        this.faces.push({
            face: new Face(3, 0, 1),
            normal: null
        });

        this.faces.push({
            face: new Face(3, 2, 6),
            normal: null
        });
        // a
        this.faces.push({
            face: new Face(3, 6, 7),
            normal: null
        });

        this.faces.push({
            face: new Face(2, 1, 6),
            normal: null
        });
        this.faces.push({
            face: new Face(5, 6, 1),
            normal: null
        });
        // b
        this.faces.push({
            face: new Face(0, 3, 7),
            normal: null
        });
        this.faces.push({
            face: new Face(4, 0, 7),
            normal: null
        });
        this.faces.push({
            face: new Face(6, 5, 4),
            normal: null
        });
        this.faces.push({
            face: new Face(7, 6, 4),
            normal: null
        });

        this.vertices.forEach(function(object) {
            object.normal = object.coordinates.subtract(Vector3.zero()).normalize();
        }.bind(this));

        this.width = width;
    }
    CubeMesh.prototype = Object.create(MeshInterface.prototype);

    return CubeMesh;
})
