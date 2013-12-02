define(function(){

    function Event() {
        this.events = {};
    }
    Event.prototype.on = function(name, callback) {
        this.events[name] = this.events[name] ? this.events[name] : [];
        this.events[name].push(callback);
        return this;
    }
    Event.prototype.trigger = function(name, args) {
        if (!this.events.hasOwnProperty(name)) {
            return;
        }
        this.events[name].forEach(function(callback) {
            callback.apply(null, args);
        })
    }

    return Event;
})
