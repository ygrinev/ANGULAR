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
var http_client_service_1 = require("../services/http-client/http-client.service");
var resources_service_1 = require("../services/resources/resources.service");
var router_1 = require("@angular/router");
var AccessRolesComponent = /** @class */ (function () {
    function AccessRolesComponent(httpClient, router, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.router = router;
        this.resourcesService = resourcesService;
        this.r = {};
        this.userEmail = '';
        this.newRole = '';
        this.systemRoles = new Array();
        this.userRoles = new Array();
        this.getSystemRolesAPI = 'api/Account/GetSystemRoles';
        this.getUserRolesByEmailAPI = 'api/Account/GetUserRolesByEmail?email={0}';
        this.grantUserRoleAPI = 'api/Account/GrantUserRole';
        this.revokeUserRoleAPI = 'api/Account/RevokeUserRole';
        this.grantButtonDisabled = false;
        this.revokeButtonDisabled = false;
        this.searchButtonDisabled = false;
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
        });
    }
    AccessRolesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchButtonDisabled = true;
        this.httpClient.get(this.getSystemRolesAPI)
            .toPromise()
            .then(function (res) {
            _this.systemRoles = res.json();
            _this.searchButtonDisabled = false;
        })
            .catch(function (e) {
            _this.router.navigate(['/home']);
            console.log("Failed: " + e);
            return false;
        });
    };
    AccessRolesComponent.prototype.getUserRoles = function () {
        var _this = this;
        if (!this.userEmail)
            return false;
        this.searchButtonDisabled = true;
        this.httpClient.get(this.getUserRolesByEmailAPI.replace('{0}', this.userEmail))
            .toPromise()
            .then(function (res) {
            _this.userRoles = res.json();
            _this.searchButtonDisabled = false;
        })
            .catch(function (e) {
            _this.searchButtonDisabled = false;
            alert('Failed: ' + e.json().Message);
        });
    };
    AccessRolesComponent.prototype.grantUserRole = function () {
        var _this = this;
        if (!this.newRole)
            return false;
        var body = {
            email: this.userEmail,
            role: this.newRole
        };
        this.grantButtonDisabled = true;
        this.httpClient.post(this.grantUserRoleAPI, body)
            .toPromise()
            .then(function (res) {
            alert('Succeeded');
            _this.getUserRoles();
            _this.grantButtonDisabled = false;
        })
            .catch(function (e) {
            _this.grantButtonDisabled = false;
            alert('Failed: ' + e.json().Message);
        });
    };
    AccessRolesComponent.prototype.revokeUserRole = function (userRole) {
        var _this = this;
        if (!this.userEmail || !userRole)
            return false;
        var body = {
            email: this.userEmail,
            role: userRole
        };
        this.revokeButtonDisabled = true;
        this.httpClient.post(this.revokeUserRoleAPI, body)
            .toPromise()
            .then(function (res) {
            alert('Succeeded');
            _this.getUserRoles();
            _this.revokeButtonDisabled = false;
        })
            .catch(function (e) {
            _this.revokeButtonDisabled = false;
            alert('Failed: ' + e.json().Message());
        });
    };
    AccessRolesComponent = __decorate([
        core_1.Component({
            selector: 'app-access-roles',
            templateUrl: './access-roles.component.html',
            styleUrls: ['./access-roles.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, router_1.Router, resources_service_1.ResourcesService])
    ], AccessRolesComponent);
    return AccessRolesComponent;
}());
exports.AccessRolesComponent = AccessRolesComponent;
//# sourceMappingURL=access-roles.component.js.map