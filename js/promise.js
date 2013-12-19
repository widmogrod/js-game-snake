(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); })(function() {
    var STATUS_UNRESOLVED = 0;
    var STATUS_REJECTED = 1;
    var STATUS_FULFILLED = 2;

    function handle(item, isRejected, value) {
        var x, func, promise;
        func = isRejected ? item.onReject : item.onResolve;
        promise = item.promise;
        try {
            if (typeof func !== 'function') {
                return isRejected
                    ? promise.reject(value)
                    : promise.fulfill(value)
            } else {
                x = func(value);
                resolve(promise, x);
            }
        } catch(e) {
            promise.reject(e);
        }
    }

    function resolve(p, x) {
        var then, notCalled = true;

        try {
            if (x === p) {
                throw new TypeError('Promise and x refer to the same object');
            }
            if (x instanceof Promise) {
                return x.then(function(v){ p.fulfill(v) }, function(r){ p.reject(r) });
            }
            if ((x !== Object(x) && typeof x !== 'function') || !('then' in x)) {
                return p.fulfill(x);
            }

            then = x.then;

            if (typeof then !== 'function') {
                return p.fulfill(x);
            }

            then.call(
                x,
                function onResolve(v) {
                    if (notCalled) {
                        notCalled = false;
                        resolve(p, v);
                    }
                }, function onReject(r){
                    if (notCalled) {
                        notCalled = false;
                        p.reject(r);
                    }
                }
            );
        } catch(e) {
            notCalled && p.reject(e);
        }
    }

    function each(promise, value) {
        while(promise.deffered.length) {
            handle(promise.deffered.shift(), promise.status === STATUS_REJECTED, value);
        }
    }

    function tryResolve(promise) {
        setTimeout(function() {
            if (promise.status === STATUS_FULFILLED) each(promise, promise.value);
            else if (promise.status === STATUS_REJECTED) each(promise, promise.value);
        }, 0);
        return promise;
    }

    function Promise() {
        this.deffered = [];
        this.status = null;
        this.value = null;
    }

    Promise.prototype.fulfill = function(value){
        if (this.status !== STATUS_UNRESOLVED)
            return this;

        this.status = STATUS_FULFILLED;
        this.value = value;

        return tryResolve(this);
    };
    Promise.prototype.reject = function(reason) {
        if (this.status !== STATUS_UNRESOLVED)
            return this;

        this.status = STATUS_REJECTED;
        this.value = reason;

        return tryResolve(this);
    };
    Promise.prototype.then = function(onResolve, onReject) {
        var promise = new Promise();

        this.deffered.push({
            onResolve: onResolve,
            onReject: onReject,
            promise: promise
        });

        tryResolve(this);

        return promise;
    };

    return Promise;
});
