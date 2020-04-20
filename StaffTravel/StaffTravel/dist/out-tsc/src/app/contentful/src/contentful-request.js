"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var contentful_query_params_1 = require("./contentful-query-params");
var ContentfulNative = require("contentful");
var ContentfulNativeCall;
(function (ContentfulNativeCall) {
    ContentfulNativeCall[ContentfulNativeCall["GET_CONTENT_TYPES"] = 0] = "GET_CONTENT_TYPES";
    ContentfulNativeCall[ContentfulNativeCall["GET_CONTENT_TYPE"] = 1] = "GET_CONTENT_TYPE";
    ContentfulNativeCall[ContentfulNativeCall["GET_ASSETS"] = 2] = "GET_ASSETS";
    ContentfulNativeCall[ContentfulNativeCall["GET_ASSET"] = 3] = "GET_ASSET";
    ContentfulNativeCall[ContentfulNativeCall["GET_ENTRIES"] = 4] = "GET_ENTRIES";
    ContentfulNativeCall[ContentfulNativeCall["GET_ENTRY"] = 5] = "GET_ENTRY";
    ContentfulNativeCall[ContentfulNativeCall["GET_ENTRIES_BY_TYPE"] = 6] = "GET_ENTRIES_BY_TYPE";
    ContentfulNativeCall[ContentfulNativeCall["GET_ENTRY_BY_SLUG"] = 7] = "GET_ENTRY_BY_SLUG";
    ContentfulNativeCall[ContentfulNativeCall["SEARCH_ENTRIES"] = 8] = "SEARCH_ENTRIES";
})(ContentfulNativeCall || (ContentfulNativeCall = {}));
var ContentfulRequest = /** @class */ (function () {
    function ContentfulRequest(contentfulConfig) {
        this.contentfulNativeClient = ContentfulNative.createClient(contentfulConfig);
        this.contentfulQueryParamsParser = new contentful_query_params_1.ContentfulQueryParamsParser();
    }
    ContentfulRequest.prototype.commit = function () {
        var params = this.contentfulQueryParamsParser.getParamsObject();
        switch (this.contentfulNativeCall) {
            case ContentfulNativeCall.GET_CONTENT_TYPES:
                return this.callContentTypes();
            case ContentfulNativeCall.GET_CONTENT_TYPE:
                return this.callContentType(this.contentTypeId);
            case ContentfulNativeCall.GET_ASSETS:
                return this.callAssets(params);
            case ContentfulNativeCall.GET_ASSET:
                return this.callAsset(this.assetId);
            case ContentfulNativeCall.GET_ENTRIES:
                return this.callEntries(params);
            case ContentfulNativeCall.GET_ENTRY:
                return this.callEntry(this.entryId);
            case ContentfulNativeCall.GET_ENTRIES_BY_TYPE:
                return this.callEntriesByType(params);
            case ContentfulNativeCall.GET_ENTRY_BY_SLUG:
                return this.callEntryBySlug(params);
            case ContentfulNativeCall.SEARCH_ENTRIES:
                return this.callSearchEntries(params);
            default:
                throw Error("Appropriate API was not found: " + this.contentfulNativeCall);
        }
    };
    ContentfulRequest.prototype.limit = function (value) {
        this.contentfulQueryParamsParser.addParam(contentful_query_params_1.ContentfulQueryParams.Limit, value);
        return this;
    };
    ContentfulRequest.prototype.order = function (value) {
        this.contentfulQueryParamsParser.addParam(contentful_query_params_1.ContentfulQueryParams.Order, value);
        return this;
    };
    ContentfulRequest.prototype.include = function (value) {
        this.contentfulQueryParamsParser.addParam(contentful_query_params_1.ContentfulQueryParams.Include, value);
        return this;
    };
    ContentfulRequest.prototype.getContentTypes = function () {
        this.contentfulNativeCall = ContentfulNativeCall.GET_CONTENT_TYPES;
        return this;
    };
    ContentfulRequest.prototype.callContentTypes = function () {
        return this.fromPromise(this.contentfulNativeClient.getContentTypes());
    };
    ContentfulRequest.prototype.getContentType = function (contentTypeId) {
        this.contentfulNativeCall = ContentfulNativeCall.GET_CONTENT_TYPE;
        this.contentTypeId = contentTypeId;
        return this;
    };
    ContentfulRequest.prototype.callContentType = function (contentTypeId) {
        return this.fromPromise(this.contentfulNativeClient.getContentType(contentTypeId));
    };
    ContentfulRequest.prototype.getAssets = function () {
        this.contentfulNativeCall = ContentfulNativeCall.GET_ASSETS;
        return this;
    };
    ContentfulRequest.prototype.callAssets = function (params) {
        return this.fromPromise(Promise.resolve(this.contentfulNativeClient.getAssets(params)));
    };
    ContentfulRequest.prototype.getAsset = function (assetId) {
        this.contentfulNativeCall = ContentfulNativeCall.GET_ASSET;
        this.assetId = assetId;
        return this;
    };
    ContentfulRequest.prototype.callAsset = function (assetId) {
        return this.fromPromise(this.contentfulNativeClient.getAsset(assetId));
    };
    ContentfulRequest.prototype.getEntries = function () {
        this.contentfulNativeCall = ContentfulNativeCall.GET_ENTRIES;
        return this;
    };
    ContentfulRequest.prototype.callEntries = function (params) {
        return this.fromPromise(this.contentfulNativeClient.getEntries(params));
    };
    ContentfulRequest.prototype.getEntriesByType = function (contentType) {
        this.contentfulNativeCall = ContentfulNativeCall.GET_ENTRIES_BY_TYPE;
        this.contentfulQueryParamsParser.addParam(contentful_query_params_1.ContentfulQueryParams.ContentType, contentType);
        return this;
    };
    ContentfulRequest.prototype.callEntriesByType = function (params) {
        return this.fromPromise(this.contentfulNativeClient.getEntries(params));
    };
    ContentfulRequest.prototype.getEntry = function (entryId) {
        this.contentfulNativeCall = ContentfulNativeCall.GET_ENTRY;
        this.entryId = entryId;
        return this;
    };
    ContentfulRequest.prototype.callEntry = function (entryId) {
        return this.fromPromise(this.contentfulNativeClient.getEntry(entryId));
    };
    ContentfulRequest.prototype.getEntryBySlug = function (contentType, fieldSlug) {
        this.contentfulNativeCall = ContentfulNativeCall.GET_ENTRY_BY_SLUG;
        this.contentfulQueryParamsParser.addParam(contentful_query_params_1.ContentfulQueryParams.ContentType, contentType);
        this.contentfulQueryParamsParser.addParam(contentful_query_params_1.ContentfulQueryParams.FieldSlug, fieldSlug);
        this.contentfulQueryParamsParser.addParam(contentful_query_params_1.ContentfulQueryParams.Limit, 1);
        return this;
    };
    ContentfulRequest.prototype.callEntryBySlug = function (params) {
        return this.fromPromise(this.contentfulNativeClient.getEntries(params));
    };
    ContentfulRequest.prototype.searchEntries = function (contentType) {
        var searchItems = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            searchItems[_i - 1] = arguments[_i];
        }
        this.contentfulNativeCall = ContentfulNativeCall.SEARCH_ENTRIES;
        this.contentfulQueryParamsParser.addParam(contentful_query_params_1.ContentfulQueryParams.ContentType, contentType);
        for (var _a = 0, searchItems_1 = searchItems; _a < searchItems_1.length; _a++) {
            var searchItem = searchItems_1[_a];
            this.contentfulQueryParamsParser.addStringParam(searchItem.param, searchItem.value);
        }
        return this;
    };
    ContentfulRequest.prototype.callSearchEntries = function (params) {
        return this.fromPromise(this.contentfulNativeClient.getEntries(params));
        // console.log('fake search');
        //return this.fromPromise(this.contentfulNativeClient.getEntry('62cTQYGTUAO8cAsKQooUS4'));
        /*
              return this.fromPromise(this.contentfulNativeClient.getEntries(({
                  'content_type': 'itemDescription',
        //          'fields.tags[In]':'jessica-is-awesome',
                  'fields.status': 'Active',
                  'fields.promotionCategory[in]': 'friendsandfamily'
        //          'order': '-fields.genericFlag,fields.priority',
                  //'include': 3,
                  //'limit': 5,
                  //'locale': 'en-CA'
              })));
          */
    };
    ContentfulRequest.prototype.fromPromise = function (promise) {
        return Rx_1.Observable.fromPromise(Promise.resolve(promise));
    };
    return ContentfulRequest;
}());
exports.ContentfulRequest = ContentfulRequest;
//# sourceMappingURL=contentful-request.js.map