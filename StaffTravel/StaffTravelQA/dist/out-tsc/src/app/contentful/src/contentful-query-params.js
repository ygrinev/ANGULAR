"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContentfulQueryParams;
(function (ContentfulQueryParams) {
    ContentfulQueryParams[ContentfulQueryParams["ContentType"] = 0] = "ContentType";
    ContentfulQueryParams[ContentfulQueryParams["Include"] = 1] = "Include";
    ContentfulQueryParams[ContentfulQueryParams["Limit"] = 2] = "Limit";
    ContentfulQueryParams[ContentfulQueryParams["Order"] = 3] = "Order";
    ContentfulQueryParams[ContentfulQueryParams["FieldSlug"] = 4] = "FieldSlug";
})(ContentfulQueryParams = exports.ContentfulQueryParams || (exports.ContentfulQueryParams = {}));
var ContentfulQueryParamsParser = /** @class */ (function () {
    function ContentfulQueryParamsParser() {
        this.queryParams = {};
        this.queryParams = {};
    }
    ContentfulQueryParamsParser.prototype.addStringParam = function (paramKey, paramValue) {
        this.queryParams[paramKey] = String(paramValue);
    };
    ContentfulQueryParamsParser.prototype.addParam = function (queryParamType, paramValue) {
        var paramType = "";
        switch (queryParamType) {
            case ContentfulQueryParams.ContentType:
                paramType = "content_type";
                break;
            case ContentfulQueryParams.Include:
                paramType = "include";
                break;
            case ContentfulQueryParams.Limit:
                paramType = "limit";
                break;
            case ContentfulQueryParams.Order:
                paramType = "order";
                break;
            case ContentfulQueryParams.FieldSlug:
                paramType = "fields.slug";
                break;
            default: return;
        }
        this.queryParams[paramType] = String(paramValue);
    };
    ContentfulQueryParamsParser.prototype.getParamsObject = function () {
        return this.queryParams;
    };
    return ContentfulQueryParamsParser;
}());
exports.ContentfulQueryParamsParser = ContentfulQueryParamsParser;
//# sourceMappingURL=contentful-query-params.js.map