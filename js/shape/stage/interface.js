define(function(){
    "use strict";

    /**
     * Stage prototype
     */
    function Stage(context) {}

    Stage.prototype = {
        'update': function() {},
        'addChild': function() {},
        'fillRect': function(x, y, width, height) {},
        'fillStyle': function(style) {},
        'setTransform': function(skewX, skewY, scalX, scalY, moveX, moveY) {}
    };

    return Stage;
})
