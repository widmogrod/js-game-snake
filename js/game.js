define([
    'shape/projection/projection',
    'shape/stage/canvas3d',
    'shape/shape/cube',
    'shape/shape/rect',
    'shape/point/point',
    'shape/point/collection',
    'functional',
    'game/service'
],
function(
    Projection,
    Canvas3DStage,
    CubeShape,
    RectShape,
    Point,
    PointCollection,
    f,
    ServiceManager
) {
    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        var self = this;

        this.canvas = canvas;
        this.service = new ServiceManager(this);

        this.config = this.service.config();
        this.projection = new Projection(1270, canvas.width / 2, canvas.height / 2);
        this.stage = new Canvas3DStage(this.canvas, this.projection);
        this.boardWidth = (canvas.width / 2) +  (this.config.ROTATION_MARGIN);
        this.board = new CubeShape(0, 0, 0, this.boardWidth, '#f68928');
        this.cube = this.service.cube();
        this.actionManager = this.service.actionManager();

        this.enemies = new PointCollection();
        this.enemies.push(new CubeShape(
            5 * this.config.CUBE_SIZE,
            5 * this.config.CUBE_SIZE,
           - 8 * this.config.CUBE_SIZE,
            this.config.CUBE_SIZE,
            '#ee312e'
        ));
        this.enemies.push(new RectShape(-140, -120, 220, 20, 40))


        // Add objection to stage, order is important - for now.
        this.stage.addChild(this.board);
        this.enemies.each(function(item) {
            self.stage.addChild(item);
        });
        this.stage.addChild(this.cube);
        this.stage.addChild(new RectShape(-100,-100, 0, 20, 40))

        // Move State Machine
        this.fsmMove = this.service.stataMachineMove();
        this.fsmMove.on('enter:left', function() {
            return self.actionManager.set('move', self.service.actionMoveLeft());
        })
        this.fsmMove.on('enter:right', function() {
            return self.actionManager.set('move', self.service.actionMoveRight());
        })
        this.fsmMove.on('enter:up', function() {
            return self.actionManager.set('move', self.service.actionMoveUp());
        })
        this.fsmMove.on('enter:down', function() {
            return self.actionManager.set('move', self.service.actionMoveDown());
        })
        this.fsmMove.on('enter:show_right_face', function() {
            self.actionManager.set('move', self.service.actionShowRightEdge());
            self.fsmMove.trigger('right.face.visible')
        });
        this.fsmMove.on('enter:show_left_face', function() {
            self.actionManager.set('move', self.service.actionShowLeftEdge());
            self.fsmMove.trigger('left.face.visible')
        });
        this.fsmMove.on('enter:show_up_face', function() {
            self.actionManager.set('move', self.service.actionShowUpEdge());
            self.fsmMove.trigger('up.face.visible')
        });
        this.fsmMove.on('enter:show_down_face', function() {
            self.actionManager.set('move', self.service.actionShowDownEdge());
            self.fsmMove.trigger('down.face.visible')
        });

        // Catch user events
        document.addEventListener("keydown", this.captureKeys.bind(this), false);
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'update': function() {
            var x = this.cube.points().first().x;
            var y = this.cube.points().first().y;

            if (x - this.config.CUBE_SIZE > this.projection.x - this.config.ROTATION_MARGIN) {
                this.fsmMove.trigger('edge.right');
            } else if (x + this.config.CUBE_SIZE + this.config.CUBE_SIZE < -this.projection.x + this.config.ROTATION_MARGIN) {
                this.fsmMove.trigger('edge.left');
            } else if (y + this.config.CUBE_SIZE + this.config.CUBE_SIZE < -this.projection.y + this.config.ROTATION_MARGIN) {
                this.fsmMove.trigger('edge.up');
            } else if (y - this.config.CUBE_SIZE > this.projection.y - this.config.ROTATION_MARGIN) {
                this.fsmMove.trigger('edge.down');
            }
        },
        'captureKeys' : function(e) {
            switch(true) {
                case 37 == e.keyCode: this.fsmMove.trigger('press.left'); break;
                case 38 == e.keyCode: this.fsmMove.trigger('press.up'); break;
                case 39 == e.keyCode: this.fsmMove.trigger('press.right'); break;
                case 40 == e.keyCode: this.fsmMove.trigger('press.down'); break;
            }
        },
        'run': function() {
            // Calculate interaction
            this.update();
            // Run actions
            this.actionManager.run();
            // Render
            this.stage.update();
            // One more time
            requestAnimationFrame(this.run.bind(this));
        }
    };

    return TetrisGame;
});
