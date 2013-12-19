require.config({
    baseUrl: "js",
    paths: {
        hammerjs: '../bower_components/hammerjs/dist/hammer.min'
    }
});

require(['game'], function(TetrisGame) {
    "use strict";

    var tetris, game;

    game = document.createElement('canvas');
    game.setAttribute('id', 'board')
    // game.width = window.innerWidth;
    // game.height = window.innerHeight;
    game.width = 600;
    game.height = 600;
    document.body.appendChild(game);

    tetris = new TetrisGame(game);
    tetris.run();
});
