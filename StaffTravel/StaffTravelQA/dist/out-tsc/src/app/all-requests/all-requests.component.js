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
var AllRequestsComponent = /** @class */ (function () {
    function AllRequestsComponent(httpClient, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.resourcesService = resourcesService;
        this.statusFilter = enums_1.StatusEnum.Pending;
        this.getAdminListAPI = 'api/request/GetAdminList/';
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
                }
            ];
        };
        this.r = {};
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.initTable();
            _this.statuses = new Array();
            _this.statuses = resourcesService.getStatusesArray();
        });
    }
    AllRequestsComponent.prototype.ngOnInit = function () { this.initTable(); };
    AllRequestsComponent.prototype.initTable = function () {
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
                title: this.r.requestedDate,
                type: 'html',
                valuePrepareFunction: function (id, row) {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            DepartureDate: {
                title: this.r.departureDate,
                type: 'html',
                valuePrepareFunction: function (id, row) {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            FirstName: {
                title: this.r.firstName,
            },
            LastName: {
                title: this.r.lastName,
            },
            TypeOfPasses: {
                title: this.r.typeOfPasses,
                type: 'html',
                valuePrepareFunction: function (cell, row) {
                    if (cell != null) {
                        // let parsedDate = cell.replace(/,/g, '<br/>');
                        // return parsedDate.toLocaleString();
                        return _this.parseTypeOfPasses(cell);
                    }
                },
            },
            FlightStatus: {
                title: this.r.flightStatus,
                type: 'html',
                valuePrepareFunction: function (id) {
                    if (id === enums_1.StatusEnum.Pending) {
                        return "<i class=\"fa fa-bookmark\" aria-hidden=\"true\"></i> " + _this.r['status' + id];
                    }
                    else {
                        if (!id)
                            return _this.r.na;
                        else
                            return _this.r['status' + id];
                    }
                }
            },
            HotelStatus: {
                title: this.r.hotelStatus,
                type: 'html',
                valuePrepareFunction: function (id) {
                    if (id === enums_1.StatusEnum.Pending) {
                        return "<i class=\"fa fa-bookmark\" aria-hidden=\"true\"></i> " + _this.r['status' + id];
                    }
                    else {
                        if (!id)
                            return _this.r.na;
                        else
                            return _this.r['status' + id];
                    }
                }
            },
            EmployeeStatus: {
                title: this.r.employeeStatus,
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
            Status: {
                title: this.r.overallStatus,
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
            route: '/admin-review/'
        };
    };
    AllRequestsComponent.prototype.requestlistViewArray = function () {
        var url = this.getAdminListAPI;
        if (!isNaN(this.statusFilter))
            url = this.getAdminListAPI + this.statusFilter;
        return this.httpClient.get(url)
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    AllRequestsComponent.prototype.handleError = function (error) {
        console.error('An error occurred', error); // test
        return Promise.reject(error.statusMessage || error);
    };
    AllRequestsComponent.prototype.statusFilterChanged = function () {
        this.initTable();
    };
    AllRequestsComponent.prototype.parseTypeOfPasses = function (rawPassesData) {
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
    AllRequestsComponent = __decorate([
        core_1.Component({
            selector: 'app-all-requests',
            templateUrl: './all-requests.component.html',
            styleUrls: ['./all-requests.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, resources_service_1.ResourcesService])
    ], AllRequestsComponent);
    return AllRequestsComponent;
}());
exports.AllRequestsComponent = AllRequestsComponent;
//# sourceMappingURL=all-requests.component.js.map