require.config({
    baseUrl: "js",
    paths: {
        hammerjs: '../bower_components/hammerjs/dist/hammer.min'
    }
    ,optimize: "none"
});

require(['game4'], function(TetrisGame) {
    'use strict';

    var tetris, game;

    game = document.createElement('canvas');
    game.setAttribute('id', 'board');
    game.width = 450;
    game.height = 450;
    document.body.appendChild(game);

    // Catch user events
    document.ontouchmove = function(event){
        event.preventDefault();
    }

    tetris = new TetrisGame(game);
    tetris.run();
});
