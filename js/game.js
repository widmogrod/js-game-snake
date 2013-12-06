define([
    'shape/projection/projection',
    'shape/stage/canvas3d',
    'shape/shape/cube',
    'shape/shape/rect',
    'shape/point/point',
    'shape/point/collection',
    'functional',
    'state',
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
    StateMachine,
    ServiceManager
) {
    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        this.canvas = canvas;
        this.service = new ServiceManager(this);

        this.projection = new Projection(1270, canvas.width / 2, canvas.height / 2);
        this.stage = new Canvas3DStage(this.canvas, this.projection);
        this.boardWidth = (canvas.width / 2) +  (this.ROTATION_MARGIN);
        this.board = new CubeShape(0, 0, 0, this.boardWidth, '#f68928');

        this.cube = this.service.cube(); // new CubeShape(0, 0, -this.boardWidth / 2, this.CUBE_SIZE, '#f2b139');
        this.actionManager = this.service.actionManager();

        this.enemies = new PointCollection();
        this.enemies.push(new CubeShape(
            5 * this.CUBE_SIZE,
            5 * this.CUBE_SIZE,
           - 8 * this.CUBE_SIZE,
            this.CUBE_SIZE,
            '#ee312e'
        ));
        this.enemies.push(new RectShape(-140, -120, 220, 20, 40))

        this.stage.addChild(this.board);
        var self = this;
        this.enemies.each(function(item) {
            self.stage.addChild(item);
        });
        this.stage.addChild(this.cube);
        this.stage.addChild(new RectShape(-100,-100, 0, 20, 40))

        // Move State Machine
        this.fsmMove = new StateMachine(this.stateMove);
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
            return self.actionManager.set('move', self.service.actionShowRightEdge());
        });
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'DIRECTION_DOWN' : 'down',
        'DIRECTION_UP': 'up',
        'DIRECTION_LEFT' : 'left',
        'DIRECTION_RIGHT' : 'right',
        'RIGHT_ANGLE' : Math.PI / 2,
        'ANGLE_STEP': 0.01,
        'ROTATION_MARGIN' : 80,
        'GAME_STEP': 20,
        'CUBE_SIZE': 20,
        'SPEED': 2,
        'counter': 0,
        'angle': 0,
        'stateMove': {
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
            }
        },
        'stateGame': {
            'start': {
                'press.start' : 'play'
            },
            'play' : {
                'ship.suiside': 'end',
                'ship.success': 'end',
                'press.pause': 'stop'
            },
            'end': {
                'press.restart' : 'start'
            },
            'stop': {
                'press.escape': 'start'
            },
        },
        'rotate': function(direction) {
            this.rotationDirection = direction;
            if (this.angle < this.RIGHT_ANGLE) {
                this.angle += this.ANGLE_STEP;

                if (direction === this.DIRECTION_RIGHT) {
                    this.projection.rotateY(this.cube.points(), -this.ANGLE_STEP);
                    this.projection.rotateY(this.board.points(), -this.ANGLE_STEP);
                    this.projection.rotateY(this.enemies, -this.ANGLE_STEP);
                } else if (direction === this.DIRECTION_LEFT) {
                    this.projection.rotateY(this.cube.points(), this.ANGLE_STEP);
                    this.projection.rotateY(this.board.points(), this.ANGLE_STEP);
                    this.projection.rotateY(this.enemies, this.ANGLE_STEP);
                } else if (direction === this.DIRECTION_DOWN) {
                    this.projection.rotateX(this.cube.points(), -this.ANGLE_STEP);
                    this.projection.rotateX(this.board.points(), -this.ANGLE_STEP);
                    this.projection.rotateX(this.enemies, -this.ANGLE_STEP);
                } else if (direction === this.DIRECTION_UP) {
                    this.projection.rotateX(this.cube.points(), this.ANGLE_STEP);
                    this.projection.rotateX(this.board.points(), this.ANGLE_STEP);
                    this.projection.rotateX(this.enemies, this.ANGLE_STEP);
                }
            } else {
                // console.log('end rotation', this.angle);
                if (direction == this.DIRECTION_RIGHT || direction == this.DIRECTION_LEFT) {
                    this.angleX = this.angle;
                } else {
                    this.angleY = this.angle;
                }
                this.angle = 0;
                this.rotationDirection = null;
                return -1;
            }
        },
        'update': function() {
            var rotationDone = -1;
            this.counter += this.SPEED;
            // console.log(this.projection.x, this.cube.x);
            // console.log(this.cube.points.x, this.cube.points.first().x);
            var x = this.cube.points().first().x;
            var y = this.cube.points().first().y;

            if (this.rotationDirection == this.DIRECTION_RIGHT
                || (this.tempDirection == this.DIRECTION_RIGHT && x - this.CUBE_SIZE > this.projection.x - this.ROTATION_MARGIN))
            {
                this.fsmMove.trigger('edge.right');
            } else if (this.rotationDirection == this.DIRECTION_LEFT
                      || (this.tempDirection == this.DIRECTION_LEFT && x + this.CUBE_SIZE + this.CUBE_SIZE < -this.projection.x + this.ROTATION_MARGIN))
            {
                // console.log('B');
                rotationDone = this.rotate(this.DIRECTION_LEFT);
            } else if (this.rotationDirection == this.DIRECTION_UP
                       || (this.tempDirection == this.DIRECTION_UP && y + this.CUBE_SIZE + this.CUBE_SIZE < -this.projection.y + this.ROTATION_MARGIN))
            {
                // console.log('C');
                rotationDone = this.rotate(this.DIRECTION_UP);
            } else if (this.rotationDirection == this.DIRECTION_DOWN
                      || (this.tempDirection == this.DIRECTION_DOWN && y - this.CUBE_SIZE > this.projection.y - this.ROTATION_MARGIN))
            {
                // console.log('D');
                rotationDone = this.rotate(this.DIRECTION_DOWN);
            }

            this.stage.update();
        },
        'init': function() {
            this.tempDirection = this.DIRECTION_RIGHT;
            this.direction = this.DIRECTION_RIGHT;
            this.position = new Point(0, 0, 0);
            this.positions = [];
            this.positions.push(new Point(0, 0, 0));
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
            var self = this;

            this.init();
            document.addEventListener("keydown", this.captureKeys.bind(this), false);
            function update() {
                self.update();
                self.actionManager.run();
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }
    };

    return TetrisGame;
});
