define([
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
        this.collision = new CollisionManager(new CollisionStrategyAABB());
        this.previousTime = Date.now();

        var w = canvas.width;
        var h = canvas.height;

        var viewportMain = new Viewport(0, 0, w, h);
        this.engine = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtRH(
                new Vector3(0, 0, 600),
                Vector3.zero(),
                Vector3.up()
            ),
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90, 1, 1000)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(0, 0, GameConfig.BOARD_EDGE + 1/3 * GameConfig.CUBE_FIELD_SIZE, GameConfig.CUBE_FIELD_SIZE, Color.fromName('red'));
        this.meshes = []
        this.meshes.push(this.cube);

        this.bigMesh = new CubeMesh(0, 0, 0, GameConfig.BOARD_WIDTH, Color.fromName('green'));
        this.meshes.push(this.bigMesh);
        this.collision.push(this.bigMesh)
    }
    SomeGame.prototype.captureKeys = function(e) {
        switch(e.keyCode) {
            case 37: e.preventDefault(); this.sm.trigger('press.left'); break; // left
            case 39: e.preventDefault(); this.sm.trigger('press.right'); break; // right
            case 38: e.preventDefault(); this.sm.trigger('press.up'); break; // up
            case 40: e.preventDefault(); this.sm.trigger('press.down'); break; // down
        }
    }
    SomeGame.prototype.approach = function(g, c, dt) {
        var diff = g - c;
        if (diff < dt && -diff < dt) return g;
        if (diff > dt) return c + dt;
        if (diff < dt) return c - dt;
        return g;
    }
    SomeGame.prototype.lineTo = function(from, to) {
        this.renderer.drawCline(
            this.engine.project(from),
            this.engine.project(to)
        );
    }
    SomeGame.prototype.update = function() {
        this.bigMesh.rotation.x += 1;
        this.bigMesh.rotation.y += 1;
        this.bigMesh.rotation.z += 1;

        this.cube.rotation.x += 5;
        this.cube.rotation.y += -5;
        this.cube.rotation.z += -2;
    }
    SomeGame.prototype.run = function() {
        this.currentTime = Date.now();
        this.dt = (this.currentTime - this.previousTime) / 1000;
        this.previousTime = this.currentTime;

        this.update();

        this.engine.clean();
        this.engine.update(this.meshes);
        this.engine.render(this.meshes);
        this.engine.flush();

        // requestAnimationFrame(this.run.bind(this));
        setTimeout(this.run.bind(this), 1000/30)
    }

    return SomeGame;
})
