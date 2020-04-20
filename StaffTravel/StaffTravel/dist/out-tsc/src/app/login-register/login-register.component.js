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
var register_1 = require("../models/register");
var login_1 = require("../models/login");
var authentication_service_1 = require("../services/authentication/authentication.service");
var resources_service_1 = require("../services/resources/resources.service");
var LoginRegisterComponent = /** @class */ (function () {
    function LoginRegisterComponent(http, router, authenticationService, resourcesService) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.authenticationService = authenticationService;
        this.resourcesService = resourcesService;
        this.authenticationService.clearUserInfo();
        this.subscription = this.authenticationService.getUserInfo().subscribe(function (userInfo) { _this.userInfo = userInfo; });
        this.showPassword = {};
        this.r = {};
        resourcesService.getResources().subscribe(function (res) { return _this.r = res; });
    }
    LoginRegisterComponent.prototype.ngOnInit = function () {
        //clean-up any saved values in the session
        sessionStorage.clear();
        localStorage.clear();
        this.resourcesService.deleteAllCookies();
        //initialize
        this.errorMessage = '';
        this.isValid = true;
        this.isPasswordValid = true;
        this.isPasswordMatch = true;
        this.isRegisteredSuccessfully = false;
        this.loginModel = new login_1.Login();
        this.registerModel = new register_1.Register();
        this.loginBtnReady = true;
        this.registerBtnReady = true;
        this.loadingBtn = false;
    };
    LoginRegisterComponent.prototype.ngOnDestroy = function () {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    };
    LoginRegisterComponent.prototype.toggleTab = function (event) {
        event.stopPropagation();
        event.preventDefault();
        var tabs = document.querySelectorAll('.tab-group > .tab');
        var selectedTabID = event.target.getAttribute('aria-controls');
        var selectedTab = document.getElementById(selectedTabID);
        Array.from(tabs).forEach(function (tab) {
            tab.classList.remove('active');
        });
        selectedTab.classList.add('active');
        this.errorMessage = '';
        this.isValid = true;
        return false;
    };
    /**
     * Toggle Password Fields type between text / password to show / hide password
     */
    LoginRegisterComponent.prototype.togglePassword = function (event) {
        event.stopPropagation();
        event.preventDefault();
        var passwordField = event.target.parentNode.parentNode.querySelectorAll('input')[0];
        var passwordFieldID = passwordField.id;
        // Create "false" state within the object on first click of togglePassword
        if (!this.showPassword.hasOwnProperty(passwordFieldID)) {
            this.showPassword[passwordFieldID] = false;
        }
        // Toggle state of showPassword object
        this.showPassword[passwordFieldID] = !this.showPassword[passwordFieldID];
        if (this.showPassword[passwordFieldID]) {
            passwordField.setAttribute('type', 'text');
        }
        else {
            passwordField.setAttribute('type', 'password');
        }
    };
    LoginRegisterComponent.prototype.login = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var body = "grant_type=" + "password" + "&username=" + this.loginModel.empNumber + "&password=" + this.loginModel.password;
        this.loginBtnReady = false;
        this.loadingBtn = true;
        this.http.post('/Token', body, { headers: headers })
            .toPromise()
            .then(function (response) {
            _this.isValid = true;
            _this.errorMessage = '';
            var cookieExpiryDate = _this.loginModel.rememberMe ? 14 : 1;
            var empNumber = response.json().userName;
            _this.resourcesService.setCookie('cookieExpiryDate', cookieExpiryDate.toString(), cookieExpiryDate);
            _this.resourcesService.setCookie('accessToken', response.json().access_token, cookieExpiryDate);
            _this.resourcesService.setCookie('basicInfo', response.json().basicInfo, cookieExpiryDate);
            _this.resourcesService.setCookie('roles', response.json().roles, cookieExpiryDate);
            _this.resourcesService.setCookie('empNumber', empNumber, cookieExpiryDate);
            _this.authenticationService.updateUserInfo();
            _this.authenticationService.getPassportStatus(empNumber)
                .then(function (rsp) {
                _this.resourcesService.setCookie('hasPassport', rsp, cookieExpiryDate);
                _this.loginBtnReady = true;
                _this.loadingBtn = false;
                _this.router.navigate([rsp == 'ERR-REG-001' ? '/home' : '/save-passport']);
            })
                .catch(function (err) {
                _this.resourcesService.setCookie('hasPassport', err.json().Message, cookieExpiryDate);
                _this.loginBtnReady = true;
                _this.loadingBtn = false;
                _this.router.navigate([err.json().Message == 'ERR-REG-001' ? '/home' : '/save-passport']);
            });
            //TODO: navigate to the referrer page
        })
            .catch(function (err) {
            _this.isValid = false;
            _this.errorMessage = _this.getErrorMessage(err.json().error);
            _this.loginBtnReady = true;
            _this.loadingBtn = false;
        });
    };
    LoginRegisterComponent.prototype.register = function () {
        var _this = this;
        if (!this.validateForm()) {
            return false;
        }
        var body = {
            EmpNumber: this.registerModel.empNumber,
            LastName: this.registerModel.lastName,
            Password: this.registerModel.password,
            ConfirmPassword: this.registerModel.confirmPassword,
            FirstNamePassport: this.registerModel.firstNamePassport,
            MidNamePassport: this.registerModel.midNamePassport,
            LastNamePassport: this.registerModel.lastNamePassport
        };
        this.registerBtnReady = false;
        this.loadingBtn = true;
        this.http.post('/api/Account/Register', body)
            .toPromise()
            .then(function (response) {
            //after succesfully registering, login the user
            _this.isValid = true;
            _this.errorMessage = '';
            _this.isRegisteredSuccessfully = true;
            _this.loginModel.empNumber = _this.registerModel.empNumber;
            _this.loginModel.password = _this.registerModel.password;
            _this.registerBtnReady = true;
            _this.login();
        })
            .catch(function (err) {
            _this.isValid = false;
            _this.errorMessage = _this.getErrorMessage(err.json().Message);
            _this.registerBtnReady = true;
            _this.loadingBtn = false;
        });
    };
    LoginRegisterComponent.prototype.validateForm = function () {
        var passwordRegEx = new RegExp(/(?=^.{6,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/);
        if (!passwordRegEx.test(this.registerModel.password)) {
            this.isPasswordValid = false;
            return false;
        }
        else {
            this.isPasswordValid = true;
        }
        if (this.registerModel.password !== this.registerModel.confirmPassword) {
            this.isPasswordMatch = false;
            return false;
        }
        else {
            this.isPasswordMatch = true;
        }
        return true;
    };
    LoginRegisterComponent.prototype.getErrorMessage = function (errCode) { return this.resourcesService.getErrorMessage(errCode); };
    LoginRegisterComponent = __decorate([
        core_1.Component({
            selector: 'login-register',
            templateUrl: './login-register.component.html',
            styleUrls: ['./login-register.component.scss']
        }),
        __metadata("design:paramtypes", [http_1.Http, router_1.Router, authentication_service_1.AuthenticationService, resources_service_1.ResourcesService])
    ], LoginRegisterComponent);
    return LoginRegisterComponent;
}());
exports.LoginRegisterComponent = LoginRegisterComponent;
//# sourceMappingURL=login-register.component.js.map