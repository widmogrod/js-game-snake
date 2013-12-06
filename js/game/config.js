define(function(){
    function GameConfig() {}

    GameConfig.prototype = {
        'RIGHT_ANGLE' : Math.PI / 2,
        'ROTATION_ANGLE_STEP': 0.01,
        'ROTATION_MARGIN' : 80,
        'GAME_STEP': 20,
        'CUBE_SIZE': 20,
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
                }
            }
        }
    }

    return GameConfig;
})
