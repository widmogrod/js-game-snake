define(
[
    'shape/shape/cube',
    'game/config',
    'game/action/manager',
    'state',
    'game/action/move/right',
    'game/action/move/left',
    'game/action/move/up',
    'game/action/move/down',
    'game/action/rotate/right',
    'game/action/rotate/left',
    'game/action/rotate/up',
    'game/action/rotate/down'
],
function(
    CubeShape,
    GameConfig,
    ActionManager,
    StateMachine,
    ActionMoveRight,
    ActionMoveLeft,
    ActionMoveUp,
    ActionMoveDown,
    ActionShowRightEdge,
    ActionShowLeftEdge,
    ActionShowUpEdge,
    ActionShowDownEdge
)
{
    function ServiceManager(game) {
        this.game = game;
        this.instances = {};
    }

    ServiceManager.prototype.get = function(name, func) {
        if (!this.instances.hasOwnProperty(name)) {
            this.instances[name] = func.call(this);
        }
        return this.instances[name];
    }

    ServiceManager.prototype.config = function() {
        return this.get('config', function() {
            return new GameConfig();
        })
    }
    ServiceManager.prototype.actionManager = function() {
        return this.get('actionManager', function() {
            return new ActionManager();
        })
    }
    ServiceManager.prototype.stateMachineMove = function() {
        return this.get('stateMachineMove', function() {
            return new StateMachine(this.config().state.move);
        })
    }
    ServiceManager.prototype.actionMoveRight = function() {
        return this.get('actionMoveRight', function() {
            return new ActionMoveRight(
                this.cube(),
                this.config().GAME_SPEED,
                this.config().GAME_STEP
            );
        })
    }
    ServiceManager.prototype.actionMoveLeft = function() {
        return this.get('actionMoveLeft', function() {
            return new ActionMoveLeft(
                this.cube(),
                this.config().GAME_SPEED,
                this.config().GAME_STEP
            );
        })
    }
    ServiceManager.prototype.actionMoveUp = function() {
        return this.get('actionMoveUp', function() {
            return new ActionMoveUp(
                this.cube(),
                this.config().GAME_SPEED,
                this.config().GAME_STEP
            );
        })
    }
    ServiceManager.prototype.actionMoveDown = function() {
        return this.get('actionMoveDown', function() {
            return new ActionMoveDown(
                this.cube(),
                this.config().GAME_SPEED,
                this.config().GAME_STEP
            );
        })
    }
    ServiceManager.prototype.actionShowRightEdge = function() {
        return this.get('actionShowRightEdge', function() {
            return new ActionShowRightEdge(
                this.game,
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            ).on('finish', function() {
                this.stateMachineMove().trigger('right.face.visible')
            }.bind(this));
        })
    }
    ServiceManager.prototype.actionShowLeftEdge = function() {
        return this.get('actionShowLeftEdge', function() {
            return new ActionShowLeftEdge(
                this.game,
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            ).on('finish', function() {
                this.stateMachineMove().trigger('left.face.visible')
            }.bind(this));
        })
    }
    ServiceManager.prototype.actionShowUpEdge = function() {
        return this.get('actionShowUpEdge', function() {
            return new ActionShowUpEdge(
                this.game,
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            ).on('finish', function() {
                this.stateMachineMove().trigger('up.face.visible')
            }.bind(this));
        })
    }
    ServiceManager.prototype.actionShowDownEdge = function() {
        return this.get('actionShowDownEdge', function() {
            return new ActionShowDownEdge(
                this.game,
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            ).on('finish', function() {
                this.stateMachineMove().trigger('down.face.visible')
            }.bind(this));
        })
    }
    ServiceManager.prototype.cube = function() {
        return this.get('cube', function() {
            return new CubeShape(0, 0, -this.game.boardWidth / 2, this.game.CUBE_SIZE, '#f2b139');
        })
    }

    return ServiceManager;
})
