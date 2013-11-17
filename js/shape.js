define(function(){

    function Point(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.xpos = 0;
        this.ypos = 0;
    }

    function ProjectionInterface(viewerAngle, x, y) {}
    ProjectionInterface.constructor = ProjectionInterface;
    ProjectionInterface.prototype = {
        'rotateX' : function(point, angle) {},
        'rotateY' : function(point, angle) {},
        'rotateZ' : function(point, angle) {},
        'project' : function(point) {}
    };

    function Projection(viewerAngle, x, y) {
        this.viewerAngle = viewerAngle;
        this.x = x;
        this.y = y;
    }
    Projection.constructor = Projection;
    Projection.prototype = new ProjectionInterface();
    Projection.prototype.project = function(point) {
        if (point.z > -this.viewerAngle) {
            var scale = this.viewerAngle / (this.viewerAngle + point.z);
            point.xpos = this.x + point.x * scale;
            point.ypos = this.y + point.y * scale;
        }
    }
    Projection.prototype.rotateY = function(point, angle) {
        var cos = Math.cos(angle), sin = Math.sin(angle),
            x1 = point.x * cos - point.z * sin,
            z1 = point.z * cos + point.x * sin;

        point.x = x1;
        point.z = z1;
    }

    /**
     * Shape prototype
     */
    function Shape() {
        this.state_ = this.STATE_CLEAN;
    }
    Shape.prototype = {
        'STATE_CLEAN' : 0,
        'STATE_DIRTY' : 1,
        'STATE_RENDERED' : 2,
        'render': function(context) {},
        'state': function(state) {
            if(arguments.length) {
                this.state_ = state;
                return this;
            }
            return this.state_;
        }
    };

    /**
     * Cube shape
     */
    function CubeShape(x, y, z, size) {
        this.state_ = this.STATE_CLEAN;
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size || 10;

        this.colors = [
            '#f2b139',
            '#f68928',
            '#ee312e',
            '#be3126',
            '#bada55',
            '#1197a7',
            '#262f6d'
        ];

        this.points = [];
        this.points.push(new Point(this.x, this.y, this.z));
        this.points.push(new Point(this.x + this.size, this.y, this.z));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z));
        this.points.push(new Point(this.x, this.y + this.size, this.z));

        this.points.push(new Point(this.x, this.y, this.z));
        this.points.push(new Point(this.x, this.y + this.size, this.z));
        this.points.push(new Point(this.x, this.y + this.size, this.z + this.size));
        this.points.push(new Point(this.x, this.y, this.z + this.size));

        this.points.push(new Point(this.x + this.size, this.y, this.z));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points.push(new Point(this.x + this.size, this.y, this.size));
        this.points.push(new Point(this.x, this.y, this.z + this.size));
        this.points.push(new Point(this.x + this.size, this.y, this.z + this.size));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points.push(new Point(this.x, this.y + this.size, this.z + this.size));

        this.points.push(new Point(this.x,this.y,this.z));
        this.points.push(new Point(this.x + this.size, this.y, this.z));
        this.points.push(new Point(this.x + this.size, this.y, this.z + this.size));
        this.points.push(new Point(this.x, this.y, this.z + this.size));

        this.points.push(new Point(this.x, this.y + this.size,this.z));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z));
        this.points.push(new Point(this.x + this.size, this.y + this.size, this.z + this.size));
        this.points.push(new Point(this.x, this.y + this.size, this.z + this.size));
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = new Shape();
    CubeShape.prototype.projection = function(projection) {
        for(var i = 0, length = this.points.length; i < length; i++) {
            projection.project(this.points[i]);
        }
        var self = this;
        return {
            rotateY : function(angle) {
                self.state(self.STATE_DIRTY);
                for(var i = 0, length = self.points.length; i < length; i++) {
                    projection.rotateY(self.points[i], angle);
                }
            }
        }
    }
    CubeShape.prototype.render = function(stage) {
        var point;
        for(var i = 0, length = this.points.length; i < length; i++) {
            point = this.points[i];
            if (i == 0) {
                stage.beginPath();
                stage.moveTo(point.xpos, point.ypos);
            }
            else if ((i + 1) % 4 == 0) {
                stage.lineTo(point.xpos, point.ypos);
                stage.fillStyle(this.colors[((i + 1) / 4) - 1]);
                stage.closePath();
                stage.fill();
                stage.beginPath();
            } else {
                stage.lineTo(point.xpos, point.ypos);
            }
        }
    }

    function EllipseShape(x, y, width, height) {
        this.state_ = this.STATE_CLEAN;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    EllipseShape.constructor = EllipseShape;
    EllipseShape.prototype = new Shape();
    EllipseShape.prototype.render = function (state) {
        state.fillEllipse(this.x, this.y, this.width, this.height);
    }

    /**
     * Stage prototype
     */
    function Stage(context) {}
    Stage.prototype = {
        'update': function() {},
        'addChild': function() {},
        'fillRect': function(x, y, width, height) {},
        'fillStyle': function(style) {},
        'setTransform': function(skewX, skewY, scalX, scalY, moveX, moveY) {}
    };

    function CanvasStage(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
    }

    CanvasStage.constructor = CanvasStage;
    CanvasStage.prototype = new Stage();
    CanvasStage.prototype.addChild = function(shape) {
        this.childs.push(shape);
    };
    CanvasStage.prototype.clean = function() {
        this.context.cleanRect(0,0,this.width, this.height);
    }
    CanvasStage.prototype.update = function() {
        var child, state,
            i = 0,
            length = this.childs.length;

        this.context.clearRect(0,0,this.width, this.height);

        for (; i < length; i++) {
            child = this.childs[i];
            state = child.state();
            if (child.STATE_RENDERED !== state) {
                child.render(this);
                child.state(child.STATE_RENDERED);
            }
        }
    };
    CanvasStage.prototype.fillRect = function(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
    }
    CanvasStage.prototype.beginPath = function() {
        this.context.beginPath();
    }
    CanvasStage.prototype.closePath = function() {
        this.context.closePath();
    }
    CanvasStage.prototype.fill = function() {
        this.context.fill();
    }
    CanvasStage.prototype.stroke = function() {
        this.context.stroke();
    }
    CanvasStage.prototype.moveTo = function(x, y) {
        this.context.moveTo(x, y);
    }
    CanvasStage.prototype.lineTo = function(x, y) {
        this.context.lineTo(x, y);
    }
    CanvasStage.prototype.fillStyle = function(style) {
        this.context.fillStyle = style;
    }
    CanvasStage.prototype.fillEllipse = function(x, y, w, h) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        this.context.beginPath();
        this.context.moveTo(x, ym);
        this.context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        this.context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        this.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        this.context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        this.context.closePath();
        this.context.stroke();
    }
    CanvasStage.prototype.setTransform = function(skewX, skewY, scalX, scalY, moveX, moveY) {
        this.context.setTransform(scalX || 1, skewX, skewY, scalY || 1, moveX || 0, 0);
    }

    function Canvas3DStage(canvas, projection) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.projection = projection;
    }
    Canvas3DStage.constructor = Canvas3DStage;
    Canvas3DStage.prototype = Object.create(CanvasStage.prototype);
    Canvas3DStage.prototype.update = function() {
        var child, state,
            i = 0,
            length = this.childs.length;


        this.context.clearRect(0,0,this.width, this.height);

        for (; i < length; i++) {
            child = this.childs[i];
            state = child.state();
            if (child.STATE_RENDERED !== state) {
                child.projection(this.projection);
                child.render(this);
                child.state(child.STATE_RENDERED);
            }
        }
    }

    return {
        'Stage' : Stage,
        'Shape' : Shape,
        'CanvasStage' : CanvasStage,
        'Canvas3DStage' : Canvas3DStage,
        'CubeShape' : CubeShape,
        'EllipseShape' : EllipseShape,
        'Point' : Point,
        'Projection' : Projection,
        'ProjectionInterface' : ProjectionInterface
    };
});
