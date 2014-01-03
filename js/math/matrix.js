define(function(){
    "use strict";

    function Matrix(rows, data) {
        this.rows = rows;
        this.data = arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : data;
        this.count = this.data.length;
        this.cols = this.count / this.rows;

        if (this.count % this.rows !== 0) {
            throw RangeError('Matrix doesn\'t have valid rows number, given ' + this.rows + ', and counts ' + this.count);
        }
    }

    Matrix.prototype.getAt = function(row, column) {
        return this.data[this.cols * row + column];
    }
    Matrix.prototype.toString = function() {
        var row, col,
        result = 'Matrix[' + this.cols + ',' + this.rows + ']' + "\n";

        for (row = 0; row < this.rows; row++) {
            result += '|'
            for (col = 0; col < this.cols; col++) {
                result += "\t"
                result += this.getAt(row, col);
                result += "\t"
            }
            result += "|\n";
        }

        return result;
    }
    Matrix.prototype.multiply = function(matrix) {
        if (this.cols !== matrix.rows) {
            throw Error('Can\'t multiply matrix because number of rows ' + matrix.rows + ' is different from current matrix columns number ' + this.cols );
        }

        var row, col, a, b, idx, sum,
            data = [];

        for (row = 0; row < this.rows; row++) {
            for (col = 0; col < matrix.cols; col++) {
                sum = 0;
                for (idx = 0; idx < matrix.rows; idx++) {
                    a = this.getAt(row, idx);
                    b = matrix.getAt(idx, col);
                    sum += a * b;
                }
                data.push(sum);
            }
        }

        return new Matrix(this.rows, data);
    }

    return Matrix;
})
