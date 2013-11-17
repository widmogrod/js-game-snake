define(['shape'], function(shape) {

    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        this.canvas = canvas;
        this.projection = new shape.Projection(1270, canvas.width / 2, canvas.height / 2);
        this.stage = new shape.Canvas3DStage(this.canvas, this.projection);
        var boardWidth = (canvas.width / 2) +  (this.ROTATION_MARGIN);
        this.cube = new shape.CubeShape(0, 0, -boardWidth / 2, this.CUBE_SIZE);
        this.board = new shape.CubeShape(0, 0, 0, boardWidth);
        this.stage.addChild(this.board);
        this.stage.addChild(this.cube);
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
        'speed': 1,
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
                if (direction === this.DIRECTION_RIGHT) {
                    this.cube.projection(this.projection).rotateY(-this.ANGLE_STEP);
                    this.board.projection(this.projection).rotateY(-this.ANGLE_STEP);
                } else if (direction === this.DIRECTION_LEFT) {
                    this.cube.projection(this.projection).rotateY(this.ANGLE_STEP);
                    this.board.projection(this.projection).rotateY(this.ANGLE_STEP);
                } else if (direction == this.DIRECTION_DOWN) {
                    this.cube.projection(this.projection).rotateX(-this.ANGLE_STEP);
                    this.board.projection(this.projection).rotateX(-this.ANGLE_STEP);
                } else if (direction == this.DIRECTION_UP) {
                    this.cube.projection(this.projection).rotateX(this.ANGLE_STEP);
                    this.board.projection(this.projection).rotateX(this.ANGLE_STEP);
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
            // console.log(this.cube.x, this.cube.points[0].x);
            var x = this.cube.points[0].x;
            var y = this.cube.points[1].y;

            // console.log(x, y, this.tempDirection);
            if (this.rotationDirection == this.DIRECTION_RIGHT
                || (this.tempDirection == this.DIRECTION_RIGHT && x > this.projection.x - this.ROTATION_MARGIN))
            {
                // console.log('A');
                rotationDone = this.rotate(this.DIRECTION_RIGHT);
            } else if (this.rotationDirection == this.DIRECTION_LEFT
                      || (this.tempDirection == this.DIRECTION_LEFT && x < -this.projection.x + this.ROTATION_MARGIN))
            {
                // console.log('B');
                rotationDone = this.rotate(this.DIRECTION_LEFT);
            } else if (this.rotationDirection == this.DIRECTION_UP
                       || (this.tempDirection == this.DIRECTION_UP && y < -this.projection.y + this.ROTATION_MARGIN))
            {
                // console.log('C');
                rotationDone = this.rotate(this.DIRECTION_UP);
            } else if (this.rotationDirection == this.DIRECTION_DOWN
                      || (this.tempDirection == this.DIRECTION_DOWN && y > this.projection.y - this.ROTATION_MARGIN))
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
            this.position = new shape.Point(0, 0, 0);
            this.positions = [];
            this.positions.push(new shape.Point(0, 0, 0));
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
            // this.update();
            // setInterval(this.move.bind(this), 200);
        }
    };

    return TetrisGame;
});
