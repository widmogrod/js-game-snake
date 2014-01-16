define([
    'shape/renderer/renderer',
    'shape/render',
    'shape/viewport',
    'math/matrix4',
    'math/vector3',
    'math/eangle',
    'math/quaternion',
    'shape/mesh/cube',
    'shape/color',
    'game/config',
    'shape/collision/manager',
    'shape/collision/strategy/meshcube'
],
function(
    Renderer,
    ShapeRender,
    Viewport,
    Matrix4,
    Vector3,
    EAngle,
    Quaternion,
    CubeMesh,
    Color,
    GameConfig,
    CollisionManager,
    CollisionStrategyMeshCube
) {
    'use strict';

    function SomeGame(canvas) {
        this.renderer = new Renderer(canvas);
        this.collision = new CollisionManager(new CollisionStrategyMeshCube());

        var viewportMain = new Viewport(0, 0, 450, 450);
        this.engine = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtLH(
                new Vector3(0, 0, 500),
                Vector3.zero(),
                Vector3.up()
            ),
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(0, 0, GameConfig.BOARD_EDGE + GameConfig.CUBE_FIELD_SIZE, GameConfig.CUBE_FIELD_SIZE, Color.fromName('red'));

        this.meshes = []
        this.meshes.push(this.cube);

        var mesh = new CubeMesh(0, 0, 0, GameConfig.BOARD_WIDTH, Color.fromName('green'));
        this.meshes.push(mesh);

        var self = this;
        this.collision.when(this.cube, mesh, function(e) {
            e.preventRelease = true;
            console.log('we have interacion', e);
        });

        var v = new Vector3(1, 0, 0);
        var q1 = new Quaternion(new Vector3(0, 0, 1), 90);
        var q2 = new Quaternion(new Vector3(0, 1, 0), 90);
        var q3 = new Quaternion(new Vector3(1, 0, 0), 90);


        console.log('q1', q1.toString(), v.toString(), q1.multiply(v).toString());
        console.log('q2', q2.toString(), v.toString(), q2.multiply(v).toString());
        console.log('q3', q3.toString(), v.toString(), q3.multiply(v).toString());



        this.velocity = new Vector3(0, 10, 0);
    }

    SomeGame.prototype.captureKeys = function(e) {
        // var position = EAngle.fromVector(this.cube.rotation);

        switch(e.keyCode) {
            case 37: e.preventDefault(); this.cube.translation.x -= 10; break; // left
            case 39: e.preventDefault(); this.cube.translation.x += 10; break; // right
            case 38: e.preventDefault(); this.cube.translation = this.cube.translation.add(this.velocity); break; // up
            case 40: e.preventDefault(); this.cube.translation.y -= 10; break; // down
            case 87: e.preventDefault(); this.cube.translation.z -= 10; break; // w
            case 83: e.preventDefault(); this.cube.translation.z += 10; break; // s
            default: console.log(e.keyCode);
        }

        // Bind camera orientation to the cube
        // var eye = this.cube.translation.subtract(position.toVector().scale(400));
        // var at = this.cube.translation.add(position.toVector());
        // this.engine.viewMatrix = Matrix4.lookAtLH(eye, at, Vector3.up());

        this.run();
    }
    SomeGame.prototype.run = function() {
        this.renderer.clean();
        this.engine.render(this.meshes);
        this.collision.run();
        this.renderer.render();
        // requestAnimationFrame(this.run.bind(this));
    }

    return SomeGame;
})
