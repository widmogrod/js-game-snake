define(['event/result'], function(Result){
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

    function hash(array) {
        var result = '';

        if (array === undefined) return result;

        array.forEach(function(item){
            switch(Object.prototype.toString.call(item).slice(8, -1)) {
                default:
                    result += item;
                    break;

                case 'Array':
                    result += hash(item);
                    break;

                case 'Object':
                    for (var i in item) {
                        if (item.hasOwnProperty(i))
                            result += hash(item)
                    }
                    break;
            }
        })
        return result;
    }

    function Event() {
        this.events = {};
        this.proxies = {};
    }
    Event.prototype.on = function(name, callback) {
        this.events[name] = this.events[name] ? this.events[name] : [];
        if (-1 === this.events[name].indexOf(callback)) {
            this.events[name].push(callback);
        }
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
        var self = this, key = name + hash(args);

        return this.proxies[key]
            ? this.proxies[key]
            : this.proxies[key] = function proxy(event) {
            self.trigger(name, args);
        }
    }

    return Event;
})
