define(['shape/shape/text', 'shape/shape/cube', 'shape/mesh/cube', 'shape/color'], function(TextShape, CubeShape, CubeMesh, Color){
    function StartStage(serviceManager) {
        var config = serviceManager.config();
        var stage = serviceManager.createStage();

        // stage.addChild(new CubeShape(0, 0, 0, 200, 'red'));
        var cube = new CubeMesh(0, 0, -10, 40, Color.fromName('red'));
        cube.rotation.x = 45;
        cube.rotation.y = 45;
        cube.rotation.z = 45;
        stage.addChild(cube);

        var cube = new CubeMesh(100, 0, 0, 40, Color.fromName('blue'));
        cube.rotation.x = 45;
        stage.addChild(cube);

        var cube = new CubeMesh(0, 100, 0, 40, Color.fromName('green'));
        stage.addChild(cube);
        var cube = new CubeMesh(100, 100, 0, 40, Color.fromName('orange'));
        stage.addChild(cube);

        this.stage = stage;
    }
    StartStage.prototype.tick = function() {
        this.stage.project();
        this.stage.render();
    }

    StartStage.prototype.updateState = function(stateMachine) {
    }

    return StartStage;
})
