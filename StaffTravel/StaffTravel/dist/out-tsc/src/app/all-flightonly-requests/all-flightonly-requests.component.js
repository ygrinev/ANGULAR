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
var ng2_smart_table_1 = require("ng2-smart-table");
var moment = require("moment");
var resources_service_1 = require("../services/resources/resources.service");
var enums_1 = require("../models/enums");
var AllFlightonlyRequestsComponent = /** @class */ (function () {
    function AllFlightonlyRequestsComponent(httpClient, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.resourcesService = resourcesService;
        this.statusFilter = enums_1.StatusEnum.Pending;
        this.getPayloadListAPI = 'api/request/GetPayloadList/';
        this.r = {};
        this.searchFilter = function (query) {
            return [
                {
                    field: 'RequestDate',
                    search: query
                },
                {
                    field: 'DepartFrom',
                    search: query
                },
                {
                    field: 'DeaprtTo',
                    search: query
                },
                {
                    field: 'NumberOfPass',
                    search: query
                },
                {
                    field: 'Status',
                    search: query
                },
                {
                    field: 'LastUpdatedBy',
                    search: query
                }
            ];
        };
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.initTable();
            _this.statuses = new Array();
            _this.statuses = resourcesService.getStatusesArray();
        });
    }
    AllFlightonlyRequestsComponent.prototype.ngOnInit = function () {
        this.initTable();
    };
    AllFlightonlyRequestsComponent.prototype.initTable = function () {
        var _this = this;
        this.tableType = 'search';
        // Data source for ng2-smart-table
        this.requestlistViewArray()
            .then(function (res) {
            _this.source = new ng2_smart_table_1.LocalDataSource(res);
        });
        // Columns settings for ng2-smart-table
        this.columns = {
            RequestDate: {
                title: this.r.dateSubmitted,
                type: 'html',
                valuePrepareFunction: function (id, row) {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            DepartOn: {
                title: this.r.departDate,
                type: 'html',
                valuePrepareFunction: function (id, row) {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            DepartFrom: {
                title: this.r.departFrom,
            },
            DeaprtTo: {
                title: this.r.departTo,
            },
            NumberOfPass: {
                title: this.r.numOfPass,
                type: 'html',
                valuePrepareFunction: function (cell, row) {
                    if (cell != null) {
                        // let parsedDate = cell.replace(/,/g, '<br/>');
                        // return parsedDate.toLocaleString();
                        return _this.parseTypeOfPasses(cell);
                    }
                }
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
            },
            LastUpdatedBy: {
                title: this.r.lastUpdatedBy
            }
        };
        this.tableSettings = {
            columns: this.columns,
            filters: this.searchFilter,
            route: '/payload-review/'
        };
    };
    AllFlightonlyRequestsComponent.prototype.requestlistViewArray = function () {
        var url = this.getPayloadListAPI;
        if (!isNaN(this.statusFilter))
            url = this.getPayloadListAPI + this.statusFilter;
        return this.httpClient.get(url)
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    AllFlightonlyRequestsComponent.prototype.handleError = function (error) {
        console.error('An error occurred', error); // test
        return Promise.reject(error.statusMessage || error);
    };
    AllFlightonlyRequestsComponent.prototype.statusFilterChanged = function () {
        this.initTable();
    };
    AllFlightonlyRequestsComponent.prototype.parseTypeOfPasses = function (rawPassesData) {
        var passes = new Array();
        passes = rawPassesData.split(',');
        for (var i = 0; i < passes.length; i++) {
            passes[i] = this.r['typeOfPassAbbrev' + passes[i]];
        }
        var parsedPasses = '';
        for (var i = 0; i < passes.length; i++) {
            parsedPasses += passes[i] + '<br>';
        }
        return parsedPasses;
    };
    AllFlightonlyRequestsComponent = __decorate([
        core_1.Component({
            selector: 'app-all-flightonly-requests',
            templateUrl: './all-flightonly-requests.component.html',
            styleUrls: ['./all-flightonly-requests.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, resources_service_1.ResourcesService])
    ], AllFlightonlyRequestsComponent);
    return AllFlightonlyRequestsComponent;
}());
exports.AllFlightonlyRequestsComponent = AllFlightonlyRequestsComponent;
//# sourceMappingURL=all-flightonly-requests.component.js.map