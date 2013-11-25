define(function(){
    /**
     * Shape prototype
     */
    function Shape() {
        this.state_ = this.STATE_CLEAN;
    }
    Shape.prototype = {
        'STATE_CLEAN' : 0,
        'STATE_DIRTY' : 1,
        'STATE_RENDERED' : 2,
        'render': function(context) {},
        'state': function(state) {
            if(arguments.length) {
                this.state_ = state;
                return this;
            }
            return this.state_;
        }
    };

    return Shape;
})
