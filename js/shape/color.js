define(function(){
    'use strict';

    function Color(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 255;
    }
    Color.prototype.clone = function() {
        return new Color(
            this.r,
            this.g,
            this.b,
            this.a
        );
    }

    Color.fromName = function(name) {
        var result = new Color();

        switch(name) {
            case 'red':   result.r = 255; break;
            case 'green': result.g = 255; break;
            case 'blue':  result.b = 255; break;
            case 'orange':  result.r = 255; result.g = 165; break;
        }

        return result;
    }

    Color.prototype.toString = function() {
        return 'rgba('+ this.r +','+ this.g +','+ this.b +', '+ this.a / 255 +')';
    }

    return Color;

})
