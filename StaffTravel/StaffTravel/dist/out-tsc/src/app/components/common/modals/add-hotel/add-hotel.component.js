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
var moment = require("moment");
var dialog_1 = require("@angular/material/dialog");
var resources_service_1 = require("../../../../services/resources/resources.service");
var http_client_service_1 = require("../../../../services/http-client/http-client.service");
var hotel_1 = require("../../../../models/hotel");
var AddHotelComponent = /** @class */ (function () {
    function AddHotelComponent(dialogRef, data, resourcesService, httpClient) {
        var _this = this;
        this.dialogRef = dialogRef;
        this.data = data;
        this.resourcesService = resourcesService;
        this.httpClient = httpClient;
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
        this.maxValueMask = [/\d/, /\d/];
        this.svHotelDestinationsAPI = 'api/Resource/GetDestCode?language={0}&brand=SWG&gateway={1}';
        this.svHotelsAPI = 'api/Resource/GetSVHotelList?language={0}&brand=SWG&gateway=YYZ&destination={1}';
        this.r = {};
        this.hotelDestinationsListReady = false;
        this.hotelsListReady = false;
        this.dateError = false;
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
        });
        this.initLists();
    }
    AddHotelComponent.prototype.initLists = function () {
        var _this = this;
        this.hotelDestinations = new Array();
        this.hotelDestinationsID = new Map();
        this.httpClient
            .get(this.svHotelDestinationsAPI.replace('{0}', 'en').replace('{1}', 'YYZ'))
            .toPromise()
            .then(function (res) {
            var tempObjArr;
            tempObjArr = JSON.parse(res.json());
            //foreach group
            tempObjArr.forEach(function (g) {
                //foreach destination in group
                g.destination.forEach(function (d) {
                    if (d.destName) {
                        _this.hotelDestinations.push(d.destName);
                        _this.hotelDestinationsID.set(d.destName, d.destCode);
                    }
                }); //end foreach destination in group
            }); //end foreach group
            _this.hotelDestinations.sort();
            _this.filteredDestinations = _this.hotelDestinations;
            _this.hotelDestinationsListReady = true;
        }); // end response
    };
    AddHotelComponent.prototype.hotelDestinationChanged = function (selectedValue) {
        var _this = this;
        //destination codes are comma separated, replace with underscore
        var destcode = this.hotelDestinationsID
            .get(selectedValue.option.value)
            .replace(/,/g, '_');
        var tempObjArr;
        //disable the hotels list until it is ready and reset value
        this.hotelsListReady = false;
        this.availableResorts = [];
        //initiate the call to hotellist
        this.httpClient
            .get(this.svHotelsAPI.replace('{0}', 'en').replace('{1}', destcode))
            .toPromise()
            .then(function (res) {
            tempObjArr = JSON.parse(res.json());
            tempObjArr[0].hotels.forEach(function (h) {
                var idx = h.indexOf('--xx--');
                var hotelName = h.substring(0, idx);
                var hotelId = h.substring(idx + 6);
                if (hotelName && hotelId.split('_').length == 1)
                    _this.availableResorts.push(hotelName);
            });
            _this.availableResorts.sort();
            _this.hotelsListReady = true;
            _this.filteredHotels = _this.availableResorts;
        });
    };
    AddHotelComponent.prototype.validateDate = function (valueEntered) {
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
    AddHotelComponent.prototype.update = function () {
        if (this.validateDate(this.data.checkInDate))
            this.dialogRef.close(this.data);
        else
            this.dateError = true;
    };
    AddHotelComponent.prototype.filterDestinations = function (valueEntered) {
        //disable the hotels list until it is ready and reset value
        this.hotelsListReady = false;
        this.data.name = '';
        return this.hotelDestinations.filter(function (destination) {
            return destination.toLowerCase().indexOf(valueEntered.toLowerCase()) === 0;
        });
    };
    AddHotelComponent.prototype.filterHotels = function (valueEntered) {
        return this.availableResorts.filter(function (hotel) { return hotel.toLowerCase().indexOf(valueEntered.toLowerCase()) === 0; });
    };
    AddHotelComponent = __decorate([
        core_1.Component({
            selector: 'app-add-hotel',
            templateUrl: './add-hotel.component.html',
            styleUrls: ['./add-hotel.component.scss']
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef,
            hotel_1.Hotel,
            resources_service_1.ResourcesService,
            http_client_service_1.HttpClientService])
    ], AddHotelComponent);
    return AddHotelComponent;
}());
exports.AddHotelComponent = AddHotelComponent;
//# sourceMappingURL=add-hotel.component.js.map