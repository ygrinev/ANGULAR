"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var passport_guard_1 = require("./passport.guard");
describe('PassportGuardGuard', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [passport_guard_1.PassportGuard]
        });
    });
    it('should ...', testing_1.inject([passport_guard_1.PassportGuard], function (guard) {
        expect(guard).toBeTruthy();
    }));
});
//# sourceMappingURL=passport.guard.spec.js.map