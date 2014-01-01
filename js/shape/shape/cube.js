define([
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection',
    'shape/utils/vector'
],
function(Shape, Point, PointCollection, VectorUtil) {
    "use strict";

    var faces = [
        [0,1,2,3], // back
        [0,4,5,1],
        [0,3,7,4],
        [3,2,6,7],
        [1,5,6,2],
        [4,7,6,5] // front
    ];

    /**
     * Cube shape
     */
    function CubeShape(x, y, z, width, color) {
        this.state_ = this.STATE_CLEAN;
        this.points_ = new PointCollection(new Point(x, y, z));

        this.width = width || 10;
        this.color = color || '#333333';

        var halfWidth = this.width / 2;

        this.points_.push(new Point(x - halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z + halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z + halfWidth));
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = Object.create(Shape.prototype);
    CubeShape.prototype.render = function(stage) {
        var face, point, normal, camera, angle;
        var i = 0, length = faces.length;

        camera = stage.projection.camera;

        for (; i < length; i++) {
            face = faces[i];

            normal = VectorUtil.normalFromPoints(
                this.points_.get(face[0]),
                this.points_.get(face[1]),
                this.points_.get(face[2])
            );

            normal = normal.normalize();
            angle = new VectorUtil(camera).angle(normal) * 180 / Math.PI >> 0;
            if (angle < 91) continue;

            point = this.points_.get(face[0]);
            stage.moveTo(point);
            for (var j = 3; j >= 0; j--) {
                point = this.points_.get(face[j]);
                stage.lineTo(point);
            }
            stage.stroke();
        }
    }

    return CubeShape;
});
