define(function(){
    "use strict";

    function PointInterface() {}
    PointInterface.prototype = {
        'moveBy' : function(x, y, z) {},
        'moveTo' : function(x, y, z) {}
    }

    return PointInterface;
})
