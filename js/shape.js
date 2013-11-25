define(['shape/stage/interface',
        'shape/stage/canvas',
        'shape/stage/canvas3d',
        'shape/shape/interface',
        'shape/shape/cube',
        'shape/point',
        'shape/projection/interface',
        'shape/projection/projection'
       ],
       function(Stage, CanvasStage, Canvas3DStage, Shape, CubeShape, Point, ProjectionInterface, Projection){

    return {
        'Stage' : Stage,
        'Shape' : Shape,
        'CanvasStage' : CanvasStage,
        'Canvas3DStage' : Canvas3DStage,
        'CubeShape' : CubeShape,
        // 'EllipseShape' : EllipseShape,
        'Point' : Point,
        'Projection' : Projection,
        'ProjectionInterface' : ProjectionInterface
    };
});
