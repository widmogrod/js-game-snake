define([
    'hammerjs',
    'shape/renderer/renderer',
    'shape/render',
    'shape/viewport',
    'math/matrix4',
    'math/vector3',
    'math/eangle',
    'shape/mesh/cube',
    'shape/color'
],
function(
    Hemmer,
    Renderer,
    ShapeRender,
    Viewport,
    Matrix4,
    Vector3,
    EAngle,
    CubeMesh,
    Color
) {
    'use strict';

    function SomeGame(canvas) {
        this.renderer = new Renderer(canvas);

        this.renderMain = new ShapeRender(
            new Viewport(0, 0, 450, 225),
            this.renderer,
            Matrix4.lookAtLH(
                new Vector3(0, 0, 50),
                Vector3.zero(),
                Vector3.up()
            ).multiply(Matrix4.rotationX(-90)),
            Matrix4.perspectiveProjection(100, 100, 90)
        );
        this.renderTwo = new ShapeRender(
            new Viewport(0, 225, 450, 225),
            this.renderer,
            Matrix4.lookAtLH(
                new Vector3(0, 0, 11),
                Vector3.zero(),
                Vector3.up()
            ),
            Matrix4.perspectiveProjection(100, 100, 90)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(0, 0, 0, 10, Color.fromName('red'));

        this.meshes = []
        this.meshes.push(this.cube);

        var mesh = new CubeMesh(30, 0, 0, 10, Color.fromName('green'));
        this.meshes.push(mesh);

        var mesh = new CubeMesh(-30, 0, 19, 10, Color.fromName('green'));
        this.meshes.push(mesh);

        var mesh = new CubeMesh(-30, 0, -100, 10, Color.fromName('orange'));
        this.meshes.push(mesh);
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
        var eye = this.cube.translation.subtract(position.toVector().scale(10));
        var at = this.cube.translation.add(position.toVector());
        this.renderTwo.viewMatrix = Matrix4.lookAtLH(eye, at, Vector3.up());

        this.run();
    }
    SomeGame.prototype.run = function() {
        this.renderer.clean();
        this.renderMain.render(this.meshes);
        this.renderTwo.render(this.meshes);
        this.renderer.render();
        // requestAnimationFrame(this.run.bind(this));
    }

    return SomeGame;
});
