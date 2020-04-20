"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
require("rxjs/add/operator/toPromise");
var authentication_service_1 = require("./services/authentication/authentication.service");
var resources_service_1 = require("./services/resources/resources.service");
var PassportGuard = /** @class */ (function () {
    function PassportGuard(http, router, authenticationService, resourcesService) {
        this.http = http;
        this.router = router;
        this.authenticationService = authenticationService;
        this.resourcesService = resourcesService;
    }
    PassportGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        var respOK = 'ERR-REG-001';
        if (this.resourcesService.getCookie('hasPassport') == '') {
            var cookieExpiryDate_1 = parseInt(this.resourcesService.getCookie('cookieExpiryDate'));
            var res_1 = false;
            return this.authenticationService.getPassportStatus(this.resourcesService.getCookie('empNumber'))
                .then(function (rsp) {
                _this.resourcesService.setCookie('hasPassport', rsp, cookieExpiryDate_1);
                res_1 = rsp == respOK;
                if (!res_1) {
                    _this.router.navigate(['/save-passport']);
                }
                return res_1;
            })
                .catch(function (err) {
                _this.resourcesService.setCookie('hasPassport', err.json().Message, cookieExpiryDate_1);
                _this.router.navigate(['/save-passport']);
                return false;
            });
        }
        else {
            if (this.resourcesService.getCookie('hasPassport') == respOK) {
                return true;
            }
            this.router.navigate(['/save-passport']);
            return false;
        }
    };
    PassportGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, router_1.Router, authentication_service_1.AuthenticationService, resources_service_1.ResourcesService])
    ], PassportGuard);
    return PassportGuard;
}());
exports.PassportGuard = PassportGuard;
//# sourceMappingURL=passport.guard.js.map