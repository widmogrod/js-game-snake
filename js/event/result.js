define(function(){
    function Result(event) {
        this.event = event;
        this.results = [];
    }
    Result.prototype.count = function() {
        return this.results.length;
    }
    Result.prototype.push = function(value) {
        this.results.push(value);
    }
    Result.prototype.last = function(defaults) {
        var c = this.count();
        return c ? this.results[c - 1] : defaults;
    }
    Result.prototype.each = function(func) {
        this.results.forEach(func);
    }

    return Result;
})
