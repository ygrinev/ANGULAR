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
var ContentfulComponent = /** @class */ (function () {
    function ContentfulComponent(contentfulService) {
        this.contentfulService = contentfulService;
    }
    ContentfulComponent = __decorate([
        core_1.Component({
            selector: 'swcontentful',
            styleUrls: ['./contentful.component.scss'],
            template: "\n    <header>\n    <nav>\n      <h1>NG2 Contentful demo</h1>\n      <ul>\n        <li>\n          <a [routerLink]=\" [''] \">Assets</a>\n        </li>\n        <li>\n          <a [routerLink]=\" ['/content-types'] \">Content types</a>\n        </li>\n      </ul>\n    </nav>\n    </header>\n    <router-outlet></router-outlet>\n  "
        }),
        __metadata("design:paramtypes", [contentful_service_1.ContentfulService])
    ], ContentfulComponent);
    return ContentfulComponent;
}());
exports.ContentfulComponent = ContentfulComponent;
//# sourceMappingURL=contentful.component.js.map