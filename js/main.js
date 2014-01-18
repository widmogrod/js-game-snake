require.config({
    baseUrl: "js",
    paths: {
        hammerjs: '../bower_components/hammerjs/dist/hammer.min'
    }
    ,optimize: "none"
});

require(['game5'], function(TetrisGame) {
    'use strict';

    var tetris, game;

    var ratio = devicePixelRatio = window.devicePixelRatio || 1;

    game = document.createElement('canvas');
    game.setAttribute('id', 'board');
    game.width = 640 * ratio;
    game.height = 640 * ratio;
    document.body.appendChild(game);

    // Catch user events
    document.ontouchmove = function(event){
        event.preventDefault();
    }

    tetris = new TetrisGame(game);
    tetris.run();
});
