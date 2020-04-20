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
var router_1 = require("@angular/router");
var resources_service_1 = require("../services/resources/resources.service");
var wrapper_1 = require("./js/wrapper");
var SearchBoxComponent = /** @class */ (function () {
    function SearchBoxComponent(route, resourcesService) {
        var _this = this;
        this.route = route;
        this.resourcesService = resourcesService;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) { return (_this.r = res); });
        this.lang = resourcesService.getLanguage();
    }
    SearchBoxComponent.prototype.ngOnInit = function () {
        wrapper_1.default();
    };
    SearchBoxComponent.prototype.ngAfterViewInit = function () {
        this._routerSubscription = this.route.fragment.subscribe(function (fragment) {
            if (fragment) {
                var scrollAnchorEl_1 = document.getElementById(fragment);
                if (scrollAnchorEl_1) {
                    setTimeout(function () {
                        scrollAnchorEl_1.scrollIntoView();
                    }, 100);
                }
            }
        });
    };
    SearchBoxComponent.prototype.ngOnDestroy = function () {
        this._routerSubscription.unsubscribe();
    };
    SearchBoxComponent = __decorate([
        core_1.Component({
            selector: "search-box",
            templateUrl: "./search-box.component.html",
            styleUrls: ["./search-box.component.scss"]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, resources_service_1.ResourcesService])
    ], SearchBoxComponent);
    return SearchBoxComponent;
}());
exports.SearchBoxComponent = SearchBoxComponent;
//# sourceMappingURL=search-box.component.js.map