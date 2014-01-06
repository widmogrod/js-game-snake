define(['shape/shape/cube', 'shape/mesh/cube', 'shape/color'], function(CubeShape, CubeMesh, Color){
    function GameStage(serviceManager) {
        var config = serviceManager.config();
        var stage = serviceManager.createStage();

        this.board = new CubeMesh(0, 0, 0, config.BOARD_WIDTH, Color.fromName('blue'));
        this.cube = serviceManager.cube();
        this.collect = 0;
        this.config = config;
        this.stage = stage;
        this.service = serviceManager;
        this.collisionManager = serviceManager.collisionManager();

        // Add objection to stage, order is important - for now.
        this.stage.addChild(this.board);
        this.enemies = this.spawnEnemies();
        this.stage.addChild(this.cube);
    }
    GameStage.prototype.tick = function() {
        this.collisionManager.run()
        this.stage.render();
    }

    GameStage.prototype.lastRandomValue = null;
    GameStage.prototype.rotateX = function(angle) {
        this.service.projection().rotateX(this.stage, angle);
    }
    GameStage.prototype.rotateY = function(angle) {
        this.service.projection().rotateY(this.stage, angle);
    }
    GameStage.prototype.giftFactory = function(x, y, z) {
        return this.service.giftFactory(x, y, z);
    }
    GameStage.prototype.updateState = function(stateMachine) {
        var x = this.cube.center().x;
        var y = this.cube.center().y;

        var boardX = this.config.BOARD_EDGE;
        var boardY = this.config.BOARD_EDGE;

        if (x > boardX) {
            stateMachine.trigger('edge.right');
        } else if (x < -boardX) {
            stateMachine.trigger('edge.left');
        } else if (y < -boardY) {
            stateMachine.trigger('edge.up');
        } else if (y > boardY) {
            stateMachine.trigger('edge.down');
        }
    }
    GameStage.prototype.spawnEnemies = function() {
        var enemies = [];
        var d;
        var self = this;
        for(var k = 0; k < 6; k++) {
            d = this.spawnRandom();
            enemies.push(this.giftFactory(d[0], d[1], d[2]));
        }
        enemies.forEach(function(item) {
            self.stage.addChild(item);
            self.collisionManager.when(self.cube, item, function(data) {
                self.collect++;
                // am.get('ring', function(ring) {
                // ring.play()
                // })
                self.stage.removeChild(data.collide);
            })
        });
    }
    GameStage.prototype.random = function() {
        var rand;
        if (!this.lastRandomValue) {
            this.lastRandomValue = Math.random();
        } else {
            do {
                rand = Math.random();
            } while (this.lastRandomValue == rand);
            this.lastRandomValue = rand;
        }
        return this.lastRandomValue;
    }
    GameStage.prototype.spawnRandom = function() {
        var faces = [
            // front
            [0,0,1],
            // back
            [0,0,-1],
            // left
            [1,0,0],
            // right
            [-1,0,0],
            // up
            [0,1,0],
            // donw
            [0,-1,0]
        ];

        var self = this, config = this.config;
        var face = faces[self.random() * 6 >> 0];
        face = face.map(function(item) {
            if (item == 0) {
                item = ((self.random() * 3 >> 0) + 2) * config.CUBE_FIELD_SIZE
                item *= (self.random() * 2 >> 0) > 0 ? -1 : 1;
            } else {
                item * config.BOARD_WIDTH
            }
            return item;
        });
        return face;
    }

    return GameStage;
})
