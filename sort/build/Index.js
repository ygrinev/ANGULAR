"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sorter = /** @class */ (function () {
    function Sorter(collection) {
        this.collection = collection;
    }
    Sorter.prototype.sort = function () {
        var length = this.collection.length;
        for (var i = 0; i < length; i++)
            for (var j = 0; j < length - i - 1; j++) {
                var left = this.collection[j], right = this.collection[j + 1];
                if (left > right) {
                    this.collection[j] = right;
                    this.collection[j + 1] = left;
                }
            }
    };
    return Sorter;
}());
exports.Sorter = Sorter;
var sorter = new Sorter([10, 3, -5, 0]);
sorter.sort();
console.log(sorter.collection);
// console.log('HELLO MY WONDERFUL WORLD!');
// console.log('.........................');
