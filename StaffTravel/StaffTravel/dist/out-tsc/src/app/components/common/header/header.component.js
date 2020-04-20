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
var authentication_service_1 = require("../../../services/authentication/authentication.service");
var resources_service_1 = require("../../../services/resources/resources.service");
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(authenticationService, router, resourcesService) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.router = router;
        this.resourcesService = resourcesService;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) { return _this.r = res; });
        this.subscription = this.authenticationService.getUserInfo().subscribe(function (userInfo) { _this.userInfo = userInfo; });
        this.router.events.subscribe(function (data) {
            if (data instanceof router_1.RoutesRecognized) {
                _this.allowAnonymous = data.state.root.firstChild.data.allowAnonymous === '1';
                _this.checkAuthorization();
                _this.toggleState = false;
            }
        });
    }
    HeaderComponent.prototype.ngOnInit = function () {
        // Nav toggle is closed by default
        this.toggleState = false;
    };
    HeaderComponent.prototype.checkAdditionalRoles = function (userRoles) {
        return JSON.stringify(userRoles).includes('true');
    };
    HeaderComponent.prototype.toggleNav = function () {
        this.toggleState = !this.toggleState;
    };
    HeaderComponent.prototype.checkAuthorization = function () {
        if (!this.userInfo.isLoggedIn && !this.allowAnonymous) {
            //TESTING - print debug info 
            //console.log('Kicked out. isLoggedIn=' + this.userInfo.isLoggedIn + ' allowAnonymous=' + this.allowAnonymous)
            this.router.navigate(['/login-register']);
        }
    };
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.scss']
        }),
        __metadata("design:paramtypes", [authentication_service_1.AuthenticationService, router_1.Router, resources_service_1.ResourcesService])
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map