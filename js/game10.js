define([
    'hammerjs',
    'shape/renderer/renderer',
    'shape/render',
    'shape/viewport',
    'math/matrix4',
    'math/vector3',
    'math/quaternion',
    'shape/mesh/cube',
    'shape/mesh/coordinate',
    'shape/color',
    'game/config',
    'collision/manager',
    'collision/strategy/triangle',
    'collision/strategy/aabb',
    'state'
],
function(
    Hammer,
    Renderer,
    ShapeRender,
    Viewport,
    Matrix4,
    Vector3,
    Quaternion,
    CubeMesh,
    CoordinateMesh,
    Color,
    GameConfig,
    CollisionManager,
    CollisionStrategyTriangle,
    CollisionStrategyAABB,
    StateMachine
) {
    'use strict';

    function SomeGame(canvas) {
        this.renderer = new Renderer(canvas);

        var w = canvas.width;
        var h = canvas.height;

        var viewport = new Viewport(0, 0, w, h);
        this.engine = new ShapeRender(
            viewport,
            this.renderer,
            Matrix4.lookAtRH(
                new Vector3(0, 0, 900),
                Vector3.zero(),
                Vector3.up()
            ),
            Matrix4.perspectiveProjection(viewport.width, viewport.height, 90, 1, 1000)
        );


        this.cube = new CubeMesh(0, 0, GameConfig.BOARD_EDGE + 1/3 * GameConfig.CUBE_FIELD_SIZE, GameConfig.CUBE_FIELD_SIZE, Color.fromName('red'));
        this.meshes = []
        this.meshes.push(this.cube);

        this.bigMesh = new CubeMesh(0, 0, 0, GameConfig.BOARD_WIDTH, Color.fromName('green'));
        this.meshes.push(this.bigMesh);
    }
    SomeGame.prototype.run = function() {
        this.currentTime = Date.now();
        this.dt = (this.currentTime - this.previousTime) / 100;
        // this.dt = this.dt > .16 ? .16 : this.dt;
        this.previousTime = this.currentTime;

        this.engine.clean();
        this.engine.update(this.meshes);

        this.bigMesh.rotation.x += 1;
        this.bigMesh.rotation.y += 1;
        this.bigMesh.rotation.z += 1;

        this.cube.rotation.x += 5;
        this.cube.rotation.y += -5;
        this.cube.rotation.z += -2;

        this.engine.render(this.meshes);
        this.engine.flush();

        // requestAnimationFrame(this.run.bind(this));
        setTimeout(this.run.bind(this), 1000/30)
    }

    return SomeGame;
});
