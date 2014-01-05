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
        })
        this.stateMachine.on('enter:start', function(e) {
            self.currentStage = self.service.startStage();
        })
        this.stateMachine.on('enter:end', function() {
            document.getElementById('santa').className += ' happy';
        })

        var p = self.service.projection();
        var eye = new Vector3(0, 0, 0);
        var at =  new Vector3(-1.5, 0, -1.5);
        var up =  new Vector3(0, 1, 0);

        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs.item(i);
            input.addEventListener('change', (function(input){
                if (input.className === 'matrix-row') return function(e) {
                    var value = parseFloat(input.value.replace(',', '.'));
                    var d = input.dataset;

                    d.col = parseInt(d.col);
                    d.row = parseInt(d.row);
                    switch(d.row) {
                        case '0':
                            if(d.col == 0) eye.x = value;
                            if(d.col == 1) eye.y = value;
                            if(d.col == 2) eye.z = value;
                            break;
                        case '1':
                            if(d.col == 0) at.x = value;
                            if(d.col == 1) at.y = value;
                            if(d.col == 2) at.z = value;
                            break;
                        case '2':
                            if(d.col == 0) up.x = value;
                            if(d.col == 1) up.y = value;
                            if(d.col == 2) up.z = value;
                            break;
                        default:
                            console.log('miss row', d.row);
                            break;
                    }
                    p.cameraMatrix = p.createCamera(eye, at, up);
                    console.log('eye', eye.toString());
                    console.log('at', at.toString());
                    console.log('up', up.toString());
                    console.log('new camera', p.cameraMatrix.toString());
                    // p.cameraMatrix.setAt(
                    //     +input.dataset.row,
                    //     +input.dataset.col,
                    //     +input.value
                    // );
                }

                if (input.className === 'matrix-rotate') return function(e) {
                    var value = parseFloat(input.value.replace(',', '.'));
                    var d = input.dataset;
                    p.rotateCamera(d.direction, value);
                }

            })(input));
        }


        // Manage game stage
        this.stateMachine.on('enter:left', function(e) {
            p.rotateCamera('x', 10);
            // self.actionManager.set('move', self.service.actionMoveLeft());
            // e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:right', function(e) {
            p.rotateCamera('x', -10);
            // self.actionManager.set('move', self.service.actionMoveRight());
            // e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:up', function(e) {
            // self.actionManager.set('move', self.service.actionMoveUp());
            // e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:down', function(e) {
            // self.actionManager.set('move', self.service.actionMoveDown());
            // e.lock(self.actionManager.proxy('canStop', 'move'));
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
            // var d = document.getElementById('fps');

            function loop() {
                // last = timestamp();

                // if (self.enemies.count <= self.collect) {
                // self.stateMachine.trigger('found.gifts');
                // return;
                // }

                // One more time
                // requestAnimationFrame(loop);
                // Run actions
                // self.actionManager.run();
                // self.currentStage.updateState(self.stateMachine);
                // self.stateMachine.run();
                self.currentStage.tick();

                // d.innerText = 1000 / (last - time) >> 0;

                // time = last;
            }
            // requestAnimationFrame(loop);
            setInterval(loop, 300)
        }
    };

    return TetrisGame;
});
