define([
    'shape/projection/interface',
    'shape/mesh/interface',
    'math/matrix',
    'math/vector3',
    'shape/point/collection',
    'shape/point/point',
    'shape/shape/interface',
    'shape/stage/interface',
    'shape/utils/angle'
],
function(
    CameraProjectionInterface,
    MeshInterface,
    Matrix,
    Vector3,
    PointCollection,
    Point,
    Shape,
    Stage,
    Angle
) {
    "use strict";

    function each(item, func) {
        item instanceof PointCollection
            ? (item.each(func) || func(item.center))
            : item instanceof Shape
                ? each(item.points(), func)
                : item instanceof Stage
                    ? item.each(function(child) { each(child.points(), func) })
                    : func(item);
    }

    function CameraProjection(distance, x, y, width, height) {
        this.distance = distance;
        this.x = x;
        this.y = y;
        this.width = width || 450;
        this.height = height || 450;

        this.wordMatrix = new Matrix(4, [
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        // var t = new Vector3(10, 10, 10);
        // var U = new Vector3(0, 1, 0);
        // var F = new Vector3(0, 0, 1);
        // var R = new Vector3(1, 0, 0);
        // var RM = new Matrix(3, [
        //     R.x, U.x, -F.x,
        //     R.y, U.y, -F.y,
        //     R.z, U.z, -F.z
        // ]);
        // var Rt = RM.transpose();
        // var Rtt = Rt.scalar(-1).multiply(t);
        // var V = new Matrix(4, [
        //     Rt.getAt(0, 0), Rt.getAt(0, 1), Rt.getAt(0, 2), Rtt.getAt(0, 0),
        //     Rt.getAt(1, 0), Rt.getAt(1, 1), Rt.getAt(1, 2), Rtt.getAt(1, 0),
        //     Rt.getAt(2, 0), Rt.getAt(2, 1), Rt.getAt(2, 2), Rtt.getAt(2, 0),
        //     0, 0, 0, 1
        // ]);
        // console.log(V.toString())


        var eye = new Vector3(0, 0, 0);
        var at =  new Vector3(0, 0, -0.5);
        // var at =  new Vector3(0, 0, -1.5);
        // var at =  new Vector3(-1,5, 0, 0);
        var up =  new Vector3(0, 1, 0);
        var c = this.createCamera(eye, at, up);
        // console.log('c', c.toString());

        this.cameraMatrix = new Matrix(4, [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        this.cameraMatrix = c;

        this.perspectiveMatrix = new Matrix(4, [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 1/1000, 1
        ]);

        var near = 1, far = 1000, aspect = 1, angle = 90;
        var p = this.createPerspective(near, far, aspect, angle);
        this.perspectiveMatrix = p;
        console.log('perspective', this.perspectiveMatrix.toString());
    }

    CameraProjection.constructor = CameraProjection;
    CameraProjection.prototype = new CameraProjectionInterface();
    CameraProjection.prototype.vectorFromPoint = function (point) {
        return new Matrix(4, [point.x, point.y, point.z, 1]);
    }
    CameraProjection.prototype.vectorToPoint = function(vector, point) {
        point = point instanceof Point ? point : new Point(0, 0, 0);
        point.x = vector.getAt(0, 0);
        point.y = vector.getAt(1, 0);
        point.z = vector.getAt(2, 0);
        return point;
    }
    CameraProjection.prototype.wordMatrixF = function(mesh) {
        var word = this.wordMatrix;
        var model = mesh.modelMatrix();
        var temp = Matrix.identity(4);

        if (mesh.rotation.x != 0) {
            temp = temp.multiply(this.rotationMatrix('x', mesh.rotation.x));
        }
        if (mesh.rotation.y != 0) {
            temp = temp.multiply(this.rotationMatrix('y', mesh.rotation.y));
        }
        if (mesh.rotation.z != 0) {
            temp = temp.multiply(this.rotationMatrix('z', mesh.rotation.z));
        }

        // return model.multiply(word).multiply(temp);
        return model.multiply(temp);
    }
    CameraProjection.prototype.rotationMatrix = function(direction, angle) {
        angle = angle >> 0;
        angle = angle * Math.PI / 180;
        var cos = Math.cos(angle), sin = Math.sin(angle);
        switch (direction) {
            case 'x': return new Matrix(4, [
                1, 0, 0, 0,
                0, cos, sin, 0,
                0, -sin, cos, 0,
                0, 0, 0, 1
            ]);

            case 'y': return new Matrix(4, [
                cos, 0, -sin, 0,
                0, 1, 0, 0,
                sin, 0, cos, 0,
                0, 0, 0, 1
            ]);

            case 'z': return new Matrix(4, [
                cos, -sin, 0, 0,
                sin, cos, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ])
        }
    }
    CameraProjection.prototype.project = function(pointOrMesh) {
        var self = this;
        var t, r, w;
        if (pointOrMesh instanceof MeshInterface) {
            t = self.perspectiveMatrix;
            t = t.multiply(self.wordMatrix);
            t = t.multiply(self.cameraMatrix);
            t = t.multiply(self.wordMatrixF(pointOrMesh));
            pointOrMesh.vertices.forEach(function(vertex){
                r = t.multiply(vertex)
                // r = self.cameraMatrix.multiply(r);
                // r = self.wordMatrix.multiply(r);
                // r = self.perspectiveMatrix.multiply(r);
                // console.log(r.toString());
                w = r.getAt(3, 0) - r.getAt(2, 0)
                vertex.xpos = r.getAt(0, 0) / w >> 0;
                vertex.ypos = r.getAt(1, 0) / w >> 0;
            })
        } else {
            t = self.perspectiveMatrix;
            t = t.multiply(self.wordMatrix);
            t = t.multiply(self.cameraMatrix);
            // t = t.multiply(self.wordMatrixF(pointOrMesh));
// t = self.wordMatrix.multiply(self.cameraMatrix).multiply(self.perspectiveMatrix);
            var task = function(point) {
                r = t.multiply(point)
                w = r.getAt(3, 0);

                point.xpos = r.getAt(0, 0) / w >> 0;
                point.ypos = r.getAt(1, 0) / w >> 0;
            }
            each(pointOrMesh, task);
        }
    }
    CameraProjection.prototype.rotateY = function(point, angle) {
        angle = angle >> 0;
        angle = angle * Math.PI / 180;
        var cos = Math.cos(angle), sin = Math.sin(angle);
        var rotation = new Matrix(4, [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ]);

        // this.cameraMatrix = rotation.multiply(this.cameraMatrix);
        var self = this;
        function task(point) {
            self.vectorToPoint(
                rotation.multiply(self.vectorFromPoint(point)),
                point
            );
        }
        each(point, task);
    }
    CameraProjection.prototype.rotateX = function(point, angle) {
        angle = angle >> 0;
        angle = angle * Math.PI / 180;
        var cos = Math.cos(angle), sin = Math.sin(angle);
        var rotation = new Matrix(4, [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ]);
        this.cameraMatrix = rotation.multiply(this.cameraMatrix);
        // var self = this;
        // function task(point) {
        //     self.vectorToPoint(
        //         rotation.multiply(self.vectorFromPoint(point)),
        //         point
        //     );
        // }
        // each(point, task);
    }
    CameraProjection.prototype.rotateCamera = function(direction, angle) {
        var temp = Matrix.identity(4);
        temp = temp.multiply(this.rotationMatrix(direction, angle));
        this.cameraMatrix = this.cameraMatrix.multiply(temp);
    }
    CameraProjection.prototype.createCamera = function(eye, at, up) {
        var zaxis = eye.subtract(at).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = xaxis.cross(zaxis);

        // console.log('eye', eye.toString());
        // console.log('at', at.toString());
        // console.log('up', up.toString());
        // console.log('zaxis', zaxis.toString())
        // console.log('yaxis', yaxis.toString())
        // console.log('xaxis', xaxis.toString())

        return new Matrix(4, [
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            // -xaxis.dot(eye), -yaxis.dot(eye), -zaxis.dot(eye), 1
            -eye.dot(xaxis), -eye.dot(yaxis), -eye.dot(zaxis), 1
        ]);
    }
    CameraProjection.prototype.createPerspective = function(near, far, aspect, angle) {
        var FOV = angle * Math.PI / 180;
        var e = 1 / Math.tan(FOV / 2);

        return new Matrix(4, [
            e, 0, 0, 0,
            0, aspect/e, 0, 0,
            0, 0, (far+near)/(near-far), (2*far*near/(near-far)),
            0, 0, -1, 0
        ]);
    }

    return CameraProjection;
})
