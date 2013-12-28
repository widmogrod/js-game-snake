define(function(){
    var GameConfig;

    GameConfig = {
        'BASE_URL': window.location.href +'assets/',
        'RIGHT_ANGLE' : 90,
        'ROTATION_ANGLE_STEP': 1,
        'ROTATION_MARGIN' : 80,
        // Cube is basic shape on the board
        'CUBE_FIELD_SIZE': 40,
        'CUBE_FIELDS_ON_BOARD': 8,
        'GAME_STEP': 20,
        'GAME_SPEED': 2,
        'state': {
            'move': {
                'up': {
                    'press.left' : 'left',
                    'press.right': 'right',
                    'edge.up': 'show_up_face'
                },
                'down': {
                    'press.left' : 'left',
                    'press.right': 'right',
                    'edge.down': 'show_down_face'
                },
                'left': {
                    'press.up' : 'up',
                    'press.down': 'down',
                    'edge.left': 'show_left_face'
                },
                'right': {
                    'press.up' : 'up',
                    'press.down': 'down',
                    'edge.right': 'show_right_face'
                },
                'show_up_face': {
                    'up.face.visible': 'up'
                },
                'show_down_face': {
                    'down.face.visible': 'down'
                },
                'show_left_face': {
                    'left.face.visible': 'left'
                },
                'show_right_face': {
                    'right.face.visible': 'right'
                },
                'start': {
                    'press.enter' : 'play'
                },
                'play' : {
                    // 'cube.suiside': 'end',
                    // 'cube.success': 'end',
                    // 'press.pause' : 'stop'
                    'press.right' : 'right',
                    'press.left'  : 'left',
                    'press.up'    : 'up',
                    'press.down'  : 'down'
                },
                'end': {
                    'press.restart' : 'start'
                },
                'stop': {
                    'press.escape': 'start'
                },
                '*': {
                    'found.gifts': 'end',
                    'init': 'start'
                }
            }
        }
    }

    GameConfig.BOARD_WIDTH = GameConfig.CUBE_FIELD_SIZE * GameConfig.CUBE_FIELDS_ON_BOARD;
    GameConfig.BOARD_EDGE = (GameConfig.BOARD_WIDTH / 2) - GameConfig.CUBE_FIELD_SIZE >> 0;

    return GameConfig;
})
