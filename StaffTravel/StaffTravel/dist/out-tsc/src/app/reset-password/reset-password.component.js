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
var password_1 = require("../models/password");
var resources_service_1 = require("../services/resources/resources.service");
var ResetPasswordComponent = /** @class */ (function () {
    function ResetPasswordComponent(http, router, activatedRoute, resourcesService) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.resourcesService = resourcesService;
        this.isPasswordValid = true;
        this.isPasswordMatch = true;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) { return _this.r = res; });
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.passwordModel = new password_1.Password();
        this.resetPasswordBtnReady = true;
        this.activatedRoute.queryParams.subscribe(function (params) {
            _this.userId = params['uid'];
            _this.resetToken = params['token'];
            if (_this.userId && _this.resetPassword) {
                _this.errorMessage = '';
                _this.isValid = true;
            }
            else {
                //log an error
                //
                alert('Invalid URL');
                //redirect to login page
                _this.router.navigate(['/login-register']);
                return;
            }
        });
    };
    ResetPasswordComponent.prototype.resetPassword = function () {
        var _this = this;
        if (!this.validateForm()) {
            this.isValid = false;
            this.resetPasswordBtnReady = true;
            return false;
        }
        this.resetPasswordBtnReady = false;
        var body = {
            NewPassword: this.passwordModel.password,
            ConfirmPassword: this.passwordModel.confirmPassword,
            ResetToken: this.resetToken,
            UserId: this.userId
        };
        this.http.post('/api/Account/ResetPassword', body)
            .toPromise()
            .then(function () {
            alert('Password was successfully reset please login using the new password');
            _this.router.navigate(['/login-register']);
        })
            .catch(function (err) {
            alert('Password reset failed');
            console.log('error ' + err);
            _this.resetPasswordBtnReady = true;
        });
    };
    ResetPasswordComponent.prototype.validateForm = function () {
        var passwordRegEx = new RegExp(/(?=^.{6,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/);
        if (!passwordRegEx.test(this.passwordModel.password)) {
            this.resetPasswordBtnReady = false;
            this.isPasswordValid = false;
            return false;
        }
        else {
            this.isPasswordValid = true;
        }
        if (this.passwordModel.password !== this.passwordModel.confirmPassword) {
            this.resetPasswordBtnReady = false;
            this.isPasswordMatch = false;
            return false;
        }
        else {
            this.isPasswordMatch = true;
        }
        return true;
    };
    ResetPasswordComponent = __decorate([
        core_1.Component({
            selector: 'app-reset-password',
            templateUrl: './reset-password.component.html',
            styleUrls: ['./reset-password.component.scss']
        }),
        __metadata("design:paramtypes", [http_1.Http, router_1.Router, router_1.ActivatedRoute, resources_service_1.ResourcesService])
    ], ResetPasswordComponent);
    return ResetPasswordComponent;
}());
exports.ResetPasswordComponent = ResetPasswordComponent;
//# sourceMappingURL=reset-password.component.js.map