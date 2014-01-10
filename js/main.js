
/*! Hammer.JS - v1.0.5 - 2013-04-07
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(t,e){function n(){if(!i.READY){i.event.determineEventTypes();for(var t in i.gestures)i.gestures.hasOwnProperty(t)&&i.detection.register(i.gestures[t]);i.event.onTouch(i.DOCUMENT,i.EVENT_MOVE,i.detection.detect),i.event.onTouch(i.DOCUMENT,i.EVENT_END,i.detection.detect),i.READY=!0}}var i=function(t,e){return new i.Instance(t,e||{})};i.defaults={stop_browser_behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},i.HAS_POINTEREVENTS=navigator.pointerEnabled||navigator.msPointerEnabled,i.HAS_TOUCHEVENTS="ontouchstart"in t,i.MOBILE_REGEX=/mobile|tablet|ip(ad|hone|od)|android/i,i.NO_MOUSEEVENTS=i.HAS_TOUCHEVENTS&&navigator.userAgent.match(i.MOBILE_REGEX),i.EVENT_TYPES={},i.DIRECTION_DOWN="down",i.DIRECTION_LEFT="left",i.DIRECTION_UP="up",i.DIRECTION_RIGHT="right",i.POINTER_MOUSE="mouse",i.POINTER_TOUCH="touch",i.POINTER_PEN="pen",i.EVENT_START="start",i.EVENT_MOVE="move",i.EVENT_END="end",i.DOCUMENT=document,i.plugins={},i.READY=!1,i.Instance=function(t,e){var r=this;return n(),this.element=t,this.enabled=!0,this.options=i.utils.extend(i.utils.extend({},i.defaults),e||{}),this.options.stop_browser_behavior&&i.utils.stopDefaultBrowserBehavior(this.element,this.options.stop_browser_behavior),i.event.onTouch(t,i.EVENT_START,function(t){r.enabled&&i.detection.startDetect(r,t)}),this},i.Instance.prototype={on:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.addEventListener(n[i],e,!1);return this},off:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.removeEventListener(n[i],e,!1);return this},trigger:function(t,e){var n=i.DOCUMENT.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e;var r=this.element;return i.utils.hasParent(e.target,r)&&(r=e.target),r.dispatchEvent(n),this},enable:function(t){return this.enabled=t,this}};var r=null,o=!1,s=!1;i.event={bindDom:function(t,e,n){for(var i=e.split(" "),r=0;i.length>r;r++)t.addEventListener(i[r],n,!1)},onTouch:function(t,e,n){var a=this;this.bindDom(t,i.EVENT_TYPES[e],function(c){var u=c.type.toLowerCase();if(!u.match(/mouse/)||!s){(u.match(/touch/)||u.match(/pointerdown/)||u.match(/mouse/)&&1===c.which)&&(o=!0),u.match(/touch|pointer/)&&(s=!0);var h=0;o&&(i.HAS_POINTEREVENTS&&e!=i.EVENT_END?h=i.PointerEvent.updatePointer(e,c):u.match(/touch/)?h=c.touches.length:s||(h=u.match(/up/)?0:1),h>0&&e==i.EVENT_END?e=i.EVENT_MOVE:h||(e=i.EVENT_END),h||null===r?r=c:c=r,n.call(i.detection,a.collectEventData(t,e,c)),i.HAS_POINTEREVENTS&&e==i.EVENT_END&&(h=i.PointerEvent.updatePointer(e,c))),h||(r=null,o=!1,s=!1,i.PointerEvent.reset())}})},determineEventTypes:function(){var t;t=i.HAS_POINTEREVENTS?i.PointerEvent.getEvents():i.NO_MOUSEEVENTS?["touchstart","touchmove","touchend touchcancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],i.EVENT_TYPES[i.EVENT_START]=t[0],i.EVENT_TYPES[i.EVENT_MOVE]=t[1],i.EVENT_TYPES[i.EVENT_END]=t[2]},getTouchList:function(t){return i.HAS_POINTEREVENTS?i.PointerEvent.getTouchList():t.touches?t.touches:[{identifier:1,pageX:t.pageX,pageY:t.pageY,target:t.target}]},collectEventData:function(t,e,n){var r=this.getTouchList(n,e),o=i.POINTER_TOUCH;return(n.type.match(/mouse/)||i.PointerEvent.matchType(i.POINTER_MOUSE,n))&&(o=i.POINTER_MOUSE),{center:i.utils.getCenter(r),timeStamp:(new Date).getTime(),target:n.target,touches:r,eventType:e,pointerType:o,srcEvent:n,preventDefault:function(){this.srcEvent.preventManipulation&&this.srcEvent.preventManipulation(),this.srcEvent.preventDefault&&this.srcEvent.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return i.detection.stopDetect()}}}},i.PointerEvent={pointers:{},getTouchList:function(){var t=this,e=[];return Object.keys(t.pointers).sort().forEach(function(n){e.push(t.pointers[n])}),e},updatePointer:function(t,e){return t==i.EVENT_END?this.pointers={}:(e.identifier=e.pointerId,this.pointers[e.pointerId]=e),Object.keys(this.pointers).length},matchType:function(t,e){if(!e.pointerType)return!1;var n={};return n[i.POINTER_MOUSE]=e.pointerType==e.MSPOINTER_TYPE_MOUSE||e.pointerType==i.POINTER_MOUSE,n[i.POINTER_TOUCH]=e.pointerType==e.MSPOINTER_TYPE_TOUCH||e.pointerType==i.POINTER_TOUCH,n[i.POINTER_PEN]=e.pointerType==e.MSPOINTER_TYPE_PEN||e.pointerType==i.POINTER_PEN,n[t]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}},i.utils={extend:function(t,n,i){for(var r in n)t[r]!==e&&i||(t[r]=n[r]);return t},hasParent:function(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1},getCenter:function(t){for(var e=[],n=[],i=0,r=t.length;r>i;i++)e.push(t[i].pageX),n.push(t[i].pageY);return{pageX:(Math.min.apply(Math,e)+Math.max.apply(Math,e))/2,pageY:(Math.min.apply(Math,n)+Math.max.apply(Math,n))/2}},getVelocity:function(t,e,n){return{x:Math.abs(e/t)||0,y:Math.abs(n/t)||0}},getAngle:function(t,e){var n=e.pageY-t.pageY,i=e.pageX-t.pageX;return 180*Math.atan2(n,i)/Math.PI},getDirection:function(t,e){var n=Math.abs(t.pageX-e.pageX),r=Math.abs(t.pageY-e.pageY);return n>=r?t.pageX-e.pageX>0?i.DIRECTION_LEFT:i.DIRECTION_RIGHT:t.pageY-e.pageY>0?i.DIRECTION_UP:i.DIRECTION_DOWN},getDistance:function(t,e){var n=e.pageX-t.pageX,i=e.pageY-t.pageY;return Math.sqrt(n*n+i*i)},getScale:function(t,e){return t.length>=2&&e.length>=2?this.getDistance(e[0],e[1])/this.getDistance(t[0],t[1]):1},getRotation:function(t,e){return t.length>=2&&e.length>=2?this.getAngle(e[1],e[0])-this.getAngle(t[1],t[0]):0},isVertical:function(t){return t==i.DIRECTION_UP||t==i.DIRECTION_DOWN},stopDefaultBrowserBehavior:function(t,e){var n,i=["webkit","khtml","moz","ms","o",""];if(e&&t.style){for(var r=0;i.length>r;r++)for(var o in e)e.hasOwnProperty(o)&&(n=o,i[r]&&(n=i[r]+n.substring(0,1).toUpperCase()+n.substring(1)),t.style[n]=e[o]);"none"==e.userSelect&&(t.onselectstart=function(){return!1})}}},i.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(t,e){this.current||(this.stopped=!1,this.current={inst:t,startEvent:i.utils.extend({},e),lastEvent:!1,name:""},this.detect(e))},detect:function(t){if(this.current&&!this.stopped){t=this.extendEventData(t);for(var e=this.current.inst.options,n=0,r=this.gestures.length;r>n;n++){var o=this.gestures[n];if(!this.stopped&&e[o.name]!==!1&&o.handler.call(o,t,this.current.inst)===!1){this.stopDetect();break}}return this.current&&(this.current.lastEvent=t),t.eventType==i.EVENT_END&&!t.touches.length-1&&this.stopDetect(),t}},stopDetect:function(){this.previous=i.utils.extend({},this.current),this.current=null,this.stopped=!0},extendEventData:function(t){var e=this.current.startEvent;if(e&&(t.touches.length!=e.touches.length||t.touches===e.touches)){e.touches=[];for(var n=0,r=t.touches.length;r>n;n++)e.touches.push(i.utils.extend({},t.touches[n]))}var o=t.timeStamp-e.timeStamp,s=t.center.pageX-e.center.pageX,a=t.center.pageY-e.center.pageY,c=i.utils.getVelocity(o,s,a);return i.utils.extend(t,{deltaTime:o,deltaX:s,deltaY:a,velocityX:c.x,velocityY:c.y,distance:i.utils.getDistance(e.center,t.center),angle:i.utils.getAngle(e.center,t.center),direction:i.utils.getDirection(e.center,t.center),scale:i.utils.getScale(e.touches,t.touches),rotation:i.utils.getRotation(e.touches,t.touches),startEvent:e}),t},register:function(t){var n=t.defaults||{};return n[t.name]===e&&(n[t.name]=!0),i.utils.extend(i.defaults,n,!0),t.index=t.index||1e3,this.gestures.push(t),this.gestures.sort(function(t,e){return t.index<e.index?-1:t.index>e.index?1:0}),this.gestures}},i.gestures=i.gestures||{},i.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(t,e){switch(t.eventType){case i.EVENT_START:clearTimeout(this.timer),i.detection.current.name=this.name,this.timer=setTimeout(function(){"hold"==i.detection.current.name&&e.trigger("hold",t)},e.options.hold_timeout);break;case i.EVENT_MOVE:t.distance>e.options.hold_threshold&&clearTimeout(this.timer);break;case i.EVENT_END:clearTimeout(this.timer)}}},i.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},handler:function(t,e){if(t.eventType==i.EVENT_END){var n=i.detection.previous,r=!1;if(t.deltaTime>e.options.tap_max_touchtime||t.distance>e.options.tap_max_distance)return;n&&"tap"==n.name&&t.timeStamp-n.lastEvent.timeStamp<e.options.doubletap_interval&&t.distance<e.options.doubletap_distance&&(e.trigger("doubletap",t),r=!0),(!r||e.options.tap_always)&&(i.detection.current.name="tap",e.trigger(i.detection.current.name,t))}}},i.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_max_touches:1,swipe_velocity:.7},handler:function(t,e){if(t.eventType==i.EVENT_END){if(e.options.swipe_max_touches>0&&t.touches.length>e.options.swipe_max_touches)return;(t.velocityX>e.options.swipe_velocity||t.velocityY>e.options.swipe_velocity)&&(e.trigger(this.name,t),e.trigger(this.name+t.direction,t))}}},i.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(n.options.drag_max_touches>0&&t.touches.length>n.options.drag_max_touches))switch(t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:if(t.distance<n.options.drag_min_distance&&i.detection.current.name!=this.name)return;i.detection.current.name=this.name,(i.detection.current.lastEvent.drag_locked_to_axis||n.options.drag_lock_to_axis&&n.options.drag_lock_min_distance<=t.distance)&&(t.drag_locked_to_axis=!0);var r=i.detection.current.lastEvent.direction;t.drag_locked_to_axis&&r!==t.direction&&(t.direction=i.utils.isVertical(r)?0>t.deltaY?i.DIRECTION_UP:i.DIRECTION_DOWN:0>t.deltaX?i.DIRECTION_LEFT:i.DIRECTION_RIGHT),this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),n.trigger(this.name+t.direction,t),(n.options.drag_block_vertical&&i.utils.isVertical(t.direction)||n.options.drag_block_horizontal&&!i.utils.isVertical(t.direction))&&t.preventDefault();break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(2>t.touches.length))switch(n.options.transform_always_block&&t.preventDefault(),t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:var r=Math.abs(1-t.scale),o=Math.abs(t.rotation);if(n.options.transform_min_scale>r&&n.options.transform_min_rotation>o)return;i.detection.current.name=this.name,this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),o>n.options.transform_min_rotation&&n.trigger("rotate",t),r>n.options.transform_min_scale&&(n.trigger("pinch",t),n.trigger("pinch"+(1>t.scale?"in":"out"),t));break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Touch={name:"touch",index:-1/0,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(t,n){return n.options.prevent_mouseevents&&t.pointerType==i.POINTER_MOUSE?(t.stopDetect(),e):(n.options.prevent_default&&t.preventDefault(),t.eventType==i.EVENT_START&&n.trigger(this.name,t),e)}},i.gestures.Release={name:"release",index:1/0,handler:function(t,e){t.eventType==i.EVENT_END&&e.trigger(this.name,t)}},"object"==typeof module&&"object"==typeof module.exports?module.exports=i:(t.Hammer=i,"function"==typeof t.define&&t.define.amd&&t.define("hammer",[],function(){return i}))})(this);
define("hammerjs", function(){});

define('game/config',[],function(){
    var GameConfig;

    GameConfig = {
        'BASE_URL': window.location.href +'assets/',
        'RIGHT_ANGLE' : 90,
        'ROTATION_ANGLE_STEP': 1,
        'ROTATION_MARGIN' : 80,
        // Cube is basic shape on the board
        'CUBE_FIELD_SIZE': 40,
        'CUBE_FIELDS_ON_BOARD': 8,
        'GAME_STEP': 20,
        'GAME_SPEED': 2,
        'state': {
            'move': {
                'up': {
                    'press.left' : 'left',
                    'press.right': 'right',
                    'edge.up': 'show_up_face'
                },
                'down': {
                    'press.left' : 'left',
                    'press.right': 'right',
                    'edge.down': 'show_down_face'
                },
                'left': {
                    'press.up' : 'up',
                    'press.down': 'down',
                    'edge.left': 'show_left_face'
                },
                'right': {
                    'press.up' : 'up',
                    'press.down': 'down',
                    'edge.right': 'show_right_face'
                },
                'show_up_face': {
                    'up.face.visible': 'up'
                },
                'show_down_face': {
                    'down.face.visible': 'down'
                },
                'show_left_face': {
                    'left.face.visible': 'left'
                },
                'show_right_face': {
                    'right.face.visible': 'right'
                },
                'start': {
                    'press.enter' : 'play'
                },
                'play' : {
                    // 'cube.suiside': 'end',
                    // 'cube.success': 'end',
                    // 'press.pause' : 'stop'
                    'press.right' : 'right',
                    'press.left'  : 'left',
                    'press.up'    : 'up',
                    'press.down'  : 'down'
                },
                'end': {
                    'press.restart' : 'start'
                },
                'stop': {
                    'press.escape': 'start'
                },
                '*': {
                    'found.gifts': 'end',
                    'init': 'start'
                }
            }
        }
    }

    GameConfig.BOARD_WIDTH = GameConfig.CUBE_FIELD_SIZE * GameConfig.CUBE_FIELDS_ON_BOARD;
    GameConfig.BOARD_EDGE = (GameConfig.BOARD_WIDTH / 2) - GameConfig.CUBE_FIELD_SIZE >> 0;

    return GameConfig;
})
;
define('shape/point/interface',[],function(){
    

    function PointInterface() {}
    PointInterface.prototype = {
        'moveBy' : function(x, y, z) {},
        'moveTo' : function(x, y, z) {}
    }

    return PointInterface;
})
;
define('shape/point/collection',['shape/point/interface'], function(PointInterface) {
    // 

    function PointCollection(center) {
        this.center = center;
        this.points = [];
        this.count = 0;
        this.area = {
            minX: center.xpos,
            minY: center.ypos,
            maxX: center.xpos,
            maxY: center.ypos
        };
    }

    PointCollection.constructor = PointCollection;
    PointCollection.prototype = new PointInterface();
    PointCollection.prototype.push = function(point) {
        this.points[this.count++] = point;
    }
    PointCollection.prototype.get = function(index) {
        return this.points[index];
    }
    PointCollection.prototype.first = function() {
        return this.get(0);
    }
    PointCollection.prototype.each = function(callback, depth) {
        var point, i
        for(i = 0; i < this.count; i++) {
            point = this.points[i];
            if (point instanceof PointCollection) {
                point.each(callback, depth + 1 || 0);
            } else {
                callback(point, i, depth);
                this.area.minX = point.xpos < this.area.minX ? point.xpos : this.area.minX;
                this.area.minY = point.ypos < this.area.minY ? point.ypos : this.area.minY;
                this.area.maxX = point.xpos < this.area.maxX ? point.xpos : this.area.maxX;
                this.area.maxY = point.ypos < this.area.maxY ? point.ypos : this.area.maxY;
            }
        }
    }
    PointCollection.prototype.moveBy = function(x, y, z) {
        this.center.x += x;
        this.center.y += y;
        this.center.z += z;
        this.each(function(point){
            point.x += x;
            point.y += y;
            point.z += z;
        });
    }
    PointCollection.prototype.moveTo = function(x, y, z) {
        this.moveBy(x - this.center.x, y - this.center.y, z - this.center.z);
    }

    return PointCollection;
})
;
define('shape/shape/interface',['shape/point/collection'], function(PointCollection) {
    

    /**
     * Shape prototype
     */
    function Shape() {
        this.state_ = this.STATE_CLEAN;
        this.points_ = new PointCollection();
    }

    Shape.constructor = Shape;
    Shape.prototype.STATE_CLEAN = 0;
    Shape.prototype.STATE_DIRTY = 1;
    Shape.prototype.STATE_RENDERED = 2;
    Shape.prototype.render = function(context) {};
    Shape.prototype.points = function() {
        return this.points_;
    };
    Shape.prototype.center = function() {
        return this.points_.center;
    };
    Shape.prototype.area = function() {
        return this.poinst_.area
    }
    Shape.prototype.state = function(state) {
        if (arguments.length) {
            this.state_ = state;
            return this;
        }
        return this.state_;
    }

    return Shape;
})
;
define('math/matrix',[],function(){
    

    function Matrix(rows, data) {
        this.rows = rows;
        this.data = arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : data;
        this.count = this.data.length;
        this.cols = this.count / this.rows;

        if (this.count % this.rows !== 0) {
            throw RangeError('Matrix doesn\'t have valid rows number, given ' + this.rows + ', and counts ' + this.count);
        }
    }
    Matrix.identity = function(rows) {
        var cols = rows, data = [], step = rows + 1;
        for (var i = 0, length = rows * cols; i < length; i++) {
            data.push((i + step) % step == 0 ? 1 : 0);
        }
        return new Matrix(rows, data);
    }

    Matrix.prototype.setAt = function(row, column, value) {
        this.data[this.cols * row + column] = value;
        return this;
    }
    Matrix.prototype.getAt = function(row, column) {
        return this.data[this.cols * row + column];
    }
    Matrix.prototype.toString = function() {
        var row, col,
        result = 'Matrix[' + this.cols + ',' + this.rows + ']' + "\n";

        for (row = 0; row < this.rows; row++) {
            result += '|'
            for (col = 0; col < this.cols; col++) {
                result += "\t"
                result += this.getAt(row, col);
                result += "\t"
            }
            result += "|\n";
        }

        return result;
    }
    Matrix.prototype.multiply = function(matrix) {
        if (this.cols !== matrix.rows) {
            throw Error('Can\'t multiply matrix because number of rows ' + matrix.rows + ' is different from current matrix columns number ' + this.cols );
        }

        var row, col, a, b, idx, sum,
            data = [];

        for (row = 0; row < this.rows; row++) {
            for (col = 0; col < matrix.cols; col++) {
                sum = 0;
                for (idx = 0; idx < matrix.rows; idx++) {
                    a = this.getAt(row, idx);
                    b = matrix.getAt(idx, col);
                    sum += a * b;
                }
                data.push(sum);
            }
        }

        return new Matrix(this.rows, data);
    }
    Matrix.prototype.transpose = function() {
        var result = new Matrix(this.cols, Array(this.count));
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                result.setAt(col, row, this.getAt(row, col));
            }
        }
        return result;
    }
     Matrix.prototype.scalar = function(scalar) {
        var result = new Matrix(this.rows, Array(this.count));
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                result.setAt(row, col, scalar * this.getAt(row, col));
            }
        }
        return result;
    }

    return Matrix;
})
;
define('math/vector3',['math/matrix'], function(Matrix) {
    

    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rows = 3;
        this.cols = 1;
        this.data = [this.x, this.y, this.z]

    }

    Vector3.up = function() {
        return new Vector3(0, 1, 0);
    }
    Vector3.down = function() {
        return new Vector3(0, -1, 0);
    }

    Vector3.constructor = Vector3;
    Vector3.prototype = Object.create(Matrix.prototype);
    Vector3.prototype.toString = function() {
        return 'Vector3(' + this.x +','+ this.y +','+ this.z + ')';
    }
    Vector3.prototype.normalize = function() {
        var length = this.length();
        return new Vector3(
            this.x / length,
            this.y / length,
            this.z / length
        );
    }
    Vector3.prototype.length = function() {
        return Math.sqrt(this.lengthSqrt());
    }
    Vector3.prototype.lengthSqrt = function() {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
    }
    Vector3.prototype.compare = function(vector) {
        var a = this.lengthSqrt();
        var b = vector.lengthSqrt();
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    }
    Vector3.prototype.subtract = function(vector) {
        return new Vector3(
            (this.x - vector.x), (this.y - vector.y), (this.z - vector.z)
        );
    }
    Vector3.prototype.add = function(vector) {
        return new Vector3(
            (this.x + vector.x), (this.y + vector.y), (this.z + vector.z)
        );
    }
    Vector3.prototype.scale = function(scale) {
        return new Vector3(
            (this.x * scale), (this.y * scale), (this.z * scale)
        );
    }
    Vector3.prototype.dot = function(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
    }
    Vector3.prototype.angle = function(vector) {
        var divisor = this.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) { angle = -1; }
        if (angle > 1) { angle = 1; }

        return Math.acos(angle);
    }
    Vector3.prototype.cross = function(vector) {
        var i, j, k;

        i = this.y * vector.z - this.z * vector.y;
        j = this.z * vector.x - this.x * vector.z;
        k = this.x * vector.y - this.y * vector.x;

        return new Vector3(i, -j, k);
    }

    return Vector3;
})
;
define('shape/point/point',['shape/point/interface', 'math/vector3', 'math/vector3'], function(PointInterface, Vector3, Vector4) {
    

    function Point(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = 1;
        this.rows = 4;
        this.cols = 1;
        this.data = [this.x, this.y, this.z, this.w]
        this.xpos = x;
        this.ypos = y;
    }
    Point.constructor = Point;
    Point.prototype = Object.create(Vector4.prototype);
    Point.prototype.toString = function() {
        return 'Point(' + this.x + ',' + this.y + ',' + this.z + ',' + this.w + ')';
    }
    Point.prototype.moveBy = function(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        this.data = [this.x, this.y, this.z, this.w]
    }
    Point.prototype.moveTo = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = [this.x, this.y, this.z, this.w]
    }
    Point.prototype.vector3 = function() {
        return new Vector3(this.x, this.y, this.z);
    }

    return Point;
})
;
define('shape/utils/vector',['shape/point/point'], function(Point) {
    function VectorUtil(vector) {
        this.vector = vector instanceof Point ? vector : new Point(0,0,0);
    }

    VectorUtil.prototype.add = function(vector) {
        return new VectorUtil(new Point(
            this.vector.x + vector.x,
            this.vector.y + vector.y,
            this.vector.z + vector.z
        ));
    }
    VectorUtil.prototype.dot = function(vector) {
        return (this.vector.x * vector.x) + (this.vector.y * vector.y) + (this.vector.z * vector.z);
    }
    VectorUtil.prototype.direction = function(vector) {
        return (this.vector.x - vector.x) + (this.vector.y - vector.y) + (this.vector.z - vector.z) > 0 ? 1 : -1;
    }
    VectorUtil.prototype.angle = function(vector) {
        var divisor = this.vector.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) { angle = -1; }
        if (angle > 1) { angle = 1; }

        return Math.acos(angle);
    }
    VectorUtil.normalFromPoints = function(point0, point1, point2) {
        // vectors on the plane
        var U = new Point(point1.x - point0.x, point1.y - point0.y, point1.z - point0.z);
        var V = new Point(point2.x - point0.x, point2.y - point0.y, point2.z - point0.z);

        return cross(U, V);
    }
    VectorUtil.cross = cross;
    function cross(U, V) {
        var i, j, k;

        i = U.y * V.z - U.z * V.y;
        j = U.z * V.x - U.x * V.z;
        k = U.x * V.y - U.y * V.x;

        return new Point(i, -j, k);
    }
    return VectorUtil;
})
;
define('shape/shape/cube',[
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection',
    'shape/utils/vector'
],
function(Shape, Point, PointCollection, VectorUtil) {
    

    var faces = [
        [0,1,2,3], // back
        [0,4,5,1],
        [0,3,7,4],
        [3,2,6,7],
        [1,5,6,2],
        [4,7,6,5] // front
    ];

    /**
     * Cube shape
     */
    function CubeShape(x, y, z, width, color) {
        this.state_ = this.STATE_CLEAN;
        this.points_ = new PointCollection(new Point(x, y, z));

        this.width = width || 10;
        this.color = color || {r:0, g:0, b:0, a:255};

        var halfWidth = this.width / 2;

        this.points_.push(new Point(x - halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z - halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z - halfWidth));
        this.points_.push(new Point(x - halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y - halfWidth, z + halfWidth));
        this.points_.push(new Point(x + halfWidth, y + halfWidth, z + halfWidth));
        this.points_.push(new Point(x - halfWidth, y + halfWidth, z + halfWidth));
    }
    CubeShape.constructor = CubeShape;
    CubeShape.prototype = Object.create(Shape.prototype);
    CubeShape.prototype.render = function(stage) {
        var face, point, normal, camera, angle;
        var i = 0, length = faces.length;

        camera =  new VectorUtil(stage.projection.camera);
        stage.fillStyle(this.color);

        for (; i < length; i++) {
            face = faces[i];

            normal = VectorUtil.normalFromPoints(
                this.points_.get(face[0]),
                this.points_.get(face[1]),
                this.points_.get(face[2])
            );

            normal = normal.normalize();
            angle = camera.angle(normal) * 180 / Math.PI >> 0;
            // if (angle < 91) continue;

            point = this.points_.get(face[0]);
            stage.moveTo(point);
            for (var j = 3; j >= 0; j--) {
                point = this.points_.get(face[j]);
                stage.lineTo(point);
            }
            stage.fill();
            stage.stroke();
        }
    }

    return CubeShape;
});

define('shape/mesh/interface',['math/matrix', 'math/vector3'], function(Matrix, Vector3){
    

    function MeshInterface() {
        this.rotation = new Vector3(0, 0, 0);
        this.translation = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.vertices = [];
    }

    MeshInterface.prototype.center = function() { return this.translation; }
    MeshInterface.prototype.modelMatrix = function() {
        return new Matrix(4, [
            this.scale.x, 0, 0, this.translation.x,
            0, this.scale.y, 0, this.translation.y,
            0, 0, this.scale.z, this.translation.z,
            0, 0, 0, 1
        ]);
    }
    MeshInterface.prototype.render = function(stage) {

    }

    return MeshInterface;
})
;
define('shape/mesh/cube',['shape/mesh/interface', 'math/vector3', 'shape/point/point'], function(MeshInterface, Vector3, Point) {
    

    var faces = [
        [0,1,2,3], // back
        [0,4,5,1],
        [0,3,7,4],
        [3,2,6,7],
        [1,5,6,2],
        [4,7,6,5] // front
    ];

    function CubeMesh(x, y, z, width, color) {
        this.rotation = new Vector3(0, 0, 0);
        this.translation = new Vector3(x, y, z);
        this.scale = new Vector3(1, 1, 1);

        var hw = width/2 >> 0;

        this.vertices = [];
        this.vertices.push(new Point(- hw, - hw, - hw));
        this.vertices.push(new Point(  hw, - hw, - hw));
        this.vertices.push(new Point(  hw,   hw, - hw));
        this.vertices.push(new Point(- hw,   hw, - hw));
        this.vertices.push(new Point(- hw, - hw,   hw));
        this.vertices.push(new Point(  hw, - hw,   hw));
        this.vertices.push(new Point(  hw,   hw,   hw));
        this.vertices.push(new Point(- hw, + hw, + hw));

        this.width = width;
        this.color = color;
    }
    CubeMesh.prototype = Object.create(MeshInterface.prototype);
    CubeMesh.prototype.render = function(stage) {
        var face, point;
        var i = 0, length = faces.length;

        stage.fillStyle(this.color);

        for (; i < length; i++) {
            face = faces[i];

            point = this.vertices[face[0]];
            stage.beginPath();
            stage.moveTo(point);
            for (var j = 3; j >= 0; j--) {
                point = this.vertices[face[j]];
                stage.lineTo(point);
            }
            stage.closePath();
            // stage.fill();
            stage.stroke();
        }
    }

    return CubeMesh;
})
;
define('shape/color',[],function(){
    

    function Color() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 255;
    }

    Color.fromName = function(name) {
        var result = new Color();

        switch(name) {
            case 'red':   result.r = 255; break;
            case 'green': result.g = 255; break;
            case 'blue':  result.b = 255; break;
            case 'orange':  result.r = 255; result.g = 165; break;
        }

        return result;
    }

    Color.prototype.toString = function() {
        return 'rgba('+ this.r +','+ this.g +','+ this.b +', '+ this.a / 255 +')';
    }

    return Color;

})
;
define('shape/shape/image',[
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function (Shape, Point, PointCollection) {
    

    function ImageShape(x, y, z, width, height) {
        this.state_ = this.STATE_CLEAN;
        this.width = width;
        this.height = height;
        this.image = null;

        width /= 2;
        height /= 2;

        this.points_ = new PointCollection(new Point(x, y, z));
        // top left corner
        this.points_.push(new Point(x - width, y - height, z - width));
        // top right corner
        this.points_.push(new Point(x + width, y - height, z - width));
        // bottom right corner
        this.points_.push(new Point(x + width, y + height, z - width));
        // bottom left corner
        this.points_.push(new Point(x - width, y + height, z - width));
    }
    ImageShape.constructor = ImageShape;
    ImageShape.prototype = Object.create(Shape.prototype);
    ImageShape.prototype.setImage = function(image) {
        this.image = image;
    }
    ImageShape.prototype.render = function(stage) {
        var center = this.center();
        var width = this.points_.get(0).xpos - this.points_.get(1).xpos;
        var height = this.points_.get(0).ypos - this.points_.get(2).ypos;

        if (!this.image) {
            return;
        }

        // stage.drawImage(this.image, center.xpos, center.ypos, width, height);
        stage.drawImage(this.image, center, this.width, this.height);
    }

    return ImageShape;
});

define('shape/shape/sprite',[
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function (Shape, Point, PointCollection) {
    

    function SpriteShape(x, y, z, width, height) {
        this.state_ = this.STATE_CLEAN;
        this.width = width;
        this.height = height;
        this.image = null;

        width /= 2;
        height /= 2;

        this.points_ = new PointCollection(new Point(x, y, z));
        // top left corner
        this.points_.push(new Point(x - width, y - height, z - width));
        // top right corner
        this.points_.push(new Point(x + width, y - height, z - width));
        // bottom right corner
        this.points_.push(new Point(x + width, y + height, z - width));
        // bottom left corner
        this.points_.push(new Point(x - width, y + height, z - width));
    }
    SpriteShape.constructor = SpriteShape;
    SpriteShape.prototype = Object.create(Shape.prototype);
    SpriteShape.prototype.setSprite = function(image) {
        this.image = image;
    }
    SpriteShape.prototype.render = function(stage) {
        var center = this.center();
        if (!this.image) {
            return;
        }

        this.image.put(stage, center);
    }

    return SpriteShape;
});

define('game/action/manager',[],function() {
    function ActionManager() {
        this.actions = {};
        this.queue = {};
        this.unset = {};
    }

    ActionManager.prototype.set = function(name, action) {
        if (!this.has(name) || this.get(name).canStop()) {
            this.actions[name] = action;
        } else {
            // If action can't stop then queue this action
            // and try to set it when current action can be stopped.
            this.queue[name] = action;
        }
        return this;
    }
    ActionManager.prototype.get = function(name) {
        return this.actions[name];
    }
    ActionManager.prototype.has = function(name) {
        return this.actions.hasOwnProperty(name);
    }
    ActionManager.prototype.remove = function(name) {
        if (!this.has(name)) return;

        var action = this.get(name);
        if (action.canRemove()) {
            delete this.actions[name];
            delete this.queue[name];
            delete this.unset[name];
            action.trigger('removed');
        } else {
            this.unset[name] = true;
        }
    }
    ActionManager.prototype.canStop = function(name) {
        return this.has(name) ? this.get(name).canStop() : false;
    }
    ActionManager.prototype.proxy = function(method, args) {
        var self = this;
        args = typeof args === 'array' ? args : [args];
        return function() {
            return self[method].apply(self, args);
        }
    }
    ActionManager.prototype.run = function() {
        var name, action, temporary;
        for (name in this.actions) {
            if (!this.actions.hasOwnProperty(name)) {
                continue;
            }

            action = temporary = this.actions[name];

            if (this.unset.hasOwnProperty(name) && action.canRemove()) {
                this.remove(name);
                continue;
            }

            if (this.queue.hasOwnProperty(name) && action.canStop()) {
                action = this.actions[name] = this.queue[name];
                delete this.queue[name];
                temporary.trigger('stopped');
            }

            if (action.finish()) {
                action.trigger('finish');
                delete this.actions[name];
            } else {
                action.run();
            }
        }
    }

    return ActionManager;
})
;
define('event/result',[],function(){
    function Result(event) {
        this.event = event;
        this.results = [];
    }
    Result.prototype.count = function() {
        return this.results.length;
    }
    Result.prototype.push = function(value) {
        this.results.push(value);
    }
    Result.prototype.last = function(defaults) {
        var c = this.count();
        return c ? this.results[c - 1] : defaults;
    }
    Result.prototype.each = function(func) {
        this.results.forEach(func);
    }

    return Result;
})
;
define('event/event',['event/result'], function(Result){
    function createEvent() {
        var stopPropagation = false;
        return {
            stopPropagation: function(flag) {
                if (arguments.length) {
                    stopPropagation = !!flag;
                } else {
                    return stopPropagation;
                }
            }
        }
    }

    function hash(array) {
        var result = '';

        if (array === undefined) return result;

        array.forEach(function(item){
            switch(Object.prototype.toString.call(item).slice(8, -1)) {
                default:
                    result += item;
                    break;

                case 'Array':
                    result += hash(item);
                    break;

                case 'Object':
                    for (var i in item) {
                        if (item.hasOwnProperty(i))
                            result += hash(item)
                    }
                    break;
            }
        })
        return result;
    }

    function Event() {
        this.events = {};
        this.proxies = {};
    }
    Event.prototype.on = function(name, callback) {
        this.events[name] = this.events[name] ? this.events[name] : [];
        if (-1 === this.events[name].indexOf(callback)) {
            this.events[name].push(callback);
        }
        return this;
    }
    Event.prototype.trigger = function(name, args) {
        var value, events;
        var event = typeof this.createEvent === 'function' ? this.createEvent() : createEvent(),
        result = new Result(event);

        if (!this.events.hasOwnProperty(name)) {
            return result;
        }

        args = [event].concat(args);
        events = this.events[name];

        for (var i = 0, length = events.length; i < length; i++) {
            value = events[i].apply(null, args);
            result.push(value);
            if (event.stopPropagation()) break;
        }

        return result;
    }
    Event.prototype.proxy = function(name, args) {
        var self = this, key = name + hash(args);

        return this.proxies[key]
            ? this.proxies[key]
            : this.proxies[key] = function proxy(event) {
            self.trigger(name, args);
        }
    }

    return Event;
})
;
define('state',['event/event'], function(Event){
    function onChange(from, to, context) {
        return function() {
            var results;
            if (null !== context.state && (context.state !== from && from !== '*')) {
                return;
            }

            if (context.unlock && !context.unlock()) {
                context.postponed = onChange(from, to, context);
                return;
            }

            context.unlock = null;
            context.state = to;
            context.trigger('change', [from, to]);
            results = context.trigger('enter:' + to, [from]);
            if (results.event.hasLocks()) {
                context.unlock = results.event.unlock;
            }
        }
    }

    function each(data, func) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                func(data[key], key);
            }
        }
    }

    function StateMachine(states) {
        var self = this;
        self.events = {};
        self.state = null;
        self.unlock = null;

        each(states, function(events, state) {
            each(events, function(nextState, event){
                self.on(event, onChange(state, nextState, self));
            });
        })
    }

    StateMachine.prototype = new Event();
    /**
     * Resove postponed state.
     * This can happen when current state is bloked
     */
    StateMachine.prototype.run = function() {
        if (typeof this.postponed === 'function') {
            var func = this.postponed;
            this.postponed = null;
            func();
        }
    }
    StateMachine.prototype.createEvent = function() {
        var stopPropagation = false;
        var unlocks = [];
        return {
            hasLocks: function() {
                return unlocks.length > 0;
            },
            lock: function(func) {
                unlocks.push(func);
            },
            unlock: function() {
                var result = true;
                unlocks.forEach(function(func){
                    if (result) {
                        result = func();
                    }
                });
                return result;
            },
            stopPropagation: function(flag) {
                if (arguments.length) {
                    stopPropagation = !!flag;
                } else {
                    return stopPropagation;
                }
            }
        }
    }

    return StateMachine;
})
;
define('game/action/interface',['event/event'], function(Event){
    function ActionInterface() {}
    ActionInterface.prototype = new Event();
    ActionInterface.prototype.run = function() {};
    ActionInterface.prototype.finish = function() { return false };
    ActionInterface.prototype.canStop = function() {};
    ActionInterface.prototype.canRemove = function() { return this.canStop() };

    return ActionInterface;
});

define('game/action/move/right',['game/action/interface'], function(ActionInterface) {
    function ActionMoveRight(shape, speed, step) {
        this.events = {};
        this.shape = shape;
        this.speed = speed;
        this.step = step;
        this.counter = 0;
    }

    ActionMoveRight.prototype = new ActionInterface();

    ActionMoveRight.prototype.run = function() {
        this.shape.translation.x += this.speed;
        // this.shape.points().moveBy(this.speed, 0, 0);
        ++this.counter;
    }
    ActionMoveRight.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveRight;
});

define('game/action/move/left',['game/action/interface'], function(ActionInterface) {
    function ActionMoveLeft(shape, speed, step) {
        this.events = {};
        this.shape = shape;
        this.speed = speed;
        this.step = step;
        this.counter = 0;
    }

    ActionMoveLeft.prototype = new ActionInterface();

    ActionMoveLeft.prototype.run = function() {
        this.shape.translation.x -= this.speed;
        // this.shape.points().moveBy(-this.speed, 0, 0);
        ++this.counter;
    }
    ActionMoveLeft.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveLeft;
});

define('game/action/move/up',['game/action/interface'], function(ActionInterface) {
    function ActionMoveUp(shape, speed, step) {
        this.events = {};
        this.shape = shape;
        this.speed = speed;
        this.step = step;
        this.counter = 0;
    }

    ActionMoveUp.prototype = new ActionInterface();

    ActionMoveUp.prototype.run = function() {
        this.shape.translation.y += this.speed;
        // this.shape.points().moveBy(0, this.speed, 0);
        ++this.counter;
    }
    ActionMoveUp.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveUp;
});

define('game/action/move/down',['game/action/interface'], function(ActionInterface) {
    function ActionMoveDown(shape, speed, step) {
        this.events = {};
        this.shape = shape;
        this.speed = speed;
        this.step = step;
        this.counter = 0;
    }

    ActionMoveDown.prototype = new ActionInterface();

    ActionMoveDown.prototype.run = function() {
        this.shape.translation.y -= this.speed;
        // this.shape.points().moveBy(0, -this.speed, 0);
        ++this.counter;
    }
    ActionMoveDown.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveDown;
});

define('game/action/rotate/right',['game/action/interface'], function(ActionInterface) {
    function ActionShowRightEdge(gameStage, speed, rightAngle) {
        this.events = {};
        this.gameStage = gameStage;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.init();
        this.on('finish', this.init.bind(this));
    }

    ActionShowRightEdge.prototype = new ActionInterface();
    ActionShowRightEdge.prototype.init = function() {
        this.counter = 0;
    }
    ActionShowRightEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.gameStage.rotateY(-this.speed);

        this.counter += this.speed;
    }
    ActionShowRightEdge.prototype.finish = function() {
        return this.canStop();
    }
    ActionShowRightEdge.prototype.canStop = function() {
        return this.counter >= this.rightAngle;
    }

    return ActionShowRightEdge;
});


define('game/action/rotate/left',['game/action/interface'], function(ActionInterface) {
    function ActionShowLeftEdge(gameStage, speed, rightAngle) {
        this.events = {};
        this.gameStage = gameStage;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.init();
        this.on('finish', this.init.bind(this));
    }

    ActionShowLeftEdge.prototype = new ActionInterface();
    ActionShowLeftEdge.prototype.init = function() {
        this.counter = 0;
    }
    ActionShowLeftEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.gameStage.rotateY(this.speed);

        this.counter += this.speed;
    }
    ActionShowLeftEdge.prototype.finish = function() {
        return this.canStop();
    }
    ActionShowLeftEdge.prototype.canStop = function() {
        return this.counter >+ this.rightAngle;
    }

    return ActionShowLeftEdge;
});


define('game/action/rotate/up',['game/action/interface'], function(ActionInterface) {
    function ActionShowUpEdge(gameStage, speed, rightAngle) {
        this.events = {};
        this.gameStage = gameStage;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.init();
        this.on('finish', this.init.bind(this));
    }

    ActionShowUpEdge.prototype = new ActionInterface();
    ActionShowUpEdge.prototype.init = function() {
        this.counter = 0;
    }
    ActionShowUpEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.gameStage.rotateX(this.speed);

        this.counter += this.speed;
    }
    ActionShowUpEdge.prototype.finish = function() {
        return this.canStop();
    }
    ActionShowUpEdge.prototype.canStop = function() {
        return this.counter >= this.rightAngle;
    }

    return ActionShowUpEdge;
});


define('game/action/rotate/down',['game/action/interface'], function(ActionInterface) {
    function ActionShowDownEdge(gameStage, speed, rightAngle) {
        this.events = {};
        this.gameStage = gameStage;
        this.speed = speed;
        this.rightAngle = rightAngle;
        this.init();
        this.on('finish', this.init.bind(this));
    }

    ActionShowDownEdge.prototype = new ActionInterface();
    ActionShowDownEdge.prototype.init = function() {
        this.counter = 0;
    }
    ActionShowDownEdge.prototype.run = function() {
        if (this.canStop()) return;

        this.gameStage.rotateX(-this.speed);

        this.counter += this.speed;
    }
    ActionShowDownEdge.prototype.finish = function() {
        return this.canStop();
    }
    ActionShowDownEdge.prototype.canStop = function() {
        return this.counter >= this.rightAngle;
    }

    return ActionShowDownEdge;
});


define('shape/collision/manager',[],function() {

    function CollisionManager() {
        this.queue = [];
    }
    CollisionManager.prototype.when = function(one, two, then) {
        this.queue.push({one: one, two: two, then: then, distance: 0});
        return this;
    }
    CollisionManager.prototype.length = function(one, two) {
        var dx = two.x - one.x,
            dy = two.y - one.y,
            dz = two.z - one.z;

        return Math.pow((dx * dx) + (dy * dy) + (dz * dz), 1/2);
    }
    CollisionManager.prototype.radius = function(shape) {
        return shape.width / 2;
    }
    CollisionManager.prototype.center = function (shape) {
        return shape.center();
    }
    CollisionManager.prototype.run = function() {
        var one, two, then, length, delta, event;
        var self = this;
        this.queue.forEach(function(item, index) {
            if (item.distance > 10) {
                // its just simplification,
                // I need to add here velocity?
                --item.distance;
                return;
            }
            // Extract data
            one = item.one, two = item.two, then = item.then;
            // Calculate length
            length = self.length(self.center(one), self.center(two));
            delta = length - (self.radius(one) + self.radius(two));

            if (delta < 0) {
                // Yes, we've intersect
                event = {
                    object: one,
                    collide: two,
                    delta: delta,
                    preventRelease: false
                };

                then(event);

                if (!event.preventRelease) {
                    self.queue.splice(index, 1);
                }
            } else {
                item.distance = delta >> 0;
            }
        });
    }

    return CollisionManager;
})
;
define('shape/utils/assets',['event/event'], function(Event){
    function onComplete(assets) {
        return function(e, name, object) {
            assets[name] = object;
        }
    }

    function onError(e, name, image) {
        console.log('cant load asset:', name, image);
    }

    function AssetUtil(baseURL) {
        this.events = {}
        this.baseURL = baseURL;
        this.assets = {};

        this.on('complete', onComplete(this.assets));
        this.on('error', onError);
    }

    AssetUtil.prototype = new Event();
    AssetUtil.prototype.loadImage = function(name, path) {
        var self = this,
        image = new Image();

        image.src = this.baseURL + path;
        image.onload = function() {
            var result = self.trigger('init:'+name, [image]);
            if (result.count()) {
                image = result.last();
            }
            self.trigger('complete', [name, image]);
            self.trigger('complete:' + name, [image]);
        }
        image.onerror = function() {
            self.trigger('error', [name, image])
            self.trigger('error:'+name, [image])
        }
    }
    AssetUtil.prototype.loadAudio = function(name, path) {
        var self = this,
        audio = new Audio();

        audio.src = this.baseURL + path;
        audio.preload = 'auto';
        audio.addEventListener('canplay', function() {
            var result = self.trigger('init:'+name, [audio]);
            if (result.count()) {
                audio = result.last();
            }
            self.trigger('complete', [name, audio])
            self.trigger('complete:' + name, [audio])

        })
        audio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.src = this.src;
        })
        audio.addEventListener('error', function() {
            self.trigger('error', [name, audio])
            self.trigger('error:'+name, [audio])
        })
        audio.load();
    }
    AssetUtil.prototype.loadAudio2 = function(name, path) {
        var self = this;
        // Fix up prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();
        var request = new XMLHttpRequest();
        request.open('GET', this.baseURL + path, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                var audio = {
                    play: function() {
                        var source = context.createBufferSource();
                        source.buffer = buffer;
                        source.connect(context.destination);
                        source.start(0);
                    }
                };
                var result = self.trigger('init:'+name, [audio]);
                if (result.count()) {
                    audio = result.last();
                }
                self.trigger('complete', [name, audio])
                self.trigger('complete:' + name, [audio])

            }, function() {
                self.trigger('error', [name, audio])
                self.trigger('error:'+name, [audio])
            });
        }
        request.send();
    }
    AssetUtil.prototype.has = function(name) {
        return this.assets.hasOwnProperty(name);
    }
    AssetUtil.prototype.get = function(name, func) {
        if (this.has(name)) {
            func(this.assets[name]);
        } else {
            this.on('complete:' + name, function(e, value) { func(value) })
        }
        return this;
    }

    return AssetUtil;
})
;
define('shape/utils/imagedata',[],function(){
    function ImageDataUtil(image) {
        this.image = image;
        this.raw = null;
        // var r, g, b, a = null;
        // for (var i = 0, length = this.raw.data.length; i < length; i += 4) {
        //     r = this.raw.data[i],
        //     g = this.raw.data[i+1],
        //     b = this.raw.data[i+2],
        //     a = this.raw.data[i+3];

        //     if (r === red && g === green && b === blue) {
        //         this.raw.data[i+3] = 0;
        //     }
        // }
    }

    ImageDataUtil.prototype.load = function() {
        if (this.raw) return this;
        var canvas = document.createElement("canvas");
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        var context = canvas.getContext("2d");
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(this.image, 0, 0);
        this.raw = context.getImageData(0, 0, this.image.width, this.image.height);
        return this;
    }

    ImageDataUtil.prototype.patch = function(stage, x, y, dw) {
        var canvas = document.createElement("canvas");
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        var context = canvas.getContext("2d");
        var frameNumber = this.image.width / dw >> 0;
        var background = stage.getImageData(x, y, dw, this.image.height);
        for (var i = 0; i < frameNumber; i++) {
            context.putImageData(
                background,
                dw * i, 0, 0, 0, this.image.width, this.image.height
            );
        }

        context.drawImage(this.image, 0, 0);
        this.raw = context.getImageData(0, 0, this.image.width, this.image.height);
        return this;
    }

    ImageDataUtil.prototype.width = function() {
        return this.image.width;
    }
    ImageDataUtil.prototype.height = function() {
        return this.image.height;
    }
    ImageDataUtil.prototype.data = function() {
        return this.load().raw;
    }

    return ImageDataUtil;
})
;
define('shape/utils/sprites',[],function() {
    function SpriteUtil(imageData, frameWidth, frameHeight) {
        this.imageData = imageData;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.tick = 15;
        this.frameNumber = 0;
        this.frames = imageData.width()/frameWidth >> 0;
        this.counter = 0;
    }

    SpriteUtil.prototype.put = function(stage, point) {
        if (++this.counter % this.tick == 0) {
           this.counter = 0;
           this.frameNumber = this.frames <= ++this.frameNumber ? 0 : this.frameNumber;
        }

        // console.log(this.imageData)
        var dx = this.frameNumber * this.frameWidth;
        var x = point.xpos, y = point.ypos;
        stage.putImageData(
            this.imageData.patch(stage, x, y, this.frameWidth).data(),
            x - dx,
            y,
            dx,
            0,
            this.frameWidth,
            this.frameHeight
        );
    }

    return SpriteUtil;
})
;
define('shape/shape/text',[
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function (Shape, Point, PointCollection) {
    

    function TextShape(x, y, z, text, options) {
        this.state_ = this.STATE_CLEAN;
        this.points_ = new PointCollection(new Point(x, y, z));
        this.text_ = text;
        this.options(options)
    }
    TextShape.constructor = TextShape;
    TextShape.prototype = Object.create(Shape.prototype);
    TextShape.prototype.options = function(options) {
        if (arguments.length) {
            options = options || {};
            options.color     = options.color || '#000';
            options.style     = options.style || 'normal';
            options.weigth     = options.weigth || 'normal';
            options.size      = options.size  || '12px';
            options.font      = options.font  || 'sans-serif';
            options.baseline  = options.baseline || 'bottom';
            this.options_ = options;
        } else return this.options_;
    }
    TextShape.prototype.render = function(stage) {
        if (!this.text_) return;

        var center = this.center(),
            options = this.options();

        stage.fillStyle(options.color);
        stage.fillText(this.text_, center, options);
    }

    return TextShape;
});

define('game/stage/start',['shape/shape/text', 'shape/shape/cube', 'shape/mesh/cube', 'shape/color'], function(TextShape, CubeShape, CubeMesh, Color){
    function StartStage(serviceManager) {
        var config = serviceManager.config();
        var stage = serviceManager.createStage();

        // stage.addChild(new CubeShape(0, 0, 0, 200, 'red'));
        var cube = new CubeMesh(0, 0, -10, 40, Color.fromName('red'));
        cube.rotation.x = 45;
        cube.rotation.y = 45;
        cube.rotation.z = 45;
        stage.addChild(cube);

        var cube = new CubeMesh(100, 0, 0, 40, Color.fromName('blue'));
        cube.rotation.x = 45;
        stage.addChild(cube);

        var cube = new CubeMesh(0, 100, 0, 40, Color.fromName('green'));
        stage.addChild(cube);
        var cube = new CubeMesh(100, 100, 0, 40, Color.fromName('orange'));
        stage.addChild(cube);

        this.stage = stage;
    }
    StartStage.prototype.tick = function() {
        this.stage.render();
    }

    StartStage.prototype.updateState = function(stateMachine) {
    }

    return StartStage;
})
;
define('game/stage/game',['shape/shape/cube', 'shape/mesh/cube', 'shape/color'], function(CubeShape, CubeMesh, Color){
    function GameStage(serviceManager) {
        var config = serviceManager.config();
        var stage = serviceManager.createStage();

        this.board = new CubeMesh(0, 0, 0, config.BOARD_WIDTH, Color.fromName('blue'));
        this.cube = serviceManager.cube();
        this.collect = 0;
        this.config = config;
        this.stage = stage;
        this.service = serviceManager;
        this.collisionManager = serviceManager.collisionManager();

        // Add objection to stage, order is important - for now.
        this.stage.addChild(this.board);
        this.enemies = this.spawnEnemies();
        this.stage.addChild(this.cube);
    }
    GameStage.prototype.tick = function() {
        this.collisionManager.run()
        this.stage.render();
    }

    GameStage.prototype.lastRandomValue = null;
    GameStage.prototype.rotateX = function(angle) {
        this.service.projection().rotateX(this.stage, angle);
    }
    GameStage.prototype.rotateY = function(angle) {
        this.service.projection().rotateY(this.stage, angle);
    }
    GameStage.prototype.giftFactory = function(x, y, z) {
        return this.service.giftFactory(x, y, z);
    }
    GameStage.prototype.updateState = function(stateMachine) {
        var x = this.cube.center().x;
        var y = this.cube.center().y;

        var boardX = this.config.BOARD_EDGE;
        var boardY = this.config.BOARD_EDGE;

        if (x > boardX) {
            stateMachine.trigger('edge.right');
        } else if (x < -boardX) {
            stateMachine.trigger('edge.left');
        } else if (y < -boardY) {
            stateMachine.trigger('edge.up');
        } else if (y > boardY) {
            stateMachine.trigger('edge.down');
        }
    }
    GameStage.prototype.spawnEnemies = function() {
        var enemies = [];
        var d;
        var self = this;
        for(var k = 0; k < 6; k++) {
            d = this.spawnRandom();
            enemies.push(this.giftFactory(d[0], d[1], d[2]));
        }
        enemies.forEach(function(item) {
            self.stage.addChild(item);
            self.collisionManager.when(self.cube, item, function(data) {
                self.collect++;
                // am.get('ring', function(ring) {
                // ring.play()
                // })
                self.stage.removeChild(data.collide);
            })
        });
    }
    GameStage.prototype.random = function() {
        var rand;
        if (!this.lastRandomValue) {
            this.lastRandomValue = Math.random();
        } else {
            do {
                rand = Math.random();
            } while (this.lastRandomValue == rand);
            this.lastRandomValue = rand;
        }
        return this.lastRandomValue;
    }
    GameStage.prototype.spawnRandom = function() {
        var faces = [
            // front
            [0,0,1],
            // back
            [0,0,-1],
            // left
            [1,0,0],
            // right
            [-1,0,0],
            // up
            [0,1,0],
            // donw
            [0,-1,0]
        ];

        var self = this, config = this.config;
        var face = faces[self.random() * 6 >> 0];
        face = face.map(function(item) {
            if (item == 0) {
                item = ((self.random() * 3 >> 0) + 2) * config.CUBE_FIELD_SIZE
                item *= (self.random() * 2 >> 0) > 0 ? -1 : 1;
            } else {
                item * config.BOARD_WIDTH
            }
            return item;
        });
        return face;
    }

    return GameStage;
})
;
define('math/matrix4',['math/matrix'], function(Matrix){
    

    var TO_RADIAN = Math.PI / 180;

    function Matrix4(data) {
        this.rows = 4;
        this.data = data;
        this.count = 16;
        this.cols = 4;
    }

    Matrix4.prototype = Object.create(Matrix.prototype);
    Matrix4.prototype.setTranslation = function(x, y, z) {
        this.setAt(0, 3, x);
        this.setAt(1, 3, y);
        this.setAt(2, 3, z);
    }
    Matrix4.prototype.setTranslationVector = function(vector) {
        this.setTranslation(vector.x, vector.y, vector.z);
    }

    Matrix4.identity = function() {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.translation = function(vector) {
        var result = Matrix4.identity();
        result.setTranslationVector(vector);
        return result;
    }
    Matrix4.rotation = function(vector) {
        var result = Matrix4.identity();
        if (vector.x != 0) {
            result = result.multiply(Matrix4.rotationX(vector.x));
        }
        if (vector.y != 0) {
            result = result.multiply(Matrix4.rotationY(vector.y));
        }
        if (vector.z != 0) {
            result = result.multiply(Matrix4.rotationZ(vector.z));
        }
        return result;
    }
    Matrix4.rotationX = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix(4, [
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationY = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix(4, [
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationZ = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix(4, [
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.lookAtLH = function(eye, at, up) {
        var zaxis = eye.subtract(at).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = xaxis.cross(zaxis);

        var Ti = new Matrix(4, [
            1, 0, 0, -eye.x,
            0, 1, 0, -eye.y,
            0, 0, 1, -eye.z,
            0, 0, 0, 1
        ]);

        var Ri = new Matrix(4, [
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1,
        ]).transpose();

        return Ti.multiply(Ri);
    }
    Matrix4.perspectiveProjection = function(width, height, angle, d) {
        angle *= TO_RADIAN / 2;
        d = d || -1;

        var e = Math.tan(angle) * Math.abs(d) * 2;

        return new Matrix(4, [
            width/e, 0, 0, 0,
            0, height/e, 0, 0,
            0, 0, 1, 0,
            0, 0, 1/d, 0
        ]);
    }

    return Matrix4;
});

define('shape/projection/camera',[
    'math/matrix4',
    'math/vector3'
],
function(
    Matrix4,
    Vector3
) {
    

    function CameraProjection(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width || 450;
        this.height = height || 450;

        var eye = new Vector3(0, 0, 400);
        var at =  new Vector3(0, 0, 0);
        var up =  new Vector3(0, 1, 0);

        this.viewMatrix = Matrix4.lookAtLH(eye, at, up);
        this.projectionMatrix = Matrix4.perspectiveProjection(this.width, this.height, 90);
    }

    CameraProjection.constructor = CameraProjection;
    CameraProjection.prototype.project = function(mesh) {
        var transformationMatrix, r, x, y, z, w, wordMatrix, self = this;

        wordMatrix = Matrix4.translation(mesh.translation).multiply(
            Matrix4.rotation(mesh.rotation)
        );

        transformationMatrix = this.projectionMatrix;
        transformationMatrix = transformationMatrix.multiply(this.viewMatrix);
        transformationMatrix = transformationMatrix.multiply(wordMatrix);

        mesh.vertices.forEach(function(vertex){
            r = transformationMatrix.multiply(vertex);

            x = r.getAt(0, 0);
            y = r.getAt(1, 0);
            z = r.getAt(2, 0);
            w = r.getAt(3, 0);

            // normalize
            if (z - w  < 0) {
                x = x/w;
                y = y/w;
                z = z/w;
                w = w/w;
            }

            vertex.xpos = self.x + x >> 0;
            vertex.ypos = self.y - y >> 0;
        });
    }

    return CameraProjection;
})
;
define('shape/stage/interface',[],function(){
    

    /**
     * Stage prototype
     */
    function Stage(context) {}

    Stage.prototype = {
        'each': function(callback) {},
        'render': function() {},
        'addChild': function() {},
        'removeChild': function() {},
        'stroke': function() {},
        'fill': function() {},
        'fillRect': function(point, width, height) {},
        'fillStyle': function(style) {},
        'fillText': function(text, point, options) {},
        'beginPath': function() {},
        'closePath': function() {},
        'moveTo': function(point) {},
        'lineTo': function(point) {},
        'getImageData': function(img, x, y, width, height) {},
        'putImageData': function(x, y, width, height) {},
        'drawImage': function(img, point, width, height) {}
    };

    return Stage;
})
;
define('shape/stage/imagedata',['shape/stage/interface', 'shape/point/point', 'shape/color'], function(Stage, Point, Color){
    

    function ImageDataStage(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.buffer = [];
        // this.imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
        this.zbuffer = Array(this.width * this.height);
        this.nullPoint = new Point(0,0,0);
        this.position = this.nullPoint;
        this.color = Color.fromName('black');
    }

    ImageDataStage.constructor = ImageDataStage;
    ImageDataStage.prototype = new Stage();
    ImageDataStage.prototype.each = function(callback) {
        var i = 0, length = this.childs.length;
        for (; i < length; i++) {
            callback(this.childs[i], i);
        }
    }
    ImageDataStage.prototype.addChild = function(shape) {
        this.childs.push(shape);
    };
    ImageDataStage.prototype.removeChild = function(shape) {
        var index = this.childs.indexOf(shape);
        if (-1 !== index) {
            this.childs.splice(index, 1);
        }
    }
    ImageDataStage.prototype.clean = function() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.buffer = []
        this.zbuffer = []
        this.position = this.nullPoint;
        this.color = Color.fromName('black');
   }
    ImageDataStage.prototype.render = function() {
        var self = this;
        this.clean();
        this.each(function(child) {
            if (child.STATE_RENDERED !== child.state()) {
                child.render(self);
                child.state(child.STATE_RENDERED);
            }
        })

        this.flush();
    };
    ImageDataStage.prototype.flush = function() {
        var method, args;
        var i = 0,
        buffer = this.buffer,
        length = buffer.length;

        this.buffer = [];
        this.position = this.nullPoint;
        // this.color = {r:0, g:0, b:0, a:255};
        var colors = [this.color];
        var fill = [];

        for (; i < length; i++) {
            method = buffer[i][0];
            args = buffer[i][1];
            switch(method) {
                case 'stroke':
                    // fill = [];
                    break;

                case 'fill':
                    if (fill.length < 3) break;
                    // console.log(fill);
                    // console.log(fill.pop(), fill.pop(), fill.pop())
                        // this.fillTriangle(fill[0], fill[1], fill[2]);
                        // this.fillTriangle(fill[2], fill[3], fill[0]);
                    fill = [];
                    break;

                // case 'fillRect':     this.context.fillRect(args[0].xpos, args[0].ypos, args[1], args[2]); break;
                case 'fillStyle':
                    colors.push(
                        args[0] instanceof Color ? args[0] : Color.fromName('black')
                    );
                    // this.context.fillStyle = 'rgba('+ this.color.r +','+ this.color.g +','+ this.color.b +',1)';
                    break;

                // case 'fillText':     this.context.fillText(args[0], args[1].xpos, args[1].ypos); break;
                case 'beginPath':
                    this.color = colors.length ? colors[0] : this.color;
                    break;

                case 'closePath':
                    colors.shift();
                    break;
                case 'moveTo':
                    // this.context.moveTo(args[0].xpos, args[0].ypos);
                    this.position = args[0];
                    // fill.push(args[0]);
                    break;

                case 'lineTo':
                    // this.context.lineTo(args[0].xpos, args[0].ypos);
                // this.context.stroke();

                    this.drawCline(this.position, args[0]);
                // this.drawBline(this.position, args[0]);
                // this.drawLine(this.position, args[0]);
                    this.position = args[0];
                    fill.push(args[0]);
                    break;

                // case 'font':         this.context.font = args[0]; break;
                // case 'textBaseline': this.context.textBaseline = args[0]; break;
                // case 'putImageData': this.context.putImageData(args[0], args[1], args[2], args[3], args[4], args[5], args[6]); break;
                // case 'drawImage':    this.context.drawImage(args[0], args[1].xpos, args[1].ypos, args[2], args[3]); break;
            }
        }

        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height)
    }
    ImageDataStage.prototype.fillTriangle = function(p1, p2, p3) {
        var top, middle, bottom, a;

        var min = Math.min(p1.ypos, p2.ypos, p3.ypos);
        var max = Math.max(p1.ypos, p2.ypos, p3.ypos);

        for (var i = 0; i < 3; i++) {
            a = arguments[i];
            switch(true) {
                case min === a.ypos && !top: top = a;
                case max === a.ypos && !bottom: bottom = a;
                default: middle = a;
            }
        }

        // console.log(top, middle, bottom)

        var x, y, x0, x1, y0, y1, z = 0;
        var z0, z1, lz, rz;

        var lx, rx;
        var fromX, toX;
        var lineX, lineY;

        x0 = top.xpos;
        y0 = top.ypos;
        z0 = top.z;
        // console.log(top.ypos, middle.ypos);
        for (var y = top.ypos; y < middle.ypos; y++) {
            x1 = middle.xpos;
            y1 = middle.ypos;
            z1 = middle.z;

            // lx = x0;
            // if (x0 !== x1) {
            lx = this.interpolate(y0, y1, x0, x1, y);
            lz = this.interpolate(y0, y1, z0, z1, y);
            // }
            // console.log(lz);

            // rx = 116;
            // console.log(y0 != y1 && x0 != x1);
            x1 = bottom.xpos;
            y1 = bottom.ypos;
            z1 = bottom.z;
            rx = x1;
            rz = lz;
            // console.log(x0, x1, y0, y1);
            if (x0 !== x1) {
                rx = this.interpolate(y0, y1, x0, x1, y);
                rz = this.interpolate(y0, y1, z0, z1, y);
            }
            // console.log(lx, rx)
                // console.log(lz, rz);

            fromX = Math.min(lx, rx);
            toX = Math.max(lx, rx);

            if (fromX === toX) continue;

            var blz = lz;
            if (fromX !== lx) {
                lz = rz;
                rz = blz;
            }
            // lz = fromX === lx ? lz : rx;

            // console.log(fromX, toX)

            for (lineX = fromX; lineX < toX; lineX++) {
                z = this.interpolate(fromX, toX, lz, rz, lineX);
                // console.log(z)
                this.drawPoint(new Point(lineX, y, z), this.color);
            }
        }
    }
    ImageDataStage.prototype.drawCline = function(point0, point1) {
        var x, y, x0, x1, y0, y1, z = 0;

        if (point1.ypos > point0.ypos) {
            x0 = point0.xpos >> 0;
            y0 = point0.ypos >> 0;
            x1 = point1.xpos >> 0;
            y1 = point1.ypos >> 0;
            for (y = y0; y < y1; y++) {
                x = this.interpolate(y0, y1, x0, x1, y);
                this.drawPoint(new Point(x, y, z), this.color);
            }
        } else if (point1.ypos < point0.ypos) {
            x0 = point1.xpos >> 0;
            y0 = point1.ypos >> 0;
            x1 = point0.xpos >> 0;
            y1 = point0.ypos >> 0;
            for (y = y0; y < y1; y++) {
                x = this.interpolate(y0, y1, x0, x1, y);
                this.drawPoint(new Point(x, y, z), this.color);
            }
        }

        if (point1.xpos > point0.xpos) {
            x0 = point0.xpos;
            y0 = point0.ypos;
            x1 = point1.xpos;
            y1 = point1.ypos;
            for (x = x0; x < x1; x++) {
                y = this.interpolate(x0, x1, y0, y1, x);
                this.drawPoint(new Point(x, y, z), this.color);
            }
        } else if (point1.xpos < point0.xpos) {
            x0 = point1.xpos >> 0;
            y0 = point1.ypos >> 0;
            x1 = point0.xpos >> 0;
            y1 = point0.ypos >> 0;
            for (x = x0; x < x1; x++) {
                y = this.interpolate(x0, x1, y0, y1, x);
                this.drawPoint(new Point(x, y, z), this.color);
            }
        }
    }
    ImageDataStage.prototype.drawLine = function (point0, point1) {
        var dist = point1.subtract(point0).length2();

        // If the distance between the 2 points is less than 2 pixels
        // We're exiting
        if(dist < 2) {
            return;
        }

        // Find the middle point between first & second point
        var middlePoint = point0.add((point1.subtract(point0)).scale(0.5));
        // We draw this point on screen
        this.drawPoint(middlePoint);
        // Recursive algorithm launched between first & middle point
        // and between middle & second point
        this.drawLine(point0, middlePoint);
        this.drawLine(middlePoint, point1);
    };
    ImageDataStage.prototype.drawBline = function (point0, point1) {
        var x0 = point0.xpos >> 0;
        var y0 = point0.ypos >> 0;
        var x1 = point1.xpos >> 0;
        var y1 = point1.ypos >> 0;
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
        while(true) {
            this.drawPoint(new Point(x0, y0, 0));
            if((x0 == x1) && (y0 == y1)) break;
            var e2 = 2 * err;
            if(e2 > -dy) { err -= dy; x0 += sx; }
            if(e2 < dx) { err += dx; y0 += sy; }
        }
    };
    ImageDataStage.prototype.interpolate = function(x0, x1, y0, y1, x) {
        return (y0 + ((y1 - y0) * (x - x0) / (x1- x0))) >> 0;
    }
    ImageDataStage.prototype.drawPoint = function(point) {
        this.drawPixel(point.x, point.y, point.z, this.color)
    }
    ImageDataStage.prototype.drawPixel = function(x, y, z, color) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) return;
        this.putPixel(x, y, z, color);
    }
    ImageDataStage.prototype.putPixel = function(x, y, z, color) {
        var index = (y * this.width) + x;
        var index4 = index * 4;

        if (this.zbuffer[index] < z) return;
        this.zbuffer[index] = z;

        this.imageData.data[index4]     = color.r;
        this.imageData.data[index4 + 1] = color.g;
        this.imageData.data[index4 + 2] = color.b;
        this.imageData.data[index4 + 3] = color.a;
    }
    ImageDataStage.prototype.fillRect = function(point, width, height) {
        this.buffer.push(['fillRect', [point, width, height]]);
    }
    ImageDataStage.prototype.beginPath = function() {
        this.buffer.push(['beginPath']);
    }
    ImageDataStage.prototype.closePath = function() {
        this.buffer.push(['closePath']);
    }
    ImageDataStage.prototype.fill = function() {
        this.buffer.push(['fill']);
    }
    ImageDataStage.prototype.stroke = function() {
        this.buffer.push(['stroke']);
    }
    ImageDataStage.prototype.moveTo = function(point) {
        this.buffer.push(['moveTo', [point]]);
    }
    ImageDataStage.prototype.lineTo = function(point) {
        this.buffer.push(['lineTo', [point]]);
    }
    ImageDataStage.prototype.fillStyle = function(style) {
        this.buffer.push(['fillStyle', [style]]);
    }
    ImageDataStage.prototype.fillText = function(text, point, options) {
        this.buffer.push(['font', [options.style + ' ' + options.weigth + ' ' + options.size + ' ' + options.font]]);
        this.buffer.push(['textBaseline', [options.baseline]]);
        this.buffer.push(['fillText', [text, point]]);
    }
    ImageDataStage.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    ImageDataStage.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.buffer.push(['putImageData', [imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight]]);
    }
    ImageDataStage.prototype.drawImage = function(img, point, width, height) {
        this.buffer.push(['drawImage', [img, point, width, height]]);
    }

    return ImageDataStage;
})
;
define('shape/stage/canvas3d',['shape/stage/imagedata', 'shape/point/point'], function(ImageDataStage, Point){
    

    function Canvas3DStage(canvas, projection) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.projection = projection;
        this.buffer = [];
        this.imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
        this.zbuffer = Array(this.width * this.height);
        this.nullPoint = new Point(0,0,0);
    }
    Canvas3DStage.constructor = Canvas3DStage;
    Canvas3DStage.prototype = Object.create(ImageDataStage.prototype);
    Canvas3DStage.prototype.render = function() {
        var state, self = this;
        // this.context.clearRect(0, 0, this.width, this.height)
        // this.canvas.width = this.width;
        this.clean();
        this.each(function(child){
            // state = child.state();
            // state = child.STATE_DIRTY;
            // if (child.STATE_RENDERED !== state) {
                self.projection.project(child);
                child.render(self);
                // child.state(child.STATE_RENDERED);
            // } else {
                // child.area();
            // }
        })

        this.flush();
    }

    return Canvas3DStage;
})
;
define(
    'game/service',[
    'game/config',
    'shape/shape/cube',
    'shape/mesh/cube',
    'shape/color',
    'shape/shape/image',
    'shape/shape/sprite',
    'game/action/manager',
    'state',
    'game/action/move/right',
    'game/action/move/left',
    'game/action/move/up',
    'game/action/move/down',
    'game/action/rotate/right',
    'game/action/rotate/left',
    'game/action/rotate/up',
    'game/action/rotate/down',
    'shape/collision/manager',
    'shape/utils/assets',
    'shape/utils/imagedata',
    'shape/utils/sprites',
    'game/stage/start',
    'game/stage/game',
    'shape/projection/camera',
    'shape/stage/canvas3d'
],
function(
    GameConfig,
    CubeShape,
    CubeMesh,
    Color,
    ImageShape,
    SpriteShape,
    ActionManager,
    StateMachine,
    ActionMoveRight,
    ActionMoveLeft,
    ActionMoveUp,
    ActionMoveDown,
    ActionShowRightEdge,
    ActionShowLeftEdge,
    ActionShowUpEdge,
    ActionShowDownEdge,
    CollisionManager,
    AssetUtil,
    ImageDataUtil,
    SpriteUtil,
    StartStage,
    GameStage,
    CameraProjection,
    Canvas3DStage
) {
    function ServiceManager(game, canvas) {
        this.game = game;
        this.instances = {
            'canvas' : canvas
        };
    }

    ServiceManager.prototype.get = function(name, func) {
        if (!this.instances.hasOwnProperty(name)) {
            this.instances[name] = func.call(this);
        }
        return this.instances[name];
    }
    ServiceManager.prototype.config = function() {
        return this.get('config', function() {
            return GameConfig;
        })
    }
    ServiceManager.prototype.collisionManager = function() {
        return this.get('collisionManager', function() {
            return new CollisionManager();
        })
    }
    ServiceManager.prototype.assetManager = function() {
        return this.get('assetManager', function() {
            var am = new AssetUtil(this.config().BASE_URL);
            am.loadImage('box', 'reindeer.png');
            am.loadImage('reindeer', 'reindeer-sprite.png');
            am.loadImage('gift-blue', 'gift-blue.png');
            am.loadImage('gift-red', 'gift-red.png');
            am.loadAudio2('melody', 'melody.mp3');
            am.loadAudio2('ring', 'ring.mp3');

            am.on('init:reindeer', function(e, object) {
                return new SpriteUtil(
                    new ImageDataUtil(object),
                    40,
                    40
                );
            });

            return am;
        })
    }
    ServiceManager.prototype.giftFactory = function(x, y, z) {
        // var am = this.assetManager();
        // var gift = Math.random() > 0.5 ? 'gift-red' : 'gift-blue';
        // var image = new ImageShape(x, y, z, this.config().CUBE_FIELD_SIZE, this.config().CUBE_FIELD_SIZE);
        // am.get(gift, image.setImage.bind(image));
        // return image;

        return new CubeMesh(x, y, z, this.config().CUBE_FIELD_SIZE, Color.fromName('red'));
        return new CubeShape(x, y, z, this.config().CUBE_FIELD_SIZE, {r:0, g: 255, b:0, a:255})
    }
    ServiceManager.prototype.actionManager = function() {
        return this.get('actionManager', function() {
            return new ActionManager();
        })
    }
    ServiceManager.prototype.stateMachineMove = function() {
        return this.get('stateMachineMove', function() {
            return new StateMachine(this.config().state.move);
        })
    }
    ServiceManager.prototype.actionMoveRight = function() {
        return this.get('actionMoveRight', function() {
            return new ActionMoveRight(
                this.cube(),
                this.config().GAME_SPEED,
                this.config().GAME_STEP
            );
        })
    }
    ServiceManager.prototype.actionMoveLeft = function() {
        return this.get('actionMoveLeft', function() {
            return new ActionMoveLeft(
                this.cube(),
                this.config().GAME_SPEED,
                this.config().GAME_STEP
            );
        })
    }
    ServiceManager.prototype.actionMoveUp = function() {
        return this.get('actionMoveUp', function() {
            return new ActionMoveUp(
                this.cube(),
                this.config().GAME_SPEED,
                this.config().GAME_STEP
            );
        })
    }
    ServiceManager.prototype.actionMoveDown = function() {
        return this.get('actionMoveDown', function() {
            return new ActionMoveDown(
                this.cube(),
                this.config().GAME_SPEED,
                this.config().GAME_STEP
            );
        })
    }
    ServiceManager.prototype.actionShowRightEdge = function() {
        return this.get('actionShowRightEdge', function() {
            return new ActionShowRightEdge(
                this.gameStage(),
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            );
        })
    }
    ServiceManager.prototype.actionShowLeftEdge = function() {
        return this.get('actionShowLeftEdge', function() {
            return new ActionShowLeftEdge(
                this.gameStage(),
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            );
        })
    }
    ServiceManager.prototype.actionShowUpEdge = function() {
        return this.get('actionShowUpEdge', function() {
            return new ActionShowUpEdge(
                this.gameStage(),
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            );
        })
    }
    ServiceManager.prototype.actionShowDownEdge = function() {
        return this.get('actionShowDownEdge', function() {
            return new ActionShowDownEdge(
                this.gameStage(),
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            );
        })
    }
    ServiceManager.prototype.cube = function() {
        return this.get('cube', function() {
            return new CubeMesh(
                0,
                0,
                this.config().BOARD_WIDTH / 2 + this.config().CUBE_FIELD_SIZE / 2,
                this.config().CUBE_FIELD_SIZE,
                Color.fromName('green')
            );
            return new CubeShape(
                0,
                0,
                this.config().BOARD_WIDTH / 2 + this.config().CUBE_FIELD_SIZE / 2,
                this.config().CUBE_FIELD_SIZE,
                {r:255, g:0, b:0, a:255}
            );

            var shape = new SpriteShape(0, 0, -this.config().BOARD_WIDTH / 2 + this.config().CUBE_FIELD_SIZE / 2, this.config().CUBE_FIELD_SIZE);

            this.assetManager().get('reindeer', shape.setSprite.bind(shape));

            return shape;
        })
    }
    ServiceManager.prototype.canvas = function() {
        return this.get('canvas');
    }
    ServiceManager.prototype.startStage = function() {
        return this.get('startStage', function() {
            return new StartStage(
                this
            );
        });
    }
    ServiceManager.prototype.gameStage = function() {
        return this.get('gameStage', function() {
            return new GameStage(
                this
            );
        });
    }
    ServiceManager.prototype.projection = function() {
        return this.get('projection', function() {
            return new CameraProjection(this.canvas().width / 2, this.canvas().height / 2);
        });
    }
    ServiceManager.prototype.createStage = function() {
        return new Canvas3DStage(this.canvas(), this.projection());
    }

    return ServiceManager;
})
;
define('game',[
    'hammerjs',
    'game/service',
    'math/vector3'
],
function(
    Hemmer,
    ServiceManager,
    Vector3
) {
    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        var self = this;

        this.service = new ServiceManager(this, canvas);

        this.config = this.service.config();
        this.actionManager = this.service.actionManager();

        // Move State Machine
        this.stateMachine = this.service.stateMachineMove();

        // Switch stages
        this.stateMachine.on('enter:play', function(e) {
            self.currentStage = self.service.gameStage();
        });
        this.stateMachine.on('enter:start', function(e) {
            self.currentStage = self.service.startStage();
        });
        this.stateMachine.on('enter:end', function() {
            document.getElementById('santa').className += ' happy';
        });

        // Manage game stage
        this.stateMachine.on('enter:left', function(e) {
            self.actionManager.set('move', self.service.actionMoveLeft());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:right', function(e) {
            self.actionManager.set('move', self.service.actionMoveRight());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:up', function(e) {
            self.actionManager.set('move', self.service.actionMoveUp());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:down', function(e) {
            self.actionManager.set('move', self.service.actionMoveDown());
            e.lock(self.actionManager.proxy('canStop', 'move'));
        })
        this.stateMachine.on('enter:show_right_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set(
                'rotate',
                self.service.actionShowRightEdge().on('finish', self.stateMachine.proxy('right.face.visible'))
            );
        })
        this.stateMachine.on('enter:show_left_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set(
                'rotate',
                self.service.actionShowLeftEdge().on('finish', self.stateMachine.proxy('left.face.visible'))
            );
        });
        this.stateMachine.on('enter:show_up_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set(
                'rotate',
                self.service.actionShowUpEdge().on('finish', self.stateMachine.proxy('up.face.visible'))
            );
        });
        this.stateMachine.on('enter:show_down_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set(
                'rotate',
                self.service.actionShowDownEdge().on('finish', self.stateMachine.proxy('down.face.visible'))
            );
        });

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        Hammer(canvas)
        .on('dragleft', self.stateMachine.proxy('press.left'))
        .on('dragright', self.stateMachine.proxy('press.right'))
        .on('dragup', self.stateMachine.proxy('press.up'))
        .on('dragdown', self.stateMachine.proxy('press.down'))
        .on('drag', self.stateMachine.proxy('press.enter'))

        this.stateMachine.trigger('init');
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'captureKeys' : function(e) {
            switch(e.keyCode) {
                case 37: e.preventDefault(); this.stateMachine.trigger('press.left'); break;
                case 38: e.preventDefault(); this.stateMachine.trigger('press.up'); break;
                case 39: e.preventDefault(); this.stateMachine.trigger('press.right'); break;
                case 40: e.preventDefault(); this.stateMachine.trigger('press.down'); break;
                case 13: e.preventDefault(); this.stateMachine.trigger('press.enter'); break;
                // default: console.log(e.keyCode);
            }
        },
        'run': function() {
            var self = this;
            var FPS = 30;
            var timestamp = function() { return new Date().getTime()};

            var last, time = timestamp();
            // var d = document.getElementById('fps');

            function loop() {
                // last = timestamp();

                // if (self.enemies.count <= self.collect) {
                // self.stateMachine.trigger('found.gifts');
                // return;
                // }

                // One more time
                requestAnimationFrame(loop);
                // Run actions
                self.actionManager.run();
                self.currentStage.updateState(self.stateMachine);
                self.stateMachine.run();
                self.currentStage.tick();

                // d.innerText = 1000 / (last - time) >> 0;

                // time = last;
            }
            requestAnimationFrame(loop);
            // setInterval(loop, 300)
            // loop()
        }
    };

    return TetrisGame;
});

require.config({
    baseUrl: "js",
    paths: {
        hammerjs: '../bower_components/hammerjs/dist/hammer.min'
    }
    ,optimize: "none"
});

require(['game'], function(TetrisGame) {
    

    var tetris, game;

    game = document.createElement('canvas');
    game.setAttribute('id', 'board');
    game.width = 450;
    game.height = 450;
    document.body.appendChild(game);

    // Catch user events
    document.ontouchmove = function(event){
        event.preventDefault();
    }

    tetris = new TetrisGame(game);
    tetris.run();

    // require(['math/matrix'], function(Matrix) {
    //     var identity = Matrix.identity(3);
    //     console.log(identity.toString());
    //     var a = new Matrix(2, [1, 0, 2, -1, 3, 1]);
    //     console.log('a', a.toString());
    //     console.log('scalar', a.scalar(-1).toString());
    //     console.log('transposed', a.transpose().toString());
    //     var b = new Matrix(3, [3, 1, 2, 1, 1, 0]);
    //     console.log(b.toString());
    //     var r = a.multiply(b);
    //     console.log(r.toString());
    // });

});

define("main", function(){});
