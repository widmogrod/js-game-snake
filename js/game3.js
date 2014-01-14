define([
    'shape/renderer/renderer',
    'shape/render',
    'shape/viewport',
    'math/matrix4',
    'math/vector3',
    'math/eangle',
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
    Color,
    GameConfig,
    AssetUtil
) {
    'use strict';

    function SomeGame(canvas) {
        this.assets = new AssetUtil(GameConfig.BASE_URL);
        this.assets.loadBlenderMesh('monkey', 'monkey.dae');
        this.assets.loadBlenderMesh('cube', 'cube.dae');

        this.renderer = new Renderer(canvas);

        var viewportMain = new Viewport(0, 0, 450, 450);
        this.engine = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtLH(
                new Vector3(0, 0, 700),
                Vector3.zero(),
                Vector3.up()
            ),
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.meshes = []
        this.rotation = new Vector3(0, 0, 0);

        var self = this;
        this.assets.get('monkey', function(mesh) {
            mesh.scale.x = 10;
            mesh.scale.y = 10;
            mesh.scale.z = 10;
            self.meshes.push(mesh)
        })
        this.assets.get('cube', function(mesh) {
            mesh.translation.x = 20;
            self.meshes.push(mesh)
        })
    }

    SomeGame.prototype.captureKeys = function(e) {
        var position = EAngle.fromVector(this.rotation);

        switch(e.keyCode) {
            case 37: e.preventDefault(); this.rotation.y -= 10; break; // left
            case 39: e.preventDefault(); this.rotation.y += 10; break; // right
        }

        // Bind camera orientation to the player
        var eye = position.toVector().scale(30);
        var at = position.toVector();
        this.engine.viewMatrix = Matrix4.lookAtLH(eye, at, Vector3.up());

        this.run();
    }
    SomeGame.prototype.run = function() {
        this.renderer.clean();
        this.engine.render(this.meshes);
        this.renderer.render();
    }

    return SomeGame;
})
