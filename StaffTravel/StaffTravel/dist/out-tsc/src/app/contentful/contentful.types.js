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
require("rxjs/add/operator/map");
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var contentful_service_1 = require("./src/services/contentful.service");
var ContentfulTypes = /** @class */ (function () {
    function ContentfulTypes(contentfulService, router) {
        this.contentfulService = contentfulService;
        this.router = router;
    }
    ContentfulTypes.prototype.ngOnInit = function () {
        var _this = this;
        if (this.contentfulService.isServiceConfigured()) {
            this.contentfulService
                .create()
                .getContentTypes()
                .commit()
                .subscribe(function (value) {
                _this.contentTypes = value.items;
            });
        }
        else {
            this.router.navigateByUrl('');
        }
    };
    ContentfulTypes = __decorate([
        core_1.Component({
            template: "\n    <h2>Content types</h2>\n    <div class=\"error\" *ngIf=\"error\">\n      {{ error }}\n    </div>\n    <div>\n      <ul>\n        <li *ngFor=\"let contentType of contentTypes\">\n          <a [routerLink]=\"['/entries', contentType.sys.id ]\">\n            {{ contentType.name }}\n          </a>\n        </li>\n      </ul>\n    </div>\n  "
        }),
        __metadata("design:paramtypes", [contentful_service_1.ContentfulService, router_1.Router])
    ], ContentfulTypes);
    return ContentfulTypes;
}());
exports.ContentfulTypes = ContentfulTypes;
//# sourceMappingURL=contentful.types.js.map