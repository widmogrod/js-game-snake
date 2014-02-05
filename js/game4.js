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
    'collision/strategy/triangle'
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
    CollisionStrategyTriangle
) {
    'use strict';

    function SomeGame(canvas) {
        this.renderer = new Renderer(canvas);
        this.collision = new CollisionManager(new CollisionStrategyTriangle());

        var w = canvas.width;
        var h = canvas.height;

        var viewportMain = new Viewport(0, 0, w/2, h/2);
        this.engine = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtRH(
                new Vector3(0, 0, 500),
                Vector3.zero(),
                Vector3.up()
            ).multiply(Matrix4.rotationX(45).multiply(Matrix4.rotationY(45)).multiply(Matrix4.rotationZ(45))),
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90)
        );

        var viewportMain = new Viewport(w/2, 0, w/2, h/2);
        this.topRight = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtRH(
                new Vector3(0, 0, 500),
                Vector3.zero(),
                Vector3.up()
            ).multiply(Matrix4.rotationX(90)),
            Matrix4.orthogonalProjection(viewportMain.width, viewportMain.height, 90)
        );

        var viewportMain = new Viewport(w/2, w/2, w/2, h/2);
        this.bottomRight = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtRH(
                new Vector3(0, 0, 500),
                Vector3.zero(),
                Vector3.up()
             ).multiply(Matrix4.rotationY(90)),
             Matrix4.orthogonalProjection(viewportMain.width, viewportMain.height, 90)
        );

        var viewportMain = new Viewport(0, w/2, w/2, h/2);
        this.bottomLeft = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtRH(
                new Vector3(0, 0, 500),
                Vector3.zero(),
                Vector3.up()
             ),
             Matrix4.orthogonalProjection(viewportMain.width, viewportMain.height, 90)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(0, 0, GameConfig.BOARD_EDGE + GameConfig.CUBE_FIELD_SIZE, GameConfig.CUBE_FIELD_SIZE, Color.fromName('red'));
        this.cube.rotation.y = 45;

        this.meshes = []
        this.meshes.push(this.cube);

        var mesh = new CoordinateMesh(-w/2 + 50, w/2 - 50, w/2 - 50);
        mesh.scale = mesh.scale.scale(50);
        this.meshes.push(mesh);

        this.bigMesh = new CubeMesh(0, 0, 0, GameConfig.BOARD_WIDTH, Color.fromName('green'));
        this.meshes.push(this.bigMesh);
        this.collision.push(this.bigMesh)

        this.velocity = new Quaternion(45, new Vector3(0, 1, 0)).multiply(new Vector3(0, 0, -1)).v;
    }

    SomeGame.prototype.captureKeys = function(e) {
        switch(e.keyCode) {
            case 37: e.preventDefault(); this.cube.translation.x -= 10; break; // left
            case 39: e.preventDefault(); this.cube.translation.x += 10; break; // right
            case 38: e.preventDefault(); this.cube.translation = this.cube.translation.add(this.velocity.scale(10)); break; // up
            case 40: e.preventDefault(); this.cube.translation = this.cube.translation.subtract(this.velocity.scale(10)); break; // down
            case 87: e.preventDefault(); this.cube.translation.z -= 10; break; // w
            case 83: e.preventDefault(); this.cube.translation.z += 10; break; // s
        }

        this.run();
    }
    SomeGame.prototype.run = function() {
        this.renderer.clean();
        this.engine.render(this.meshes);

        var from = this.cube.translation;
        var to = this.cube.translation.add(this.velocity.scale(50));
        var self = this;

        self.bigMesh.color = Color.fromName('green');
        this.collision.raycast(from, this.velocity, 15, function() {
            console.log('collision')
            self.bigMesh.color = Color.fromName('blue');
        });

        this.renderer.drawCline(
            this.engine.project(from),
            this.engine.project(to)
        );

        this.topRight.render(this.meshes);
        this.bottomLeft.render(this.meshes);
        this.bottomRight.render(this.meshes);
        this.renderer.render();
    }

    return SomeGame;
})
