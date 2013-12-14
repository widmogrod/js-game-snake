define(function() {

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
