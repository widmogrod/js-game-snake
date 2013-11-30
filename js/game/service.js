define(
[
    'shape/shape/cube',
    'game/config',
    'game/action/manager',
    'game/action/move/right',
    'game/action/move/left',
    'game/action/move/up',
    'game/action/move/down'
],
function(
    CubeShape,
    GameConfig,
    ActionManager,
    ActionMoveRight,
    ActionMoveLeft,
    ActionMoveUp,
    ActionMoveDown
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
    ServiceManager.prototype.cube = function() {
        return this.get('cube', function() {
            return new CubeShape(0, 0, -this.game.boardWidth / 2, this.game.CUBE_SIZE, '#f2b139');
        })
    }

    return ServiceManager;
})
