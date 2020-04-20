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
var ContentfulAssets = /** @class */ (function () {
    function ContentfulAssets(contentfulService, router) {
        this.contentfulService = contentfulService;
        this.router = router;
    }
    ContentfulAssets.prototype.ngOnInit = function () {
        var _this = this;
        if (this.contentfulService.isServiceConfigured()) {
            this.contentfulService
                .create()
                .getAssets()
                .commit()
                .subscribe(function (value) {
                _this.assets = value.items;
            });
        }
        else {
            this.router.navigateByUrl('');
        }
    };
    ContentfulAssets = __decorate([
        core_1.Component({
            template: "\n    <h2>Assets</h2>\n    <div class=\"error\" *ngIf=\"error\">\n      {{ error }}\n    </div>\n    <div>\n      <ul>\n        <li *ngFor=\"let asset of assets\">\n          <a *ngIf=\"asset?.fields?.file?.url\" href=\"{{ asset.fields.file.url }}\">\n            {{ asset.fields.title }}\n          </a>\n        </li>\n      </ul>\n    </div>\n  "
        }),
        __metadata("design:paramtypes", [contentful_service_1.ContentfulService, router_1.Router])
    ], ContentfulAssets);
    return ContentfulAssets;
}());
exports.ContentfulAssets = ContentfulAssets;
//# sourceMappingURL=contentful.assets.js.map