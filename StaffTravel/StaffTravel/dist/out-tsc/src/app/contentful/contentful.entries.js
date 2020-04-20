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
var contentful_service_1 = require("./src/services/contentful.service");
var router_1 = require("@angular/router");
var resources_service_1 = require("../services/resources/resources.service");
var ContentfulEntries = /** @class */ (function () {
    function ContentfulEntries(router, contentfulService, resourcesService) {
        this.resourcesService = resourcesService;
        this.router = router;
        this.contentfulService = contentfulService;
        this.culture = resourcesService.getCookie('culture');
    }
    ContentfulEntries.prototype.canslide = function (slide) {
        if (slide.fields && slide.fields.urlLink && slide.fields.urlLink.length > 0)
            return true;
        else
            return false;
    };
    ContentfulEntries.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.allslides.changes.subscribe(function (t) {
            _this.contentfulService.setSharedData("slidesRendered", true);
        });
    };
    ContentfulEntries.prototype.ngOnInit = function () {
        var _this = this;
        if (this.contentfulService.isServiceConfigured()) {
            var contentType = 'itemDescription'; //this.router.url.split('/').pop();
            var today = new Date().toJSON().slice(0, 10);
            this.contentfulService
                .create()
                .searchEntries(contentType, { param: 'fields.promotionCategory[in]', value: 'stafftravel' }, { param: 'fields.status', value: 'Active' }, { param: 'fields.startDateTime[lte]', value: today }, { param: 'fields.toDateTime[gte]', value: today }, { param: 'include', value: '3' }, { param: 'limit', value: '5' }, { param: 'locale', value: this.culture }, { param: 'order', value: '-fields.genericFlag,fields.priority' })
                //.getEntriesByType(contentType)
                .commit()
                .subscribe(function (value) {
                _this.entries = value.items;
                if (_this.entries.length == 0)
                    _this.contentfulService.setSharedData("slidesRendered", true);
            });
            //this.resources.getResources().then(res => {
            //        this.resourcesData = res; 
            //        this.contentfulService
            //            .create()
            //            .searchEntries(contentType, 
            //                { param: 'fields.promotionCategory[in]', value: 'friendsandfamily' },
            //                { param: 'fields.status', value: 'Active' },
            //                { param: 'fields.startDateTime[lte]', value: today },
            //                { param: 'fields.toDateTime[gte]', value: today },
            //                { param: 'include', value: '3' },
            //                { param: 'limit', value: '5' },
            //                {param: 'locale', value: this.resourcesData['locale'] },
            //                { param: 'order', value: '-fields.genericFlag,fields.priority' }
            //            )
            //            //.getEntriesByType(contentType)
            //            .commit()
            //            .subscribe((value) => {
            //                this.entries = value.items;
            //                if (this.entries.length == 0)
            //                    this.resources.setSharedData("slidesRendered", true);
            //                });
            //});
        }
        else {
            this.router.navigateByUrl('');
        }
    };
    __decorate([
        core_1.ViewChildren('allslides'),
        __metadata("design:type", core_1.QueryList)
    ], ContentfulEntries.prototype, "allslides", void 0);
    ContentfulEntries = __decorate([
        core_1.Component({
            selector: 'contentfulentries',
            styleUrls: ['./contentful.component.scss'],
            templateUrl: './contentful.entries.html',
            providers: [contentful_service_1.ContentfulService]
        }),
        __metadata("design:paramtypes", [router_1.Router, contentful_service_1.ContentfulService, resources_service_1.ResourcesService])
    ], ContentfulEntries);
    return ContentfulEntries;
}());
exports.ContentfulEntries = ContentfulEntries;
//# sourceMappingURL=contentful.entries.js.map