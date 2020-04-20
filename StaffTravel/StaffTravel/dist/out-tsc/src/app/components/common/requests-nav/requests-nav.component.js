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
var http_client_service_1 = require("../../../services/http-client/http-client.service");
var resources_service_1 = require("../../../services/resources/resources.service");
var enums_1 = require("../../../models/enums");
var RequestsNavComponent = /** @class */ (function () {
    function RequestsNavComponent(httpClient, route, router, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.route = route;
        this.router = router;
        this.resourcesService = resourcesService;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) { return _this.r = res; });
        this.noRequestsLeft = false;
        this.isFirstRequest = false;
    }
    RequestsNavComponent.prototype.ngOnInit = function () {
        var _this = this;
        switch (this.type) {
            case 'manager':
                this.getRequestsAPI = 'api/request/GetTeamList/';
                this.listRouteUrl = '/team-requests';
                this.reviewUrl = '/manager-review/';
                break;
            case 'admin':
                this.getRequestsAPI = 'api/request/GetAdminList/';
                this.listRouteUrl = '/all-requests';
                this.reviewUrl = '/admin-review/';
                break;
            case 'payload':
                this.getRequestsAPI = 'api/request/GetPayloadListFNav';
                this.listRouteUrl = '/all-flightonly-requests';
                this.reviewUrl = '/payload-review/';
                break;
            default:
                this.getRequestsAPI = 'api/Request/GetRequestsList';
                this.listRouteUrl = '/my-requests';
                this.reviewUrl = '/request-progress/';
        }
        this.route.params.subscribe(function (params) {
            _this.httpClient.get(_this.getRequestsAPI)
                .toPromise()
                .then(function (res) {
                return res.json().filter(function (list) { return list.Status === enums_1.StatusEnum.Pending; });
                ;
            })
                .then(function (list) {
                _this.totalPendingRequests = list.length;
                _this.currentPendingRequest = list.findIndex(_this.getRequestIndex, params['requestId']);
                var nextRequestIndex = _this.currentPendingRequest + 1;
                var previousRequestIndex = _this.currentPendingRequest - 1;
                // If no more "next" pending tasks -> Go back to first pending
                if (list[nextRequestIndex] === undefined) {
                    _this.noRequestsLeft = true;
                    _this.nextPendingId = null;
                }
                else {
                    _this.noRequestsLeft = false;
                    _this.nextPendingId = list[nextRequestIndex].RequestId;
                }
                // If no more "next" pending tasks -> Go back to first pending
                if (list[previousRequestIndex] === undefined) {
                    _this.isFirstRequest = true;
                    _this.previousId = null;
                }
                else {
                    _this.isFirstRequest = false;
                    _this.previousId = list[previousRequestIndex].RequestId;
                }
            });
        });
    };
    RequestsNavComponent.prototype.getRequestIndex = function (list) {
        return list.RequestId == this;
    };
    RequestsNavComponent.prototype.goToRequestList = function () {
        this.router.navigate([this.listRouteUrl]);
    };
    RequestsNavComponent.prototype.goToNextRequest = function () {
        if (this.nextPendingId === null) {
            // Fallback if not disabled correctly
            this.goToRequestList();
        }
        else {
            this.router.navigate([this.reviewUrl, this.nextPendingId]);
        }
    };
    RequestsNavComponent.prototype.goToPreviousRequest = function () {
        if (this.previousId === null) {
            // Fallback if not disabled correctly
            this.goToRequestList();
        }
        else {
            this.router.navigate([this.reviewUrl, this.previousId]);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], RequestsNavComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], RequestsNavComponent.prototype, "requestId", void 0);
    RequestsNavComponent = __decorate([
        core_1.Component({
            selector: 'requests-nav',
            templateUrl: './requests-nav.component.html',
            styleUrls: ['./requests-nav.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, router_1.ActivatedRoute, router_1.Router, resources_service_1.ResourcesService])
    ], RequestsNavComponent);
    return RequestsNavComponent;
}());
exports.RequestsNavComponent = RequestsNavComponent;
//# sourceMappingURL=requests-nav.component.js.map