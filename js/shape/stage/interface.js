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
        'fillRect': function(x, y, width, height) {},
        'fillStyle': function(style) {},
        'fillText': function(text, x, y) {},
        'drawImage': function(img, x, y, width, height) {},
        'setTransform': function(skewX, skewY, scalX, scalY, moveX, moveY) {}
    };

    return Stage;
})
