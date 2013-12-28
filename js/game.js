define([
    'hammerjs',
    'game/service'
],
function(
    Hemmer,
    ServiceManager
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
        })
        this.stateMachine.on('enter:start', function(e) {
            self.currentStage = self.service.startStage();
        });

        // Manage game stage
        this.stateMachine.on('enter:left', function(e) {
            self.actionManager.set('move', self.service.actionMoveLeft());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        });
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


        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        Hammer(canvas, {
            drag_lock_to_axis: true
        })
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
            switch(e.keyCode) {
                case 37: e.preventDefault(); this.stateMachine.trigger('press.left'); break;
                case 38: e.preventDefault(); this.stateMachine.trigger('press.up'); break;
                case 39: e.preventDefault(); this.stateMachine.trigger('press.right'); break;
                case 40: e.preventDefault(); this.stateMachine.trigger('press.down'); break;
                case 13: e.preventDefault(); this.stateMachine.trigger('press.enter'); break;
                // default: console.log(e.keyCode);
            }
        },
        'run': function() {
            var self = this;
            var FPS = 30;
            var timestamp = function() { return new Date().getTime()};

            var last, time = timestamp();
            var d = document.getElementById('fps');

            function loop() {
                last = timestamp();

                // if (self.enemies.count <= self.collect) {
                    // self.stateMachine.trigger('found.gifts');
                    // return;
                // }

                // One more time
                requestAnimationFrame(loop);
                // Run actions
                self.actionManager.run();
                self.currentStage.updateState(self.stateMachine);
                self.stateMachine.run();
                self.currentStage.tick();

                d.innerText = 1000 / (last - time) >> 0;

                time = last;
            }
            requestAnimationFrame(loop);
        }
    };

    return TetrisGame;
});
