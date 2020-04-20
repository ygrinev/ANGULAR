"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var custom_date_pipe_1 = require("./custom-date.pipe");
var moment = require("moment");
var common_1 = require("@angular/common");
describe('Testing date format transformation via CustomDatePipe vs Angulars native date pipe.', function () {
    fit('create an instance', function () {
        var pipe = new custom_date_pipe_1.CustomDatePipe();
        expect(pipe).toBeTruthy();
    });
    var dateInputFormat1_jsFormat = 'MM/dd/yyyy';
    var dateInputFormat1_momentFormat = 'MM/DD/YYYY';
    var dateOutputFormat1_jsFormat = 'dd MMM yyyy';
    var dateOutputFormat1_momentFormat = 'DD MMM YYYY';
    var numberOfDaysToTest = 20000;
    var _loop_1 = function (i) {
        var moment_future = moment().add(i, 'days');
        var dateInput = moment_future.format(dateInputFormat1_momentFormat);
        fit('Transform date via custom date pipe ' + dateInput + ' to ' + dateOutputFormat1_jsFormat, function () {
            var custom_pipe = new custom_date_pipe_1.CustomDatePipe();
            expect(custom_pipe.transform(dateInput, dateOutputFormat1_jsFormat + ',' + dateInputFormat1_momentFormat)).toEqual(moment_future.format(dateOutputFormat1_momentFormat));
        });
        fit('Transform date via angular date pipe ' + dateInput + ' to ' + dateOutputFormat1_jsFormat, function () {
            var ng_pipe = new common_1.DatePipe(navigator.language);
            expect(ng_pipe.transform(dateInput, dateOutputFormat1_jsFormat)).toEqual(moment_future.format(dateOutputFormat1_momentFormat));
        });
    };
    for (var i = 0; i < numberOfDaysToTest; i++) {
        _loop_1(i);
    }
    var _loop_2 = function (i) {
        var m = moment().subtract(i, 'days');
        var dateInput = m.format(dateInputFormat1_momentFormat);
        fit('Transform date via custom date pipe ' + dateInput + ' to ' + dateOutputFormat1_jsFormat, function () {
            var custom_pipe = new custom_date_pipe_1.CustomDatePipe();
            expect(custom_pipe.transform(dateInput, dateOutputFormat1_jsFormat + ',' + dateInputFormat1_momentFormat)).toEqual(m.format(dateOutputFormat1_momentFormat));
        });
        fit('Transform date via angular date pipe ' + dateInput + ' to ' + dateOutputFormat1_jsFormat, function () {
            var ng_pipe = new common_1.DatePipe(navigator.language);
            expect(ng_pipe.transform(dateInput, dateOutputFormat1_jsFormat)).toEqual(m.format(dateOutputFormat1_momentFormat));
        });
    };
    for (var i = 0; i < numberOfDaysToTest; i++) {
        _loop_2(i);
    }
});
//# sourceMappingURL=custom-date.pipe.spec.js.map