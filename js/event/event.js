define(function(){

    function Result(event) {
        this.event = event;
        this.results = [];
    }
    Result.prototype.count = function() {
        return this.results.length;
    }
    Result.prototype.push = function(value) {
        this.results.push(value);
    }
    Result.prototype.last = function(defaults) {
        var c = this.count();
        return c ? this.results[c - 1] : defaults;
    }
    Result.prototype.each = function(func) {
        this.results.forEach(func);
    }

    function createEvent() {
        var stopPropagation = false;
        return {
            stopPropagation: function(flag) {
                if (arguments.length) {
                    stopPropagation = !!flag;
                } else {
                    return stopPropagation;
                }
            }
        }
    }

    function Event() {
        this.events = {};
    }
    Event.prototype.on = function(name, callback) {
        this.events[name] = this.events[name] ? this.events[name] : [];
        this.events[name].push(callback);
        return this;
    }
    Event.prototype.trigger = function(name, args) {
        var value, events;
        var event = typeof this.createEvent === 'function' ? this.createEvent() : createEvent(),
            result = new Result(event);

        if (!this.events.hasOwnProperty(name)) {
            return result;
        }

        args = [event].concat(args);
        events = this.events[name];

        for (var i = 0, length = events.length; i < length; i++) {
            value = events[i].apply(null, args);
            result.push(value);
            if (event.stopPropagation()) break;
        }

        return result;
    }
    Event.prototype.proxy = function(name, args) {
        var self = this;
        return function(event) {
            self.trigger(name, args);
        }
    }

    return Event;
})
