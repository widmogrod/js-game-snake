define(function() {
    'use strict';

    function CollisionManager(strategy) {
        this.queue = [];
        this.strategy = strategy;
    }
    CollisionManager.prototype.when = function(one, two, then, otherwise) {
        this.queue.push({one: one, two: two, then: then, otherwise: otherwise});
        return this;
    }

    CollisionManager.prototype.createEvent = function(one, two) {
        return {
            object: one,
            collide: two,
            preventRelease: false
        }
    }
    CollisionManager.prototype.raycast = function(origin, direction, distance, then) {
        // console.log('o', origin.toString(), 'd', direction.toString())
        // var target = origin.subtract(direction).scale(distance);
        var target = direction.subtract(origin).scale(distance);
        for (var i = 0, length = this.queue.length; i < length; i++) {
            if (this.strategy.raycast(origin, target, this.queue[i].two)) {
                then();
                return true;
            }
        }

        return false;
    }
    CollisionManager.prototype.run = function() {
        var one, two, callback, event;
        for (var i = 0, length = this.queue.length; i < length; i++) {
            one = this.queue[i].one,
            two = this.queue[i].two;

            callback = this.strategy.isCollision(one, two)
                ? this.queue[i].then
                : this.queue[i].otherwise;

            if (typeof callback !== 'function') continue;

            event = this.createEvent(one, two);
            callback(event);
            if (!event.preventRelease) {
                this.queue.splice(i, 1);
            }
        }
    }

    return CollisionManager;
})
