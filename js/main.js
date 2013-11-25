require.config({
    baseUrl: "js"
});

require(['game'], function(TetrisGame){
    "use strict";

    var tetris;
    tetris = new TetrisGame(document.getElementById('game'));
    tetris.run();
});
