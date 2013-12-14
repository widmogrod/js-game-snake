define([
    'hammerjs',
    'shape/projection/projection',
    'shape/stage/canvas3d',
    'shape/shape/cube',
    'shape/point/point',
    'shape/point/collection',
    'game/service'
],
function(
    Hemmer,
    Projection,
    Canvas3DStage,
    CubeShape,
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
        this.boardWidth = this.config.CUBE_SIZE * 10 >> 0;
        this.boardEdge = (this.boardWidth / 2) - this.config.CUBE_SIZE >> 0;
        this.board = new CubeShape(0, 0, 0, this.boardWidth, '#fff');
        this.cube = this.service.cube();
        this.collect = 0;
        this.actionManager = this.service.actionManager();

        var size = this.config.CUBE_SIZE;
        var edge = (-this.boardWidth / 2) + size;

        this.enemies = new PointCollection();

        var am = this.service.assetManager();

        am.get('melody', function(audio) {
            audio.addEventListener('ended', function() {
                // this.currentTime = 0;
                this.play();
            }, false);
            audio.play();
        })

        // this.enemies.push(this.service.giftFactory(0, 1 * size, edge));
        this.enemies.push(this.service.giftFactory(0, 2 * size, edge));
        this.enemies.push(this.service.giftFactory(0, 3 * size, edge));
        this.enemies.push(this.service.giftFactory(0, 4 * size, edge));
        this.enemies.push(this.service.giftFactory(edge, 1 * size, edge));
        this.enemies.push(this.service.giftFactory(edge, 1 * size, edge));
        this.enemies.push(this.service.giftFactory(edge, edge, edge));

        this.collisionManager = this.service.collisionManager();

        // Add objection to stage, order is important - for now.
        this.stage.addChild(this.board);
        this.enemies.each(function(item) {
            self.stage.addChild(item);
            self.collisionManager.when(self.cube, item, function(data) {
                self.collect++;
                am.get('ring', function(ring) {
                    ring.play()
                })
                self.stage.removeChild(data.collide);

            })
        });
        this.stage.addChild(this.cube);

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
        this.stateMachine.on('enter:end', function() {
            document.getElementById('santa').className += ' happy';
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
            var boardX = this.board.center().x + this.boardEdge;
            var boardY = this.board.center().y + this.boardEdge;

            if (x > boardX) {
                this.stateMachine.trigger('edge.right');
            } else if (x < -boardX) {
                this.stateMachine.trigger('edge.left');
            } else if (y < -boardY) {
                this.stateMachine.trigger('edge.up');
            } else if (y > boardY) {
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
            if (this.enemies.count <= this.collect) {
                this.stateMachine.trigger('found.gidts');
                return;
            }
            // Calculate interaction
            this.update();
            this.collisionManager.run();
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
