define(function(){
    "use strict";

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
        'fillRect': function(x, y, width, height) {},
        'fillStyle': function(style) {},
        'fillText': function(text, x, y, options) {},
        'beginPath': function() {},
        'closePath': function() {},
        'moveTo': function(x, y) {},
        'lineTo': function(x, y) {},
        'getImageData': function(img, x, y, width, height) {},
        'putImageData': function(x, y, width, height) {},
        'drawImage': function(img, x, y, width, height) {},
        'setTransform': function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {}
    };

    return Stage;
})
