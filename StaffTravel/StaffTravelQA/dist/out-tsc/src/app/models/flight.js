"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
var Flight = /** @class */ (function () {
    function Flight() {
        this.status = enums_1.StatusEnum.Pending;
        this.approvalStatus = enums_1.StatusEnum.Pending;
    }
    return Flight;
}());
exports.Flight = Flight;
//# sourceMappingURL=flight.js.map