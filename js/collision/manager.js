define([
    'collision/ray'
],
function(
    Ray
) {
    'use strict';

    function CollisionManager(strategy) {
        this.queue = [];
        this.actions = [];
        this.strategy = strategy;
    }
    CollisionManager.prototype.push = function(object) {
        this.queue.push(object);
    }
    CollisionManager.prototype.when = function(one, two, then, otherwise) {
        this.actions.push({one: one, two: two, then: then, otherwise: otherwise});
        return this;
    }

    CollisionManager.prototype.createEvent = function(one, two) {
        return {
            object: one,
            collide: two,
            preventRelease: false
        }
    }
    CollisionManager.prototype.raycast2 = function (origin, direction) {
        var ray = new Ray(origin, direction);
        this.queue.forEach(this.strategy.raycast2.bind(
            this.strategy,
            ray
        ))
        return ray;
    }
    CollisionManager.prototype.raycast = function(origin, direction, distance, then, otherwise) {
        var result, found = {found:false, result: null};
        for (var i = 0, length = this.queue.length; i < length; i++) {
            result = this.strategy.raycast(origin, direction, this.queue[i])
            if (result.result) {
                found.found = true;

                // console.log(result.t);
                if (result.t >= distance) continue;

                if (found.result === null) {
                    found.result = result;
                }
                else if(found.result.t > result.t) {
                    found.result = result;
                }
            }
        }

        if (found.found) {
            // Then is executed only when distance is valid
            // found.result && then(found.result);
            then(found.result, origin, direction)
        } else if (otherwise) {
            otherwise();
        }
        return found.found;
    }
    CollisionManager.prototype.run = function() {
        var one, two, callback, event;
        for (var i = 0, length = this.actions.length; i < length; i++) {
            one = this.actions[i].one,
            two = this.actions[i].two;

            callback = this.strategy.isCollision(one, two)
                ? this.actions[i].then
                : this.actions[i].otherwise;

            if (typeof callback !== 'function') continue;

            event = this.createEvent(one, two);
            callback(event);
            if (!event.preventRelease) {
                this.actions.splice(i, 1);
            }
        }
    }

    return CollisionManager;
})
