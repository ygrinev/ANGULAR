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
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var resources_service_1 = require("../resources/resources.service");
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(resourcesService) {
        this.resourcesService = resourcesService;
        this.subject = new BehaviorSubject_1.BehaviorSubject({
            isLoggedIn: false,
            basicInfo: null,
            roles: null
        });
    }
    AuthenticationService.prototype.updateUserInfo = function () {
        var _a;
        var isLoggedIn = false;
        var basicInfo = null;
        var roles = null;
        var isManager = false;
        var isAdmin = false;
        var isPayload = false;
        if (this.resourcesService.getCookie('accessToken')) {
            isLoggedIn = true;
            if (this.resourcesService.getCookie('basicInfo'))
                basicInfo = this.resourcesService.getCookie('basicInfo');
            if (this.resourcesService.getCookie('roles')) {
                roles = this.resourcesService.getCookie('roles');
                if (roles.includes("2")) {
                    isManager = true;
                }
                if (roles.includes("5")) {
                    isAdmin = true;
                }
                if (roles.includes("4")) {
                    isPayload = true;
                }
            }
        }
        this.subject.next({
            isLoggedIn: isLoggedIn,
            basicInfo: JSON.parse(basicInfo),
            roles: (_a = {},
                _a['isManager'] = isManager,
                _a['isAdmin'] = isAdmin,
                _a['isPayload'] = isPayload,
                _a)
        });
    };
    AuthenticationService.prototype.clearUserInfo = function () {
        this.subject.next({
            isLoggedIn: false,
            basicInfo: null,
            roles: null
        });
    };
    AuthenticationService.prototype.getUserInfo = function () {
        return this.subject.asObservable();
    };
    AuthenticationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [resources_service_1.ResourcesService])
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map