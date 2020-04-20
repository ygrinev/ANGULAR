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
var TeamRequestsComponent = /** @class */ (function () {
    function TeamRequestsComponent(httpClient, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.resourcesService = resourcesService;
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
                    field: 'EmployeeNumber',
                    search: query
                },
                {
                    field: 'Status',
                    search: query
                },
                {
                    field: 'Department',
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
        });
    }
    TeamRequestsComponent.prototype.ngOnInit = function () { this.initTable(); };
    TeamRequestsComponent.prototype.initTable = function () {
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
            EmployeeNumber: {
                title: this.r.employeeNumber,
                type: 'html',
            },
            FirstName: {
                title: this.r.firstName,
            },
            LastName: {
                title: this.r.lastName,
            },
            Department: {
                title: this.r.department,
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
            route: '/manager-review/'
        };
    };
    TeamRequestsComponent.prototype.requestlistViewArray = function () {
        var url = 'api/request/GetTeamList';
        return this.httpClient.get(url)
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    TeamRequestsComponent.prototype.handleError = function (error) {
        console.error('An error occurred', error); // test
        return Promise.reject(error.statusMessage || error);
    };
    TeamRequestsComponent = __decorate([
        core_1.Component({
            selector: 'team-requests',
            templateUrl: './team-requests.component.html',
            styleUrls: ['./team-requests.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, resources_service_1.ResourcesService])
    ], TeamRequestsComponent);
    return TeamRequestsComponent;
}());
exports.TeamRequestsComponent = TeamRequestsComponent;
//# sourceMappingURL=team-requests.component.js.map