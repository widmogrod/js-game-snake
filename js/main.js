
/*! Hammer.JS - v1.0.6 - 2014-01-02
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */


!function(a,b){function c(){d.READY||(d.event.determineEventTypes(),d.utils.each(d.gestures,function(a){d.detection.register(a)}),d.event.onTouch(d.DOCUMENT,d.EVENT_MOVE,d.detection.detect),d.event.onTouch(d.DOCUMENT,d.EVENT_END,d.detection.detect),d.READY=!0)}var d=function(a,b){return new d.Instance(a,b||{})};d.defaults={stop_browser_behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},d.HAS_POINTEREVENTS=a.navigator.pointerEnabled||a.navigator.msPointerEnabled,d.HAS_TOUCHEVENTS="ontouchstart"in a,d.MOBILE_REGEX=/mobile|tablet|ip(ad|hone|od)|android|silk/i,d.NO_MOUSEEVENTS=d.HAS_TOUCHEVENTS&&a.navigator.userAgent.match(d.MOBILE_REGEX),d.EVENT_TYPES={},d.DIRECTION_DOWN="down",d.DIRECTION_LEFT="left",d.DIRECTION_UP="up",d.DIRECTION_RIGHT="right",d.POINTER_MOUSE="mouse",d.POINTER_TOUCH="touch",d.POINTER_PEN="pen",d.EVENT_START="start",d.EVENT_MOVE="move",d.EVENT_END="end",d.DOCUMENT=a.document,d.plugins=d.plugins||{},d.gestures=d.gestures||{},d.READY=!1,d.utils={extend:function(a,c,d){for(var e in c)a[e]!==b&&d||(a[e]=c[e]);return a},each:function(a,c,d){var e,f;if("forEach"in a)a.forEach(c,d);else if(a.length!==b){for(e=0,f=a.length;f>e;e++)if(c.call(d,a[e],e,a)===!1)return}else for(e in a)if(a.hasOwnProperty(e)&&c.call(d,a[e],e,a)===!1)return},hasParent:function(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1},getCenter:function(a){var b=[],c=[];return d.utils.each(a,function(a){b.push("undefined"!=typeof a.clientX?a.clientX:a.pageX),c.push("undefined"!=typeof a.clientY?a.clientY:a.pageY)}),{pageX:(Math.min.apply(Math,b)+Math.max.apply(Math,b))/2,pageY:(Math.min.apply(Math,c)+Math.max.apply(Math,c))/2}},getVelocity:function(a,b,c){return{x:Math.abs(b/a)||0,y:Math.abs(c/a)||0}},getAngle:function(a,b){var c=b.pageY-a.pageY,d=b.pageX-a.pageX;return 180*Math.atan2(c,d)/Math.PI},getDirection:function(a,b){var c=Math.abs(a.pageX-b.pageX),e=Math.abs(a.pageY-b.pageY);return c>=e?a.pageX-b.pageX>0?d.DIRECTION_LEFT:d.DIRECTION_RIGHT:a.pageY-b.pageY>0?d.DIRECTION_UP:d.DIRECTION_DOWN},getDistance:function(a,b){var c=b.pageX-a.pageX,d=b.pageY-a.pageY;return Math.sqrt(c*c+d*d)},getScale:function(a,b){return a.length>=2&&b.length>=2?this.getDistance(b[0],b[1])/this.getDistance(a[0],a[1]):1},getRotation:function(a,b){return a.length>=2&&b.length>=2?this.getAngle(b[1],b[0])-this.getAngle(a[1],a[0]):0},isVertical:function(a){return a==d.DIRECTION_UP||a==d.DIRECTION_DOWN},stopDefaultBrowserBehavior:function(a,b){b&&a&&a.style&&(d.utils.each(["webkit","khtml","moz","Moz","ms","o",""],function(c){d.utils.each(b,function(b){c&&(b=c+b.substring(0,1).toUpperCase()+b.substring(1)),b in a.style&&(a.style[b]=b)})}),"none"==b.userSelect&&(a.onselectstart=function(){return!1}),"none"==b.userDrag&&(a.ondragstart=function(){return!1}))}},d.Instance=function(a,b){var e=this;return c(),this.element=a,this.enabled=!0,this.options=d.utils.extend(d.utils.extend({},d.defaults),b||{}),this.options.stop_browser_behavior&&d.utils.stopDefaultBrowserBehavior(this.element,this.options.stop_browser_behavior),d.event.onTouch(a,d.EVENT_START,function(a){e.enabled&&d.detection.startDetect(e,a)}),this},d.Instance.prototype={on:function(a,b){var c=a.split(" ");return d.utils.each(c,function(a){this.element.addEventListener(a,b,!1)},this),this},off:function(a,b){var c=a.split(" ");return d.utils.each(c,function(a){this.element.removeEventListener(a,b,!1)},this),this},trigger:function(a,b){b||(b={});var c=d.DOCUMENT.createEvent("Event");c.initEvent(a,!0,!0),c.gesture=b;var e=this.element;return d.utils.hasParent(b.target,e)&&(e=b.target),e.dispatchEvent(c),this},enable:function(a){return this.enabled=a,this}};var e=null,f=!1,g=!1;d.event={bindDom:function(a,b,c){var e=b.split(" ");d.utils.each(e,function(b){a.addEventListener(b,c,!1)})},onTouch:function(a,b,c){var h=this;this.bindDom(a,d.EVENT_TYPES[b],function(i){var j=i.type.toLowerCase();if(!j.match(/mouse/)||!g){j.match(/touch/)||j.match(/pointerdown/)||j.match(/mouse/)&&1===i.which?f=!0:j.match(/mouse/)&&!i.which&&(f=!1),j.match(/touch|pointer/)&&(g=!0);var k=0;f&&(d.HAS_POINTEREVENTS&&b!=d.EVENT_END?k=d.PointerEvent.updatePointer(b,i):j.match(/touch/)?k=i.touches.length:g||(k=j.match(/up/)?0:1),k>0&&b==d.EVENT_END?b=d.EVENT_MOVE:k||(b=d.EVENT_END),(k||null===e)&&(e=i),c.call(d.detection,h.collectEventData(a,b,h.getTouchList(e,b),i)),d.HAS_POINTEREVENTS&&b==d.EVENT_END&&(k=d.PointerEvent.updatePointer(b,i))),k||(e=null,f=!1,g=!1,d.PointerEvent.reset())}})},determineEventTypes:function(){var a;a=d.HAS_POINTEREVENTS?d.PointerEvent.getEvents():d.NO_MOUSEEVENTS?["touchstart","touchmove","touchend touchcancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],d.EVENT_TYPES[d.EVENT_START]=a[0],d.EVENT_TYPES[d.EVENT_MOVE]=a[1],d.EVENT_TYPES[d.EVENT_END]=a[2]},getTouchList:function(a){return d.HAS_POINTEREVENTS?d.PointerEvent.getTouchList():a.touches?a.touches:(a.identifier=1,[a])},collectEventData:function(a,b,c,e){var f=d.POINTER_TOUCH;return(e.type.match(/mouse/)||d.PointerEvent.matchType(d.POINTER_MOUSE,e))&&(f=d.POINTER_MOUSE),{center:d.utils.getCenter(c),timeStamp:(new Date).getTime(),target:e.target,touches:c,eventType:b,pointerType:f,srcEvent:e,preventDefault:function(){this.srcEvent.preventManipulation&&this.srcEvent.preventManipulation(),this.srcEvent.preventDefault&&this.srcEvent.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return d.detection.stopDetect()}}}},d.PointerEvent={pointers:{},getTouchList:function(){var a=this,b=[];return d.utils.each(a.pointers,function(a){b.push(a)}),b},updatePointer:function(a,b){return a==d.EVENT_END?this.pointers={}:(b.identifier=b.pointerId,this.pointers[b.pointerId]=b),Object.keys(this.pointers).length},matchType:function(a,b){if(!b.pointerType)return!1;var c=b.pointerType,e={};return e[d.POINTER_MOUSE]=c===b.MSPOINTER_TYPE_MOUSE||c===d.POINTER_MOUSE,e[d.POINTER_TOUCH]=c===b.MSPOINTER_TYPE_TOUCH||c===d.POINTER_TOUCH,e[d.POINTER_PEN]=c===b.MSPOINTER_TYPE_PEN||c===d.POINTER_PEN,e[a]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}},d.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(a,b){this.current||(this.stopped=!1,this.current={inst:a,startEvent:d.utils.extend({},b),lastEvent:!1,name:""},this.detect(b))},detect:function(a){if(this.current&&!this.stopped){a=this.extendEventData(a);var b=this.current.inst.options;return d.utils.each(this.gestures,function(c){return this.stopped||b[c.name]===!1||c.handler.call(c,a,this.current.inst)!==!1?void 0:(this.stopDetect(),!1)},this),this.current&&(this.current.lastEvent=a),a.eventType==d.EVENT_END&&!a.touches.length-1&&this.stopDetect(),a}},stopDetect:function(){this.previous=d.utils.extend({},this.current),this.current=null,this.stopped=!0},extendEventData:function(a){var b=this.current.startEvent;!b||a.touches.length==b.touches.length&&a.touches!==b.touches||(b.touches=[],d.utils.each(a.touches,function(a){b.touches.push(d.utils.extend({},a))}));var c,e,f=a.timeStamp-b.timeStamp,g=a.center.pageX-b.center.pageX,h=a.center.pageY-b.center.pageY,i=d.utils.getVelocity(f,g,h);return"end"===a.eventType?(c=this.current.lastEvent&&this.current.lastEvent.interimAngle,e=this.current.lastEvent&&this.current.lastEvent.interimDirection):(c=this.current.lastEvent&&d.utils.getAngle(this.current.lastEvent.center,a.center),e=this.current.lastEvent&&d.utils.getDirection(this.current.lastEvent.center,a.center)),d.utils.extend(a,{deltaTime:f,deltaX:g,deltaY:h,velocityX:i.x,velocityY:i.y,distance:d.utils.getDistance(b.center,a.center),angle:d.utils.getAngle(b.center,a.center),interimAngle:c,direction:d.utils.getDirection(b.center,a.center),interimDirection:e,scale:d.utils.getScale(b.touches,a.touches),rotation:d.utils.getRotation(b.touches,a.touches),startEvent:b}),a},register:function(a){var c=a.defaults||{};return c[a.name]===b&&(c[a.name]=!0),d.utils.extend(d.defaults,c,!0),a.index=a.index||1e3,this.gestures.push(a),this.gestures.sort(function(a,b){return a.index<b.index?-1:a.index>b.index?1:0}),this.gestures}},d.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,correct_for_drag_min_distance:!0,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(a,b){if(d.detection.current.name!=this.name&&this.triggered)return b.trigger(this.name+"end",a),this.triggered=!1,void 0;if(!(b.options.drag_max_touches>0&&a.touches.length>b.options.drag_max_touches))switch(a.eventType){case d.EVENT_START:this.triggered=!1;break;case d.EVENT_MOVE:if(a.distance<b.options.drag_min_distance&&d.detection.current.name!=this.name)return;if(d.detection.current.name!=this.name&&(d.detection.current.name=this.name,b.options.correct_for_drag_min_distance&&a.distance>0)){var c=Math.abs(b.options.drag_min_distance/a.distance);d.detection.current.startEvent.center.pageX+=a.deltaX*c,d.detection.current.startEvent.center.pageY+=a.deltaY*c,a=d.detection.extendEventData(a)}(d.detection.current.lastEvent.drag_locked_to_axis||b.options.drag_lock_to_axis&&b.options.drag_lock_min_distance<=a.distance)&&(a.drag_locked_to_axis=!0);var e=d.detection.current.lastEvent.direction;a.drag_locked_to_axis&&e!==a.direction&&(a.direction=d.utils.isVertical(e)?a.deltaY<0?d.DIRECTION_UP:d.DIRECTION_DOWN:a.deltaX<0?d.DIRECTION_LEFT:d.DIRECTION_RIGHT),this.triggered||(b.trigger(this.name+"start",a),this.triggered=!0),b.trigger(this.name,a),b.trigger(this.name+a.direction,a),(b.options.drag_block_vertical&&d.utils.isVertical(a.direction)||b.options.drag_block_horizontal&&!d.utils.isVertical(a.direction))&&a.preventDefault();break;case d.EVENT_END:this.triggered&&b.trigger(this.name+"end",a),this.triggered=!1}}},d.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(a,b){switch(a.eventType){case d.EVENT_START:clearTimeout(this.timer),d.detection.current.name=this.name,this.timer=setTimeout(function(){"hold"==d.detection.current.name&&b.trigger("hold",a)},b.options.hold_timeout);break;case d.EVENT_MOVE:a.distance>b.options.hold_threshold&&clearTimeout(this.timer);break;case d.EVENT_END:clearTimeout(this.timer)}}},d.gestures.Release={name:"release",index:1/0,handler:function(a,b){a.eventType==d.EVENT_END&&b.trigger(this.name,a)}},d.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_min_touches:1,swipe_max_touches:1,swipe_velocity:.7},handler:function(a,b){if(a.eventType==d.EVENT_END){if(b.options.swipe_max_touches>0&&a.touches.length<b.options.swipe_min_touches&&a.touches.length>b.options.swipe_max_touches)return;(a.velocityX>b.options.swipe_velocity||a.velocityY>b.options.swipe_velocity)&&(b.trigger(this.name,a),b.trigger(this.name+a.direction,a))}}},d.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},handler:function(a,b){if(a.eventType==d.EVENT_END&&"touchcancel"!=a.srcEvent.type){var c=d.detection.previous,e=!1;if(a.deltaTime>b.options.tap_max_touchtime||a.distance>b.options.tap_max_distance)return;c&&"tap"==c.name&&a.timeStamp-c.lastEvent.timeStamp<b.options.doubletap_interval&&a.distance<b.options.doubletap_distance&&(b.trigger("doubletap",a),e=!0),(!e||b.options.tap_always)&&(d.detection.current.name="tap",b.trigger(d.detection.current.name,a))}}},d.gestures.Touch={name:"touch",index:-1/0,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(a,b){return b.options.prevent_mouseevents&&a.pointerType==d.POINTER_MOUSE?(a.stopDetect(),void 0):(b.options.prevent_default&&a.preventDefault(),a.eventType==d.EVENT_START&&b.trigger(this.name,a),void 0)}},d.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1},triggered:!1,handler:function(a,b){if(d.detection.current.name!=this.name&&this.triggered)return b.trigger(this.name+"end",a),this.triggered=!1,void 0;if(!(a.touches.length<2))switch(b.options.transform_always_block&&a.preventDefault(),a.eventType){case d.EVENT_START:this.triggered=!1;break;case d.EVENT_MOVE:var c=Math.abs(1-a.scale),e=Math.abs(a.rotation);if(c<b.options.transform_min_scale&&e<b.options.transform_min_rotation)return;d.detection.current.name=this.name,this.triggered||(b.trigger(this.name+"start",a),this.triggered=!0),b.trigger(this.name,a),e>b.options.transform_min_rotation&&b.trigger("rotate",a),c>b.options.transform_min_scale&&(b.trigger("pinch",a),b.trigger("pinch"+(a.scale<1?"in":"out"),a));break;case d.EVENT_END:this.triggered&&b.trigger(this.name+"end",a),this.triggered=!1}}},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define('hammerjs',[],function(){return d}):"object"==typeof module&&"object"==typeof module.exports?module.exports=d:a.Hammer=d}(this);
//# sourceMappingURL=hammer.min.map;
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

    Matrix.prototype.constructor = Matrix;
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
                result += this.getAt(row, col).toFixed(3);
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
    

    var abs = Math.abs,
        sqrt = Math.sqrt;

    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rows = 3;
        this.cols = 1;
        this.data = [this.x, this.y, this.z]
    }

    Vector3.left = function() {
        return new Vector3(-1, 0, 0);
    }
    Vector3.right = function() {
        return new Vector3(1, 0, 0);
    }
    Vector3.forward = function() {
        return new Vector3(0, 0, 1);
    }
    Vector3.back = function() {
        return new Vector3(0, 0, -1);
    }
    Vector3.up = function() {
        return new Vector3(0, 1, 0);
    }
    Vector3.down = function() {
        return new Vector3(0, -1, 0);
    }
    Vector3.zero = function() {
        return new Vector3(0, 0, 0);
    }
    Vector3.one = function() {
        return new Vector3(1, 1, 1);
    }

    Vector3.constructor = Vector3;
    Vector3.prototype = Object.create(Matrix.prototype);
    Vector3.prototype.toString = function() {
        return 'Vector3(' + this.x.toFixed(3) +','+ this.y.toFixed(3) +','+ this.z.toFixed(3) + ')';
    }
    Vector3.prototype.clone = function() {
        return new Vector3(this.x, this.y, this.z);
    }
    Vector3.prototype.get = function(index) {
        return [this.x, this.y, this.z][index];
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
        return sqrt(this.lengthSqrt());
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
        return new Vector3(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }
    Vector3.prototype.abs = function() {
        return new Vector3(
            abs(this.x),
            abs(this.y),
            abs(this.z)
        );
    }
    Vector3.prototype.round = function() {
        return new Vector3(
            this.x >> 0,
            this.y >> 0,
            this.z >> 0
        );
    }

    return Vector3;
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
define('shape/renderer/renderer',['math/vector3', 'shape/color'], function(Vector3, Color){
    

    function Renderer(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.buffer = [];
        this.zbuffer = Array(this.width * this.height);
        this.nullPoint = Vector3.zero();
        this.position = this.nullPoint;
        this.color = Color.fromName('black');
    }

    Renderer.constructor = Renderer;
    Renderer.prototype.clean = function() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.buffer = []
        this.zbuffer = []
        this.position = this.nullPoint;
        this.color = Color.fromName('black');
    }
    Renderer.prototype.render = function() {
        this.flush();
    };
    Renderer.prototype.flush = function() {
        var method, args;
        var i = 0,
        buffer = this.buffer,
        length = buffer.length;

        this.buffer = [];
        this.position = this.nullPoint;
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

                // case 'fillRect':     this.context.fillRect(args[0].x, args[0].y, args[1], args[2]); break;
                case 'fillStyle':
                    colors.push(
                        args[0] instanceof Color ? args[0] : Color.fromName('black')
                );
                // this.context.fillStyle = 'rgba('+ this.color.r +','+ this.color.g +','+ this.color.b +',1)';
                break;

                // case 'fillText':     this.context.fillText(args[0], args[1].x, args[1].y); break;
                case 'beginPath':
                    this.color = colors.length ? colors[colors.length - 1] : this.color;
                break;

                case 'closePath':
                    // colors.shift();
                break;
                case 'moveTo':
                    // this.context.moveTo(args[0].x, args[0].y);
                    this.position = args[0];
                // fill.push(args[0]);
                break;

                case 'lineTo':
                    // this.context.lineTo(args[0].x, args[0].y);
                    // this.context.stroke();

                    // this.drawCline(this.position, args[0]);
                this.drawBline(this.position, args[0]);
                // this.drawLine(this.position, args[0]);
                this.position = args[0];
                fill.push(args[0]);
                break;

                // case 'font':         this.context.font = args[0]; break;
                // case 'textBaseline': this.context.textBaseline = args[0]; break;
                // case 'putImageData': this.context.putImageData(args[0], args[1], args[2], args[3], args[4], args[5], args[6]); break;
                // case 'drawImage':    this.context.drawImage(args[0], args[1].x, args[1].y, args[2], args[3]); break;
            }
        }

        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height)
    }
    Renderer.prototype.fillTriangle = function(p1, p2, p3) {
        var top, middle, bottom, a;

        var min = Math.min(p1.y, p2.y, p3.y);
        var max = Math.max(p1.y, p2.y, p3.y);

        for (var i = 0; i < 3; i++) {
            a = arguments[i];
            switch(true) {
                case min === a.y && !top: top = a;
                case max === a.y && !bottom: bottom = a;
                default: middle = a;
            }
        }

        // console.log(top, middle, bottom)

        var x, y, x0, x1, y0, y1, z = 0;
        var z0, z1, lz, rz;

        var lx, rx;
        var fromX, toX;
        var lineX, lineY;

        x0 = top.x;
        y0 = top.y;
        z0 = top.z;
        // console.log(top.y, middle.y);
        for (var y = top.y; y < middle.y; y++) {
            x1 = middle.x;
            y1 = middle.y;
            z1 = middle.z;

            // lx = x0;
            // if (x0 !== x1) {
            lx = this.interpolate(y0, y1, x0, x1, y);
            lz = this.interpolate(y0, y1, z0, z1, y);
            // }
            // console.log(lz);

            // rx = 116;
            // console.log(y0 != y1 && x0 != x1);
            x1 = bottom.x;
            y1 = bottom.y;
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
                this.drawPoint(new Vector3(lineX, y, z), this.color);
            }
        }
    }
    Renderer.prototype.drawCline = function(point0, point1) {
        var x, y, x0, x1, y0, y1, z = 0;

        if (point1.y > point0.y) {
            x0 = point0.x >> 0;
            y0 = point0.y >> 0;
            x1 = point1.x >> 0;
            y1 = point1.y >> 0;
            for (y = y0; y < y1; y++) {
                x = this.interpolate(y0, y1, x0, x1, y);
                this.drawPoint(new Vector3(x, y, z), this.color);
            }
        } else if (point1.y < point0.y) {
            x0 = point1.x >> 0;
            y0 = point1.y >> 0;
            x1 = point0.x >> 0;
            y1 = point0.y >> 0;
            for (y = y0; y < y1; y++) {
                x = this.interpolate(y0, y1, x0, x1, y);
                this.drawPoint(new Vector3(x, y, z), this.color);
            }
        }

        if (point1.x > point0.x) {
            x0 = point0.x;
            y0 = point0.y;
            x1 = point1.x;
            y1 = point1.y;
            for (x = x0; x < x1; x++) {
                y = this.interpolate(x0, x1, y0, y1, x);
                this.drawPoint(new Vector3(x, y, z), this.color);
            }
        } else if (point1.x < point0.x) {
            x0 = point1.x >> 0;
            y0 = point1.y >> 0;
            x1 = point0.x >> 0;
            y1 = point0.y >> 0;
            for (x = x0; x < x1; x++) {
                y = this.interpolate(x0, x1, y0, y1, x);
                this.drawPoint(new Vector3(x, y, z), this.color);
            }
        }
    }
    Renderer.prototype.drawLine = function (point0, point1) {
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
    Renderer.prototype.drawBline = function (point0, point1) {
        var x0 = point0.x >> 0;
        var y0 = point0.y >> 0;
        var x1 = point1.x >> 0;
        var y1 = point1.y >> 0;
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
        while(true) {
            this.drawPoint(new Vector3(x0, y0, 0));
            if((x0 == x1) && (y0 == y1)) break;
            var e2 = 2 * err;
            if(e2 > -dy) { err -= dy; x0 += sx; }
            if(e2 < dx) { err += dx; y0 += sy; }
        }
    };
    Renderer.prototype.interpolate = function(x0, x1, y0, y1, x) {
        return (y0 + ((y1 - y0) * (x - x0) / (x1- x0))) >> 0;
    }
    Renderer.prototype.drawPoint = function(point) {
        this.drawPixel(point.x, point.y, point.z, this.color)
    }
    Renderer.prototype.drawPixel = function(x, y, z, color) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) return;
        this.putPixel(x, y, z, color);
    }
    Renderer.prototype.putPixel = function(x, y, z, color) {
        var index = (y * this.width) + x;
        var index4 = index * 4;

        if (this.zbuffer[index] < z) return;
        this.zbuffer[index] = z;

        this.imageData.data[index4]     = color.r;
        this.imageData.data[index4 + 1] = color.g;
        this.imageData.data[index4 + 2] = color.b;
        this.imageData.data[index4 + 3] = color.a;
    }
    Renderer.prototype.fillRect = function(point, width, height) {
        this.buffer.push(['fillRect', [point, width, height]]);
    }
    Renderer.prototype.beginPath = function() {
        this.buffer.push(['beginPath']);
    }
    Renderer.prototype.closePath = function() {
        this.buffer.push(['closePath']);
    }
    Renderer.prototype.fill = function() {
        this.buffer.push(['fill']);
    }
    Renderer.prototype.stroke = function() {
        this.buffer.push(['stroke']);
    }
    Renderer.prototype.moveTo = function(point) {
        this.buffer.push(['moveTo', [point]]);
    }
    Renderer.prototype.lineTo = function(point) {
        this.buffer.push(['lineTo', [point]]);
    }
    Renderer.prototype.fillStyle = function(style) {
        this.buffer.push(['fillStyle', [style]]);
    }
    Renderer.prototype.fillText = function(text, point, options) {
        this.buffer.push(['font', [options.style + ' ' + options.weigth + ' ' + options.size + ' ' + options.font]]);
        this.buffer.push(['textBaseline', [options.baseline]]);
        this.buffer.push(['fillText', [text, point]]);
    }
    Renderer.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    Renderer.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.buffer.push(['putImageData', [imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight]]);
    }
    Renderer.prototype.drawImage = function(img, point, width, height) {
        this.buffer.push(['drawImage', [img, point, width, height]]);
    }

    return Renderer;
});

define('math/vector4',['math/matrix'], function(Matrix) {
    

    function Vector4(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.rows = 4;
        this.cols = 1;
        this.data = [this.x, this.y, this.z, this.w]

    }
    Vector4.constructor = Vector4;
    Vector4.prototype = Object.create(Matrix.prototype);
    Vector4.prototype.toString = function() {
        return 'Vector4(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ',' + this.z.toFixed(3) + ',' + this.w.toFixed(3) + ')';
    }
    Vector4.prototype.normalize = function() {
        var length = this.length();
        return new Vector4(
            this.x / length,
            this.y / length,
            this.z / length,
            this.z / length
        );
    }
    Vector4.prototype.length = function() {
        return Math.sqrt(
            (this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w)
        );
    }
    Vector4.prototype.subtract = function(vector) {
        return new Vector4(
            (this.x - vector.x), (this.y - vector.y), (this.z - vector.z), (this.w - vector.w)
        );
    }
    Vector4.prototype.add = function(vector) {
        return new Vector4(
            (this.x + vector.x), (this.y + vector.y), (this.z + vector.z), (this.w + vector.w)
        );
    }
    Vector4.prototype.scale = function(scale) {
        return new Vector4(
            (this.x * scale), (this.y * scale), (this.z * scale), (this.w * scale)
        );
    }
    Vector4.prototype.dot = function(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z) + (this.w * vector.w);
    }
    Vector4.prototype.angle = function(vector) {
        var divisor = this.length() * vector.length();
        if (divisor === 0) return null;

        var angle = this.dot(vector) / divisor;

        if (angle < -1) { angle = -1; }
        if (angle > 1) { angle = 1; }

        return Math.acos(angle);
    }

    return Vector4;
})
;
define('math/matrix4',[
    'math/matrix',
    'math/vector3',
    'math/vector4'
], function(
    Matrix,
    Vector3,
    Vector4
) {
    

    var TO_RADIAN = Math.PI / 180;

    function Matrix4(data) {
        this.rows = 4;
        this.data = data;
        this.count = 16;
        this.cols = 4;
    }

    Matrix4.prototype = Object.create(Matrix.prototype);
    Matrix4.prototype.constructor = Matrix4;
    Matrix4.prototype.multiply = function(matrixOrVector) {
        var isVector3 = matrixOrVector instanceof Vector3;
        if (isVector3) {
            matrixOrVector = new Vector4(
                matrixOrVector.x,
                matrixOrVector.y,
                matrixOrVector.z,
                1
            );
        }

        var result = Matrix.prototype.multiply.call(this, matrixOrVector);

        if (isVector3) {
            result = new Vector3(
                result.getAt(0, 0),
                result.getAt(1, 0),
                result.getAt(2, 0)
            );
        } else if (matrixOrVector instanceof Vector4) {
            result = new Vector4(
                result.getAt(0, 0),
                result.getAt(1, 0),
                result.getAt(2, 0),
                result.getAt(3, 0)
            );
        } else {
            result = new Matrix4(result.data);
        }

        return result;
    }
    Matrix4.prototype.setScale = function(x, y, z) {
        this.setAt(0, 0, x);
        this.setAt(1, 1, y);
        this.setAt(2, 2, z);
    }
    Matrix4.prototype.setScaleVector = function(vector) {
        this.setScale(vector.x, vector.y, vector.z);
    }
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
    Matrix4.scale = function(vector) {
        var result = Matrix4.identity();
        result.setScaleVector(vector);
        return result;
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
        return new Matrix4([
            1, 0, 0, 0,
            0, cos, sin, 0,
            0, -sin, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationY = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix4([
            cos, 0, -sin, 0,
            0, 1, 0, 0,
            sin, 0, cos, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.rotationZ = function(angle) {
        angle *= TO_RADIAN;
        var sin = Math.sin(angle), cos = Math.cos(angle);
        return new Matrix4([
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.lookAtRH = function(eye, at, up) {
        var zaxis = eye.subtract(at).normalize();
        var xaxis = up.cross(zaxis).normalize();
        var yaxis = zaxis.cross(xaxis);

        // console.log('zaxis', zaxis.toString())

        var Ti = new Matrix4([
            1, 0, 0, -eye.x,
            0, 1, 0, -eye.y,
            0, 0, 1, -eye.z,
            0, 0, 0, 1
        ]);

        var Ri = new Matrix4([
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1,
        ]).transpose();

        return Ri.multiply(Ti);
    }
    Matrix4.orthogonalProjection = function(width, height, angle, d) {
        angle *= TO_RADIAN / 2;
        d = d || -1;

        var ratio = width/height;

        var ew = Math.tan(angle) * Math.abs(d) * 2;
        var eh = ew / ratio;

        return new Matrix4([
            1/ew, 0, 0, 0,
            0, 1/eh, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    Matrix4.perspectiveProjection = function(width, height, angle, d) {
        angle *= TO_RADIAN / 2;
        d = d || -1;

        var ratio = width/height;

        var ew = Math.tan(angle) * Math.abs(d) * 2;
        var eh = ew / ratio;

        return new Matrix4([
            width/ew, 0, 0, 0,
            0, height/eh, 0, 0,
            0, 0, 1, 0,
            0, 0, 1/d, 0
        ]);
    }

    return Matrix4;
});

define('shape/render',[
    'math/matrix4',
    'math/vector3',
    'math/vector4',
    'shape/color'
], function(
    Matrix4,
    Vector3,
    Vector4,
    Color
) {
    

    function ShapeRender(viewport, renderer, viewMatrix, projectionMatrix) {
        this.viewport = viewport;
        this.renderer = renderer;
        this.viewMatrix = viewMatrix;
        this.projectionMatrix = projectionMatrix;
    }
    ShapeRender.prototype.render = function(meshes) {
        var wordMatrix, mesh, face;

        for (var i = 0, length = meshes.length; i < length; i++) {
            mesh = meshes[i];
            wordMatrix = Matrix4.translation(mesh.translation).multiply(
                Matrix4.rotation(mesh.rotation).multiply(
                    Matrix4.scale(mesh.scale)
                )
            );

            // Store vertices information in word matrix. Usefull for collision detection
            mesh.vertices.forEach(function(vertex, index) {
                mesh.verticesInWord[index] = wordMatrix.multiply(vertex);
            })

            this.transformationMatrix = this.projectionMatrix.multiply(this.viewMatrix)

            for (var f = 0, fl = mesh.faces.length; f < fl; f++) {
                face = mesh.faces[f];

                var vertexA = mesh.verticesInWord[face.a];
                var vertexB = mesh.verticesInWord[face.b];
                var vertexC = mesh.verticesInWord[face.c];

                // var normal = vertexA.subtract(vertexB).cross(vertexA.subtract(vertexC)).normalize().scale(2);
                // var pointN = this.project(vertexA.add(normal));

                var pointA = this.project(vertexA);
                var pointB = this.project(vertexB);
                var pointC = this.project(vertexC);
                // console.log(pointA.toString())

                if (pointA.z > 0 && pointB.z > 0 && pointC.z > 0) continue;
                this.renderer.fillStyle(mesh.color)
                this.drawTriangle(pointA, pointB, pointC);
                // this.renderer.fillStyle(Color.fromName('blue'));
                // this.drawLine(pointA, pointN);
            }
        }
    }
    ShapeRender.prototype.project = function(vertex) {
        // Homogeneous coordinates
        var vector4 = new Vector4(vertex.x, vertex.y, vertex.z, 1);
            vector4 = this.transformationMatrix.multiply(vector4);
        var vector3 = this.transformCoordinates(vector4);

        vector3.x = this.viewport.x + this.viewport.width/2 + vector3.x >> 0;
        vector3.y = this.viewport.y + this.viewport.height/2 - vector3.y >> 0;

        return vector3;
    }
    ShapeRender.prototype.unproject = function(vector) {
        // todo
    }

    ShapeRender.prototype.transformCoordinates = function(vector4) {
        var result = Vector3.zero(), w = vector4.w;

        if (w > 0) {
            result.x = vector4.x / w;
            result.y = vector4.y / w;
            result.z = vector4.z / w;
        } else if (w < 0) {
            result.x = -vector4.x / w;
            result.y = -vector4.y / w;
            result.z = -vector4.z / w;
        }

        return result;
    }
    ShapeRender.prototype.drawLine = function(a, b) {
        this.renderer.beginPath();
        this.renderer.moveTo(a);
        this.renderer.lineTo(b);
        this.renderer.closePath();
        this.renderer.stroke();
    }
    ShapeRender.prototype.drawTriangle = function(a, b, c) {
        this.renderer.beginPath();
        this.renderer.moveTo(a);
        this.renderer.lineTo(b);
        this.renderer.lineTo(c);
        this.renderer.lineTo(a);
        this.renderer.closePath();
        this.renderer.stroke();
    }

    return ShapeRender;
})
;
define('shape/viewport',[],function() {
    

    function Viewport(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    return Viewport;
})
;
define('math/quaternion',[
    'math/vector3'
], function(
    Vector3
) {
    

    var TO_RADIAN = Math.PI / 180,
        TO_DEGREE = 180 / Math.PI;

    var cos = Math.cos,
        sin = Math.sin,
        acos = Math.acos,
        sqrt = Math.sqrt;

    /**
     * https://github.com/BSVino/MathForGameDevelopers/blob/quaternion-transform/math/quaternion.cpp
     */
    function Quaternion(w, x, y, z) {
        if (arguments.length == 2) {
            w = w * TO_RADIAN;
            this.w = cos(w/2)
            this.v = x.scale(sin(w/2));
        } else if (arguments.length == 4) {
            this.w = w;
            this.v = new Vector3(x, y, z);
        } else {
            this.w = 0;
            this.v = Vector3.zero();
        }
    }

    Quaternion.prototype.toString = function() {
        return 'Quaternion('+ this.w.toFixed(3) +', '+ this.v.toString() +')['+ this.magnitude() +']';
    }
    Quaternion.prototype.inverted = function() {
        var result = new Quaternion();
        result.w = this.w;
        result.v = this.v.scale(-1);
        return result;
    }
    Quaternion.prototype.magnitude = function() {
        return sqrt(this.w * this.w + this.v.x * this.v.x + this.v.y * this.v.y + this.v.z * this.v.z);
    }
    Quaternion.prototype.multiply = function(quaterionOrVector) {
        return quaterionOrVector instanceof Quaternion
            ? this.multiplyQuaternion(quaterionOrVector)
            : this.multiplyVector(quaterionOrVector)
    }
    Quaternion.prototype.multiplyQuaternion = function(q2) {
        var result = new Quaternion(), q1 = this;
        result.v.x =  q1.v.x * q2.w + q1.v.y * q2.v.z - q1.v.z * q2.v.y + q1.w * q2.v.x;
		result.v.y = -q1.v.x * q2.v.z + q1.v.y * q2.w + q1.v.z * q2.v.x + q1.w * q2.v.y;
		result.v.z =  q1.v.x * q2.v.y - q1.v.y * q2.v.x + q1.v.z * q2.w + q1.w * q2.v.z;
		result.w   = -q1.v.x * q2.v.x - q1.v.y * q2.v.y - q1.v.z * q2.v.z + q1.w * q2.w;
        return result;
    }
    Quaternion.prototype.multiplyVector = function(v) {
        var p = new Quaternion(0, v.x, v.y, v.z), q = this;
        return q.multiply(p).multiply(q.inverted());
    }
    Quaternion.prototype.angle = function() {
        return 2 * acos(this.w) * TO_DEGREE >> 0;
    }
    Quaternion.prototype.axis = function() {
        // return this.v.scale(1/this.magnitude());
        var w = this.angle() * TO_RADIAN;
        var a = sin(w/2);
        return this.v.scale(1/a);
    }
    Quaternion.prototype.pow = function(t) {
        var n = this.axis();
        var w = this.angle();
        var wt = w * t;
        return new Quaternion(wt, n);
    }
    Quaternion.prototype.slerp = function(r, t) {
        var q = this;
        return r.multiply(q.inverted()).pow(t).multiply(q);
    }


    return Quaternion;
})
;
define('shape/mesh/interface',['math/matrix4', 'math/vector3'], function(Matrix4, Vector3){
    

    function MeshInterface(x, y, z) {
        this.rotation = new Vector3(0, 0, 0);
        this.translation = new Vector3(x, y, z);
        this.scale = new Vector3(1, 1, 1);
        this.vertices = [];
        this.verticesInWord = [];
        this.faces = [];
    }

    return MeshInterface;
})
;
define('shape/face',[],function() {
    

    function Face(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    return Face;
});

define('shape/mesh/cube',[
    'shape/mesh/interface',
    'math/vector3',
    'shape/face'
], function(
    MeshInterface,
    Vector3,
    Face
) {
    

    function CubeMesh(x, y, z, width, color) {
        // invoke parent constructor
        MeshInterface.call(this, x, y, z);

        var hw = width/2 >> 0;

        this.vertices.push(new Vector3(- hw,   hw, - hw));
        this.vertices.push(new Vector3(  hw,   hw, - hw));
        this.vertices.push(new Vector3(  hw, - hw, - hw));
        this.vertices.push(new Vector3(- hw, - hw, - hw));
        this.vertices.push(new Vector3(- hw,   hw,   hw));
        this.vertices.push(new Vector3(  hw,   hw,   hw));
        this.vertices.push(new Vector3(  hw, - hw,   hw));
        this.vertices.push(new Vector3(- hw, - hw,   hw));

        // in render step this will contains vertices projected on word space
        this.verticesInWord = Array(this.vertices.length);

        this.faces.push(new Face(0, 1, 5));
        this.faces.push(new Face(5, 4, 0));
        this.faces.push(new Face(1, 2, 3));
        this.faces.push(new Face(3, 0, 1));
        this.faces.push(new Face(3, 6, 2));
        this.faces.push(new Face(3, 7, 6));
        this.faces.push(new Face(1, 6, 2));
        this.faces.push(new Face(5, 6, 1));
        this.faces.push(new Face(0, 3, 7));
        this.faces.push(new Face(7, 4, 0));
        this.faces.push(new Face(4, 6, 5));
        this.faces.push(new Face(7, 6, 4));

        this.width = width;
        this.color = color;
    }
    CubeMesh.prototype = Object.create(MeshInterface.prototype);

    return CubeMesh;
})
;
define('shape/mesh/coordinate',[
    'shape/mesh/interface',
    'math/vector3',
    'shape/face'
], function(
    MeshInterface,
    Vector3,
    Face
) {
    

    function CoordinateMesh(x, y, z) {
        // invoke parent constructor
        MeshInterface.call(this, x, y, z);

        var w = 50;

        this.vertices.push(new Vector3(0, 0, 0));
        this.vertices.push(new Vector3(w, 0, 0));
        this.vertices.push(new Vector3(0, w, 0));
        this.vertices.push(new Vector3(0, 0, w));

        var p = 10;
        // x
        this.vertices.push(new Vector3(w + p,      p, 0));
        this.vertices.push(new Vector3(w + p + p, -p, 0));
        this.vertices.push(new Vector3(w + p + p,  p, 0));
        this.vertices.push(new Vector3(w + p,     -p, 0));

        // y
        this.vertices.push(new Vector3( p, w + p   , 0));
        this.vertices.push(new Vector3( p, w + 3*p, 0));
        this.vertices.push(new Vector3( p, w + 2*p, 0));
        this.vertices.push(new Vector3(-p, w + 3*p, 0));

        // in render step this will contains vertices projected on word space
        this.verticesInWord = Array(this.vertices.length);

        this.faces.push(new Face(0, 1, 0));
        this.faces.push(new Face(0, 2, 0));
        this.faces.push(new Face(0, 3, 0));

        // x
        this.faces.push(new Face(4, 5, 4));
        this.faces.push(new Face(6, 7, 6));
        // y
        this.faces.push(new Face(8, 9, 8));
        this.faces.push(new Face(10, 11, 10));
    }
    CoordinateMesh.prototype = Object.create(MeshInterface.prototype);

    return CoordinateMesh;
})
;
define('game/config',[],function(){
    var GameConfig;

    GameConfig = {
        'BASE_URL': window.location.href +'assets/',
        'RIGHT_ANGLE' : 90,
        'ROTATION_ANGLE_STEP': 1,
        'ROTATION_MARGIN' : 80,
        // Cube is basic shape on the board
        'CUBE_FIELD_SIZE': 40,
        'CUBE_FIELDS_ON_BOARD': 9,
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
                    'init': 'start',
                    'stop' : 'move_stop'
                }
            }
        }
    }

    GameConfig.BOARD_WIDTH = GameConfig.CUBE_FIELD_SIZE * GameConfig.CUBE_FIELDS_ON_BOARD;
    GameConfig.BOARD_EDGE = (GameConfig.BOARD_WIDTH / 2)

    return GameConfig;
})
;
define('shape/collision/manager',[],function() {
    

    function CollisionManager(strategy) {
        this.queue = [];
        this.actions = [];
        this.strategy = strategy;
    }
    CollisionManager.prototype.push = function(object) {
        this.queue.push(object);
    }
    CollisionManager.prototype.when = function(one, two, then, otherwise) {
        this.actions.push({one: one, two: two, then: then, otherwise: otherwise});
        return this;
    }

    CollisionManager.prototype.createEvent = function(one, two) {
        return {
            object: one,
            collide: two,
            preventRelease: false
        }
    }
    CollisionManager.prototype.raycast = function(origin, direction, distance, then, otherwise) {
        var result, found = false;
        for (var i = 0, length = this.queue.length; i < length; i++) {
            if (result = this.strategy.raycast(origin, direction, this.queue[i])) {
                found = true;
                if (result.t < distance)
                    then();
                return true;
            }
        }

        !found && otherwise && otherwise();
        return false;
    }
    CollisionManager.prototype.run = function() {
        var one, two, callback, event;
        for (var i = 0, length = this.actions.length; i < length; i++) {
            one = this.actions[i].one,
            two = this.actions[i].two;

            callback = this.strategy.isCollision(one, two)
                ? this.actions[i].then
                : this.actions[i].otherwise;

            if (typeof callback !== 'function') continue;

            event = this.createEvent(one, two);
            callback(event);
            if (!event.preventRelease) {
                this.actions.splice(i, 1);
            }
        }
    }

    return CollisionManager;
})
;
define('shape/collision/strategy/interface',[],function(){
    

    function CollisionStrategyInterface() {}

    CollisionStrategyInterface.prototype.isCollision = function(one, two) {}
    CollisionStrategyInterface.prototype.raycast = function(origin, direction, object) {}

    return CollisionStrategyInterface;
})
;
define('shape/collision/strategy/triangle',[
    'shape/collision/strategy/interface'
], function(
    CollisionStrategyInterface
){
    

    var EPSILON = 0.000001;

    /**
     * Möller–Trumbore intersection algorithm
     *
     * http://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm
     */
    function CollisionStrategyTriangle() {}

    CollisionStrategyTriangle.prototype = Object.create(CollisionStrategyInterface.prototype);
    CollisionStrategyTriangle.prototype.raycast = function(origin, direction, mesh) {
        var face, event, closest;

        for (var i = 0, length = mesh.faces.length; i < length; i++) {
            face = mesh.faces[i];
            event = {};
            if (this.triangle(
                mesh.verticesInWord[face.a],
                mesh.verticesInWord[face.b],
                mesh.verticesInWord[face.c],
                origin,
                direction,
                event
            )) {
                if (!closest || closest.t > event.t) {
                    closest = event;
                }
            }
        }

        return closest;
    }
    CollisionStrategyTriangle.prototype.isCollision = function(ray, mesh) {}
    CollisionStrategyTriangle.prototype.triangle = function(V1, V2, V3, O, D, event) {
        var e1, e2;  //Edge1, Edge2
        var P, Q, T;
        var det, inv_det, u, v;
        var t;

        //Find vectors for two edges sharing V1
        e1 = V2.subtract(V1);
        e2 = V3.subtract(V1);
        // SUB(e1, V2, V1);
        // SUB(e2, V3, V1);
        //Begin calculating determinant - also used to calculate u parameter
        P = D.cross(e2);
        // CROSS(P, D, e2);
        //if determinant is near zero, ray lies in plane of triangle
        det = e1.dot(P);
        // det = DOT(e1, P);
        //NOT CULLING

        if(det > -EPSILON && det < EPSILON) return false;
        inv_det = 1 / det;

        //calculate distance from V1 to ray origin
        T = O.subtract(V1);
        // SUB(T, O, V1);

        //Calculate u parameter and test bound
        u = T.dot(P) * inv_det;

        event.u = u;

        // u = DOT(T, P) * inv_det;
        //The intersection lies outside of the triangle
        if(u < 0 || u > 1) return false;

        //Prepare to test v parameter
        Q = T.cross(e1);
        // CROSS(Q, T, e1);

        //Calculate V parameter and test bound
        v = D.dot(Q) * inv_det;

        event.v = v;

        // v = DOT(D, Q) * inv_det;
        //The intersection lies outside of the triangle
        if(v < 0 || u + v  > 1) return false;

        t = e2.dot(Q) * inv_det;
        // t = DOT(e2, Q) * inv_det;
        event.t = t;

        if(t > EPSILON) { //ray intersection
            return true;
        }

        // No hit, no win
        return false;
    }

    return CollisionStrategyTriangle;
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
define('game9',[
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
    'shape/collision/manager',
    'shape/collision/strategy/triangle',
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
    StateMachine
) {
    

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
            ).multiply(Matrix4.rotationX(45)).multiply(Matrix4.rotationZ(45)).multiply(Matrix4.rotationY(45)),
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
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90)
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
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90)
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
            Matrix4.perspectiveProjection(viewportMain.width, viewportMain.height, 90)
        );

        document.addEventListener("keydown", this.captureKeys.bind(this), false);

        this.cube = new CubeMesh(0, 0, GameConfig.BOARD_EDGE + GameConfig.CUBE_FIELD_SIZE, GameConfig.CUBE_FIELD_SIZE, Color.fromName('red'));

        this.meshes = []
        this.meshes.push(this.cube);

        var mesh = new CoordinateMesh(-w/2 * 1.2, w/2 * 1.2, 0);
        this.meshes.push(mesh);

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
            'forward' : {
                'ray.hit': 'climbing',
                'ray.miss': 'falling',
                // 'press.left': 'left',
                'press.right': 'right'
            },
            'falling': {
                // 'ray.hit': 'climbing',
                'ray.miss': 'falling',
                'press.left': 'left',
                'press.right': 'right',
                'press.up': 'up',
                'press.down': 'down'
            },
            'climbing': {
                // 'ray.hit': 'climbing',
                'ray.miss': 'falling',
                'press.left': 'left',
                'press.right': 'right'
            },
            'up': {
                'ray.miss': 'falling',
                'press.left': 'left',
                'press.right': 'right'
            },
            'down': {
                'ray.miss': 'falling',
                'press.left': 'left',
                'press.right': 'right'
            },
            'left': {
                'ray.miss': 'falling',
                'press.up': 'up',
                'press.down': 'down'
            },
            'right': {
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
            this.direction = new Quaternion(-90, this.rotation).multiply(this.direction).v
        }.bind(this));
        this.sm.on('change', function(e, from, to) {
            this.velocity = 0;
            // this.step = 0;
        }.bind(this))
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
        this.velocity = this.approach(goal, this.velocity, this.dt * 10);
        this.cube.translation = this.cube.translation.add(this.direction.scale(this.velocity))

        var self = this;
        var from = this.cube.translation;
        var toGroundDirection = new Quaternion(45, this.rotation).multiply(this.direction).v;

        this.collision.raycast(from, toGroundDirection, 15, function() {
            self.sm.trigger('ray.hit');
            self.bigMesh.color = Color.fromName('blue');
        }, function() {
            self.sm.trigger('ray.miss')
            self.bigMesh.color = Color.fromName('green');
        });

        // this.renderer.drawCline(
        //     this.engine.project(from),
        //     this.engine.project(from.add(toGroundDirection.scale(37)))
        // );
        // this.renderer.drawCline(
        //     this.engine.project(from),
        //     this.engine.project(from.add(this.direction.cross(this.rotation).scale(37)))
        // );
        this.renderer.drawCline(
            this.engine.project(from),
            this.engine.project(from.add(this.rotation.scale(37)))
        );

        this.step = this.approach(1, this.step, this.dt/2);

        var v = new Quaternion(90,this.fromSide).slerp(new Quaternion(90, this.cross),  this.step).v;
        var eye = this.bigMesh.translation.add(v.scale(700));
        var at = Vector3.zero();
        this.engine.viewMatrix = Matrix4.lookAtRH(eye, at, this.up);
    }
    SomeGame.prototype.run = function() {
        this.currentTime = Date.now();
        this.dt = (this.currentTime - this.previousTime) / 100;
        this.dt = this.dt > .16 ? .16 : this.dt;
        this.previousTime = this.currentTime;

        this.renderer.clean();
        this.engine.render(this.meshes);
        this.doCollision();
        this.topRight.render(this.meshes);
        this.bottomLeft.render(this.meshes);
        this.bottomRight.render(this.meshes);
        this.renderer.render();

        requestAnimationFrame(this.run.bind(this));
    }

    return SomeGame;
})
;
require.config({
    baseUrl: "js",
    paths: {
        hammerjs: '../bower_components/hammerjs/hammer.min'
    }
    ,optimize: "none"
});

require(['game9'], function(TetrisGame) {
    

    var tetris, game;

    var ratio = devicePixelRatio = window.devicePixelRatio || 1,
        width = window.innerWidth,
        height = window.innerHeight;

    game = document.createElement('canvas');
    game.setAttribute('id', 'board');
    game.width = width * ratio;
    game.height = height * ratio;
    game.style.width = width + 'px';
    game.style.height = height + 'px';
    document.body.appendChild(game);

    // Catch user events
    document.ontouchmove = function(event){
        event.preventDefault();
    }

    tetris = new TetrisGame(game);
    tetris.run();
});

define("main", function(){});
