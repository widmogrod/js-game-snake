define(function(){
    function GameConfig() {}

    GameConfig.prototype = {
        'RIGHT_ANGLE' : Math.PI / 2,
        'ANGLE_STEP': 0.01,
        'ROTATION_MARGIN' : 80,
        'GAME_STEP': 20,
        'CUBE_SIZE': 20,
        'GAME_SPEED': 2,
    }

    return GameConfig;
})
