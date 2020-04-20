"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
var Passenger = /** @class */ (function () {
    function Passenger(passengerNumber) {
        if (passengerNumber === void 0) { passengerNumber = 1; }
        this.status = enums_1.StatusEnum.Pending;
        this.approvalStatus = enums_1.StatusEnum.Pending;
        this.passengerNumber = passengerNumber;
    }
    return Passenger;
}());
exports.Passenger = Passenger;
//# sourceMappingURL=passenger.js.map