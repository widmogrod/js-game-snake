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
