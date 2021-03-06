define([
    'hammerjs',
    'game/service',
    'math/vector3'
],
function(
    Hemmer,
    ServiceManager,
    Vector3
) {
    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        var self = this;

        this.service = new ServiceManager(this, canvas);

        this.config = this.service.config();
        this.actionManager = this.service.actionManager();

        // Move State Machine
        this.stateMachine = this.service.stateMachineMove();

        // Switch stages
        this.stateMachine.on('enter:play', function(e) {
            self.currentStage = self.service.gameStage();
        });
        this.stateMachine.on('enter:start', function(e) {
            self.currentStage = self.service.startStage();
        });
        this.stateMachine.on('enter:end', function() {
            document.getElementById('santa').className += ' happy';
        });
        this.stateMachine.on('enter:move_stop', function() {
            self.actionManager.remove('move');
        });

        // Manage game stage
        this.stateMachine.on('enter:left', function(e) {
            self.actionManager.set('move', self.service.actionMoveLeft());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:right', function(e) {
            self.actionManager.set('move', self.service.actionMoveRight());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:up', function(e) {
            self.actionManager.set('move', self.service.actionMoveUp());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:down', function(e) {
            self.actionManager.set('move', self.service.actionMoveDown());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:show_right_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set(
                'rotate',
                self.service.actionShowRightEdge().on('finish', self.stateMachine.proxy('right.face.visible'))
            );
        })
        this.stateMachine.on('enter:show_left_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set(
                'rotate',
                self.service.actionShowLeftEdge().on('finish', self.stateMachine.proxy('left.face.visible'))
            );
        });
        this.stateMachine.on('enter:show_up_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set(
                'rotate',
                self.service.actionShowUpEdge().on('finish', self.stateMachine.proxy('up.face.visible'))
            );
        });
        this.stateMachine.on('enter:show_down_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set(
                'rotate',
                self.service.actionShowDownEdge().on('finish', self.stateMachine.proxy('down.face.visible'))
            );
        });

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        Hammer(canvas)
        .on('dragleft', self.stateMachine.proxy('press.left'))
        .on('dragright', self.stateMachine.proxy('press.right'))
        .on('dragup', self.stateMachine.proxy('press.up'))
        .on('dragdown', self.stateMachine.proxy('press.down'))
        .on('drag', self.stateMachine.proxy('press.enter'))

        this.stateMachine.trigger('init');
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'captureKeys' : function(e) {
            // var p = this.service.projection();
            var c = this.service.cube();

            switch(e.keyCode) {
                case 37: e.preventDefault(); this.stateMachine.trigger('press.left'); break;
                case 38: e.preventDefault(); this.stateMachine.trigger('press.up'); break;
                case 39: e.preventDefault(); this.stateMachine.trigger('press.right'); break;
                case 40: e.preventDefault(); this.stateMachine.trigger('press.down'); break;
                case 13: e.preventDefault(); this.stateMachine.trigger('press.enter'); break;
                case 87: e.preventDefault(); c.rotation.x += 1; break; // w
                case 83: e.preventDefault(); c.rotation.x -= 1; break; // s
                case 65: e.preventDefault(); c.rotation.y += 1; break; // a
                case 68: e.preventDefault(); c.rotation.y -= 1; break; // d
                default: console.log(e.keyCode);
            }
        },
        'run': function() {
            var self = this;
            var FPS = 30;
            var timestamp = function() { return new Date().getTime()};

            var last, time = timestamp();

            function loop() {
                // last = timestamp();

                // if (self.enemies.count <= self.collect) {
                // self.stateMachine.trigger('found.gifts');
                // return;
                // }

                // One more time
                // requestAnimationFrame(loop);
                // Run actions
                self.actionManager.run();
                self.currentStage.updateState(self.stateMachine);
                self.stateMachine.run();
                self.currentStage.tick();

                // time = last;
            }
            requestAnimationFrame(loop);
            // setInterval(loop, 300)
            // loop()
        }
    };

    return TetrisGame;
});
