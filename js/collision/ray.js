define(function(){
    'use strict';

    function compareNumbers(a, b) {
        return a - b;
    }

    /**
     * Ray provides all importat informations to calculate intersection(s)
     */
    function Ray(origin, direction) {
        this.origin = origin;
        this.direction = direction;
        this.intersections = [];
        this.distanceIndex = [];
    }

    Ray.constructor = Ray;
    Ray.prototype.distance = function(distance) {
        // Simplification, thanks to this we should have less intersection with close range
        distance = distance >> 0;
        if (-1 === this.distanceIndex.indexOf(distance)) {
            this.intersections.push({
                distance: distance,
                point: this.origin.add(this.direction.scale(distance))
            });
            this.distanceIndex.push(distance);
            this.distanceIndex.sort(compareNumbers);
        }
    }

    return Ray;
});
