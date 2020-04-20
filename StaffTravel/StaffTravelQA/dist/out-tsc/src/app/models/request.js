"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passenger_1 = require("./passenger");
var enums_1 = require("./enums");
var Request = /** @class */ (function () {
    function Request() {
        this.passengers = new Array(new passenger_1.Passenger);
        this.flights = new Array();
        this.hotels = new Array();
        this.ancillaries = new Array();
        this.notes = new Array();
        this.status = enums_1.StatusEnum.Pending;
        this.requestDate = new Date();
    }
    return Request;
}());
exports.Request = Request;
//# sourceMappingURL=request.js.map