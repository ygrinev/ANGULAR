"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
/*
* Overrides the default date pipe in angular by using the same name 'date'
* To maintain the formats already being used across the site which was meant for the angular pipe we transform the format to upper case as this is the format that momentJs uses
* Original Issue: http://yyztfs3:8080/tfs/web/wi.aspx?pcguid=2ef8fee7-ca25-4dd4-8ce1-8f34e45f0864&id=21047
*/
var CustomDatePipe = /** @class */ (function () {
    function CustomDatePipe() {
    }
    CustomDatePipe.prototype.transform = function (value, args) {
        if (!value)
            return '';
        var argsArray;
        var outputFormat;
        var inputFormat;
        var formattedDate = null;
        var inputDate;
        argsArray = args.split(',');
        if (argsArray.length > 0)
            outputFormat = argsArray[0];
        if (args.split(',').length > 1)
            inputFormat = argsArray[1];
        if (inputFormat)
            inputDate = moment(value, inputFormat);
        else
            inputDate = moment(value);
        if (inputDate.isValid()) {
            if (outputFormat)
                formattedDate = inputDate.format(outputFormat.toUpperCase());
            else
                formattedDate = inputDate.format();
        }
        return formattedDate;
    };
    CustomDatePipe = __decorate([
        core_1.Pipe({
            name: 'date'
        })
    ], CustomDatePipe);
    return CustomDatePipe;
}());
exports.CustomDatePipe = CustomDatePipe;
//# sourceMappingURL=custom-date.pipe.js.map