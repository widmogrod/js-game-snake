define([
    'hammerjs',
    'shape/projection/projection',
    'shape/stage/canvas3d',
    'shape/shape/cube',
    'shape/shape/rect',
    'shape/point/point',
    'shape/point/collection',
    'game/service'
],
function(
    Hemmer,
    Projection,
    Canvas3DStage,
    CubeShape,
    RectShape,
    Point,
    PointCollection,
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
        this.stateMachine = this.service.stateMachineMove();
        this.stateMachine.on('enter:left', function() {
            self.actionManager.set('move', self.service.actionMoveLeft());
        })
        this.stateMachine.on('enter:right', function() {
            self.actionManager.set('move', self.service.actionMoveRight());
        })
        this.stateMachine.on('enter:up', function() {
            self.actionManager.set('move', self.service.actionMoveUp());
        })
        this.stateMachine.on('enter:down', function() {
            self.actionManager.set('move', self.service.actionMoveDown());
        })
        this.stateMachine.on('enter:show_right_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set('rotate', self.service.actionShowRightEdge());
        });
        this.stateMachine.on('enter:show_left_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set('rotate', self.service.actionShowLeftEdge());
        });
        this.stateMachine.on('enter:show_up_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set('rotate', self.service.actionShowUpEdge());
        });
        this.stateMachine.on('enter:show_down_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set('rotate', self.service.actionShowDownEdge());
        });

        // Catch user events
        document.addEventListener("keydown", this.captureKeys.bind(this), false);
        document.ontouchmove = function(event){
            event.preventDefault();
        }
        Hammer(this.canvas, {
            drag_lock_to_axis: true
        })
        .on('dragleft', self.stateMachine.proxy('press.left'))
        .on('dragright', self.stateMachine.proxy('press.right'))
        .on('dragup', self.stateMachine.proxy('press.up'))
        .on('dragdown', self.stateMachine.proxy('press.down'))
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'update': function() {
            var x = this.cube.center().x;
            var y = this.cube.center().y;

            if (x - this.config.CUBE_SIZE > this.projection.x - this.config.ROTATION_MARGIN) {
                this.stateMachine.trigger('edge.right');
            } else if (x + this.config.CUBE_SIZE + this.config.CUBE_SIZE < -this.projection.x + this.config.ROTATION_MARGIN) {
                this.stateMachine.trigger('edge.left');
            } else if (y + this.config.CUBE_SIZE + this.config.CUBE_SIZE < -this.projection.y + this.config.ROTATION_MARGIN) {
                this.stateMachine.trigger('edge.up');
            } else if (y - this.config.CUBE_SIZE > this.projection.y - this.config.ROTATION_MARGIN) {
                this.stateMachine.trigger('edge.down');
            }
        },
        'captureKeys' : function(e) {
            switch(true) {
                case 37 == e.keyCode: this.stateMachine.trigger('press.left'); break;
                case 38 == e.keyCode: this.stateMachine.trigger('press.up'); break;
                case 39 == e.keyCode: this.stateMachine.trigger('press.right'); break;
                case 40 == e.keyCode: this.stateMachine.trigger('press.down'); break;
            }
        },
        'run': function() {
            // Calculate interaction
            this.update();
            // Run actions
            this.actionManager.run();
            // Render
            this.stage.render();
            // One more time
            requestAnimationFrame(this.run.bind(this));
        }
    };

    return TetrisGame;
});
