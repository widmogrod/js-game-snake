
define('shape/viewport',[],function() {
    

    function Viewport(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Viewport.constructor = Viewport;
    Viewport.prototype.isIn = function(x, y) {
        return (x > this.x || x < (this.x + this.width)) && (y > this.y || y < (this.y + this.height));
    }

    return Viewport;
})
;
define('shape/renderer/renderer',[
    'shape/viewport'
], function(
    Viewport
) {
    

    function Renderer(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.viewport = new Viewport(0, 0, this.width, this.height);
        this.zbuffer = Array(this.width * this.height);
    }

    Renderer.constructor = Renderer;
    Renderer.prototype.clean = function() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.zbuffer = Array(this.width * this.height)
    }
    Renderer.prototype.render = function() {
        this.flush();
    };
    Renderer.prototype.flush = function() {
        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height)
    }
    Renderer.prototype.fillTriangle = function(v1, v2, v3, texture) {
        var order = this.topMiddleBottom(v1, v2, v3);

        for (var y = order.bottom.projection.y >> 0; y < order.middle.projection.y >> 0; y++) {
            this.processLine(y, order.bottom, order.middle, order.top, texture);
        }
        for (var y = order.middle.projection.y >> 0; y < order.top.projection.y >> 0; y++) {
            this.processLine(y, order.top, order.middle, order.bottom, texture);
        }
    }
    Renderer.prototype.topMiddleBottom = function(v1, v2, v3) {
        var result = {
            bottom: v1,
            middle: v2,
            top: v3
        };

        if(result.bottom.projection.y > result.middle.projection.y) {
            this.swap(result, 'bottom', 'middle');
        }
        if(result.middle.projection.y > result.top.projection.y) {
            this.swap(result, 'top', 'middle');
        }
        if(result.bottom.projection.y > result.middle.projection.y) {
            this.swap(result, 'bottom', 'middle');
        }

        return result;
    }
    Renderer.prototype.swap = function(object, key1, key2) {
        var temp = object[key2];
        object[key2] = object[key1];
        object[key1] = temp;
    }
    Renderer.prototype.processLine = function(y, v1, v2, v3, texture) {
        var p1 = v1.projection;
        var p2 = v2.projection;
        var p3 = v3.projection;

        var t1 = v1.texture;
        var t2 = v2.texture;
        var t3 = v3.texture;

        var data = {};

        // interpolate start and end x
        data.x1 = this.interpolate(p1.x, p2.x, p1.y, p2.y, y);
        data.x2 = this.interpolate(p1.x, p3.x, p1.y, p3.y, y);
        // interpolate depth
        data.z1 = this.interpolate(p1.z, p2.z, p1.y, p2.y, y);
        data.z2 = this.interpolate(p1.z, p3.z, p1.y, p3.y, y);

        // interpolate start and end texture point
        data.u1 = this.interpolate(t1.x, t2.x, p1.y, p2.y, y);
        data.u2 = this.interpolate(t1.x, t3.x, p1.y, p3.y, y);
        data.v1 = this.interpolate(t1.y, t2.y, p1.x, p2.x, data.x1);
        data.v2 = this.interpolate(t1.y, t3.y, p1.x, p3.x, data.x2);

        if (data.x1 === data.x2) return;

        if (data.x1 > data.x2) {
            this.swap(data, 'x1', 'x2');
            this.swap(data, 'z1', 'z2');
            this.swap(data, 'u1', 'u2');
            this.swap(data, 'v1', 'v2');
        }

        var dx = data.x2 - data.x1;
        var dz = (data.z2 - data.z1)/dx;
        var du = (data.u2 - data.u1)/dx;
        var dv = (data.v2 - data.v1)/dx;

        var x = data.x1 >> 0;
        var z = data.z1;
        var u = data.u1;
        var v = data.v1;

        for (; x < data.x2 >> 0; x++, z += dz, u += du, v += dv) {
            this.drawPixel(x, y, z, texture.map(u, v));
        }
    }
    Renderer.prototype.interpolate = function(x1, x2, y1, y2, y) {
        if (y1 === y2) return x1;
        return ((y - y1)/(y2 - y1) * (x2 - x1)) + x1;
    }
    Renderer.prototype.clipTo = function(viewport) {
        this.viewport = viewport;
    }
    Renderer.prototype.drawPoint = function(point, color) {
        this.drawPixel(point.x, point.y, point.z, color);
    }
    Renderer.prototype.drawPixel = function(x, y, z, color) {
        if (this.viewport.isIn(x, y)) {
            this.putPixel(x, y, z, color);
        }
    }
    Renderer.prototype.putPixel = function(x, y, z, color) {
        var index = (y * this.width) + x;
        var index4 = index * 4;

        if (this.zbuffer[index] < z) return;
        this.zbuffer[index] = z;

        this.imageData.data[index4]     = color.r;
        this.imageData.data[index4 + 1] = color.g;
        this.imageData.data[index4 + 2] = color.b;
        this.imageData.data[index4 + 3] = color.a;
    }

    return Renderer;
});

define('math/matrix',[],function(){
    

    function Matrix(rows, data) {
        this.rows = rows;
        this.data = arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : data;
        this.count = this.data.length;
        this.cols = this.count / this.rows;

        if (this.count % this.rows !== 0) {
            throw RangeError('Matrix doesn\'t have valid rows number, given ' + this.rows + ', and counts ' + this.count);
        }
    }
    Matrix.identity = function(rows) {
        var cols = rows, data = [], step = rows + 1;
        for (var i = 0, length = rows * cols; i < length; i++) {
            data.push((i + step) % step == 0 ? 1 : 0);
        }
        return new Matrix(rows, data);
    }

    Matrix.prototype.constructor = Matrix;
    Matrix.prototype.setAt = function(row, column, value) {
        this.data[this.cols * row + column] = value;
        return this;
    }
    Matrix.prototype.getAt = function(row, column) {
        return this.data[this.cols * row + column];
    }
    Matrix.prototype.toString = function() {
        var row, col,
        result = 'Matrix[' + this.cols + ',' + this.rows + ']' + "\n";

        for (row = 0; row < this.rows; row++) {
            result += '|'
            for (col = 0; col < this.cols; col++) {
                result += "\t"
                result += this.getAt(row, col).toFixed(3);
                result += "\t"
            }
            result += "|\n";
        }

        return result;
    }
    Matrix.prototype.multiply = function(matrix) {
        if (this.cols !== matrix.rows) {
            throw Error('Can\'t multiply matrix because number of rows ' + matrix.rows + ' is different from current matrix columns number ' + this.cols );
        }

        var row, col, a, b, idx, sum,
            data = [];

        for (row = 0; row < this.rows; row++) {
            for (col = 0; col < matrix.cols; col++) {
                sum = 0;
                for (idx = 0; idx < matrix.rows; idx++) {
                    a = this.getAt(row, idx);
                    b = matrix.getAt(idx, col);
                    sum += a * b;
                }
                data.push(sum);
            }
        }

        return new Matrix(this.rows, data);
    }
    Matrix.prototype.transpose = function() {
        var result = new Matrix(this.cols, Array(this.count));
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                result.setAt(col, row, this.getAt(row, col));
            }
        }
        return result;
    }
     Matrix.prototype.scalar = function(scalar) {
        var result = new Matrix(this.rows, Array(this.count));
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                result.setAt(row, col, scalar * this.getAt(row, col));
            }
        }
        return result;
    }

    return Matrix;
})
;
define('math/vector3',['math/matrix'], function(Matrix) {
    

    var abs = Math.abs,
        sqrt = Math.sqrt,
        acos = Math.acos;

    var TO_DEGREE = 180/Math.PI;

    var keys = ['x', 'y', 'z'];

    function Vector3(x, y, z) {
        Matrix.call(this, 3, [x, y, z]);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Vector3.left = function() {
        return new Vector3(-1, 0, 0);
    }
    Vector3.right = function() {
        return new Vector3(1, 0, 0);
    }
    Vector3.forward = function() {
        return new Vector3(0, 0, 1);
    }
    Vector3.back = function() {
        return new Vector3(0, 0, -1);
    }
    Vector3.up = function() {
        return new Vector3(0, 1, 0);
    }
    Vector3.down = function() {
        return new Vector3(0, -1, 0);
    }
    Vector3.zero = function() {
        return new Vector3(0, 0, 0);
    }
    Vector3.one = function() {
        return new Vector3(1, 1, 1);
    }

    Vector3.constructor = Vector3;
    Vector3.prototype = Object.create(Matrix.prototype);
    Vector3.prototype.toString = function() {
        return 'Vector3(' + this.x.toFixed(3) +','+ this.y.toFixed(3) +','+ this.z.toFixed(3) + ')';
    }
    Vector3.prototype.clone = function() {
        return new Vector3(this.x, this.y, this.z);
    }
    Vector3.prototype.get = function(index) {
        return this[keys[index]];
    }
    Vector3.prototype.set = function(index, value) {
        this[keys[index]] = value;
    }
    Vector3.prototype.normalize = function() {
        var length = this.length();
        return new Vector3(
            this.x / length,
            this.y / length,
            this.z / length
        );
    }
    Vector3.prototype.length = function() {
        return sqrt(this.lengthSqrt());
    }
    Vector3.prototype.lengthSqrt = function() {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
    }
    Vector3.prototype.compare = function(vector) {
        var a = this.lengthSqrt();
        var b = vector.lengthSqrt();
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    }
    Vector3.prototype.subtract = function(vector) {
        return new Vector3(
            (this.x - vector.x), (this.y - vector.y), (this.z - vector.z)
        );
    }
    Vector3.prototype.add = function(vector) {
        return new Vector3(
            (this.x + vector.x), (this.y + vector.y), (this.z + vector.z)
        );
    }
    Vector3.prototype.scale = function(scale) {
        return new Vector3(
            (this.x * scale), (this.y * scale), (this.z * scale)
        );
    }
    Vector3.prototype.dot = function(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
    }
    Vector3.prototype.angle = function(vector) {
        var divisor = this.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) angle = -1;
        if (angle > 1) angle = 1;

        return acos(angle) * TO_DEGREE;
    }
    Vector3.prototype.cross = function(vector) {
        return new Vector3(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }
    Vector3.prototype.abs = function() {
        return new Vector3(
            abs(this.x),
            abs(this.y),
            abs(this.z)
        );
    }
    Vector3.prototype.round = function() {
        return new Vector3(
            this.x >> 0,
            this.y >> 0,
            this.z >> 0
        );
    }

    return Vector3;
})
;
define('math/vector4',['math/matrix'], function(Matrix) {
    

    function Vector4(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.rows = 4;
        this.cols = 1;
        this.data = [this.x, this.y, this.z, this.w]

    }
    Vector4.constructor = Vector4;
    Vector4.prototype = Object.create(Matrix.prototype);
    Vector4.prototype.toString = function() {
        return 'Vector4(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ',' + this.z.toFixed(3) + ',' + this.w.toFixed(3) + ')';
    }
    Vector4.prototype.normalize = function() {
        var length = this.length();
        return new Vector4(
            this.x / length,
            this.y / length,
            this.z / length,
            this.z / length
        );
    }
    Vector4.prototype.length = function() {
        return Math.sqrt(
            (this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w)
        );
    }
    Vector4.prototype.subtract = function(vector) {
        return new Vector4(
            (this.x - vector.x), (this.y - vector.y), (this.z - vector.z), (this.w - vector.w)
        );
    }
    Vector4.prototype.add = function(vector) {
        return new Vector4(
            (this.x + vector.x), (this.y + vector.y), (this.z + vector.z), (this.w + vector.w)
        );
    }
    Vector4.prototype.scale = function(scale) {
        return new Vector4(
            (this.x * scale), (this.y * scale), (this.z * scale), (this.w * scale)
        );
    }
    Vector4.prototype.dot = function(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z) + (this.w * vector.w);
    }
    Vector4.prototype.angle = function(vector) {
        var divisor = this.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) { angle = -1; }
        if (angle > 1) { angle = 1; }

        return Math.acos(angle);
    }

    return Vector4;
})
;
define('math/matrix4',[
    'math/matrix',
    'math/vector3',
    'math/vector4'
], function(
    Matrix,
    Vector3,
    Vector4
) {
    

    var TO_RADIAN = Math.PI / 180;

    function Matrix4(data) {
        this.rows = 4;
        this.data = data;
        this.count = 16;
        this.cols = 4;
    }

    Matrix4.prototype = Object.create(Matrix.prototype);
    Matrix4.prototype.constructor = Matrix4;
    Matrix4.prototype.transpose = function() {
        var result = new Matrix4(Array(this.count));
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                result.setAt(col, row, this.getAt(row, col));
            }
        }
        return result;
    }
    Matrix4.prototype.multiply = function(matrixOrVector) {
        var isVector3 = matrixOrVector instanceof Vector3;
        if (isVector3) {
            matrixOrVector = new Vector4(
                matrixOrVector.x,
                matrixOrVector.y,
                matrixOrVector.z,
                1
            );
        }

        var result = Matrix.prototype.multiply.call(this, matrixOrVector);

        if (isVector3) {
            result = new Vector3(
                result.getAt(0, 0),
                result.getAt(1, 0),
                result.getAt(2, 0)
            );
        } else if (matrixOrVector instanceof Vector4) {
            result = new Vector4(
                result.getAt(0, 0),
                result.getAt(1, 0),
                result.getAt(2, 0),
                result.getAt(3, 0)
            );
        } else {
            result = new Matrix4(result.data);
        }

        return result;
    }
    Matrix4.prototype.setScale = function(x, y, z) {
        this.setAt(0, 0, x);
        this.setAt(1, 1, y);
        this.setAt(2, 2, z);
    }
    Matrix4.prototype.setScaleVector = function(vector) {
        this.setScale(vector.x, vector.y, vector.z);
    }
    Matrix4.prototype.setTranslation = function(x, y, z) {
        this.setAt(0, 3, x);
        this.setAt(1, 3, y);
        this.setAt(2, 3, z);
    }
    Matrix4.prototype.setTranslationVector = function(vector) {
        this.setTranslation(vector.x, vector.y, vector.z);
    }
    Matrix4.prototype.getTranslationVector = function() {
        return new Vector3(
           -this.getAt(0, 3),
           -this.getAt(1, 3),
           -this.getAt(2, 3)
        );
    }

    Matrix4.identity = function() {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.scale = function(vector) {
        var result = Matrix4.identity();
        result.setScaleVector(vector);
        return result;
    }
    Matrix4.translation = function(vector) {
        var result = Matrix4.identity();
        result.setTranslationVector(vector);
        return result;
    }
    Matrix4.rotation = function(vector) {
        var result = Matrix4.identity();
        if (vector.x != 0) {
            result = result.multiply(Matrix4.rotationX(vector.x));
        }
        if (vector.y != 0) {
            result = result.multiply(Matrix4.rotationY(vector.y));
        }
        if (vector.z != 0) {
            result = result.multiply(Matrix4.rotationZ(vector.z));
        }
        return result;
    }
    Matrix4.rotationX = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix4([
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationY = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix4([
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationZ = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix4([
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.lookAtRH = function(eye, at, up) {
        var zaxis = eye.subtract(at).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = zaxis.cross(xaxis);

        // console.log('zaxis', zaxis.toString())

        var Ti = new Matrix4([
            1, 0, 0, -eye.x,
            0, 1, 0, -eye.y,
            0, 0, 1, -eye.z,
            0, 0, 0, 1
        ]);

        var Ri = new Matrix4([
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1,
        ]).transpose();

        return Ri.multiply(Ti);
    }
    Matrix4.orthogonalProjection = function(width, height, angle, d) {
        angle *= TO_RADIAN / 2;
        d = d || -1;

        var ratio = width/height;

        var ew = Math.tan(angle) * Math.abs(d) * 2;
        var eh = ew / ratio;

        return new Matrix4([
            1/ew, 0, 0, 0,
            0, 1/eh, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.perspectiveProjection = function(width, height, angle, near, far) {
        angle *= TO_RADIAN / 2;

        var r = width/height;
        var e = Math.tan(angle);
        var a = (near + far)/(near - far);
        var b = 2*near*far/(near - far);

        return new Matrix4([
            1/e, 0, 0, 0,
            0, r/e, 0, 0,
            0, 0, a, b,
            0, 0, -1, 0
        ]);
    }

    Matrix4.viewportMatrix = function(width, height) {
         var w = width,
             h = height;

         return new Matrix4([
            w, 0, 0, 0,
            0, h, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    return Matrix4;
});

define('shape/color',[],function(){
    

    function Color(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 255;
    }
    Color.prototype.clone = function() {
        return new Color(
            this.r,
            this.g,
            this.b,
            this.a
        );
    }

    Color.fromName = function(name) {
        var result = new Color();

        switch(name) {
            case 'red':   result.r = 255; break;
            case 'green': result.g = 255; break;
            case 'blue':  result.b = 255; break;
            case 'orange':  result.r = 255; result.g = 165; break;
        }

        return result;
    }

    Color.prototype.toString = function() {
        return 'rgba('+ this.r +','+ this.g +','+ this.b +', '+ this.a / 255 +')';
    }

    return Color;

})
;
define('shape/render',[
    'math/matrix4',
    'math/vector3',
    'math/vector4',
    'shape/color'
], function(
    Matrix4,
    Vector3,
    Vector4,
    Color
) {
    

    function compareNumbers(a, b) {
        return a.z - b.z;
    }

    function ShapeRender(viewport, renderer, viewMatrix, projectionMatrix) {
        this.viewport = viewport;
        this.renderer = renderer;
        this.viewMatrix = viewMatrix;
        this.projectionMatrix = projectionMatrix;
        this.viewportMatrix = Matrix4.viewportMatrix(viewport.width, viewport.height);
        // temporary callculation
        this.transformationMatrix = this.viewportMatrix.multiply(this.projectionMatrix).multiply(this.viewMatrix)
    }
    ShapeRender.prototype.update = function(meshes) {
        var wordMatrix, mesh;

        var depth = [];
        for (var i = 0, length = meshes.length; i < length; i++) {
            mesh = meshes[i];
            wordMatrix = Matrix4.translation(mesh.translation).multiply(
                Matrix4.rotation(mesh.rotation).multiply(
                    Matrix4.scale(mesh.scale)
                )
            );

            // Store vertices information in word matrix. Usefull for collision detection
            mesh.vertices.forEach(function(object) {
                object.word = wordMatrix.multiply(object.coordinates);
                // this is so specific for CUBE...
                // object.normal = object.word.subtract(mesh.translation).normalize();
            });

            // Calculate face normal
            mesh.faces.forEach(function(object, index) {
                var vertexA = mesh.vertices[object.face.a].word;
                var vertexB = mesh.vertices[object.face.b].word;
                var vertexC = mesh.vertices[object.face.c].word;

                object.normal = vertexA.subtract(vertexB).cross(vertexA.subtract(vertexC)).normalize();
            })
        }
    }
    ShapeRender.prototype.render = function(meshes) {
        var mesh, face, facesDepth = [];

        this.renderer.clipTo(this.viewport);

        this.transformationMatrix = this.viewportMatrix.multiply(this.projectionMatrix).multiply(this.viewMatrix)

        for (var i = 0, length = meshes.length; i < length; i++) {
            mesh = meshes[i];

            for (var f = 0, fl = mesh.faces.length; f < fl; f++) {
                face = mesh.faces[f];

                var vertexA = mesh.vertices[face.face.a]
                var vertexB = mesh.vertices[face.face.b]
                var vertexC = mesh.vertices[face.face.c]

                var pointA = this.project(vertexA.word);
                var pointB = this.project(vertexB.word);
                var pointC = this.project(vertexC.word);

                if (pointA.z > 1 || pointA.z < -1) continue;
                if (pointB.z > 1 || pointB.z < -1) continue;
                if (pointC.z > 1 || pointC.z < -1) continue;

                vertexA.projection = pointA;
                vertexB.projection = pointB;
                vertexC.projection = pointC;

                facesDepth.push({
                    z: Math.min(vertexA.z, vertexB.z, vertexC.z),
                    a: vertexA,
                    b: vertexB,
                    c: vertexC,
                    normal: face.normal,
                    texture: mesh.texture
                });
            }
        }

        facesDepth.sort(compareNumbers);
        facesDepth.forEach(function(o) {
            this.renderer.fillTriangle(o.a, o.b, o.c, o.texture);
        }.bind(this));
    }
    ShapeRender.prototype.clean = function() {
        this.renderer.clean();
    }
    ShapeRender.prototype.flush = function() {
        this.renderer.render();
    }
    ShapeRender.prototype.project = function(vertex) {
        // Homogeneous coordinates
        var vector4 = new Vector4(vertex.x, vertex.y, vertex.z, 1);
        vector4 = this.transformationMatrix.multiply(vector4);
        var vector3 = this.transformCoordinates(vector4);

        vector3.x = this.viewport.x + this.viewport.width/2 + vector3.x >> 0;
        vector3.y = this.viewport.y + this.viewport.height/2 - vector3.y >> 0;

        return vector3;
    }
    ShapeRender.prototype.unproject = function(vector) {
        // todo
    }

    ShapeRender.prototype.transformCoordinates = function(vector4) {
        var result = Vector3.zero(),
            w = vector4.w;

        result.x = vector4.x / w;
        result.y = vector4.y / w;
        result.z = vector4.z / w;

        return result;
    }

    return ShapeRender;
})
;
define('math/quaternion',[
    'math/vector3'
], function(
    Vector3
) {
    

    var TO_RADIAN = Math.PI / 180,
        TO_DEGREE = 180 / Math.PI;

    var cos = Math.cos,
        sin = Math.sin,
        acos = Math.acos,
        sqrt = Math.sqrt;

    /**
     * https://github.com/BSVino/MathForGameDevelopers/blob/quaternion-transform/math/quaternion.cpp
     */
    function Quaternion(w, x, y, z) {
        if (arguments.length == 2) {
            w = w * TO_RADIAN;
            this.w = cos(w/2)
            this.v = x.scale(sin(w/2));
        } else if (arguments.length == 4) {
            this.w = w;
            this.v = new Vector3(x, y, z);
        } else {
            this.w = 0;
            this.v = Vector3.zero();
        }
    }

    Quaternion.prototype.toString = function() {
        return 'Quaternion('+ this.w.toFixed(3) +', '+ this.v.toString() +')['+ this.magnitude() +']';
    }
    Quaternion.prototype.inverted = function() {
        var result = new Quaternion();
        result.w = this.w;
        result.v = this.v.scale(-1);
        return result;
    }
    Quaternion.prototype.magnitude = function() {
        return sqrt(this.w * this.w + this.v.x * this.v.x + this.v.y * this.v.y + this.v.z * this.v.z);
    }
    Quaternion.prototype.multiply = function(quaterionOrVector) {
        return quaterionOrVector instanceof Quaternion
            ? this.multiplyQuaternion(quaterionOrVector)
            : this.multiplyVector(quaterionOrVector)
    }
    Quaternion.prototype.multiplyQuaternion = function(q2) {
        var result = new Quaternion(), q1 = this;
        result.v.x =  q1.v.x * q2.w + q1.v.y * q2.v.z - q1.v.z * q2.v.y + q1.w * q2.v.x;
		result.v.y = -q1.v.x * q2.v.z + q1.v.y * q2.w + q1.v.z * q2.v.x + q1.w * q2.v.y;
		result.v.z =  q1.v.x * q2.v.y - q1.v.y * q2.v.x + q1.v.z * q2.w + q1.w * q2.v.z;
		result.w   = -q1.v.x * q2.v.x - q1.v.y * q2.v.y - q1.v.z * q2.v.z + q1.w * q2.w;
        return result;
    }
    Quaternion.prototype.multiplyVector = function(v) {
        var p = new Quaternion(0, v.x, v.y, v.z), q = this;
        return q.multiply(p).multiply(q.inverted());
    }
    Quaternion.prototype.angle = function() {
        return 2 * acos(this.w) * TO_DEGREE >> 0;
    }
    Quaternion.prototype.axis = function() {
        // return this.v.scale(1/this.magnitude());
        var w = this.angle() * TO_RADIAN;
        var a = sin(w/2);
        return this.v.scale(1/a);
    }
    Quaternion.prototype.pow = function(t) {
        var n = this.axis();
        var w = this.angle();
        var wt = w * t;
        return new Quaternion(wt, n);
    }
    Quaternion.prototype.slerp = function(r, t) {
        var q = this;
        return r.multiply(q.inverted()).pow(t).multiply(q);
    }


    return Quaternion;
})
;
define('shape/mesh/interface',['math/matrix4', 'math/vector3'], function(Matrix4, Vector3){
    

    function MeshInterface(x, y, z, texture) {
        this.rotation = new Vector3(0, 0, 0);
        this.translation = new Vector3(x, y, z);
        this.scale = new Vector3(1, 1, 1);
        this.vertices = [];
        this.faces = [];
        this.texture = texture;
    }

    return MeshInterface;
})
;
define('math/vector2',['math/matrix'], function(Matrix) {
    

    var abs = Math.abs,
        sqrt = Math.sqrt,
        acos = Math.acos;

    var TO_DEGREE = 180/Math.PI;

    var keys = ['x', 'y'];

    function Vector2(x, y) {
        Matrix.call(this, 2, [x, y]);
        this.x = x;
        this.y = y;
    }

    Vector2.constructor = Vector2;
    Vector2.prototype = Object.create(Matrix.prototype);
    Vector2.prototype.toString = function() {
        return 'Vector2(' + this.x.toFixed(3) +','+ this.y.toFixed(3) + ')';
    }
    Vector2.prototype.clone = function() {
        return new Vector2(this.x, this.y);
    }
    Vector2.prototype.get = function(index) {
        return this[keys[index]];
    }
    Vector2.prototype.set = function(index, value) {
        this[keys[index]] = value;
    }
    Vector2.prototype.normalize = function() {
        var length = this.length();
        return new Vector2(
            this.x / length,
            this.y / length
        );
    }
    Vector2.prototype.length = function() {
        return sqrt(this.lengthSqrt());
    }
    Vector2.prototype.lengthSqrt = function() {
        return (this.x * this.x) + (this.y * this.y);
    }
    Vector2.prototype.compare = function(vector) {
        var a = this.lengthSqrt();
        var b = vector.lengthSqrt();
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    }
    Vector2.prototype.subtract = function(vector) {
        return new Vector2(
            (this.x - vector.x), (this.y - vector.y)
        );
    }
    Vector2.prototype.add = function(vector) {
        return new Vector2(
            (this.x + vector.x), (this.y + vector.y)
        );
    }
    Vector2.prototype.scale = function(scale) {
        return new Vector2(
            (this.x * scale), (this.y * scale)
        );
    }
    Vector2.prototype.dot = function(vector) {
        return (this.x * vector.x) + (this.y * vector.y)
    }
    Vector2.prototype.angle = function(vector) {
        var divisor = this.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) angle = -1;
        if (angle > 1) angle = 1;

        return acos(angle) * TO_DEGREE;
    }
    Vector2.prototype.abs = function() {
        return new Vector2(
            abs(this.x),
            abs(this.y)
        );
    }
    Vector2.prototype.round = function() {
        return new Vector2(
            this.x >> 0,
            this.y >> 0
        );
    }

    return Vector2;
})
;
define('shape/face',[],function() {
    

    function Face(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    return Face;
});

define('shape/mesh/cube',[
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
;
define('shape/mesh/triangle',[
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
    

    function TriangleMesh(x, y, z, width, texture) {
        // invoke parent constructor
        MeshInterface.call(this, x, y, z, texture);

        var hw = width/2 >> 0;

        this.vertices.push({
            coordinates: new Vector3(- hw,   hw, - hw),
            word: null,
            normal: null,
            projection: null,
            faces: [],
            texture: new Vector2(0, 0)
        });
        this.vertices.push({
            coordinates: new Vector3(  hw,   hw, - hw),
            word: null,
            normal: null,
            projection: null,
            faces: [],
            texture: new Vector2(0, 1)
        })
        this.vertices.push({
            coordinates: new Vector3(  hw, - hw, - hw),
            word: null,
            normal: null,
            projection: null,
            faces: [],
            texture: new Vector2(1, 0)
        })

        this.faces.push({
            face: new Face(1, 0, 2),
            normal: null
        });

        this.vertices.forEach(function(object) {
            object.normal = object.coordinates.subtract(Vector3.zero()).normalize();
        }.bind(this));

        this.width = width;
    }
    TriangleMesh.prototype = Object.create(MeshInterface.prototype);

    return TriangleMesh;
})
;
define('shape/mesh/coordinate',[
    'shape/mesh/interface',
    'math/vector3',
    'shape/face'
], function(
    MeshInterface,
    Vector3,
    Face
) {
    

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
;
define('game/config',[],function(){
    var GameConfig;

    GameConfig = {
        'BASE_URL': window.location.href +'assets/',
        'RIGHT_ANGLE' : 90,
        'ROTATION_ANGLE_STEP': 1,
        'ROTATION_MARGIN' : 80,
        // Cube is basic shape on the board
        'CUBE_FIELD_SIZE': 40,
        'CUBE_FIELDS_ON_BOARD': 9,
        'GAME_STEP': 20,
        'GAME_SPEED': 2,
        'state': {
            'move': {
                'up': {
                    'press.left' : 'left',
                    'press.right': 'right',
                    'edge.up': 'show_up_face'
                },
                'down': {
                    'press.left' : 'left',
                    'press.right': 'right',
                    'edge.down': 'show_down_face'
                },
                'left': {
                    'press.up' : 'up',
                    'press.down': 'down',
                    'edge.left': 'show_left_face'
                },
                'right': {
                    'press.up' : 'up',
                    'press.down': 'down',
                    'edge.right': 'show_right_face'
                },
                'show_up_face': {
                    'up.face.visible': 'up'
                },
                'show_down_face': {
                    'down.face.visible': 'down'
                },
                'show_left_face': {
                    'left.face.visible': 'left'
                },
                'show_right_face': {
                    'right.face.visible': 'right'
                },
                'start': {
                    'press.enter' : 'play'
                },
                'play' : {
                    // 'cube.suiside': 'end',
                    // 'cube.success': 'end',
                    // 'press.pause' : 'stop'
                    'press.right' : 'right',
                    'press.left'  : 'left',
                    'press.up'    : 'up',
                    'press.down'  : 'down'
                },
                'end': {
                    'press.restart' : 'start'
                },
                'stop': {
                    'press.escape': 'start'
                },
                '*': {
                    'found.gifts': 'end',
                    'init': 'start',
                    'stop' : 'move_stop'
                }
            }
        }
    }

    GameConfig.BOARD_WIDTH = GameConfig.CUBE_FIELD_SIZE * GameConfig.CUBE_FIELDS_ON_BOARD;
    GameConfig.BOARD_EDGE = (GameConfig.BOARD_WIDTH / 2)

    return GameConfig;
})
;
define('collision/ray',[],function(){
    

    function compareNumbers(a, b) {
        return a - b;
    }

    /**
     * Ray provides all importat informations to calculate intersection(s)
     */
    function Ray(origin, direction) {
        this.origin = origin;
        this.direction = direction;
        this.intersections = [];
        this.distanceIndex = [];
    }

    Ray.constructor = Ray;
    Ray.prototype.distance = function(distance) {
        // Simplification, thanks to this we should have less intersection with close range
        distance = distance >> 0;
        if (-1 === this.distanceIndex.indexOf(distance)) {
            this.distanceIndex.push(distance);
            this.distanceIndex.sort(compareNumbers);
            this.intersections.splice(
                this.distanceIndex.indexOf(distance), 0, {
                    distance: distance,
                    point: this.origin.add(this.direction.scale(distance))
                }
            );
        }
    }

    return Ray;
});

define('collision/manager',[
    'collision/ray'
],
function(
    Ray
) {
    

    function CollisionManager(strategy) {
        this.queue = [];
        this.actions = [];
        this.strategy = strategy;
    }
    CollisionManager.prototype.push = function(object) {
        this.queue.push(object);
    }
    CollisionManager.prototype.when = function(one, two, then, otherwise) {
        this.actions.push({one: one, two: two, then: then, otherwise: otherwise});
        return this;
    }
    CollisionManager.prototype.createEvent = function(one, two) {
        return {
            object: one,
            collide: two,
            preventRelease: false
        }
    }
    CollisionManager.prototype.raycast = function (origin, direction) {
        var ray = new Ray(origin, direction);
        this.queue.forEach(this.strategy.raycast.bind(
            this.strategy,
            ray
        ))
        return ray;
    }
    CollisionManager.prototype.run = function() {
        var one, two, callback, event;
        for (var i = 0, length = this.actions.length; i < length; i++) {
            one = this.actions[i].one,
            two = this.actions[i].two;

            callback = this.strategy.isCollision(one, two)
                ? this.actions[i].then
                : this.actions[i].otherwise;

            if (typeof callback !== 'function') continue;

            event = this.createEvent(one, two);
            callback(event);
            if (!event.preventRelease) {
                this.actions.splice(i, 1);
            }
        }
    }

    return CollisionManager;
})
;
define('collision/strategy/interface',[],function(){
    

    function CollisionStrategyInterface() {}

    CollisionStrategyInterface.prototype.isCollision = function(one, two) {}
    CollisionStrategyInterface.prototype.raycast = function(origin, direction, object) {}

    return CollisionStrategyInterface;
})
;
define('collision/strategy/triangle',[
    'collision/strategy/interface'
], function(
    CollisionStrategyInterface
){
    

    var EPSILON = 0.000001;

    /**
     * Möller–Trumbore intersection algorithm
     *
     * http://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm
     */
    function CollisionStrategyTriangle() {}

    CollisionStrategyTriangle.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyTriangle.prototype.raycast = function(ray, mesh) {
        var face, event;

        for (var i = 0, length = mesh.faces.length; i < length; i++) {
            face = mesh.faces[i];
            event = {};
            if (this.triangle(
                mesh.verticesInWord[face.a],
                mesh.verticesInWord[face.b],
                mesh.verticesInWord[face.c],
                ray.origin,
                ray.direction,
                event
            )) {
                ray.distance(event.t);
            }
        }

    }
    CollisionStrategyTriangle.prototype.isCollision = function(ray, mesh) {
        throw Error('not implemented')
    }
    CollisionStrategyTriangle.prototype.triangle = function(V1, V2, V3, O, D, event) {
        var e1, e2;  //Edge1, Edge2
        var P, Q, T;
        var det, inv_det, u, v;
        var t;

        //Find vectors for two edges sharing V1
        e1 = V2.subtract(V1);
        e2 = V3.subtract(V1);
        // SUB(e1, V2, V1);
        // SUB(e2, V3, V1);
        //Begin calculating determinant - also used to calculate u parameter
        P = D.cross(e2);
        // CROSS(P, D, e2);
        //if determinant is near zero, ray lies in plane of triangle
        det = e1.dot(P);
        // det = DOT(e1, P);
        //NOT CULLING

        if(det > -EPSILON && det < EPSILON) return false;
        inv_det = 1 / det;

        //calculate distance from V1 to ray origin
        T = O.subtract(V1);
        // SUB(T, O, V1);

        //Calculate u parameter and test bound
        u = T.dot(P) * inv_det;

        event.u = u;

        // u = DOT(T, P) * inv_det;
        //The intersection lies outside of the triangle
        if(u < 0 || u > 1) return false;

        //Prepare to test v parameter
        Q = T.cross(e1);
        // CROSS(Q, T, e1);

        //Calculate V parameter and test bound
        v = D.dot(Q) * inv_det;

        event.v = v;

        // v = DOT(D, Q) * inv_det;
        //The intersection lies outside of the triangle
        if(v < 0 || u + v  > 1) return false;

        t = e2.dot(Q) * inv_det;
        // t = DOT(e2, Q) * inv_det;
        event.t = t;

        if(t > EPSILON) { //ray intersection
            return true;
        }

        // No hit, no win
        return false;
    }

    return CollisionStrategyTriangle;
})
;
define('collision/mesh2aabb',[],function() {

    function Mesh2AABB (mesh) {
        var vertices = mesh.vertices;
        var vertex = vertices[0];

        this.min = vertex.word.clone();
        this.max = vertex.word.clone();

        for (var i = 1, length = vertices.length; i < length; i++) {
            vertex = vertices[i].word;
            if (this.min.x > vertex.x) this.min.x = vertex.x;
            else if (this.max.x < vertex.x) this.max.x = vertex.x;

            if (this.min.y > vertex.y) this.min.y = vertex.y;
            else if (this.max.y < vertex.y) this.max.y = vertex.y;

            if (this.min.z > vertex.z) this.min.z = vertex.z;
            else if (this.max.z < vertex.z) this.max.z = vertex.z;
        }
    }

    return Mesh2AABB;
});

define('collision/strategy/aabb',[
    'collision/strategy/interface',
    'collision/mesh2aabb',
], function(
    CollisionStrategyInterface,
    Mesh2AABB
){
    

    /**
     * AABB
     */
    function CollisionStrategyAABB() {}

    CollisionStrategyAABB.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyAABB.prototype.raycast = function(ray, object) {
        var t1, t2, tmp, amin, amax, d, o,
            a = 0,
            tnear = -Infinity,
            tfar = Infinity,
            AABB = new Mesh2AABB(object);


        for (; a < 3; a++) {
            amin = AABB.min.get(a);
            amax = AABB.max.get(a);
            d = ray.direction.get(a);
            o = ray.origin.get(a);

            if (d === 0) {
                if (o < amin || o > amax) {
                    return false;
                }
                continue;
            }

            t1 = (amin - o) / d;
            t2 = (amax - o) / d;

            if (t1 > t2) {
                tmp = t1;
                t1 = t2;
                t2 = tmp;
            }

            if (t1 > tnear) {
                tnear = t1;
            }
            if (t2 < tfar) {
                tfar = t2;
            }
            if (tnear > tfar) {
                return false;
            }
            if (tfar < 0) {
                return false;
            }
        }

        ray.distance(tnear);
        ray.distance(tfar);

        return true;
    }
    CollisionStrategyAABB.prototype.isCollision = function(one, two) {
        var a = new Mesh2AABB(one);
        var b = new Mesh2AABB(two);

        for(var i = 0; i < 3; i++) {
            if (a.min.get(i) > b.max.get(i)) return false;
            if (a.max.get(i) < b.min.get(i)) return false;
        }

        return true;
    }

    return CollisionStrategyAABB;
})
;
define('event/result',[],function(){
    function Result(event) {
        this.event = event;
        this.results = [];
    }
    Result.prototype.count = function() {
        return this.results.length;
    }
    Result.prototype.push = function(value) {
        this.results.push(value);
    }
    Result.prototype.last = function(defaults) {
        var c = this.count();
        return c ? this.results[c - 1] : defaults;
    }
    Result.prototype.each = function(func) {
        this.results.forEach(func);
    }

    return Result;
})
;
define('event/event',['event/result'], function(Result){
    function createEvent() {
        var stopPropagation = false;
        return {
            stopPropagation: function(flag) {
                if (arguments.length) {
                    stopPropagation = !!flag;
                } else {
                    return stopPropagation;
                }
            }
        }
    }

    function hash(array) {
        var result = '';

        if (array === undefined) return result;

        array.forEach(function(item){
            switch(Object.prototype.toString.call(item).slice(8, -1)) {
                default:
                    result += item;
                    break;

                case 'Array':
                    result += hash(item);
                    break;

                case 'Object':
                    for (var i in item) {
                        if (item.hasOwnProperty(i))
                            result += hash(item)
                    }
                    break;
            }
        })
        return result;
    }

    function Event() {
        this.events = {};
        this.proxies = {};
    }
    Event.prototype.on = function(name, callback) {
        this.events[name] = this.events[name] ? this.events[name] : [];
        if (-1 === this.events[name].indexOf(callback)) {
            this.events[name].push(callback);
        }
        return this;
    }
    Event.prototype.trigger = function(name, args) {
        var value, events;
        var event = typeof this.createEvent === 'function' ? this.createEvent() : createEvent(),
        result = new Result(event);

        if (!this.events.hasOwnProperty(name)) {
            return result;
        }

        args = [event].concat(args);
        events = this.events[name];

        for (var i = 0, length = events.length; i < length; i++) {
            value = events[i].apply(null, args);
            result.push(value);
            if (event.stopPropagation()) break;
        }

        return result;
    }
    Event.prototype.proxy = function(name, args) {
        var self = this, key = name + hash(args);

        return this.proxies[key]
            ? this.proxies[key]
            : this.proxies[key] = function proxy(event) {
            self.trigger(name, args);
        }
    }

    return Event;
})
;
define('state',['event/event'], function(Event){
    function onChange(from, to, context) {
        return function() {
            var results;
            if (null !== context.state && (context.state !== from && from !== '*')) {
                return;
            }

            if (context.unlock && !context.unlock()) {
                context.postponed = onChange(from, to, context);
                return;
            }

            context.unlock = null;
            context.state = to;
            context.trigger('change', [from, to]);
            results = context.trigger('enter:' + to, [from]);
            if (results.event.hasLocks()) {
                context.unlock = results.event.unlock;
            }
        }
    }

    function each(data, func) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                func(data[key], key);
            }
        }
    }

    function StateMachine(states) {
        var self = this;
        self.events = {};
        self.state = null;
        self.unlock = null;

        each(states, function(events, state) {
            each(events, function(nextState, event){
                self.on(event, onChange(state, nextState, self));
            });
        })
    }

    StateMachine.prototype = new Event();
    /**
     * Resove postponed state.
     * This can happen when current state is bloked
     */
    StateMachine.prototype.run = function() {
        if (typeof this.postponed === 'function') {
            var func = this.postponed;
            this.postponed = null;
            func();
        }
    }
    StateMachine.prototype.createEvent = function() {
        var stopPropagation = false;
        var unlocks = [];
        return {
            hasLocks: function() {
                return unlocks.length > 0;
            },
            lock: function(func) {
                unlocks.push(func);
            },
            unlock: function() {
                var result = true;
                unlocks.forEach(function(func){
                    if (result) {
                        result = func();
                    }
                });
                return result;
            },
            stopPropagation: function(flag) {
                if (arguments.length) {
                    stopPropagation = !!flag;
                } else {
                    return stopPropagation;
                }
            }
        }
    }

    return StateMachine;
})
;
define('shape/texture/interface',[],function() {
    

    function TextureInterface() {}
    TextureInterface.prototype.map = function(u, v) {}

    return TextureInterface;
})
;
define('shape/texture/image',[
    'shape/texture/interface',
    'shape/color'
], function(
    TextureInterface,
    Color
) {
    

    var abs = Math.abs;

    function ImageTexture(path, width, height) {
        this.width = width;
        this.height = height;
        this.internalBuffer = null;
        this.cache = Array(width * height);
        this.load(path);
    }

    ImageTexture.constructor = ImageTexture;
    ImageTexture.prototype = Object.create(TextureInterface.prototype);
    ImageTexture.prototype.load = function (path) {
        var imageTexture = new Image();
        imageTexture.height = this.height;
        imageTexture.width = this.width;

        imageTexture.onload = function () {
            this.loaded = true;
            var internalCanvas = document.createElement("canvas");
            internalCanvas.width = this.width;
            internalCanvas.height = this.height;
            var internalContext = internalCanvas.getContext("2d");
            internalContext.drawImage(imageTexture, 0, 0);
            this.internalBuffer = internalContext.getImageData(0, 0, this.width, this.height);
        }.bind(this);

        imageTexture.src = path;
    };
    ImageTexture.prototype.map = function (tu, tv) {
        if (this.internalBuffer) {
            // using a % operator to cycle/repeat the texture if needed
            var u = abs(((tu * this.width) % this.width)) >> 0;
            var v = abs(((tv * this.height) % this.height)) >> 0;

            var index = (u + v * this.width);

            if (this.cache[index]) {
                return this.cache[index];
            }

            var intex4 = index * 4;

            var r = this.internalBuffer.data[intex4];
            var g = this.internalBuffer.data[intex4 + 1];
            var b = this.internalBuffer.data[intex4 + 2];
            var a = this.internalBuffer.data[intex4 + 3];

            return this.cache[index] = new Color(r, g, b, a);
        } else {
            return Color.fromName('back');
        }
    }

    return ImageTexture;
});

define('shape/texture/color',[
    'shape/texture/interface',
    'shape/color'
], function(
    TextureInterface,
    Color
) {
    

    function ColorTexture(color) {
        this.color = color;
    }

    ColorTexture.prototype = Object.create(TextureInterface.prototype);
    ColorTexture.prototype.map = function (tu, tv) {
        return this.color;
    }

    return ColorTexture;
})
;
define('game11',[
    'shape/renderer/renderer',
    'shape/render',
    'shape/viewport',
    'math/matrix4',
    'math/vector3',
    'math/quaternion',
    'shape/mesh/cube',
    'shape/mesh/triangle',
    'shape/mesh/coordinate',
    'shape/color',
    'game/config',
    'collision/manager',
    'collision/strategy/triangle',
    'collision/strategy/aabb',
    'state',
    'shape/texture/image',
    'shape/texture/color'
],
function(
    Renderer,
    ShapeRender,
    Viewport,
    Matrix4,
    Vector3,
    Quaternion,
    CubeMesh,
    TriangleMesh,
    CoordinateMesh,
    Color,
    GameConfig,
    CollisionManager,
    CollisionStrategyTriangle,
    CollisionStrategyAABB,
    StateMachine,
    ImageTexture,
    ColorTexture
) {
    

    function SomeGame(canvas) {
        this.renderer = new Renderer(canvas);
        this.collision = new CollisionManager(new CollisionStrategyAABB());
        this.previousTime = Date.now();


        var w = canvas.width * .6;
        var h = canvas.height;
        var pw = canvas.width * .3;
        var ph = canvas.height * .3;

        this.cameraA =  Matrix4.lookAtRH(
            new Vector3(0, 0, 300),
            Vector3.zero(),
            Vector3.up()
        );
        this.viewportA = new Viewport(pw, 0, w, h);

        this.cameraX = this.cameraA.multiply(Matrix4.rotationX(90));
        this.viewportX = new Viewport(0, 0, pw, ph);

        this.cameraY = this.cameraA.multiply(Matrix4.rotationY(90));
        this.viewportY = new Viewport(0, ph, pw, ph);

        this.cameraZ = Matrix4.lookAtRH(
            new Vector3(0, 0, -300),
            Vector3.zero(),
            Vector3.up()
        );
        this.viewportZ = new Viewport(0, ph * 2, pw, ph);

        this.engine = new ShapeRender(
            this.viewportA,
            this.renderer,
            this.cameraA,
            Matrix4.perspectiveProjection(this.viewportA.width, this.viewportA.height, 90, 1, 1000)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(0, 0, GameConfig.BOARD_EDGE + 1/3 * GameConfig.CUBE_FIELD_SIZE, GameConfig.CUBE_FIELD_SIZE, Color.fromName('red'));
        this.meshes = []
        // this.meshes.push(this.cube);

        this.texture = new ImageTexture('assets/texture.jpg', 512, 512);
        this.triangle = new TriangleMesh(0, 0, 0, 100, this.texture);
        this.meshes.push(this.triangle);

        this.triangle2 = new TriangleMesh(0, 0, 80, 190, new ColorTexture(Color.fromName('blue')));
        this.meshes.push(this.triangle2);

        this.bigMesh = new CubeMesh(0, 0, -30, 50, new ImageTexture('assets/texture3.jpg', 512, 512));
        // this.bigMesh = new CubeMesh(0, 0, -30, 50, new ImageTexture('assets/texture2.jpg', 768,512));
        this.meshes.push(this.bigMesh);
    }
    SomeGame.prototype.captureKeys = function(e) {
        switch(e.keyCode) {
            case 37: e.preventDefault(); this.triangle.translation.x -=10; break; // left
            case 39: e.preventDefault(); this.triangle.translation.x +=10; break; // right
            case 38: e.preventDefault(); this.triangle.translation.y +=10; break; // up
            case 40: e.preventDefault(); this.triangle.translation.y -=10; break; // down
            case 65: e.preventDefault(); this.triangle.rotation.y +=10; break;
            case 68: e.preventDefault(); this.triangle.rotation.y -=10; break;
            case 87: e.preventDefault(); this.triangle.rotation.x +=10; break;
            case 83: e.preventDefault(); this.triangle.rotation.x -=10; break;
            case 32: e.preventDefault();
                this.triangle.rotation = Vector3.zero();
                this.triangle.translation = Vector3.zero();
                break;
            default: console.log(e.keyCode);
        }
    }
    SomeGame.prototype.approach = function(g, c, dt) {
        var diff = g - c;
        if (diff < dt && -diff < dt) return g;
        if (diff > dt) return c + dt;
        if (diff < dt) return c - dt;
        return g;
    }
    SomeGame.prototype.lineTo = function(from, to) {
        this.renderer.drawCline(
            this.engine.project(from),
            this.engine.project(to)
        );
    }
    SomeGame.prototype.update = function() {
        this.bigMesh.rotation.x += 10;
        this.bigMesh.rotation.y += 10;
        this.bigMesh.rotation.z += 5;

        this.cube.rotation.x += 5;
        this.cube.rotation.y += -5;
        this.cube.rotation.z += -2;

        this.texture.map(0, 1)
    }
    SomeGame.prototype.run = function() {
        this.currentTime = Date.now();
        this.dt = (this.currentTime - this.previousTime) / 1000;
        this.previousTime = this.currentTime;

        this.update();

        this.engine.clean();
        this.engine.update(this.meshes);

        this.engine.viewMatrix = this.cameraA;
        this.engine.viewport = this.viewportA;
        this.engine.viewportMatrix = Matrix4.viewportMatrix(this.engine.viewport.width, this.engine.viewport.height);
        this.engine.render(this.meshes);

        this.engine.viewMatrix = this.cameraX;
        this.engine.viewport = this.viewportX;
        this.engine.viewportMatrix = Matrix4.viewportMatrix(this.engine.viewport.width, this.engine.viewport.height);
        this.engine.render(this.meshes);

        this.engine.viewMatrix = this.cameraY;
        this.engine.viewport = this.viewportY;
        this.engine.viewportMatrix = Matrix4.viewportMatrix(this.engine.viewport.width, this.engine.viewport.height);
        this.engine.render(this.meshes);

        this.engine.viewMatrix = this.cameraZ;
        this.engine.viewport = this.viewportZ;
        this.engine.viewportMatrix = Matrix4.viewportMatrix(this.engine.viewport.width, this.engine.viewport.height);
        this.engine.render(this.meshes);

        this.engine.flush();

        // requestAnimationFrame(this.run.bind(this));
        setTimeout(this.run.bind(this), 1000/30)
    }

    return SomeGame;
})
;
require.config({
    baseUrl: "js",
    paths: {
        hammerjs: '../bower_components/hammerjs/hammer.min'
    }
    ,optimize: "none"
});

require(['game11'], function(TetrisGame) {
    

    var tetris, game;

    var ratio = devicePixelRatio = window.devicePixelRatio || 1,
        width = window.innerWidth,
        height = window.innerHeight;

    game = document.createElement('canvas');
    game.setAttribute('id', 'board');
    game.width = width * ratio;
    game.height = height * ratio;
    game.style.width = width + 'px';
    game.style.height = height + 'px';
    document.body.appendChild(game);

    // Catch user events
    document.ontouchmove = function(event){
        event.preventDefault();
    }

    tetris = new TetrisGame(game);
    tetris.run();
});

define("main", function(){});
