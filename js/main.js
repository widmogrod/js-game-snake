require.config({
    baseUrl: "js",
    paths: {
        hammerjs: '../bower_components/hammerjs/dist/hammer.min'
    }
});

require(['game', 'promise2'], function(TetrisGame, Promise) {
    "use strict";

    var tetris, game;

    game = document.createElement('canvas');
    game.width = window.innerWidth;
    game.height = window.innerHeight;
    document.body.appendChild(game);

    tetris = new TetrisGame(game);
    tetris.run();

    // var p = new Promise(function(fulfill, reject) {
    //     setTimeout(function(){
    //         fulfill('okkkk');
    //     }, 1000);
    // })

    // p.then(function(value) {
    //     console.log('call:0, success', value);
    // }, function(reason) {
    //     console.log('call:0, failure', reason);
    // }).then(function(value) {
    //     console.log('call:1, success', value);
    // }, function(reason) {
    //     console.log('call:1, failure', reason);
    // });
});
