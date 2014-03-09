define([
    'shape/renderer/renderer',
    'shape/render',
    'shape/viewport',
    'math/matrix4',
    'math/vector3',
    'math/quaternion',
    'shape/mesh/cube',
    'shape/mesh/triangle',
    'shape/mesh/coordinate',
    'shape/color',
    'game/config',
    'collision/manager',
    'collision/strategy/triangle',
    'collision/strategy/aabb',
    'state',
    'shape/texture/image',
    'shape/texture/color'
],
function(
    Renderer,
    ShapeRender,
    Viewport,
    Matrix4,
    Vector3,
    Quaternion,
    CubeMesh,
    TriangleMesh,
    CoordinateMesh,
    Color,
    GameConfig,
    CollisionManager,
    CollisionStrategyTriangle,
    CollisionStrategyAABB,
    StateMachine,
    ImageTexture,
    ColorTexture
) {
    'use strict';

    function SomeGame(canvas) {
        this.renderer = new Renderer(canvas);
        this.collision = new CollisionManager(new CollisionStrategyAABB());
        this.previousTime = Date.now();


        var w = canvas.width * .6;
        var h = canvas.height;
        var pw = canvas.width * .3;
        var ph = canvas.height * .3;

        this.cameraA =  Matrix4.lookAtRH(
            new Vector3(0, 0, 300),
            Vector3.zero(),
            Vector3.up()
        );
        this.viewportA = new Viewport(pw, 0, w, h);

        this.cameraX = this.cameraA.multiply(Matrix4.rotationX(90));
        this.viewportX = new Viewport(0, 0, pw, ph);

        this.cameraY = this.cameraA.multiply(Matrix4.rotationY(90));
        this.viewportY = new Viewport(0, ph, pw, ph);

        this.cameraZ = Matrix4.lookAtRH(
            new Vector3(0, 0, -300),
            Vector3.zero(),
            Vector3.up()
        );
        this.viewportZ = new Viewport(0, ph * 2, pw, ph);

        this.engine = new ShapeRender(
            this.viewportA,
            this.renderer,
            this.cameraA,
            Matrix4.perspectiveProjection(this.viewportA.width, this.viewportA.height, 90, 1, 1000)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(0, 0, GameConfig.BOARD_EDGE + 1/3 * GameConfig.CUBE_FIELD_SIZE, GameConfig.CUBE_FIELD_SIZE, Color.fromName('red'));
        this.meshes = []
        // this.meshes.push(this.cube);

        this.texture = new ImageTexture(location.href + 'assets/texture3.jpg', 512, 512);
        this.triangle = new TriangleMesh(0, 0, 0, 100, this.texture);
        this.meshes.push(this.triangle);

        this.triangle2 = new TriangleMesh(0, 0, 80, 190, new ColorTexture(Color.fromName('blue')));
        // this.meshes.push(this.triangle2);

        this.bigMesh = new CubeMesh(0, 0, -30, 50, new ImageTexture(location.href + 'assets/texture3.jpg', 512, 512));
        // this.bigMesh = new CubeMesh(0, 0, -30, 50, new ImageTexture('assets/texture2.jpg', 768,512));
        // this.meshes.push(this.bigMesh);
    }
    SomeGame.prototype.captureKeys = function(e) {
        switch(e.keyCode) {
            case 37: e.preventDefault(); this.triangle.translation.x -=10; break; // left
            case 39: e.preventDefault(); this.triangle.translation.x +=10; break; // right
            case 38: e.preventDefault(); this.triangle.translation.y +=10; break; // up
            case 40: e.preventDefault(); this.triangle.translation.y -=10; break; // down
            case 65: e.preventDefault(); this.triangle.rotation.y +=10; break;
            case 68: e.preventDefault(); this.triangle.rotation.y -=10; break;
            case 87: e.preventDefault(); this.triangle.rotation.x +=10; break;
            case 83: e.preventDefault(); this.triangle.rotation.x -=10; break;
            case 32: e.preventDefault();
                this.triangle.rotation = Vector3.zero();
                this.triangle.translation = Vector3.zero();
                break;
            case 9: e.preventDefault(); this.run(); break;
            default: console.log(e.keyCode);
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
        this.bigMesh.rotation.x += 10;
        this.bigMesh.rotation.y += 10;
        this.bigMesh.rotation.z += 5;

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

        this.engine.viewMatrix = this.cameraA;
        this.engine.viewport = this.viewportA;
        this.engine.viewportMatrix = Matrix4.viewportMatrix(this.engine.viewport.width, this.engine.viewport.height);
        this.engine.render(this.meshes);

//         this.engine.viewMatrix = this.cameraX;
//         this.engine.viewport = this.viewportX;
//         this.engine.viewportMatrix = Matrix4.viewportMatrix(this.engine.viewport.width, this.engine.viewport.height);
//         this.engine.render(this.meshes);
//
//         this.engine.viewMatrix = this.cameraY;
//         this.engine.viewport = this.viewportY;
//         this.engine.viewportMatrix = Matrix4.viewportMatrix(this.engine.viewport.width, this.engine.viewport.height);
//         this.engine.render(this.meshes);
//
//         this.engine.viewMatrix = this.cameraZ;
//         this.engine.viewport = this.viewportZ;
//         this.engine.viewportMatrix = Matrix4.viewportMatrix(this.engine.viewport.width, this.engine.viewport.height);
//         this.engine.render(this.meshes);
//
        this.engine.flush();

        // requestAnimationFrame(this.run.bind(this));
        // setTimeout(this.run.bind(this), 1000/30)
    }

    return SomeGame;
})
