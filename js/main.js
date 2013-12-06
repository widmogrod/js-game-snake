require.config({
    baseUrl: "js"
});

require(['game', 'promise2'], function(TetrisGame, Promise) {
    "use strict";

    var tetris;
    tetris = new TetrisGame(document.getElementById('game'));
    window['TetrisGame'] = tetris;
    tetris.run();

    var p = new Promise(function(fulfill, reject) {
        setTimeout(function(){
            fulfill('okkkk');
        }, 1000);
    })

    p.then(function(value) {
        console.log('call:0, success', value);
    }, function(reason) {
        console.log('call:0, failure', reason);
    }).then(function(value) {
        console.log('call:1, success', value);
    }, function(reason) {
        console.log('call:1, failure', reason);
    });
});
