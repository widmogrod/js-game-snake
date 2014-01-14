define([
    'shape/renderer/renderer',
    'shape/render',
    'shape/viewport',
    'math/matrix4',
    'math/vector3',
    'math/eangle',
    'shape/mesh/cube',
    'shape/color',
    'game/config',
    'shape/utils/assets'
],
function(
    Renderer,
    ShapeRender,
    Viewport,
    Matrix4,
    Vector3,
    EAngle,
    CubeMesh,
    Color,
    GameConfig,
    AssetUtil
) {
    'use strict';

    function SomeGame(canvas) {
        this.assets = new AssetUtil(GameConfig.BASE_URL);
        this.assets.loadBlenderMesh('cube', 'cube.dae');
        this.assets.loadBlenderMesh('monkey', 'monkey.dae');

        this.renderer = new Renderer(canvas);

        var viewportMain = new Viewport(0, 0, 450, 450);
        this.engine = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtLH(
                new Vector3(0, 0, 200),
                Vector3.zero(),
                Vector3.up()
            ),
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(0, 0, GameConfig.BOARD_EDGE, GameConfig.CUBE_FIELD_SIZE, Color.fromName('red'));

        this.meshes = []
        this.meshes.push(this.cube);

        var mesh = new CubeMesh(0, 0, 0, GameConfig.BOARD_WIDTH, Color.fromName('green'));
        // this.meshes.push(mesh);

        var self = this;
        this.assets.get('cube', function(mesh) {
            console.log('cube', mesh);
            // self.meshes.push(mesh)
        })
        this.assets.get('monkey', function(mesh) {
            // console.log('monkey', mesh);
            mesh.scale.x = 100;
            mesh.scale.y = 100;
            mesh.scale.z = 100;
            self.meshes.push(mesh)
        })
    }

    SomeGame.prototype.captureKeys = function(e) {
        var position = EAngle.fromVector(this.cube.rotation);

        switch(e.keyCode) {
            case 37: e.preventDefault(); this.cube.rotation.y -= 10; break; // left
            case 39: e.preventDefault(); this.cube.rotation.y += 10; break; // right
            case 38: e.preventDefault(); this.cube.translation = this.cube.translation.add(position.toVector().scale(10)); break; // up
            case 40: e.preventDefault(); this.cube.translation = this.cube.translation.subtract(position.toVector().scale(10)); break; // down
            default: console.log(e.keyCode);
        }

        // Bind camera orientation to the cube
        var eye = this.cube.translation.subtract(position.toVector().scale(400));
        var at = this.cube.translation.add(position.toVector());
        this.engine.viewMatrix = Matrix4.lookAtLH(eye, at, Vector3.up());

        this.run();
    }
    SomeGame.prototype.run = function() {
        this.renderer.clean();
        this.engine.render(this.meshes);
        this.renderer.render();
        // requestAnimationFrame(this.run.bind(this));
    }

    return SomeGame;
})
