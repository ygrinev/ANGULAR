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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var enums_1 = require("../../../../models/enums");
var moment = require("moment");
var dialog_1 = require("@angular/material/dialog");
var resources_service_1 = require("../../../../services/resources/resources.service");
var http_client_service_1 = require("../../../../services/http-client/http-client.service");
var flight_1 = require("../../../../models/flight");
var AddFlightComponent = /** @class */ (function () {
    function AddFlightComponent(dialogRef, data, resourcesService, httpClient) {
        var _this = this;
        this.dialogRef = dialogRef;
        this.data = data;
        this.resourcesService = resourcesService;
        this.httpClient = httpClient;
        this.dateValid = true;
        this.r = {};
        this.typeOfPassEnum = enums_1.TypeOfPassEnum;
        this.dateMask = [
            /\d/,
            /\d/,
            '/',
            /\d/,
            /\d/,
            '/',
            /\d/,
            /\d/,
            /\d/,
            /\d/
        ];
        this.gatewaysAPI = 'api/Resource/GetGatewayforBrandAsync?language={0}&brand=SWG';
        this.destinationsAPI = 'api/Resource/GetDestCode?language={0}&brand=SWG&gateway={1}&searchType=RE';
        this.gatewaysListReady = false;
        this.destinationsListReady = false;
        this.dateError = false;
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
        });
        this.initLists();
    }
    AddFlightComponent.prototype.initLists = function () {
        var _this = this;
        this.availableGateways = new Array();
        //load the list of available gateways
        this.httpClient
            .get(this.gatewaysAPI.replace('{0}', 'en'))
            .toPromise()
            .then(function (res) {
            var tempObjArr;
            tempObjArr = JSON.parse(res.json());
            tempObjArr.forEach(function (o) {
                return _this.availableGateways.push(o.name + ' ' + '(' + o.code + ')');
            });
            _this.availableGateways.sort();
            _this.filteredAvailableGateways = _this.availableGateways;
            _this.filteredAvailableReturnGateways = _this.availableGateways;
            _this.gatewaysListReady = true;
        });
    };
    AddFlightComponent.prototype.gatewayChanged = function (selectedValue) {
        var _this = this;
        var gateway;
        var tempObjArr;
        //disable destinations until the new list is ready
        this.destinationsListReady = false;
        this.availableDestinations = [];
        //reset destination lists
        this.data.departTo = '';
        this.data.returnFrom = '';
        this.filteredAvailableDestinations = [];
        this.filteredAvailableReturnDestinations = [];
        //airport code
        gateway = selectedValue.option.value.substr(selectedValue.option.value.length - 4, 3);
        this.httpClient
            .get(this.destinationsAPI.replace('{0}', 'en').replace('{1}', gateway))
            .toPromise()
            .then(function (res) {
            _this.availableDestinations = new Array();
            tempObjArr = JSON.parse(res.json());
            tempObjArr.forEach(function (d) {
                if (d.destinationName)
                    _this.availableDestinations.push(d.destinationName);
            });
            _this.availableDestinations.sort();
            _this.destinationsListReady = true;
            _this.filteredAvailableDestinations = _this.availableDestinations;
            _this.filteredAvailableReturnDestinations = _this.availableDestinations;
        }); //end response
    };
    AddFlightComponent.prototype.validateDate = function (valueEntered) {
        var dateValid = true;
        var tempMoment = moment(valueEntered, 'MM/DD/YYYY', true);
        if (tempMoment.isValid()) {
            var now = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });
            var diff = tempMoment.diff(now, 'days');
            if (diff < 0) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    };
    AddFlightComponent.prototype.update = function () {
        if (this.validateDate(this.data.departDate) &&
            this.validateDate(this.data.returnDate))
            this.dialogRef.close(this.data);
        else
            this.dateError = true;
    };
    AddFlightComponent.prototype.filterAvailableGateways = function (valueEntered, returnField) {
        if (returnField === void 0) { returnField = false; }
        if (!returnField) {
            //disable the hotels list until it is ready and reset value
            this.destinationsListReady = false;
            this.data.departFrom = '';
        }
        return this.availableGateways.filter(function (gateway) { return gateway.toLowerCase().indexOf(valueEntered.toLowerCase()) === 0; });
    };
    AddFlightComponent.prototype.filterAvailableDestinations = function (valueEntered) {
        return this.availableDestinations.filter(function (destination) {
            return destination.toLowerCase().indexOf(valueEntered.toLowerCase()) === 0;
        });
    };
    AddFlightComponent = __decorate([
        core_1.Component({
            selector: 'app-add-flight',
            templateUrl: './add-flight.component.html',
            styleUrls: ['./add-flight.component.scss']
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef,
            flight_1.Flight,
            resources_service_1.ResourcesService,
            http_client_service_1.HttpClientService])
    ], AddFlightComponent);
    return AddFlightComponent;
}());
exports.AddFlightComponent = AddFlightComponent;
//# sourceMappingURL=add-flight.component.js.map