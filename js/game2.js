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

        var mesh = new CubeMesh(-30, 0, -100, 10, Color.fromName('green'));
        this.meshes.push(mesh);

        this.ea = EAngle.fromVector(new Vector3(1, 0, 0));
    }

    SomeGame.prototype.captureKeys = function(e) {
        var self = this;
        var p, c;
        var ea = this.ea;
        ea = ea.fromVector(this.cube.rotation);
        var u = function() {
            // console.log('ea', ea.toString(), ea.toVector().toString(), ea.normalize().toVector().toString());
            // c = self.cube.translation.add(new Vector3(0, 0, 10));
            // c = ea.toVector();
            // c = p.add(ea.toVector());
            // p = p.add(ea.toVector()).scale(20);
            // c = ea.toVector();
            // p = ea.toVector().scale(20);
            // c = self.cube.translation.add(new Vector3(0, 0, 10));
            c = self.cube.translation;
            // p = self.cube.translation.subtract(ea.toVector().scale(10));
            // p = ea.toVector().scale(10);
            p = self.cube.translation.add(ea.toVector())
            // c = self.cube.translation.add(ea.normalize().toVector().scale(10));
            // self.renderTwo.viewMatrix = Matrix4.lookAtLH(self.cube.eye(), self.cube.at(), Vector3.up());
            self.renderTwo.viewMatrix = Matrix4.lookAtLH(c, p, Vector3.up());
            console.log('eye', c.toString())
            console.log('at', p.toString());
            // p = c;
            self.run();
        };
        switch(e.keyCode) {
            case 37: e.preventDefault(); this.cube.translation.x -= 10; u(); break; // left
            case 39: e.preventDefault(); this.cube.translation.x += 10; u(); break; // right
            case 38: e.preventDefault(); this.cube.translation = this.cube.translation.add(this.ea.toVector().scale(10)); u(); break; // up
            case 40: e.preventDefault(); this.cube.translation = this.cube.translation.subtract(this.ea.toVector().scale(10)); u(); break; // down

                // case 81: e.preventDefault(); this.cube.translation.z += 1; break; // q
            // case 69: e.preventDefault(); this.cube.translation.z -= 1; break; // e
            // case 13: e.preventDefault(); this.stateMachine.trigger('press.enter'); break;
            case 87: e.preventDefault(); this.cube.rotation.x += 10; u(); break; // w
            case 83: e.preventDefault(); this.cube.rotation.x -= 10; u(); break; // s
            case 65: e.preventDefault(); this.cube.rotation.y -= 10; /* ea.y += 10; */ u(); break; // a
            case 68: e.preventDefault(); this.cube.rotation.y += 10; /* ea.y -= 10; */ u(); break; // d
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
