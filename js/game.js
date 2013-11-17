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
        this.cube = new shape.CubeShape(200, 0, -200, 30);
        this.stage.addChild(this.cube);
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'DIRECTION_DOWN' : 'down',
        'DIRECTION_UP': 'up',
        'DIRECTION_LEFT' : 'left',
        'DIRECTION_RIGHT' : 'right',
        'RIGHT_ANGLE' : 90 * Math.PI / 180,
        'ANGLE_STEP': 0.1,
        'ROTATION_MARGIN' : 40,
        'GAME_STEP': 20,
        'speed': 0.00001,
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
            if (this.angle < this.RIGHT_ANGLE) {
                this.angle += this.ANGLE_STEP;
                this.cube.projection(this.projection).rotateY(this.ANGLE_STEP);
            } else {
                this.angle = 0;
                return -1;
            }
        },
        'update': function() {
            var rotationDone = -1;
            this.counter += this.speed;
            if (this.direction === this.DIRECTION_LEFT && this.cube.points[0].xpos < this.ROTATION_MARGIN) {
                console.log(this.cube.xpos, this.ROTATION_MARGIN);
                // rotationDone = this.rotate(this.DIRECTION_RIGHT);
            } else if (this.cube.x > this.canvas.width - this.ROTATION_MARGIN) {
                // rotationDone = this.rotate(this.DIRECTION_LEFT);
            } else if (this.cube.y < this.ROTATION_MARGIN) {
                // rotationDone = this.rotate(this.DIRECTION_UP);
            } else if (this.cube.y > this.canvas.height - this.ROTATION_MARGIN) {
                // rotationDone = this.rotate(this.DIRECTION_DOWN);
            }

            if (-1 === rotationDone) {
                // move if there is no rotation
                // this.move();
            }

                        this.stage.update();
        },
        'init': function() {
            this.tempDirection = this.DIRECTION_DOWN;
            this.direction = this.DIRECTION_DOWN;
            this.position = new shape.Point(0, 0, 0);
            this.positions = [];
            this.positions.push(new shape.Point(0, 0, 0));
            this.speed = 10;
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
