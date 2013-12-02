define(['promise'], function(Promise) {

    function EventPromise() {
        this.events = {};
        this.locked = false;
    }
    EventPromise.prototype.on = function(name, callback) {
        this.events[name] = this.events[name] ? this.events[name] : [];
        this.events[name].push(callback);
        return this;
    }
    EventPromise.prototype.trigger = function(name, args) {
        if (!this.events.hasOwnProperty(name)) {
            return;
        }
        if (this.locked) {
            return;
        }

        var events = this.events[name];
        this.locked = new Promise(function(reject, resolve) {
            var promise = this;
            events.forEach(function(callback) {
                promise.then(callback.apply(null, args));
            });
            resolve();
        });

        this.locked.then(function(err, result) {
            this.locked = null;
        }.bind(this));
    }

    return EventPromise;
})

