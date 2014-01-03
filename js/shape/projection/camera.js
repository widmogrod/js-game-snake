define([
    'shape/projection/interface',
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
            1000, 0, 0, x,
            0, 1000, 0, y,
            0, 0, 1000, 0,
            0, 0, 0, 1
        ]);


        var eye = new Vector3(0, 0, 100);
        var target = new Vector3(0,0,0);
        var up = new Vector3(0, 1, 0);

        var zaxis = eye.subtract(target).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = zaxis.cross(xaxis).normalize();

        var orientation = new Matrix(4, [
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1
        ]);
        // console.log(orientation.toString())

        var translation = new Matrix(4, [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -eye.x, -eye.y, -eye.z, 1
        ]);
        // console.log(translation.toString())

        this.cameraMatrix = orientation.multiply(translation);
        // this.cameraMatrix = translation.multiply(orientation);
        // console.log(this.cameraMatrix.toString());
        // this.cameraMatrix = new Matrix(4, [
        //     1, 0, 0, 0,
        //     0, 1, 0, 0,
        //     0, 0, 1, 0,
        //     0, 0, 0, 1
        // ]);


        var n, f, e, a;
        var FOV = 45 * Math.PI / 180;
        n = 1;
        f = 100;
        e = 1 / Math.tan(FOV / 2);
        a = this.width/this.height;

        this.projectionMatrix = new Matrix(4, [
            e, 0, 0, 0,
            0, e/a, 0, 0,
            0, 0, -(f + n)/(f - n), -(2 * f * n / (f - n)),
            0, 0, -1, 0
        ]);
        // infinite projection matrix
        // this.projectionMatrix = new Matrix(4, [
        //     e, 0, 0, 0,
        //     0, e/a, 0, 0,
        //     0, 0, -1, -2*n,
        //     0, 0, -1, 0
        // ]);
        // console.log(this.projectionMatrix.toString())
        // this.projectionMatrix = new Matrix(4, [
        //     this.width / 2, 0, 0, 0,
        //     0, this.height/2, 0, 0,
        //     0, 0, 1, 0,
        //     x + this.width / 2, this.height / 2.0 + y, 0, 1

        // ]);

        this.camera = new Point(0, 0, this.distance);
    }

    CameraProjection.constructor = CameraProjection;
    CameraProjection.prototype = new CameraProjectionInterface();
    // CameraProjection.prototype.vectorFromPoint = function (point) {
    //     return new Matrix(4, [point.x, point.y, point.z, 1]);
    // }
    // CameraProjection.prototype.vectorToPoint = function(vector, point) {
    //     point = point instanceof Point ? point : new Point(0, 0, 0);
    //     point.x = vector.getAt(0, 0);
    //     point.y = vector.getAt(1, 0);
    //     point.z = vector.getAt(2, 0);
    //     return point;
    // }
    CameraProjection.prototype.project = function(point) {
        var self = this, vector;
        // var t = this.projectionMatrix;

        // t.multiply(self.wordMatrix).multiply(self.cameraMatrix);
        var t = self.wordMatrix.multiply(self.cameraMatrix).multiply(self.projectionMatrix);
        // console.log(t.toString())
        var r, w;
        function task(point) {
            r = t.multiply(point)
            // console.log(r.toString());
            w = r.getAt(3, 0);

            point.xpos = r.getAt(0, 0) / w >> 0;
            point.ypos = r.getAt(1, 0) / w >> 0;
        }
        each(point, task);
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

    return CameraProjection;
})
