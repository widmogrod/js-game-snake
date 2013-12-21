define(function() {
    function ActionManager() {
        this.actions = {};
        this.queue = {};
        this.unset = {};
    }

    ActionManager.prototype.set = function(name, action) {
        if (!this.has(name) || this.get(name).canStop()) {
            this.actions[name] = action;
        } else {
            // If action can't stop then queue this action
            // and try to set it when current action can be stopped.
            this.queue[name] = action;
        }
        return this;
    }
    ActionManager.prototype.get = function(name) {
        return this.actions[name];
    }
    ActionManager.prototype.has = function(name) {
        return this.actions.hasOwnProperty(name);
    }
    ActionManager.prototype.remove = function(name) {
        if (!this.has(name)) return;

        var action = this.get(name);
        if (action.canRemove()) {
            delete this.actions[name];
            delete this.queue[name];
            delete this.unset[name];
            action.trigger('removed');
        } else {
            this.unset[name] = true;
        }
    }
    ActionManager.prototype.canStop = function(name) {
        return this.has(name) ? this.get(name).canStop() : false;
    }
    ActionManager.prototype.proxy = function(method, args) {
        var self = this;
        args = typeof args === 'array' ? args : [args];
        return function() {
            return self[method].apply(self, args);
        }
    }
    ActionManager.prototype.run = function() {
        var name, action, temporary;
        for (name in this.actions) {
            if (!this.actions.hasOwnProperty(name)) {
                continue;
            }

            action = temporary = this.actions[name];

            if (this.unset.hasOwnProperty(name) && action.canRemove()) {
                this.remove(name);
                continue;
            }

            if (this.queue.hasOwnProperty(name) && action.canStop()) {
                action = this.actions[name] = this.queue[name];
                delete this.queue[name];
                temporary.trigger('stopped');
            }

            if (action.finish()) {
                action.trigger('finish');
                delete this.actions[name];
            } else {
                action.run();
            }
        }
    }

    return ActionManager;
})
