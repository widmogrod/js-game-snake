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
        this.collision = new CollisionManager(new CollisionStrategyAABB());
        // this.collision = new CollisionManager(new CollisionStrategyTriangle());

        var w = canvas.width;
        var h = canvas.height;

        var viewportMain = new Viewport(0, 0, w, h);
        this.engine = new ShapeRender(
            viewportMain,
            this.renderer,
            Matrix4.lookAtRH(
                new Vector3(0, 0, 1000),
                Vector3.zero(),
                Vector3.up()
            ),//.multiply(Matrix4.rotationX(-45)).multiply(Matrix4.rotationZ(-45)).multiply(Matrix4.rotationY(-45)),
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(-400, 200, GameConfig.BOARD_EDGE + 1/3 * GameConfig.CUBE_FIELD_SIZE, GameConfig.CUBE_FIELD_SIZE * 5, Color.fromName('red'));
        this.meshes = []
        // this.meshes.push(this.cube);

        this.bigMesh = new CubeMesh(0, 0, 0, GameConfig.BOARD_WIDTH, Color.fromName('green'));
        this.meshes.push(this.bigMesh);
        this.collision.push(this.bigMesh)

        this.velocity = 1;
        this.up = Vector3.up();
        this.cross = Vector3.forward();
        this.direction = new Vector3(0, 0, -1);
        this.rotation = new Vector3(0, 1, 0);
        this.fromSide =  Vector3.zero();

        Hammer(document, {
            release: false,
            drag_lock_to_axis: true
        })
        .on('drag', function(e) {
            e.gesture.preventDefault();
            switch(e.gesture.direction) {
                case 'left': this.sm.trigger('press.left'); break;
                case 'right': this.sm.trigger('press.right'); break;
                case 'up': this.sm.trigger('press.up'); break;
                case 'down': this.sm.trigger('press.down'); break;
            }
        }.bind(this));


        this.sm = new StateMachine({
            'falling': {
                'ray.hit': 'climbing',
                'ray.miss': 'falling',
                'press.left': 'left',
                'press.right': 'right',
                'press.up': 'up',
                'press.down': 'down',
            },
            'climbing': {
                // 'ray.hit': 'climbing',
                'ray.miss': 'falling',
                'press.left': 'left',
                'press.right': 'right'
            },
            'up': {
                'ray.hit': 'climbing',
                'ray.miss': 'falling',
                'press.left': 'left',
                'press.right': 'right'
            },
            'down': {
                'ray.hit': 'climbing',
                'ray.miss': 'falling',
                'press.left': 'left',
                'press.right': 'right'
            },
            'left': {
                'ray.hit': 'climbing',
                'ray.miss': 'falling',
                'press.up': 'up',
                'press.down': 'down'
            },
            'right': {
                'ray.hit': 'climbing',
                'ray.miss': 'falling',
                'press.up': 'up',
                'press.down': 'down'
            }
        });

        this.sm.on('enter:right', function(e){
            var cross = this.direction.cross(this.rotation);
            this.direction = new Quaternion(-90, cross).multiply(this.direction).v;
            this.rotation = new Quaternion(-90, cross).multiply(this.rotation).v;
        }.bind(this))
        this.sm.on('enter:left', function(e){
            var cross = this.direction.cross(this.rotation);
            this.direction = new Quaternion(90, cross).multiply(this.direction).v;
            this.rotation = new Quaternion(90, cross).multiply(this.rotation).v;
        }.bind(this));
        this.sm.on('enter:up', function(e, from){
            var sign = from === 'left' ? -1 : 1;
            var cross = this.direction.cross(this.rotation);
            this.direction = new Quaternion(sign * 90, cross).multiply(this.direction).v;
            this.rotation = new Quaternion(sign * 90, cross).multiply(this.rotation).v;
        }.bind(this));
        this.sm.on('enter:down', function(e, from){
            var sign = from === 'left' ? 1 : -1;
            var cross = this.direction.cross(this.rotation);
            this.direction = new Quaternion(sign * 90, cross).multiply(this.direction).v;
            this.rotation = new Quaternion(sign * 90, cross).multiply(this.rotation).v;
        }.bind(this));
        this.sm.on('enter:falling', function(e){
            // console.log('falling')
            var dir = new Quaternion(90, this.rotation).multiply(this.direction).v;
            var cross = dir.cross(this.rotation);
            var dot = cross.dot(this.up) >> 0;
            this.fromSide = this.cross.clone();
            this.cross = cross;
            this.up = (dot != 0) ? dir.scale(dot).normalize() : this.up;
            this.direction = dir;
            this.step = 0;
        }.bind(this));
        this.sm.on('enter:climbing', function(e){
            // console.log('climb')
            // var dir = new Quaternion(-90, this.rotation).multiply(this.direction).v;
            // var cross = dir.cross(this.rotation);
            // var dot = cross.dot(this.up) >> 0;
            // this.fromSide = this.cross.clone();
            // this.cross = cross;
            // this.up = (dot != 0) ? dir.scale(dot).normalize() : this.up;
            // this.direction = dir;
            // this.step = 0;
            // console.log(this.direction);
            this.direction = new Quaternion(-90, this.rotation).multiply(this.direction).v
        }.bind(this));
        this.sm.on('change', function(e, from, to) {
            this.velocity = 0;
            // this.step = 0;
        }.bind(this))
        this.sm.state = 'falling';
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
    SomeGame.prototype.doCollision = function() {
        var goal = 5;
        this.velocity = this.approach(goal, this.velocity, this.dt * 20);
        // this.velocity = 5;
        this.cube.translation = this.cube.translation.add(this.direction.scale(this.velocity))

        var self = this;
        var from = this.cube.translation;
        var toFrontDirection = this.direction;
        var toGroundDirection = new Quaternion(90, this.rotation).multiply(this.direction).v;

        var rayFront = this.collision.raycast(from, toFrontDirection);
        var rayGround = this.collision.raycast(from, toGroundDirection);

        var hitCloseFront = rayFront.intersections.length && rayFront.intersections[0].distance <= 20;
        var hitCloseGround = rayGround.intersections.length && rayGround.intersections[0].distance <= 20;
        var hitFarFront = rayFront.intersections.length;
        var hitFarGround = rayGround.intersections.length;

        if (hitCloseFront) {
            this.sm.trigger('ray.hit');
        } else if (hitCloseGround) {
        } else if (hitFarFront) {
        } else if (!hitFarGround) {
            this.cube.translation = this.cube.translation.add(toGroundDirection.scale(20));
            this.cube.translation = this.cube.translation.add(toFrontDirection.scale(20));
            this.sm.trigger('ray.miss');
        }

        this.lineTo(from, from.add(toGroundDirection.scale(50)))

        this.step = this.approach(1, this.step, this.dt/2);
        var v = new Quaternion(90,this.fromSide).slerp(new Quaternion(90, this.cross),  this.step).v;
        var eye = this.bigMesh.translation.add(v.scale(1000));
        var at = Vector3.zero();
        this.engine.viewMatrix = Matrix4.lookAtRH(eye, at, this.up);
    }
    SomeGame.prototype.lineTo = function(from, to) {
        this.renderer.drawCline(
            this.engine.project(from),
            this.engine.project(to)
        );
    }
    SomeGame.prototype.doTest = function() {
        var object = this.bigMesh;
        var test = new CollisionStrategyAABB();
        var manager = new CollisionManager(test);
        manager.push(object);

        var data =[
            {o: new Vector3(0, 0, -400), d: new Vector3(0,0,1)},
            {o: new Vector3(0, 0, 400), d: new Vector3(0,0,-1)},
            {o: new Vector3(0, 400, 0), d: new Vector3(0,-1,0)},
            {o: new Vector3(0, 0,0), d: new Vector3(-0.707,0,0.707)},
            {o: new Vector3(0, 0,0), d: new Vector3(0.707,0,-0.707)},
            {o: new Vector3(0, 0,0), d: new Vector3(-0.707,0,-0.707)}
        ];

        data.forEach(function(i) {
            var ray = manager.raycast(i.o, i.d);
            if (ray.intersections.length) {
                this.lineTo(ray.origin, ray.intersections[0].point);
            }
        }.bind(this));
    }
    SomeGame.prototype.run = function() {
        this.currentTime = Date.now();
        this.dt = (this.currentTime - this.previousTime) / 100;
        this.dt = this.dt > .16 ? .16 : this.dt;
        this.previousTime = this.currentTime;

        this.renderer.clean();
        this.engine.render(this.meshes);
        // this.doCollision();
        // this.doTest();
        // var p1= new Vector3(-30, 14, 0);
        // var p2= new Vector3(89, 16, 0);
        // var p3= new Vector3(64, 196, 0);
        // var fn = p2.subtract(p1).cross(p3.subtract(p1)).normalize();
        // p1 = this.engine.project(p1);
        // p2 = this.engine.project(p2);
        // p3 = this.engine.project(p3);
        //
        // this.renderer.color = Color.fromName('green')
        // this.renderer.fillTriangle2(p1, p2, p3, fn);
        //
        // var p1= new Vector3(30, 10, 0);
        // var p2= new Vector3(-100, 0, 0);
        // var p3= new Vector3(-90, 200, 0);
        // var fn = p2.subtract(p1).cross(p3.subtract(p1)).normalize();
        // p1 = this.engine.project(p1);
        // p2 = this.engine.project(p2);
        // p3 = this.engine.project(p3);
        //
        // this.renderer.color = Color.fromName('blue')
        // this.renderer.fillTriangle2(p1, p2, p3, fn);
        // this.renderer.fillTriangle(p1, p2, p3, fn);
        //
        this.renderer.render();

        this.bigMesh.rotation.x += 1;
        this.bigMesh.rotation.y += 1;
        this.bigMesh.rotation.z += 1;

        this.cube.rotation.x += 1;
        this.cube.rotation.y += 1;
        this.cube.rotation.z += 1;

        // requestAnimationFrame(this.run.bind(this));
        setTimeout(this.run.bind(this), 1000/10)
    }

    return SomeGame;
});
