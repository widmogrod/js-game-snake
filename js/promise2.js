define(function() {
    var STATUS_UNRESOLVED = 0.
        STATUS_FULFILLED = 1.
        STATUS_REJECTED = 2;

    function Promise(callback) {
        this.status = STATUS_UNRESOLVED;
        this.callback = callback;
        this.reason = null;
        this.value = null;
        this.result = null;
    }

    Promise.prototype.then = function(onFulfilled, onRejected) {
        resolve(this, onFulfilled, onRejected);
        return next(this);
    }

    function next(promise) {
        return new Promise(function(fulfill, reject) {
            var isFulfilled = promise.status === STATUS_FULFILLED,
                isRejected = promise.status === STATUS_REJECTED;

            isFulfilled && fulfill(promise.value || promise.value);
            isRejected && reject(promise.value || promise.reason);
        });
    }
    function resolve(promise, onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function() {};
        onRejected = typeof onRejected === 'function' ? onRejected : function() {};

        if (promise.status === STATUS_FULFILLED) {
            onFulfilled(promise.value);
        } else if (promise.status === STATUS_REJECTED) {
            onRejected(promise.reason);
        } else {
            promise.callback(fulfill(promise, onFulfilled), reject(promise, onRejected));
        }

        return next;
    }
    function fulfill(promise, onFulfilled) {
        return function(value) {
            promise.status = STATUS_FULFILLED;
            promise.value = value;
            promise.result = onFulfilled(value);
        }
    }
    function reject(promise, onRejected) {
        return function(reason) {
            promise.status = STATUS_REJECTED;
            promise.reason = reason;
            promise.result = onRejected(reason);
        }
    }

    return Promise;

})
