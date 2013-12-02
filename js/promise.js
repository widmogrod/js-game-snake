define(function(){
    var STATUS_UNRESOLVED = 0;
    var STATUS_REJECTED = 1;
    var STATUS_FULFILLED = 2;

    function Promise(callback) {
        this.deffered = [];
        this.value = null;
        this.reason = null;
        this.status = STATUS_UNRESOLVED;

        callback(this.reject.bind(this), this.resolve.bind(this));
    }
    Promise.prototype.then = function(onFulfilled, onRejected) {
        if (this.status === STATUS_REJECTED) onRejected(this.reason);
        else if (this.status === STATUS_FULFILLED) onFulfilled(this.message);
        else this.deffered.push([onFulfilled, onRejected]);
        return this;
    }
    Promise.prototype.resolve = function(value) {
        if (this.status !== STATUS_UNRESOLVED) throw new Error('Promise was fulfilled');

        this.status = STATUS_FULFILLED;
        this.value = value;
        this.deffered.forEach(function(item) {
            item[0](value);
        });
    }
    Promise.prototype.reject = function(reason) {
        if (this.status !== STATUS_UNRESOLVED) throw new Error('Promise was rejected')

        this.status = STATUS_REJECTED;
        this.reason = reason;
        this.deffered.forEach(function(item) {
            item[1](reason);
        });
    }

    return Promise;
})
