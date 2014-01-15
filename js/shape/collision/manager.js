define(function() {
    'use strict';

    function CollisionManager(strategy) {
        this.queue = [];
        this.strategy = strategy;
    }
    CollisionManager.prototype.when = function(one, two, then) {
        this.queue.push({one: one, two: two, then: then});
        return this;
    }

    CollisionManager.prototype.createEvent = function(one, two) {
        return {
            object: one,
            collide: two,
            preventRelease: false
        }
    }
    CollisionManager.prototype.run = function() {
        var one, two, then, event;
        for (var i = 0, length = this.queue.length; i < length; i++) {
            one = this.queue[i].one,
            two = this.queue[i].two,
            then = this.queue[i].then;

            if (this.strategy.isCollision(one, two)) {
                // Yes, we've intersect
                event = this.createEvent(one, two);
                // Invoke then
                then(event);
                // And release collided object
                if (!event.preventRelease) {
                    this.queue.splice(i, 1);
                }
            }
        }
    }

    return CollisionManager;
})
