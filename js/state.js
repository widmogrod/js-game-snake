define(['event/event'], function(Event){
    function onChange(from, to, context) {
        return function() {
            var results;
            if (null !== context.state && (context.state !== from && from !== '*')) {
                return;
            }

            if (context.unlock && !context.unlock()) {
                context.postponed = onChange(from, to, context);
                return;
            }

            context.unlock = null;
            context.state = to;
            context.trigger('change', [from, to]);
            results = context.trigger('enter:' + to, [from]);
            if (results.event.hasLocks()) {
                context.unlock = results.event.unlock;
            }
        }
    }

    function each(data, func) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                func(data[key], key);
            }
        }
    }

    function StateMachine(states) {
        var self = this;
        self.events = {};
        self.state = null;
        self.unlock = null;

        each(states, function(events, state) {
            each(events, function(nextState, event){
                self.on(event, onChange(state, nextState, self));
            });
        })
    }

    StateMachine.prototype = new Event();
    /**
     * Resove postponed state.
     * This can happen when current state is bloked
     */
    StateMachine.prototype.run = function() {
        if (typeof this.postponed === 'function') {
            var func = this.postponed;
            this.postponed = null;
            func();
        }
    }
    StateMachine.prototype.createEvent = function() {
        var stopPropagation = false;
        var unlocks = [];
        return {
            hasLocks: function() {
                return unlocks.length > 0;
            },
            lock: function(func) {
                unlocks.push(func);
            },
            unlock: function() {
                var result = true;
                unlocks.forEach(function(func){
                    if (result) {
                        result = func();
                    }
                });
                return result;
            },
            stopPropagation: function(flag) {
                if (arguments.length) {
                    stopPropagation = !!flag;
                } else {
                    return stopPropagation;
                }
            }
        }
    }

    return StateMachine;
})
