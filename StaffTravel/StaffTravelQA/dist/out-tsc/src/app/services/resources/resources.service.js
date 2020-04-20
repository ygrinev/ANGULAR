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
var http_1 = require("@angular/http");
var enums_1 = require("../../models/enums");
var ResourcesService = /** @class */ (function () {
    function ResourcesService(http) {
        this.http = http;
        this.resourcesAPI = 'api/Resource/GetResourceStringsFromResources?culture={0}';
        if (this.getCookie("culture"))
            this.cultrue = this.getCookie("culture");
        else {
            this.setCookie('culture', 'en-CA', 365);
            this.cultrue = 'en-CA';
        }
        this.resources = this.getResources();
    }
    ResourcesService.prototype.getResources = function () {
        if (!this.resources) {
            var connectableObs = this.http.get(this.resourcesAPI.replace('{0}', this.cultrue))
                .map(function (res) { return res.json(); })
                .publishReplay();
            connectableObs.connect();
            return connectableObs;
        }
        else
            return this.resources;
    };
    ResourcesService.prototype.setCookie = function (cname, cvalue, exdays) {
        if (exdays > 0) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        else {
            document.cookie = cname + "=" + cvalue + ";" + ";path=/";
        }
    };
    ResourcesService.prototype.getCookie = function (cname) {
        var name = cname + "=";
        var ca = decodeURIComponent(document.cookie).split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    ResourcesService.prototype.deleteCookie = function (cname) {
        var d = new Date(0);
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + '' + ";" + expires + ";path=/";
    };
    ResourcesService.prototype.deleteAllCookies = function () {
        var ca = decodeURIComponent(document.cookie).split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            this.deleteCookie(c.split('=')[0]);
        }
    };
    ResourcesService.prototype.getTypeOfPasses = function () {
        var r;
        this.resources.subscribe(function (res) { return r = res; });
        return [
            { value: enums_1.TypeOfPassEnum.YCP, name: r['typeOfPassDesc' + enums_1.TypeOfPassEnum.YCP] },
            { value: enums_1.TypeOfPassEnum.BCP, name: r['typeOfPassDesc' + enums_1.TypeOfPassEnum.BCP] },
            { value: enums_1.TypeOfPassEnum.LMCP, name: r['typeOfPassDesc' + enums_1.TypeOfPassEnum.LMCP] },
            { value: enums_1.TypeOfPassEnum.NONE, name: r['typeOfPassDesc' + enums_1.TypeOfPassEnum.NONE] },
            { value: enums_1.TypeOfPassEnum.IP, name: r['typeOfPassDesc' + enums_1.TypeOfPassEnum.IP] },
        ];
    };
    ResourcesService.prototype.getAncillaryProducts = function () {
        var r;
        this.resources.subscribe(function (res) { return r = res; });
        return [
            { value: enums_1.AncillaryProductEnum.Excursion, name: r['ancillaryProductDesc' + enums_1.AncillaryProductEnum.Excursion] },
            { value: enums_1.AncillaryProductEnum.Transfer, name: r['ancillaryProductDesc' + enums_1.AncillaryProductEnum.Transfer] },
            { value: enums_1.AncillaryProductEnum.Insurance, name: r['ancillaryProductDesc' + enums_1.AncillaryProductEnum.Insurance] },
            { value: enums_1.AncillaryProductEnum.CarRental, name: r['ancillaryProductDesc' + enums_1.AncillaryProductEnum.CarRental] }
        ];
    };
    ResourcesService.prototype.getTransferTypes = function () {
        var r;
        this.resources.subscribe(function (res) { return r = res; });
        return [
            { value: enums_1.TransferTypeEnum.Shared, name: r['transferTypeDesc' + enums_1.TransferTypeEnum.Shared] },
            { value: enums_1.TransferTypeEnum.Private, name: r['transferTypeDesc' + enums_1.TransferTypeEnum.Private] }
        ];
    };
    ResourcesService.prototype.getStatusesArray = function () {
        return new Array(enums_1.StatusEnum.Pending, enums_1.StatusEnum.Approved, enums_1.StatusEnum.Denied);
    };
    ResourcesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ResourcesService);
    return ResourcesService;
}());
exports.ResourcesService = ResourcesService;
//# sourceMappingURL=resources.service.js.map