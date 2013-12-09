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
        var one, two, then, length, delta;
        this.queue.forEach(function(item) {
            // Extract data
            one = item[0], two = item[1], then = item[2];
            // Calculate length
            length = this.length(this.center(one), this.center(two));
            delta = length - (this.radius(one) + this.radius(two));

            if (delta < 0) {
                // Yes, we've intersect
                then({
                    object: one,
                    collide: two,
                    delta: delta
                });
            }
        }.bind(this));
    }

    return CollisionManager;
})
