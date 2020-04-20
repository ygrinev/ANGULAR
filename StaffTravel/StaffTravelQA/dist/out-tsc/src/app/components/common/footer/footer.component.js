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
var resources_service_1 = require("../../../services/resources/resources.service");
var authentication_service_1 = require("../../../services/authentication/authentication.service");
var FooterComponent = /** @class */ (function () {
    function FooterComponent(authenticationService, resourcesService) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.resourcesService = resourcesService;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) { return _this.r = res; });
        this.subscription = this.authenticationService.getUserInfo().subscribe(function (userInfo) { _this.userInfo = userInfo; });
    }
    FooterComponent.prototype.ngOnInit = function () { };
    FooterComponent.prototype.switchLanguage = function () {
        if (this.resourcesService.cultrue == 'en-CA')
            this.resourcesService.setCookie('culture', 'fr-CA', 365);
        else
            this.resourcesService.setCookie('culture', 'en-CA', 365);
        document.location.reload();
    };
    FooterComponent = __decorate([
        core_1.Component({
            selector: 'app-footer',
            templateUrl: './footer.component.html',
            styleUrls: ['./footer.component.scss']
        }),
        __metadata("design:paramtypes", [authentication_service_1.AuthenticationService, resources_service_1.ResourcesService])
    ], FooterComponent);
    return FooterComponent;
}());
exports.FooterComponent = FooterComponent;
//# sourceMappingURL=footer.component.js.map