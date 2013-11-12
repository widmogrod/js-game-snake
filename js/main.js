require.config({
    baseUrl: "js"
});

require(['game'], function(TetrisGame){
    var tetris;
    tetris = new TetrisGame(document.getElementById('game'));
    tetris.run();
});
