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
var contentful_request_1 = require("../contentful-request");
var contentful_config_1 = require("../contentful-config");
require("../../custom/custom.src.js");
var Subject_1 = require("rxjs/Subject");
/**
 *
 */
var ContentfulService = /** @class */ (function () {
    function ContentfulService() {
        this._shareddata = new Array();
        this._shareddataSubject = new Subject_1.Subject();
        this.ContentfulConfig = {
            accessToken: "72b58763fef0e06bac21c7a04e77ee7e5d22571381333f906926dbe589b074fd",
            spaceId: "h82kzjd39wa1",
            host: "preview.contentful.com"
        };
        this.contentfulConfig = new contentful_config_1.ContentfulConfig(this.ContentfulConfig.spaceId, this.ContentfulConfig.accessToken, this.ContentfulConfig.host);
    }
    ContentfulService.prototype.create = function () {
        return new contentful_request_1.ContentfulRequest(this.contentfulConfig);
    };
    ContentfulService.prototype.getServiceConfig = function () {
        return this.contentfulConfig;
    };
    ContentfulService.prototype.isServiceConfigured = function () {
        return this.contentfulConfig !== undefined ? true : false;
    };
    ContentfulService.prototype.syncJSCall = function () {
        if (this._shareddata && this._shareddata["searchRendered"] && this._shareddata["searchRendered"] === true && this._shareddata["slidesRendered"] && this._shareddata["slidesRendered"] === true && !this._shareddata["bothRendered"]) {
            customsrcObject.init();
            this.setSharedData("bothRendered", true);
        }
    };
    ContentfulService.prototype.setSharedData = function (key, value) {
        this._shareddata[key] = value;
        this._shareddataSubject.next(this._shareddata);
        this.syncJSCall();
    };
    ContentfulService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], ContentfulService);
    return ContentfulService;
}());
exports.ContentfulService = ContentfulService;
//# sourceMappingURL=contentful.service.js.map