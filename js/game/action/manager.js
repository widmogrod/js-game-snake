define(function() {
    function ActionManager() {
        this.actions = {};
        this.queue = {};
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
        this.has(name) && delete this.actions[name];
    }
    ActionManager.prototype.run = function() {
        var name, action;
        for (name in this.actions) {
            if (!this.actions.hasOwnProperty(name)) {
                continue;
            }

            action = this.actions[name];

            if (this.queue.hasOwnProperty(name) && action.canStop()) {
                action = this.actions[name] = this.queue[name];
                delete this.queue[name];
            }

            action.run();
        }
    }

    return ActionManager;
})
