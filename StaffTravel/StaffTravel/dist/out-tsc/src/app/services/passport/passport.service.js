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
var router_1 = require("@angular/router");
require("rxjs/add/operator/toPromise");
var http_1 = require("@angular/http");
var resources_service_1 = require("../resources/resources.service");
var PassportService = /** @class */ (function () {
    function PassportService(http, router, resourcesService) {
        this.http = http;
        this.router = router;
        this.resourcesService = resourcesService;
    }
    PassportService.prototype.savePassport = function (passportModel) {
        var _this = this;
        //alert('Saving passport is under construction...');
        var body = {
            EmpNumber: passportModel.empNumber,
            FirstNamePassport: passportModel.firstNamePassport,
            MidNamePassport: passportModel.midNamePassport,
            LastNamePassport: passportModel.lastNamePassport
        };
        return this.http.post('/api/Account/SavePassport', body)
            .toPromise()
            .then(function (rsp) {
            // set cookie hasPassport
            _this.resourcesService.setCookie('hasPassport', rsp.json().Message, 14);
            return true;
        })
            .catch(function (err) {
            // set cookie hasPassport
            _this.resourcesService.setCookie('hasPassport', err.json().Message, 14);
            return true;
        });
    };
    PassportService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, router_1.Router, resources_service_1.ResourcesService])
    ], PassportService);
    return PassportService;
}());
exports.PassportService = PassportService;
//# sourceMappingURL=passport.service.js.map