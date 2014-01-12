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

        var mesh = new CubeMesh(30, 0, 0, 10, Color.fromName('grean'));
        this.meshes.push(mesh);

        var mesh = new CubeMesh(-30, 0, 19, 10, Color.fromName('grean'));
        this.meshes.push(mesh);

        var mesh = new CubeMesh(-30, 0, -100, 10, Color.fromName('grean'));
        this.meshes.push(mesh);

    }

    SomeGame.prototype.captureKeys = function(e) {
        var self = this;
        var p, c;
        p = self.cube.translation;
        var ea = new EAngle(0, 0, 0);
        var u = function() {
            // console.log('e', ea, ea.toVector().toString());
            c = self.cube.translation.add(new Vector3(0, 0, 20));
            // c = ea.normalize().toVector().scale(38);
            // c = self.cube.translation.add(ea.normalize().toVector().scale(38));
            // self.renderTwo.viewMatrix = Matrix4.lookAtLH(self.cube.eye(), self.cube.at(), Vector3.up());
            self.renderTwo.viewMatrix = Matrix4.lookAtLH(c, p, Vector3.up());
            p = c;
            self.run();
        };
        switch(e.keyCode) {
            case 37: e.preventDefault(); this.cube.translation.x -= 10; u(); break; // left
            case 39: e.preventDefault(); this.cube.translation.x += 10; u(); break; // right
            case 38: e.preventDefault(); this.cube.translation.z -= 10; u(); break; // up
            case 40: e.preventDefault(); this.cube.translation.z += 10; u(); break; // down

                // case 81: e.preventDefault(); this.cube.translation.z += 1; break; // q
            // case 69: e.preventDefault(); this.cube.translation.z -= 1; break; // e
            // case 13: e.preventDefault(); this.stateMachine.trigger('press.enter'); break;
            case 87: e.preventDefault(); this.cube.rotation.x += 10; break; // w
            case 83: e.preventDefault(); this.cube.rotation.x -= 10; break; // s
            case 65: e.preventDefault(); this.cube.rotation.y += 10; ea.y += 1; u(); break; // a
            case 68: e.preventDefault(); this.cube.rotation.y -= 10; ea.y -= 1; u(); break; // d
            default: console.log(e.keyCode);
        }
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
