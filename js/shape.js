define([
    'shape/stage/canvas3d',
    'shape/shape/cube',
    'shape/point',
    'shape/projection/projection'
],
function(
    Canvas3DStage,
    CubeShape,
    Point,
    Projection
) {
    "use strict";

    return {
        'Canvas3DStage' : Canvas3DStage,
        'CubeShape' : CubeShape,
        'Point' : Point,
        'Projection' : Projection
    };
});
