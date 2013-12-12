define(['event/event'], function(Event){
    function onChange(from, to, context) {
        return function() {
            if (null !== context.state && (context.state !== from && from !== '*')) {
                return;
            }

            context.state = to;
            context.trigger('change', [from, to]);
            context.trigger('enter:' + to, [from]);
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

        each(states, function(events, state) {
            each(events, function(nextState, event){
                self.on(event, onChange(state, nextState, self));
            });
        })
    }

    StateMachine.prototype = new Event();

    return StateMachine;
})
