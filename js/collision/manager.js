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
    CollisionManager.prototype.raycast = function (origin, direction) {
        var ray = new Ray(origin, direction);
        this.queue.forEach(this.strategy.raycast.bind(
            this.strategy,
            ray
        ))
        return ray;
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
