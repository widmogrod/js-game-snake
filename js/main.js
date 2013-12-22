
/*! Hammer.JS - v1.0.5 - 2013-04-07
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(t,e){function n(){if(!i.READY){i.event.determineEventTypes();for(var t in i.gestures)i.gestures.hasOwnProperty(t)&&i.detection.register(i.gestures[t]);i.event.onTouch(i.DOCUMENT,i.EVENT_MOVE,i.detection.detect),i.event.onTouch(i.DOCUMENT,i.EVENT_END,i.detection.detect),i.READY=!0}}var i=function(t,e){return new i.Instance(t,e||{})};i.defaults={stop_browser_behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},i.HAS_POINTEREVENTS=navigator.pointerEnabled||navigator.msPointerEnabled,i.HAS_TOUCHEVENTS="ontouchstart"in t,i.MOBILE_REGEX=/mobile|tablet|ip(ad|hone|od)|android/i,i.NO_MOUSEEVENTS=i.HAS_TOUCHEVENTS&&navigator.userAgent.match(i.MOBILE_REGEX),i.EVENT_TYPES={},i.DIRECTION_DOWN="down",i.DIRECTION_LEFT="left",i.DIRECTION_UP="up",i.DIRECTION_RIGHT="right",i.POINTER_MOUSE="mouse",i.POINTER_TOUCH="touch",i.POINTER_PEN="pen",i.EVENT_START="start",i.EVENT_MOVE="move",i.EVENT_END="end",i.DOCUMENT=document,i.plugins={},i.READY=!1,i.Instance=function(t,e){var r=this;return n(),this.element=t,this.enabled=!0,this.options=i.utils.extend(i.utils.extend({},i.defaults),e||{}),this.options.stop_browser_behavior&&i.utils.stopDefaultBrowserBehavior(this.element,this.options.stop_browser_behavior),i.event.onTouch(t,i.EVENT_START,function(t){r.enabled&&i.detection.startDetect(r,t)}),this},i.Instance.prototype={on:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.addEventListener(n[i],e,!1);return this},off:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.removeEventListener(n[i],e,!1);return this},trigger:function(t,e){var n=i.DOCUMENT.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e;var r=this.element;return i.utils.hasParent(e.target,r)&&(r=e.target),r.dispatchEvent(n),this},enable:function(t){return this.enabled=t,this}};var r=null,o=!1,s=!1;i.event={bindDom:function(t,e,n){for(var i=e.split(" "),r=0;i.length>r;r++)t.addEventListener(i[r],n,!1)},onTouch:function(t,e,n){var a=this;this.bindDom(t,i.EVENT_TYPES[e],function(c){var u=c.type.toLowerCase();if(!u.match(/mouse/)||!s){(u.match(/touch/)||u.match(/pointerdown/)||u.match(/mouse/)&&1===c.which)&&(o=!0),u.match(/touch|pointer/)&&(s=!0);var h=0;o&&(i.HAS_POINTEREVENTS&&e!=i.EVENT_END?h=i.PointerEvent.updatePointer(e,c):u.match(/touch/)?h=c.touches.length:s||(h=u.match(/up/)?0:1),h>0&&e==i.EVENT_END?e=i.EVENT_MOVE:h||(e=i.EVENT_END),h||null===r?r=c:c=r,n.call(i.detection,a.collectEventData(t,e,c)),i.HAS_POINTEREVENTS&&e==i.EVENT_END&&(h=i.PointerEvent.updatePointer(e,c))),h||(r=null,o=!1,s=!1,i.PointerEvent.reset())}})},determineEventTypes:function(){var t;t=i.HAS_POINTEREVENTS?i.PointerEvent.getEvents():i.NO_MOUSEEVENTS?["touchstart","touchmove","touchend touchcancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],i.EVENT_TYPES[i.EVENT_START]=t[0],i.EVENT_TYPES[i.EVENT_MOVE]=t[1],i.EVENT_TYPES[i.EVENT_END]=t[2]},getTouchList:function(t){return i.HAS_POINTEREVENTS?i.PointerEvent.getTouchList():t.touches?t.touches:[{identifier:1,pageX:t.pageX,pageY:t.pageY,target:t.target}]},collectEventData:function(t,e,n){var r=this.getTouchList(n,e),o=i.POINTER_TOUCH;return(n.type.match(/mouse/)||i.PointerEvent.matchType(i.POINTER_MOUSE,n))&&(o=i.POINTER_MOUSE),{center:i.utils.getCenter(r),timeStamp:(new Date).getTime(),target:n.target,touches:r,eventType:e,pointerType:o,srcEvent:n,preventDefault:function(){this.srcEvent.preventManipulation&&this.srcEvent.preventManipulation(),this.srcEvent.preventDefault&&this.srcEvent.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return i.detection.stopDetect()}}}},i.PointerEvent={pointers:{},getTouchList:function(){var t=this,e=[];return Object.keys(t.pointers).sort().forEach(function(n){e.push(t.pointers[n])}),e},updatePointer:function(t,e){return t==i.EVENT_END?this.pointers={}:(e.identifier=e.pointerId,this.pointers[e.pointerId]=e),Object.keys(this.pointers).length},matchType:function(t,e){if(!e.pointerType)return!1;var n={};return n[i.POINTER_MOUSE]=e.pointerType==e.MSPOINTER_TYPE_MOUSE||e.pointerType==i.POINTER_MOUSE,n[i.POINTER_TOUCH]=e.pointerType==e.MSPOINTER_TYPE_TOUCH||e.pointerType==i.POINTER_TOUCH,n[i.POINTER_PEN]=e.pointerType==e.MSPOINTER_TYPE_PEN||e.pointerType==i.POINTER_PEN,n[t]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}},i.utils={extend:function(t,n,i){for(var r in n)t[r]!==e&&i||(t[r]=n[r]);return t},hasParent:function(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1},getCenter:function(t){for(var e=[],n=[],i=0,r=t.length;r>i;i++)e.push(t[i].pageX),n.push(t[i].pageY);return{pageX:(Math.min.apply(Math,e)+Math.max.apply(Math,e))/2,pageY:(Math.min.apply(Math,n)+Math.max.apply(Math,n))/2}},getVelocity:function(t,e,n){return{x:Math.abs(e/t)||0,y:Math.abs(n/t)||0}},getAngle:function(t,e){var n=e.pageY-t.pageY,i=e.pageX-t.pageX;return 180*Math.atan2(n,i)/Math.PI},getDirection:function(t,e){var n=Math.abs(t.pageX-e.pageX),r=Math.abs(t.pageY-e.pageY);return n>=r?t.pageX-e.pageX>0?i.DIRECTION_LEFT:i.DIRECTION_RIGHT:t.pageY-e.pageY>0?i.DIRECTION_UP:i.DIRECTION_DOWN},getDistance:function(t,e){var n=e.pageX-t.pageX,i=e.pageY-t.pageY;return Math.sqrt(n*n+i*i)},getScale:function(t,e){return t.length>=2&&e.length>=2?this.getDistance(e[0],e[1])/this.getDistance(t[0],t[1]):1},getRotation:function(t,e){return t.length>=2&&e.length>=2?this.getAngle(e[1],e[0])-this.getAngle(t[1],t[0]):0},isVertical:function(t){return t==i.DIRECTION_UP||t==i.DIRECTION_DOWN},stopDefaultBrowserBehavior:function(t,e){var n,i=["webkit","khtml","moz","ms","o",""];if(e&&t.style){for(var r=0;i.length>r;r++)for(var o in e)e.hasOwnProperty(o)&&(n=o,i[r]&&(n=i[r]+n.substring(0,1).toUpperCase()+n.substring(1)),t.style[n]=e[o]);"none"==e.userSelect&&(t.onselectstart=function(){return!1})}}},i.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(t,e){this.current||(this.stopped=!1,this.current={inst:t,startEvent:i.utils.extend({},e),lastEvent:!1,name:""},this.detect(e))},detect:function(t){if(this.current&&!this.stopped){t=this.extendEventData(t);for(var e=this.current.inst.options,n=0,r=this.gestures.length;r>n;n++){var o=this.gestures[n];if(!this.stopped&&e[o.name]!==!1&&o.handler.call(o,t,this.current.inst)===!1){this.stopDetect();break}}return this.current&&(this.current.lastEvent=t),t.eventType==i.EVENT_END&&!t.touches.length-1&&this.stopDetect(),t}},stopDetect:function(){this.previous=i.utils.extend({},this.current),this.current=null,this.stopped=!0},extendEventData:function(t){var e=this.current.startEvent;if(e&&(t.touches.length!=e.touches.length||t.touches===e.touches)){e.touches=[];for(var n=0,r=t.touches.length;r>n;n++)e.touches.push(i.utils.extend({},t.touches[n]))}var o=t.timeStamp-e.timeStamp,s=t.center.pageX-e.center.pageX,a=t.center.pageY-e.center.pageY,c=i.utils.getVelocity(o,s,a);return i.utils.extend(t,{deltaTime:o,deltaX:s,deltaY:a,velocityX:c.x,velocityY:c.y,distance:i.utils.getDistance(e.center,t.center),angle:i.utils.getAngle(e.center,t.center),direction:i.utils.getDirection(e.center,t.center),scale:i.utils.getScale(e.touches,t.touches),rotation:i.utils.getRotation(e.touches,t.touches),startEvent:e}),t},register:function(t){var n=t.defaults||{};return n[t.name]===e&&(n[t.name]=!0),i.utils.extend(i.defaults,n,!0),t.index=t.index||1e3,this.gestures.push(t),this.gestures.sort(function(t,e){return t.index<e.index?-1:t.index>e.index?1:0}),this.gestures}},i.gestures=i.gestures||{},i.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(t,e){switch(t.eventType){case i.EVENT_START:clearTimeout(this.timer),i.detection.current.name=this.name,this.timer=setTimeout(function(){"hold"==i.detection.current.name&&e.trigger("hold",t)},e.options.hold_timeout);break;case i.EVENT_MOVE:t.distance>e.options.hold_threshold&&clearTimeout(this.timer);break;case i.EVENT_END:clearTimeout(this.timer)}}},i.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},handler:function(t,e){if(t.eventType==i.EVENT_END){var n=i.detection.previous,r=!1;if(t.deltaTime>e.options.tap_max_touchtime||t.distance>e.options.tap_max_distance)return;n&&"tap"==n.name&&t.timeStamp-n.lastEvent.timeStamp<e.options.doubletap_interval&&t.distance<e.options.doubletap_distance&&(e.trigger("doubletap",t),r=!0),(!r||e.options.tap_always)&&(i.detection.current.name="tap",e.trigger(i.detection.current.name,t))}}},i.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_max_touches:1,swipe_velocity:.7},handler:function(t,e){if(t.eventType==i.EVENT_END){if(e.options.swipe_max_touches>0&&t.touches.length>e.options.swipe_max_touches)return;(t.velocityX>e.options.swipe_velocity||t.velocityY>e.options.swipe_velocity)&&(e.trigger(this.name,t),e.trigger(this.name+t.direction,t))}}},i.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(n.options.drag_max_touches>0&&t.touches.length>n.options.drag_max_touches))switch(t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:if(t.distance<n.options.drag_min_distance&&i.detection.current.name!=this.name)return;i.detection.current.name=this.name,(i.detection.current.lastEvent.drag_locked_to_axis||n.options.drag_lock_to_axis&&n.options.drag_lock_min_distance<=t.distance)&&(t.drag_locked_to_axis=!0);var r=i.detection.current.lastEvent.direction;t.drag_locked_to_axis&&r!==t.direction&&(t.direction=i.utils.isVertical(r)?0>t.deltaY?i.DIRECTION_UP:i.DIRECTION_DOWN:0>t.deltaX?i.DIRECTION_LEFT:i.DIRECTION_RIGHT),this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),n.trigger(this.name+t.direction,t),(n.options.drag_block_vertical&&i.utils.isVertical(t.direction)||n.options.drag_block_horizontal&&!i.utils.isVertical(t.direction))&&t.preventDefault();break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(2>t.touches.length))switch(n.options.transform_always_block&&t.preventDefault(),t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:var r=Math.abs(1-t.scale),o=Math.abs(t.rotation);if(n.options.transform_min_scale>r&&n.options.transform_min_rotation>o)return;i.detection.current.name=this.name,this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),o>n.options.transform_min_rotation&&n.trigger("rotate",t),r>n.options.transform_min_scale&&(n.trigger("pinch",t),n.trigger("pinch"+(1>t.scale?"in":"out"),t));break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Touch={name:"touch",index:-1/0,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(t,n){return n.options.prevent_mouseevents&&t.pointerType==i.POINTER_MOUSE?(t.stopDetect(),e):(n.options.prevent_default&&t.preventDefault(),t.eventType==i.EVENT_START&&n.trigger(this.name,t),e)}},i.gestures.Release={name:"release",index:1/0,handler:function(t,e){t.eventType==i.EVENT_END&&e.trigger(this.name,t)}},"object"==typeof module&&"object"==typeof module.exports?module.exports=i:(t.Hammer=i,"function"==typeof t.define&&t.define.amd&&t.define("hammer",[],function(){return i}))})(this);
define("hammerjs", function(){});

define('shape/projection/interface',[],function(){
    

    function ProjectionInterface() {}
    ProjectionInterface.constructor = ProjectionInterface;
    ProjectionInterface.prototype = {
        'rotateX' : function(point, angle) {},
        'rotateY' : function(point, angle) {},
        'rotateZ' : function(point, angle) {},
        'project' : function(point) {}
    };

    return ProjectionInterface;
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

    function PointCollection(centerPoint) {
        this.center = centerPoint;
        this.points = [];
        this.count = 0;
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
            point = this.points[1];
            if (point instanceof PointCollection) {
                point.each(callback, depth + 1 || 0);
            } else {
                callback(this.points[i], i, depth);
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
        'fillRect': function(x, y, width, height) {},
        'fillStyle': function(style) {},
        'fillText': function(text, x, y) {},
        'drawImage': function(img, x, y, width, height) {},
        'getImageData': function(img, x, y, width, height) {},
        'putImageData': function(x, y, width, height) {},
        'setTransform': function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {}
    };

    return Stage;
})
;
define('shape/utils/angle',[],function() {
    function AngleUtil() {};

    AngleUtil.TO_RADIANS = Math.PI/180;
    AngleUtil.normalize = function(angle) {
        angle = angle >> 0;
        if (angle > 360) return angle % 360;
        if (angle < -360) return -(angle % 360);
        if (angle === -360) return 1;
        if (angle < 1) return 360 + angle;
        return angle;
    }

    return AngleUtil;
})
;
define('shape/projection/projection',[
    'shape/projection/interface',
    'shape/point/collection',
    'shape/shape/interface',
    'shape/stage/interface',
    'shape/utils/angle'
],
function(
    ProjectionInterface,
    PointCollection,
    Shape,
    Stage,
    Angle
) {
    

    function each(item, func) {
        item instanceof PointCollection
            ? (item.each(func) || func(item.center))
            : item instanceof Shape
                ? item.points().each(func)
                : item instanceof Stage
                    ? item.each(function(child) { each(child.points(), func) })
                    : func(item);
    }

    function Projection(distance, x, y) {
        this.distance = distance;
        this.x = x;
        this.y = y;
    }
    Projection.constructor = Projection;
    Projection.prototype = new ProjectionInterface();
    Projection.prototype.project = function(point) {
        function task(point) {
            if (point.z > -this.distance) {
                var scale = this.distance / (this.distance + point.z >> 0);
                point.xpos = this.x + point.x * scale >> 0;
                point.ypos = this.y + point.y * scale >> 0;
                point.scale = scale;
            }
        }
        each(point, task.bind(this));
    }
    Projection.prototype.rotateY = function(point, angle) {
        angle = angle * Math.PI / 180;
        var cos = Math.cos(angle), sin = Math.sin(angle);
        function task(point) {
            // point.origin.angle.y = Angle.normalize(point.origin.angle.y + angle);
            // angle = point.origin.angle.y * Math.PI / 180;
            // var cos = Math.cos(angle), sin = Math.sin(angle);
            // var x1 = point.origin.x * cos - point.origin.z * sin,
            //     z1 = point.origin.z * cos + point.origin.x * sin;
            var x1 = point.x * cos - point.z * sin,
                z1 = point.z * cos + point.x * sin;

            point.x = x1;
            point.z = z1;
        }
        each(point, task);
    }
    Projection.prototype.rotateX = function(point, angle) {
        angle = angle * Math.PI / 180;
        var cos = Math.cos(angle), sin = Math.sin(angle);
        function task(point) {
            var y1 = point.y * cos - point.z * sin,
                z1 = point.z * cos + point.y * sin;

            point.y = y1;
            point.z = z1;
        }
        each(point, task);
    }

    return Projection;
})
;
define('shape/stage/canvas',['shape/stage/interface'], function(Stage){
    

    function CanvasStage(canvas) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
    }

    CanvasStage.constructor = CanvasStage;
    CanvasStage.prototype = new Stage();
    CanvasStage.prototype.each = function(callback) {
        var i = 0, length = this.childs.length;
        for (; i < length; i++) {
            callback(this.childs[i], i);
        }
    }
    CanvasStage.prototype.addChild = function(shape) {
        this.childs.push(shape);
    };
    CanvasStage.prototype.removeChild = function(shape) {
        var index = this.childs.indexOf(shape);
        if (-1 !== index) {
            this.childs.splice(index, 1);
        }
    }
    CanvasStage.prototype.clean = function() {
        this.context.cleanRect(0,0,this.width, this.height);
    }
    CanvasStage.prototype.render = function() {
        var self = this;
        this.context.clearRect(0,0,this.width, this.height);
        this.each(function(child) {
            if (child.STATE_RENDERED !== child.state()) {
                child.render(self);
                child.state(child.STATE_RENDERED);
            }
        })
    };
    CanvasStage.prototype.fillRect = function(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
    }
    CanvasStage.prototype.beginPath = function() {
        this.context.beginPath();
    }
    CanvasStage.prototype.closePath = function() {
        this.context.closePath();
    }
    CanvasStage.prototype.fill = function() {
        this.context.fill();
    }
    CanvasStage.prototype.stroke = function() {
        this.context.stroke();
    }
    CanvasStage.prototype.moveTo = function(x, y) {
        this.context.moveTo(x, y);
    }
    CanvasStage.prototype.lineTo = function(x, y) {
        this.context.lineTo(x, y);
    }
    CanvasStage.prototype.fillStyle = function(style) {
        this.context.fillStyle = style;
    }
    CanvasStage.prototype.fillText = function(text, x, y) {
        // this.context.fillStyle = '#f00';
        this.context.font = 'italic bold 12px sans-serif';
        this.context.textBaseline = 'bottom';
        this.context.fillText(text, x, y);
    }
    CanvasStage.prototype.getImageData = function(x, y, width, height) {
        return this.context.getImageData(x, y, width, height);
    }
    CanvasStage.prototype.putImageData = function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this.context.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
    }
    CanvasStage.prototype.drawImage = function(img, x, y, width, height) {
        this.context.drawImage(img, x, y, width, height);
    }
    CanvasStage.prototype.fillEllipse = function(x, y, w, h) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        this.context.beginPath();
        this.context.moveTo(x, ym);
        this.context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        this.context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        this.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        this.context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        this.context.closePath();
        this.context.stroke();
    }
    CanvasStage.prototype.setTransform = function(skewX, skewY, scalX, scalY, moveX, moveY) {
        this.context.setTransform(scalX || 1, skewX, skewY, scalY || 1, moveX || 0, 0);
    }

    return CanvasStage;
})
;
define('shape/stage/canvas3d',['shape/stage/canvas'], function(CanvasStage){
    

    function Canvas3DStage(canvas, projection) {
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.childs = [];
        this.projection = projection;
    }
    Canvas3DStage.constructor = Canvas3DStage;
    Canvas3DStage.prototype = Object.create(CanvasStage.prototype);

    Canvas3DStage.prototype.render = function() {
        var state, self = this;
        this.context.clearRect(0,0,this.width, this.height);
        this.each(function(child){
            // state = child.state();
            state = child.STATE_DIRTY;
            if (child.STATE_RENDERED !== state) {
                self.projection.project(child.points());
                // child.projection(this.projection);
                child.render(self);
                child.state(child.STATE_RENDERED);
            }
        })
    }

    return Canvas3DStage;
})
;
define('shape/point/point',['shape/point/interface'], function(PointInterface) {
    

    function Point(x, y, z) {
        this.origin = {
            x:x, y:y, z:z,
            angle: {x:360, y:360,z:360}
        };
        this.x = x;
        this.y = y;
        this.z = z;
        this.xpos = 0;
        this.ypos = 0;
    }
    Point.constructor = Point;
    Point.prototype = new PointInterface();
    Point.prototype.moveBy = function(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }
    Point.prototype.moveTo = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Point.prototype.length = function() {
        return Math.sqrt(
            (this.x * this.x) + (this.y * this.y) + (this.z * this.z)
        );
    }

    return Point;
})
;
define('shape/shape/cube',[
    'shape/shape/interface',
    'shape/point/point',
    'shape/point/collection'
],
function(Shape, Point, PointCollection) {
    

    /**
     * Cube shape
     */
    function CubeShape(x, y, z, width, color) {
        this.state_ = this.STATE_CLEAN;
        this.width = width || 10;
        this.color = color || '#333333';
        this.points_ = new PointCollection(new Point(x, y, z));
        this.faces = [
            [0,1,2,3],
            [0,1,5,4],
            [0,3,7,4],
            [3,2,6,7],
            [1,2,6,5],
            [4,5,6,7]
        ];

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
    CubeShape.prototype = new Shape();
    CubeShape.prototype.center = function() {
        return this.points().center;
    }
    CubeShape.prototype.render = function(stage) {
        var face, point;
        var i = 0, length = this.faces.length;
        for (; i < length; i++) {
            face = this.faces[i];
            point = this.points_.get(face[0]);
            stage.beginPath();
            stage.moveTo(point.xpos, point.ypos);
            for (var j = 3; j >= 0; j--) {
                point = this.points_.get(face[j]);
                stage.lineTo(point.xpos, point.ypos);
            }
            stage.closePath();
            stage.fillStyle(this.color);
            // stage.stroke();
            stage.fill();
        }
    }

    return CubeShape;
});

define('game/config',[],function(){
    function GameConfig() {}

    GameConfig.prototype = {
        'BASE_URL': window.location.href +'assets/',
        'RIGHT_ANGLE' : 90,
        'ROTATION_ANGLE_STEP': 1,
        'ROTATION_MARGIN' : 80,
        'GAME_STEP': 20,
        'CUBE_SIZE': 40,
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
                '*': {
                    'found.gidts': 'end'
                }
            },
            'game': {
                'start': {
                    'press.start' : 'play'
                },
                'play' : {
                    'ship.suiside': 'end',
                    'ship.success': 'end',
                    'press.pause': 'stop'
                },
                'end': {
                    'press.restart' : 'start'
                },
                'stop': {
                    'press.escape': 'start'
                },
            }
        }
    }

    return GameConfig;
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
    ImageShape.prototype = new Shape();
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
        stage.drawImage(this.image, center.xpos, center.ypos, this.width, this.height);
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
    SpriteShape.prototype = new Shape();
    SpriteShape.prototype.setSprite = function(image) {
        this.image = image;
    }
    SpriteShape.prototype.render = function(stage) {
        var center = this.center();
        if (!this.image) {
            return;
        }

        this.image.put(stage, center.xpos, center.ypos);
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

    function Event() {
        this.events = {};
    }
    Event.prototype.on = function(name, callback) {
        this.events[name] = this.events[name] ? this.events[name] : [];
        this.events[name].push(callback);
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
        var self = this;
        return function(event) {
            self.trigger(name, args);
        }
    }

    return Event;
})
;
define('state',['event/event'], function(Event){
    function onAny(context) {
        return function() {
            --context.lock;
        }
    }

    function onChange(from, to, context) {
        return function() {
            var results;
            if (null !== context.state && (context.state !== from && from !== '*')) {
                // console.log('NO - state');
                return;
            }

            if (context.unlock && !context.unlock()) {
                context.postponed = onChange(from, to, context);
                // console.log('NO - unlock');
                return;
            }


            // console.log('OK - unlocked')

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
    StateMachine.prototype.run = function() {
        // Resove postponed state.
        // This can happen when current state is bloked
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
        this.shape.points().moveBy(this.speed, 0, 0);
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
        this.shape.points().moveBy(-this.speed, 0, 0);
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
        this.shape.points().moveBy(0, -this.speed, 0);
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
        this.shape.points().moveBy(0, this.speed, 0);
        ++this.counter;
    }
    ActionMoveDown.prototype.canStop = function() {
        return this.counter % this.step === 0;
    }

    return ActionMoveDown;
});

define('game/action/rotate/right',['game/action/interface'], function(ActionInterface) {
    function ActionShowRightEdge(game, speed, rightAngle) {
        this.events = {};
        this.game = game;
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

        this.game.projection.rotateY(this.game.stage, -this.speed);

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
    function ActionShowLeftEdge(game, speed, rightAngle) {
        this.events = {};
        this.game = game;
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

        this.game.projection.rotateY(this.game.stage, this.speed);

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
    function ActionShowUpEdge(game, speed, rightAngle) {
        this.events = {};
        this.game = game;
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

        this.game.projection.rotateX(this.game.stage, this.speed);

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
    function ActionShowDownEdge(game, speed, rightAngle) {
        this.events = {};
        this.game = game;
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

        this.game.projection.rotateX(this.game.stage, -this.speed);

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
        this.queue.push([one, two, then]);
        return this;
    }
    CollisionManager.prototype.length = function(one, two) {
        var dx = two.x - one.x,
            dy = two.y - one.y,
            dz = two.z - one.z;

        return Math.pow((dx * dx) + (dy * dy) + (dz + dz), 1/2);
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
            // Extract data
            one = item[0], two = item[1], then = item[2];
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
            }
        });
    }

    return CollisionManager;
})
;
define('shape/utils/assets',['event/event'], function(Event){
    function onComplete(assets) {
        return function(e, name, image) {
            assets[name] = image;
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
            self.trigger('complete', [name, image])
            self.trigger('complete:' + name, [image])
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

    SpriteUtil.prototype.put = function(stage, x, y) {
        if (++this.counter % this.tick == 0) {
           this.counter = 0;
           this.frameNumber = this.frames <= ++this.frameNumber ? 0 : this.frameNumber;
        }

        var dx = this.frameNumber * this.frameWidth;
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
define(
'game/service',[
    'game/config',
    'shape/shape/cube',
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
],
function(
    GameConfig,
    CubeShape,
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
    SpriteUtil
) {
    function ServiceManager(game) {
        this.game = game;
        this.instances = {};
    }

    ServiceManager.prototype.get = function(name, func) {
        if (!this.instances.hasOwnProperty(name)) {
            this.instances[name] = func.call(this);
        }
        return this.instances[name];
    }
    ServiceManager.prototype.config = function() {
        return this.get('config', function() {
            return new GameConfig();
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
            return am;
        })
    }
    ServiceManager.prototype.giftFactory = function(x, y, z) {
        var am = this.assetManager();
        var gift = Math.random() > 0.5 ? 'gift-red' : 'gift-blue';
        var image = new ImageShape(x, y, z, this.config().CUBE_SIZE, this.config().CUBE_SIZE);
        am.get(gift, image.setImage.bind(image));
        return image;
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
                this.game,
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            ).on('finish', function() {
                this.stateMachineMove().trigger('right.face.visible')
            }.bind(this));
        })
    }
    ServiceManager.prototype.actionShowLeftEdge = function() {
        return this.get('actionShowLeftEdge', function() {
            return new ActionShowLeftEdge(
                this.game,
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            ).on('finish', function() {
                this.stateMachineMove().trigger('left.face.visible')
            }.bind(this));
        })
    }
    ServiceManager.prototype.actionShowUpEdge = function() {
        return this.get('actionShowUpEdge', function() {
            return new ActionShowUpEdge(
                this.game,
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            ).on('finish', function() {
                this.stateMachineMove().trigger('up.face.visible')
            }.bind(this));
        })
    }
    ServiceManager.prototype.actionShowDownEdge = function() {
        return this.get('actionShowDownEdge', function() {
            return new ActionShowDownEdge(
                this.game,
                this.config().ROTATION_ANGLE_STEP,
                this.config().RIGHT_ANGLE
            ).on('finish', function() {
                this.stateMachineMove().trigger('down.face.visible')
            }.bind(this));
        })
    }
    ServiceManager.prototype.cube = function() {
        return this.get('cube', function() {
            var shape = new SpriteShape(0, 0, -this.game.board.width / 2 + this.config().CUBE_SIZE / 2, this.config().CUBE_SIZE);
            var am = this.assetManager();

            am.get('reindeer', function(object) {
                var sprite = new SpriteUtil(
                    new ImageDataUtil(object),
                    40,
                    40
                );
                shape.setSprite(sprite);
            });

            return shape;
            // return new CubeShape(0, 0, -this.game.board.width / 2 + this.config().CUBE_SIZE / 2, this.config().CUBE_SIZE, '#f2b139');
        })
    }

    return ServiceManager;
})
;
define('game',[
    'hammerjs',
    'shape/projection/projection',
    'shape/stage/canvas3d',
    'shape/shape/cube',
    'shape/point/point',
    'shape/point/collection',
    'game/service'
],
function(
    Hemmer,
    Projection,
    Canvas3DStage,
    CubeShape,
    Point,
    PointCollection,
    ServiceManager
) {
    /**
     * Description
     *
     * @param DOMCanvasElement
     */
    function TetrisGame(canvas) {
        var self = this;

        this.canvas = canvas;
        this.service = new ServiceManager(this);

        this.config = this.service.config();
        this.projection = new Projection(1270, canvas.width / 2, canvas.height / 2);
        this.stage = new Canvas3DStage(this.canvas, this.projection);
        this.boardWidth = this.config.CUBE_SIZE * 10 >> 0;
        this.boardEdge = (this.boardWidth / 2) - this.config.CUBE_SIZE >> 0;
        this.board = new CubeShape(0, 0, 0, this.boardWidth, '#fff');
        this.cube = this.service.cube();
        this.collect = 0;
        this.actionManager = this.service.actionManager();

        var size = this.config.CUBE_SIZE;
        var edge = (-this.boardWidth / 2) + size;

        this.enemies = new PointCollection();

        var am = this.service.assetManager();

        am.get('melody', function(audio) {
            // audio.addEventListener('ended', function() {
            // this.currentTime = 0;
            // this.play();
            // }, false);
            audio.play();
        })

        // this.enemies.push(this.service.giftFactory(0, 1 * size, edge));
        this.enemies.push(this.service.giftFactory(0, 2 * size, edge));
        this.enemies.push(this.service.giftFactory(0, 3 * size, edge));
        this.enemies.push(this.service.giftFactory(0, 4 * size, edge));
        this.enemies.push(this.service.giftFactory(edge, 1 * size, edge));
        this.enemies.push(this.service.giftFactory(edge, 1 * size, edge));
        this.enemies.push(this.service.giftFactory(edge, edge, edge));

        this.collisionManager = this.service.collisionManager();

        // Add objection to stage, order is important - for now.
        this.stage.addChild(this.board);
        this.enemies.each(function(item) {
            self.stage.addChild(item);
            self.collisionManager.when(self.cube, item, function(data) {
                self.collect++;
                am.get('ring', function(ring) {
                    ring.play()
                })
                self.stage.removeChild(data.collide);

            })
        });
        this.stage.addChild(this.cube);

        // Move State Machine
        this.stateMachine = this.service.stateMachineMove();
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
            self.actionManager.set('rotate', self.service.actionShowRightEdge());
        });
        this.stateMachine.on('enter:show_left_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set('rotate', self.service.actionShowLeftEdge());
        });
        this.stateMachine.on('enter:show_up_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set('rotate', self.service.actionShowUpEdge());
        });
        this.stateMachine.on('enter:show_down_face', function() {
            self.actionManager.remove('move');
            self.actionManager.set('rotate', self.service.actionShowDownEdge());
        });
        this.stateMachine.on('enter:end', function() {
            document.getElementById('santa').className += ' happy';
        });

        // Catch user events
        document.addEventListener("keydown", this.captureKeys.bind(this), false);
        document.ontouchmove = function(event){
            event.preventDefault();
        }
        Hammer(this.canvas, {
            drag_lock_to_axis: true
        })
        .on('dragleft', self.stateMachine.proxy('press.left'))
        .on('dragright', self.stateMachine.proxy('press.right'))
        .on('dragup', self.stateMachine.proxy('press.up'))
        .on('dragdown', self.stateMachine.proxy('press.down'))
    }

    TetrisGame.constructor = TetrisGame;
    TetrisGame.prototype = {
        'update': function() {
            var x = this.cube.center().x;
            var y = this.cube.center().y;
            var boardX = this.boardEdge;
            var boardY = this.boardEdge;

            if (x > boardX) {
                this.stateMachine.trigger('edge.right');
            } else if (x < -boardX) {
                this.stateMachine.trigger('edge.left');
            } else if (y < -boardY) {
                this.stateMachine.trigger('edge.up');
            } else if (y > boardY) {
                this.stateMachine.trigger('edge.down');
            }
        },
        'captureKeys' : function(e) {
            switch(true) {
                case 37 == e.keyCode: e.preventDefault(); this.stateMachine.trigger('press.left'); break;
                case 38 == e.keyCode: e.preventDefault(); this.stateMachine.trigger('press.up'); break;
                case 39 == e.keyCode: e.preventDefault(); this.stateMachine.trigger('press.right'); break;
                case 40 == e.keyCode: e.preventDefault(); this.stateMachine.trigger('press.down'); break;
            }
        },
        'run': function() {
            var self = this;
            function loop() {
                if (self.enemies.count <= self.collect) {
                    self.stateMachine.trigger('found.gidts');
                    return;
                }
                // One more time
                requestAnimationFrame(loop);
                // Calculate interaction
                self.update();
                self.collisionManager.run();
                // Run actions
                self.actionManager.run();
                // Resolve state if any aciton is locking state
                self.stateMachine.run();
                // Render
                self.stage.render();
            }
            requestAnimationFrame(loop);
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
    game.setAttribute('id', 'board')
    // game.width = window.innerWidth;
    // game.height = window.innerHeight;
    game.width = 600;
    game.height = 600;
    document.body.appendChild(game);

    tetris = new TetrisGame(game);
    tetris.run();
});

define("main", function(){});
