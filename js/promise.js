define(function(){
    function Promise(callback) {
        this.deffered = [];
        this.done = false;
        this.value = null;
        this.error = null;

        callback(this.reject.bind(this), this.resolve.bind(this));
    }
    Promise.prototype.then = function(callback) {
        if (!this.done) this.deffered.push(callback);
        else callback(this.error, this.value);
        return this;
    }
    Promise.prototype.resolve = function(value) {
        if (this.done) throw new Error('Promise was resolved');

        this.done = true;
        this.value = value;
        this.deffered.forEach(function(callback) {
            callback(null, value);
        });
    }
    Promise.prototype.reject = function(error) {
        if (this.done) throw new Error('Promise was rejected')

        this.done = true;
        this.error = error;
        this.deffered.forEach(function(callback) {
            callback(error, null);
        });
    }

    return Promise;
})
