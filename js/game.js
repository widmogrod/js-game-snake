define(['shape'], function(shape) {

    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        this.canvas = canvas;
        this.projection = new shape.Projection(270, canvas.width / 2, canvas.height / 2);
        this.stage = new shape.Canvas3DStage(this.canvas, this.projection);
        this.cube = new shape.CubeShape();
        this.stage.addChild(this.cube);
        // this.stage.addChild(new shape.EllipseShape(10,10, 70, 30));
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'update': function() {
            this.cube.projection(this.projection).rotateY(0.1);
            this.stage.update();
        },
        'run': function() {
            var self = this;

            function update() {
                self.update();
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            console.log(this);
        }
    };

    return TetrisGame;
});
