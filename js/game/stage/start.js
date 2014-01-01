define(['shape/shape/text', 'shape/shape/cube'], function(TextShape, CubeShape){
    function StartStage(serviceManager) {
        var config = serviceManager.config();
        var stage = serviceManager.createStage();

        stage.addChild(new CubeShape(0, 0, 0, 200, 'red'));
        // stage.addChild(new TextShape(
        //     -120, 0, 10,
        //     'To start game hit enter or swipe',
        //     {
        //         size: '20px',
        //         color: 'black'
        //     }
        // ));

        this.stage = stage;
    }
    StartStage.prototype.tick = function() {
        this.stage.render();
    }

    StartStage.prototype.updateState = function(stateMachine) {
    }

    return StartStage;
})
