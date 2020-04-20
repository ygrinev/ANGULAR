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
var resources_service_1 = require("../services/resources/resources.service");
var ForgotPasswordComponent = /** @class */ (function () {
    function ForgotPasswordComponent(http, router, resourcesService) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) { return _this.r = res; });
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
        this.errorMessage = '';
        this.isValid = true;
        this.isResetSuccessful = false;
        this.forgotPasswordBtnReady = true;
    };
    ForgotPasswordComponent.prototype.forgotPassword = function () {
        var _this = this;
        this.forgotPasswordBtnReady = false;
        var body = { EmpNumber: this.empNumber };
        this.http.post('/api/Account/ForgotPassword', body)
            .toPromise()
            .then(function (response) {
            _this.isValid = true;
            _this.errorMessage = '';
            _this.isResetSuccessful = true;
            _this.forgotPasswordBtnReady = true;
        })
            .catch(function (err) {
            _this.isValid = false;
            _this.errorMessage = _this.getErrorMessage(err.json().Message);
            _this.forgotPasswordBtnReady = true;
        });
    };
    ForgotPasswordComponent.prototype.getErrorMessage = function (errorMessage) {
        switch (errorMessage) {
            case "ERR-RES-001":
                return this.r.ERR_RES_001;
            case "ERR-RES-002":
                return this.r.ERR_RES_002;
            case "ERR-RES-003":
                return this.r.ERR_RES_003;
            default:
                return this.r.unknownError;
        }
    };
    ForgotPasswordComponent = __decorate([
        core_1.Component({
            selector: 'app-forgot-password',
            templateUrl: './forgot-password.component.html',
            styleUrls: ['./forgot-password.component.scss']
        }),
        __metadata("design:paramtypes", [http_1.Http, router_1.Router, resources_service_1.ResourcesService])
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());
exports.ForgotPasswordComponent = ForgotPasswordComponent;
//# sourceMappingURL=forgot-password.component.js.map