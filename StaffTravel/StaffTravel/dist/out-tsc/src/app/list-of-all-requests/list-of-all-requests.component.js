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
var http_client_service_1 = require("../services/http-client/http-client.service");
require("rxjs/add/operator/toPromise");
var ng2_smart_table_1 = require("ng2-smart-table");
var resources_service_1 = require("../services/resources/resources.service");
var ListOfAllRequestsComponent = /** @class */ (function () {
    function ListOfAllRequestsComponent(httpClient, router, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.router = router;
        this.resourcesService = resourcesService;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
        });
    }
    ListOfAllRequestsComponent.prototype.ngOnInit = function () {
        this.initTable();
    };
    ListOfAllRequestsComponent.prototype.initTable = function () {
        // Default table type to 'search' if not set
        if (this.tableType === undefined) {
            this.tableType = 'search';
        }
        // Base ng2-smart-table settings
        this.settings = {
            actions: {
                add: false,
                edit: false,
                delete: false
            },
            pager: {
                perPage: 15,
            },
            attr: {
                class: 'table'
            },
            hideSubHeader: true,
            columns: this.tableSettings.columns
        };
    };
    ListOfAllRequestsComponent.prototype.onSearch = function (query) {
        if (query === void 0) { query = ''; }
        if (query != '') {
            this.source.setFilter(this.tableSettings.filters(query), false);
        }
        else {
            this.source.reset();
        }
    };
    ListOfAllRequestsComponent.prototype.routingto = function (event) {
        this.router.navigate([this.tableSettings.route + event.data.RequestId + '']);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", ng2_smart_table_1.LocalDataSource)
    ], ListOfAllRequestsComponent.prototype, "source", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ListOfAllRequestsComponent.prototype, "tableSettings", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ListOfAllRequestsComponent.prototype, "tableType", void 0);
    ListOfAllRequestsComponent = __decorate([
        core_1.Component({
            selector: 'list-of-all-requests',
            templateUrl: './list-of-all-requests.component.html',
            styleUrls: ['./list-of-all-requests.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, router_1.Router, resources_service_1.ResourcesService])
    ], ListOfAllRequestsComponent);
    return ListOfAllRequestsComponent;
}());
exports.ListOfAllRequestsComponent = ListOfAllRequestsComponent;
//# sourceMappingURL=list-of-all-requests.component.js.map