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
var passport_1 = require("../models/passport");
var resources_service_1 = require("../services/resources/resources.service");
var passport_service_1 = require("../services/passport/passport.service");
var SavePassportComponent = /** @class */ (function () {
    function SavePassportComponent(http, router, activatedRoute, resourcesService, passportService) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.resourcesService = resourcesService;
        this.passportService = passportService;
        this.isValid = true;
        this.isEmpNumValid = true;
        this.isHRAdmin = false;
        this.saveBtnReady = true;
        this.chkBtnReady = true;
        this.isSaveSuccessful = true;
        this.isValidationSuccessful = true;
        this.loadingBtn1 = false;
        this.loadingBtn2 = false;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) { return _this.r = res; });
        this.passportModel = new passport_1.Passport();
    }
    SavePassportComponent.prototype.ngOnInit = function () {
        this.hasPassport = this.resourcesService.getCookie('hasPassport') == 'ERR-REG-001';
        this.passportModel.empNumber = this.resourcesService.getCookie('empNumber');
        if (this.resourcesService.getCookie('roles')) {
            var roles = this.resourcesService.getCookie('roles');
            if (roles.includes("6")) {
                this.isHRAdmin = true;
            }
        }
        this.getPassport();
        if (this.isHRAdmin) {
            this.basicInfo = JSON.parse(this.resourcesService.getCookie('basicInfo'));
            this.passportModel.name = this.basicInfo.firstname + ' ' + this.basicInfo.lastname;
        }
    };
    SavePassportComponent.prototype.savePassport = function () {
        var _this = this;
        if (this.chkBtnReady && this.isValidationSuccessful) {
            this.errorMessage = '';
            this.saveBtnReady = false;
            this.loadingBtn1 = true;
            var body = {
                EmpNumber: this.passportModel.empNumber,
                FirstNamePassport: this.passportModel.firstNamePassport,
                MidNamePassport: this.passportModel.midNamePassport,
                LastNamePassport: this.passportModel.lastNamePassport
            };
            return this.http.post('/api/Account/SavePassport', body)
                .toPromise()
                .then(function (rsp) {
                // set cookie hasPassport
                _this.resourcesService.setCookie('hasPassport', rsp.json(), 14);
                _this.loadingBtn1 = false;
                _this.saveBtnReady = true;
                _this.isSaveSuccessful = true;
                _this.errorMessage = _this.r.successSavePassport;
                if (!_this.isHRAdmin) {
                    _this.router.navigate(['/home']);
                }
            })
                .catch(function (err) {
                // set cookie hasPassport
                _this.isValid = false;
                _this.loadingBtn1 = false;
                _this.saveBtnReady = true;
                _this.isSaveSuccessful = false;
                _this.errorMessage = _this.resourcesService.getErrorMessage(err.json().Message);
                _this.resourcesService.setCookie('hasPassport', err.json().Message, 14);
            });
        }
    };
    SavePassportComponent.prototype.getPassport = function () {
        var _this = this;
        this.errorMessage = '';
        this.chkBtnReady = false;
        this.isValidationSuccessful = false;
        this.loadingBtn2 = true;
        this.chkBtnReady = false;
        this.http.get('/api/Account/GetPassport?empNumber=' + this.passportModel.empNumber)
            .toPromise()
            .then(function (rsp) {
            _this.passportModel = rsp.json();
            if (!_this.passportModel.firstNamePassport) {
                _this.errorMessage = _this.resourcesService.getErrorMessage('ERR-REG-007');
            }
            ///alert('Full Name = ' + this.passportModel.name + ', firstName = ' + this.passportModel.firstNamePassport + ', lastName = ' + this.passportModel.lastNamePassport);
            _this.isValidationSuccessful = true;
            _this.isEmpNumValid = true;
        })
            .catch(function (err) {
            _this.passportModel.firstNamePassport = "";
            _this.passportModel.midNamePassport = "";
            _this.passportModel.lastNamePassport = "";
            _this.errorMessage = _this.resourcesService.getErrorMessage(err.json().Message);
            _this.isEmpNumValid = false;
            _this.isValidationSuccessful = false;
            _this.isValid = false;
        });
        this.loadingBtn2 = false;
        this.chkBtnReady = true;
    };
    SavePassportComponent.prototype.invalidatePassport = function () {
        this.errorMessage = '';
        this.isEmpNumValid = false;
        this.passportModel.name = '';
        this.isValidationSuccessful = false;
        this.isSaveSuccessful = false;
    };
    SavePassportComponent = __decorate([
        core_1.Component({
            selector: 'app-save-passport',
            templateUrl: './save-passport.component.html',
            styleUrls: ['./save-passport.component.scss']
        }),
        __metadata("design:paramtypes", [http_1.Http, router_1.Router, router_1.ActivatedRoute, resources_service_1.ResourcesService, passport_service_1.PassportService])
    ], SavePassportComponent);
    return SavePassportComponent;
}());
exports.SavePassportComponent = SavePassportComponent;
//# sourceMappingURL=save-passport.component.js.map