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

    // require(['math/matrix'], function(Matrix) {
    //     var identity = Matrix.identity(3);
    //     console.log(identity.toString());
    //     var a = new Matrix(2, [1, 0, 2, -1, 3, 1]);
    //     console.log('a', a.toString());
    //     console.log('scalar', a.scalar(-1).toString());
    //     console.log('transposed', a.transpose().toString());
    //     var b = new Matrix(3, [3, 1, 2, 1, 1, 0]);
    //     console.log(b.toString());
    //     var r = a.multiply(b);
    //     console.log(r.toString());
    // });

});
