define([
    'shape/projection/projection',
    'shape/stage/canvas3d',
    'shape/shape/cube',
    'shape/shape/rect',
    'shape/point/point',
    'functional'
],
function(
    Projection,
    Canvas3DStage,
    CubeShape,
    RectShape,
    Point,
    f
) {
    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        this.canvas = canvas;
        this.projection = new Projection(1270, canvas.width / 2, canvas.height / 2);
        this.stage = new Canvas3DStage(this.canvas, this.projection);
        this.boardWidth = (canvas.width / 2) +  (this.ROTATION_MARGIN);
        this.cube = new CubeShape(0, 0, -this.boardWidth / 2, this.CUBE_SIZE, '#f2b139');
        this.board = new CubeShape(0, 0, 0, this.boardWidth, '#f68928');

        this.enemies = [];
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
        f.forEach(this.enemies, function(item) {
            self.stage.addChild(item);
        });
        this.stage.addChild(this.cube);

        this.stage.addChild(new RectShape(-100,-100, 0, 20, 40))
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
        'speed': 2,
        'counter': 0,
        'angle': 0,
        'move': function() {
            if (this.counter % this.GAME_STEP == 0) {
                this.tempDirection = this.direction;
            }
            this.position.x = this.position.y = this.position.z = 0;
            switch(this.tempDirection) {
                case 'left':  this.position.x = -this.speed; break;
                case 'right': this.position.x = this.speed; break;
                case 'up':    this.position.y = -this.speed; break;
                case 'down':  this.position.y = this.speed; break;
            }
            this.cube.moveTo(this.position);
        },
        'rotate': function(direction) {
            this.rotationDirection = direction;
            if (this.angle < this.RIGHT_ANGLE) {
                this.angle += this.ANGLE_STEP;

                var self = this;
                var projection = this.projection;
                function each(array, func) {
                    for (var i = 0, length = array.length; i < length; i++) {
                        func(array[i])
                    }
                }
                if (direction === this.DIRECTION_RIGHT) {
                    this.cube.projection(this.projection).rotateY(-this.ANGLE_STEP);
                    this.board.projection(this.projection).rotateY(-this.ANGLE_STEP);
                    each(this.enemies, function(item){
                        // console.log(item);
                        item.projection(projection).rotateY(-self.ANGLE_STEP);
                    });
                } else if (direction === this.DIRECTION_LEFT) {
                    this.cube.projection(this.projection).rotateY(this.ANGLE_STEP);
                    this.board.projection(this.projection).rotateY(this.ANGLE_STEP);
                    each(this.enemies, function(item){
                        item.projection(projection).rotateY(self.ANGLE_STEP);
                    });
                } else if (direction == this.DIRECTION_DOWN) {
                    this.cube.projection(this.projection).rotateX(-this.ANGLE_STEP);
                    this.board.projection(this.projection).rotateX(-this.ANGLE_STEP);
                    each(this.enemies, function(item){
                        item.projection(projection).rotateX(-self.ANGLE_STEP);
                    });
                } else if (direction == this.DIRECTION_UP) {
                    this.cube.projection(this.projection).rotateX(this.ANGLE_STEP);
                    this.board.projection(this.projection).rotateX(this.ANGLE_STEP);
                    each(this.enemies, function(item){
                        item.projection(projection).rotateX(self.ANGLE_STEP);
                    });
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
            this.counter += this.speed;
            // console.log(this.projection.x, this.cube.x);
            // console.log(this.cube.points.x, this.cube.points.first().x);
            var x = this.cube.points.first().x;
            var y = this.cube.points.first().y;

            // console.log(x, y, this.tempDirection);
            if (this.rotationDirection == this.DIRECTION_RIGHT
                || (this.tempDirection == this.DIRECTION_RIGHT && x - this.CUBE_SIZE > this.projection.x - this.ROTATION_MARGIN))
            {
                // console.log('A');
                rotationDone = this.rotate(this.DIRECTION_RIGHT);
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

            if (-1 == rotationDone) {
                // move if there is no rotation
                this.move();
            }

            this.stage.update();
        },
        'init': function() {
            this.tempDirection = this.DIRECTION_RIGHT;
            this.direction = this.DIRECTION_RIGHT;
            this.position = new Point(0, 0, 0);
            this.positions = [];
            // this.enemies = [];
            this.positions.push(new Point(0, 0, 0));
        },
        'dropEnemies': function() {
                    },
        'captureKeys' : function(e) {
            var d = this.direction;
            switch(true) {
                case 37 == e.keyCode && d != this.DIRECTION_RIGHT:
                    this.direction = this.DIRECTION_LEFT; break;
                case 38 == e.keyCode && d != this.DIRECTION_DOWN:
                    this.direction = this.DIRECTION_UP; break;
                case 39 == e.keyCode  && d != this.DIRECTION_LEFT:
                    this.direction = this.DIRECTION_RIGHT; break;
                case 40 == e.keyCode && d != this.DIRECTION_UP:
                    this.direction = this.DIRECTION_DOWN; break;
            }
        },
        'run': function() {
            var self = this;

            this.init();
            document.addEventListener("keydown", this.captureKeys.bind(this), false);
            function update() {
                self.update();
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            // this.dropEnemies();
            // this.update();
            // setInterval(this.move.bind(this), 200);
        }
    };

    return TetrisGame;
});
