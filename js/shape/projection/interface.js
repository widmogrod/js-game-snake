define(function(){
    function ProjectionInterface(viewerAngle, x, y) {}
    ProjectionInterface.constructor = ProjectionInterface;
    ProjectionInterface.prototype = {
        'rotateX' : function(point, angle) {},
        'rotateY' : function(point, angle) {},
        'rotateZ' : function(point, angle) {},
        'project' : function(point) {}
    };

    return ProjectionInterface;
})
