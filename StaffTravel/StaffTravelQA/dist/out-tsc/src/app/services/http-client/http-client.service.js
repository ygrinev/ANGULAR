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
var router_1 = require("@angular/router");
var resources_service_1 = require("../resources/resources.service");
var HttpClientService = /** @class */ (function () {
    function HttpClientService(http, router, resourcesService) {
        this.http = http;
        this.router = router;
        this.resourcesService = resourcesService;
    }
    HttpClientService.prototype.createAuthHeader = function (headers) {
        var token = this.resourcesService.getCookie('accessToken');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
        else {
            alert('Your session has expired.');
            this.router.navigate(['/login-register']);
            return;
        }
    };
    HttpClientService.prototype.get = function (url, includeAuthHeader) {
        if (includeAuthHeader === void 0) { includeAuthHeader = true; }
        var headers = new http_1.Headers();
        if (includeAuthHeader) {
            this.createAuthHeader(headers);
        }
        return this.http.get(url, { headers: headers });
    };
    HttpClientService.prototype.post = function (url, data, includeAuthHeader) {
        if (includeAuthHeader === void 0) { includeAuthHeader = true; }
        var headers = new http_1.Headers();
        if (includeAuthHeader) {
            this.createAuthHeader(headers);
        }
        return this.http.post(url, data, { headers: headers });
    };
    HttpClientService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, router_1.Router, resources_service_1.ResourcesService])
    ], HttpClientService);
    return HttpClientService;
}());
exports.HttpClientService = HttpClientService;
//# sourceMappingURL=http-client.service.js.map