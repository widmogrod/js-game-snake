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

        var eye = new Vector3(0, 0, 0);
        var at =  new Vector3(0, 0, 1);
        var up =  new Vector3(0, -1, 0);
        var c = this.createCamera(eye, at, up);
        this.cameraMatrix = c;

        this.d = -1;

        var p = this.createPerspectiveProjection(this.d);
        this.perspectiveMatrix = p;
    }

    CameraProjection.constructor = CameraProjection;
    CameraProjection.prototype = new CameraProjectionInterface();
    CameraProjection.prototype.wordMatrix = function(mesh) {
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
        var t, r, x, y, z, w;
        if (pointOrMesh instanceof MeshInterface) {
            // t = self.perspectiveMatrix;
            // t = t.multiply(self.cameraMatrix);
            // t = t.multiply(self.wordMatrix(pointOrMesh));
            t = self.wordMatrix(pointOrMesh);
            pointOrMesh.vertices.forEach(function(vertex){
                r = t.multiply(vertex);
                r = self.cameraMatrix.multiply(r);
                r = self.perspectiveMatrix.multiply(r);


                x = r.getAt(0, 0);
                y = r.getAt(1, 0);
                z = r.getAt(2, 0);
                w = r.getAt(3, 0);

                if (z - w  < 0) {
                    x = x/w;
                    y = y/w;
                    z = z/w;
                    w = w/w;
                }


                // x *= self.width/5;
                // y *= self.height/5;

                // console.log(r.toString())
                // console.log(x, y, z, w);
                // vertex.xpos = self.x + self.x*x >> 0;
                // vertex.ypos = self.y - self.y*y >> 0;

                // vertex.xpos = x >> 0;
                // vertex.ypos = y >> 0;

                vertex.xpos = self.x + x >> 0;
                vertex.ypos = self.y - y >> 0;
            });
        } else {
            t = self.perspectiveMatrix;
            t = t.multiply(self.cameraMatrix);
            var task = function(point) {
                r = t.multiply(point)

                x = r.getAt(0, 0);
                y = r.getAt(1, 0);
                z = r.getAt(2, 0);
                w = r.getAt(3, 0);

                x = x/w;
                y = y/w;
                z = z/w;
                w = w/w;

                point.xpos = self.x + x >> 0;
                point.ypos = self.y + y >> 0;
            }
            each(pointOrMesh, task);
        }
    }
    CameraProjection.prototype.rotateCamera = function(direction, angle) {
        var temp = Matrix.identity(4);
        temp = temp.multiply(this.rotationMatrix(direction, angle));
        this.cameraMatrix = this.cameraMatrix.multiply(temp);
    }
    CameraProjection.prototype.createCamera = function(eye, at, up) {
        // eye = new Vector3(this.x, this.y, 0);
        eye = new Vector3(0, 0, 100);
        at  = new Vector3(0, 0, 0);
        up  = new Vector3(0, 1, 0);

        var zaxis = eye.subtract(at).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = xaxis.cross(zaxis);

        console.log('eye', eye)
        console.log('at', at)
        console.log('up', up)
        console.log('zaxis', zaxis.toString());
        console.log('yaxis', yaxis.toString());
        console.log('xaxis', xaxis.toString());

        var t = new Vector3(this.x, this.y, 0);
        var R, T;
        var Ri, Ti;


        T = new Matrix(4, [
            1, 0, 0, eye.x,
            0, 1, 0, eye.y,
            0, 0, 1, eye.z,
            0, 0, 0, 1

        ])
        Ti = new Matrix(4, [
            1, 0, 0, -eye.x,
            0, 1, 0, -eye.y,
            0, 0, 1, -eye.z,
            0, 0, 0, 1
        ]);
        console.log('T*Ti', T.multiply(Ti).toString());
        console.log('Ti*T', Ti.multiply(T).toString());

        // Ti = Matrix.identity(4);
        console.log('Ti', Ti.toString())

        R = new Matrix(4, [
            xaxis.x, yaxis.x, -zaxis.x, 0,
            xaxis.y, yaxis.y, -zaxis.y, 0,
            xaxis.z, yaxis.z, -zaxis.z, 0,
            0, 0, 0, 1,
        ]);
        // R.setAt(2, 2, -1);
        console.log('R', R.toString())

        Ri = R.transpose();

        console.log('Ri', Ri.toString())

        // g = T*R*S*v
        // v = Si*Ri*Ti*g
        // c = Sic*Ric*Tic*g;

        var r = Ri.multiply(Ti);
        var r = Ti.multiply(Ri);
        console.log('V', r.toString())
        return r;

        var zaxis = eye.subtract(at).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = xaxis.cross(zaxis);

        return new Matrix(4, [
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            -eye.dot(xaxis), -eye.dot(yaxis), -eye.dot(zaxis), 1
        ]);
    }
    CameraProjection.prototype.createPerspectiveFovLH = function(near, far, aspect, angle) {
        var FOV = angle * Math.PI / 180;
        var e = 1 / Math.tan(FOV / 2);
        var z = 1000;
        return new Matrix(4, [
            e, 0, 0, 0,
            0, aspect/e, 0, 0,
            0, 0, (far+near)/(near-far), (2*far*near/(near-far)),
            0, 0, -1, 0
        ])
        // return new Matrix(4, [
        //     e, 0, 0, 0,
        //     0, e, 0, 0,
        //     0, 0, -far/(far - near), -1,
        //     0, 0, -far * near/(far - near), 0
        // ]);
    }
    CameraProjection.prototype.createPerspectiveProjection = function(d) {
        // return this.createPerspectiveFovLH(0.1, 10, this.width/this.height, 90)
        var angle = 90;
        var FOV = angle * Math.PI / 180;
        var e = Math.tan(FOV / 2) * Math.abs(this.d) * 2;
        var w, h;

        w = h = this.height;
        console.log('w=h=', w);
        console.log('e=', e);
        console.log('w/e', w/e)
        return new Matrix(4, [
            w/e, 0, 0, 0,
            0, h/e, 0, 0,
            0, 0, 1, 0,
            0, 0, 1/d, 0
        ])
        return new Matrix(4, [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 1/d, 0
        ])
    }

    return CameraProjection;
})
