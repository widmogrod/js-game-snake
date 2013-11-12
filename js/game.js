define(['shape'], function(shape) {

    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        this.canvas = canvas;
        this.stage = new shape.CanvasStage(canvas);
        this.cube = new shape.CubeShape();
        this.stage.addChild(this.cube);
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'run': function(){
            this.stage.update();
        }
    };

    return TetrisGame;
});
