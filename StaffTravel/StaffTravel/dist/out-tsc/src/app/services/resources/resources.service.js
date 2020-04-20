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
        var _this = this;
        this.http = http;
        this.resourcesAPI = 'api/Resource/GetResourceStringsFromResources?culture={0}';
        this.r = {};
        if (this.getCookie("culture"))
            this.cultrue = this.getCookie("culture");
        else {
            this.setCookie('culture', 'en-CA', 365);
            this.cultrue = 'en-CA';
        }
        this.resources = this.getResources();
        this.resources.subscribe(function (res) { return _this.r = res; });
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
    ResourcesService.prototype.getLanguage = function () {
        return this.cultrue.substr(0, 2);
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
        return [
            //{ value: TypeOfPassEnum.YCP, name: this.r['typeOfPassDesc' + TypeOfPassEnum.YCP] },
            //{ value: TypeOfPassEnum.BCP, name: this.r['typeOfPassDesc' + TypeOfPassEnum.BCP] },
            { value: enums_1.TypeOfPassEnum.LMCP, name: this.r['typeOfPassDesc' + enums_1.TypeOfPassEnum.LMCP] },
            { value: enums_1.TypeOfPassEnum.NONE, name: this.r['typeOfPassDesc' + enums_1.TypeOfPassEnum.NONE] },
            { value: enums_1.TypeOfPassEnum.IP, name: this.r['typeOfPassDesc' + enums_1.TypeOfPassEnum.IP] },
        ];
    };
    ResourcesService.prototype.getAncillaryProducts = function () {
        return [
            { value: enums_1.AncillaryProductEnum.Excursion, name: this.r['ancillaryProductDesc' + enums_1.AncillaryProductEnum.Excursion] },
            { value: enums_1.AncillaryProductEnum.Transfer, name: this.r['ancillaryProductDesc' + enums_1.AncillaryProductEnum.Transfer] },
            { value: enums_1.AncillaryProductEnum.Insurance, name: this.r['ancillaryProductDesc' + enums_1.AncillaryProductEnum.Insurance] },
            { value: enums_1.AncillaryProductEnum.CarRental, name: this.r['ancillaryProductDesc' + enums_1.AncillaryProductEnum.CarRental] }
        ];
    };
    ResourcesService.prototype.getTransferTypes = function () {
        return [
            { value: enums_1.TransferTypeEnum.Shared, name: this.r['transferTypeDesc' + enums_1.TransferTypeEnum.Shared] },
            { value: enums_1.TransferTypeEnum.Private, name: this.r['transferTypeDesc' + enums_1.TransferTypeEnum.Private] }
        ];
    };
    ResourcesService.prototype.getStatusesArray = function () {
        return new Array(enums_1.StatusEnum.Pending, enums_1.StatusEnum.Approved, enums_1.StatusEnum.Denied);
    };
    ResourcesService.prototype.getErrorMessage = function (errCode) {
        switch (errCode) {
            case "ERR-REG-001":
                return this.r.ERR_REG_001;
            case "ERR-REG-002":
                return this.r.ERR_REG_002;
            case "ERR-REG-003":
                return this.r.ERR_REG_003;
            case "ERR-REG-004":
                return this.r.ERR_REG_004;
            case "ERR-REG-005":
                return this.r.ERR_REG_005;
            case "ERR-REG-006":
                return this.r.ERR_REG_006;
            case "ERR-REG-007":
                return this.r.ERR_REG_007;
            case "ERR-REG-008":
                return this.r.ERR_REG_008;
            case "ERR-REG-009":
                return this.r.ERR_REG_009;
            case "ERR-LOG-001":
                return this.r.ERR_LOG_001;
            case "ERR-LOG-002":
                return this.r.ERR_LOG_002;
            default:
                return this.r.unknownError;
        }
    };
    ResourcesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ResourcesService);
    return ResourcesService;
}());
exports.ResourcesService = ResourcesService;
//# sourceMappingURL=resources.service.js.map