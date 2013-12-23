require.config({
    baseUrl: "js",
    paths: {
        hammerjs: '../bower_components/hammerjs/dist/hammer.min'
    }
    ,optimize: "none"
});

require(['game'], function(TetrisGame) {
    "use strict";

    var tetris, game;

    game = document.createElement('canvas');
    game.setAttribute('id', 'board')
    // game.width = window.innerWidth;
    // game.height = window.innerHeight;
    game.width = 500;
    game.height = 500;
    document.body.appendChild(game);

    tetris = new TetrisGame(game);
    tetris.run();
});
