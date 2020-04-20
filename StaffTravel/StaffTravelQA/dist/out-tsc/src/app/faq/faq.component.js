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
var resources_service_1 = require("../services/resources/resources.service");
var FaqComponent = /** @class */ (function () {
    function FaqComponent(httpClient, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.resourcesService = resourcesService;
        this.loading = true;
        this.showError = false;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
        });
        this.lang = resourcesService.getCookie('culture').substring(0, 2);
    }
    FaqComponent.prototype.ngOnInit = function () {
        var _this = this;
        var url = 'https://infoserviceuat2.sunwingtravelgroup.com/Contentful';
        var data = {
            'lang': this.lang,
            'spaceid': 'rn5eli9rf9yp',
            'itemtype': 'stafftravelpolicy',
            'docfrom': '0',
            'items': '10',
            'textsearch': ''
        };
        this.httpClient.post(url, data)
            .toPromise()
            .then(function (res) {
            _this.loading = false;
            return res.json();
        })
            .then(function (res) {
            // Sort by priority order
            return JSON.parse(JSON.stringify(res.stafftravelpolicy)).sort(function (a, b) {
                return a.PriorityOrder - b.PriorityOrder;
            });
        }).then(function (list) {
            _this.faqList = list;
            if (list.length > 0) {
                _this.selectedCategory = list[0].CategoryID;
            }
            else {
                _this.selectedCategory = null;
                _this.showError = true;
            }
        })
            .catch(function (err) {
            _this.loading = false;
            _this.showError = true;
            _this.selectedCategory = null;
            _this.handleError(err);
        });
    };
    FaqComponent.prototype.handleError = function (error) {
        //console.error('An error occurred', error); // test
        return Promise.reject(error.statusMessage || error);
    };
    FaqComponent.prototype.openSection = function (CategoryID) {
        this.selectedCategory = CategoryID;
    };
    FaqComponent = __decorate([
        core_1.Component({
            selector: 'app-faq',
            templateUrl: './faq.component.html',
            styleUrls: ['./faq.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, resources_service_1.ResourcesService])
    ], FaqComponent);
    return FaqComponent;
}());
exports.FaqComponent = FaqComponent;
//# sourceMappingURL=faq.component.js.map