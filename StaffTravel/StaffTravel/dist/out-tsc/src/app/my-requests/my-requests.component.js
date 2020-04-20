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
var enums_1 = require("../models/enums");
var http_client_service_1 = require("../services/http-client/http-client.service");
var ng2_smart_table_1 = require("ng2-smart-table");
var moment = require("moment");
var resources_service_1 = require("../services/resources/resources.service");
var MyRequestsComponent = /** @class */ (function () {
    function MyRequestsComponent(httpClient, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.resourcesService = resourcesService;
        this.statusEnum = enums_1.StatusEnum;
        this.searchFilter = function (query) {
            return [
                {
                    field: 'RequestDate',
                    search: query
                },
                {
                    field: 'FirstName',
                    search: query
                },
                {
                    field: 'LastName',
                    search: query
                },
                {
                    field: 'Status',
                    search: query
                },
                {
                    field: 'TypeOfPasses',
                    search: query
                },
                {
                    field: 'NumberOfPasses',
                    search: query
                }
            ];
        };
        this.r = {};
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.initTable();
        });
    }
    MyRequestsComponent.prototype.ngOnInit = function () {
        this.initTable();
    };
    MyRequestsComponent.prototype.initTable = function () {
        var _this = this;
        this.tableType = 'viewByYear';
        // Data source for ng2-smart-table
        this.requestlistViewArray()
            .then(function (res) {
            _this.source = new ng2_smart_table_1.LocalDataSource(res);
        });
        // Columns settings for ng2-smart-table
        this.columns = {
            RequestDate: {
                title: this.r.initiated,
                type: 'html',
                valuePrepareFunction: function (id, row) {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            TypeOfPasses: {
                title: this.r.typeOfPasses,
                type: 'html',
                valuePrepareFunction: function (cell, row) {
                    if (cell != null) {
                        var parsedDate = cell.replace(/,/g, '<br/>');
                        return parsedDate.toLocaleString();
                    }
                },
            },
            NumberOfPasses: {
                title: this.r.passesCount,
                type: 'html',
                valuePrepareFunction: function (cell, row) {
                    if (cell != null) {
                        var parsedDate = cell.replace(/,/g, '<br/>');
                        return parsedDate.toLocaleString();
                    }
                },
            },
            Status: {
                title: this.r.status,
                type: 'html',
                valuePrepareFunction: function (id) {
                    if (id === enums_1.StatusEnum.Pending) {
                        return "<i class=\"fa fa-bookmark\" aria-hidden=\"true\"></i> " + _this.r['status' + id];
                    }
                    else {
                        return _this.r['status' + id];
                    }
                }
            }
        };
        this.tableSettings = {
            columns: this.columns,
            filters: this.searchFilter,
            route: '/request-progress/'
        };
    };
    MyRequestsComponent.prototype.requestlistViewArray = function () {
        var url = 'api/Request/GetRequestsList';
        return this.httpClient.get(url)
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    MyRequestsComponent.prototype.handleError = function (error) {
        console.error('An error occurred', error); // test
        return Promise.reject(error.statusMessage || error);
    };
    MyRequestsComponent = __decorate([
        core_1.Component({
            selector: 'my-requests',
            templateUrl: './my-requests.component.html',
            styleUrls: ['./my-requests.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, resources_service_1.ResourcesService])
    ], MyRequestsComponent);
    return MyRequestsComponent;
}());
exports.MyRequestsComponent = MyRequestsComponent;
//# sourceMappingURL=my-requests.component.js.map