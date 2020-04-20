import { Observable } from 'rxjs/Rx';
import { ContentfulConfig } from './contentful-config';
import { ContentfulQueryParams, ContentfulQueryParamsParser } from './contentful-query-params';
import * as ContentfulNative from 'contentful'

export interface SearchItem {
  param: string;
  value: string; 
}

enum ContentfulNativeCall {
  GET_CONTENT_TYPES,
  GET_CONTENT_TYPE,
  GET_ASSETS,
  GET_ASSET,
  GET_ENTRIES,
  GET_ENTRY,
  GET_ENTRIES_BY_TYPE,
  GET_ENTRY_BY_SLUG,
  SEARCH_ENTRIES
}

export class ContentfulRequest {
  private contentfulNativeClient: any;
  private contentfulNativeCall: ContentfulNativeCall;
  private contentfulQueryParamsParser: ContentfulQueryParamsParser;

  private contentTypeId: string;
  private assetId: string;
  private entryId: string;

  public constructor(contentfulConfig: ContentfulConfig) {
    this.contentfulNativeClient = ContentfulNative.createClient(contentfulConfig);
    this.contentfulQueryParamsParser = new ContentfulQueryParamsParser();
  }

  public commit(): Observable<any> {
    let params = this.contentfulQueryParamsParser.getParamsObject();

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
        throw Error(`Appropriate API was not found: ${this.contentfulNativeCall}`)
    }
  }

  public limit(value: number): ContentfulRequest {
    this.contentfulQueryParamsParser.addParam(ContentfulQueryParams.Limit, value);

    return this;
  }

  public order(value: string): ContentfulRequest {
    this.contentfulQueryParamsParser.addParam(ContentfulQueryParams.Order, value);

    return this;
  }

  public include(value: number): ContentfulRequest {
    this.contentfulQueryParamsParser.addParam(ContentfulQueryParams.Include, value);

    return this;
  }

  public getContentTypes(): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.GET_CONTENT_TYPES;

    return this;
  }

  private callContentTypes(): Observable<any> {
    return this.fromPromise(this.contentfulNativeClient.getContentTypes());
  }

  public getContentType(contentTypeId: string): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.GET_CONTENT_TYPE;

    this.contentTypeId = contentTypeId;

    return this;
  }

  private callContentType(contentTypeId: string): Observable<any> {
    return this.fromPromise(this.contentfulNativeClient.getContentType(contentTypeId));
  }

  public getAssets(): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.GET_ASSETS;

    return this;
  }

  private callAssets(params: any): Observable<any> {
    return this.fromPromise(Promise.resolve(this.contentfulNativeClient.getAssets(params)));
  }

  public getAsset(assetId: string): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.GET_ASSET;

    this.assetId = assetId;

    return this;
  }

  private callAsset(assetId: string): Observable<any> {
    return this.fromPromise(this.contentfulNativeClient.getAsset(assetId));
  }

  public getEntries(): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.GET_ENTRIES;

    return this;
  }

  private callEntries(params: any): Observable<any> {
    return this.fromPromise(this.contentfulNativeClient.getEntries(params));
  }

  public getEntriesByType(contentType: string): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.GET_ENTRIES_BY_TYPE;

    this.contentfulQueryParamsParser.addParam(ContentfulQueryParams.ContentType, contentType);

    return this;
  }

  private callEntriesByType(params): Observable<any> {
    return this.fromPromise(this.contentfulNativeClient.getEntries(params));
  }

  public getEntry(entryId: string): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.GET_ENTRY;

    this.entryId = entryId;

    return this;
  }

  private callEntry(entryId: string): Observable<any> {
    return this.fromPromise(this.contentfulNativeClient.getEntry(entryId));
  }

  public getEntryBySlug(contentType: string, fieldSlug: string): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.GET_ENTRY_BY_SLUG;

    this.contentfulQueryParamsParser.addParam(ContentfulQueryParams.ContentType, contentType);
    this.contentfulQueryParamsParser.addParam(ContentfulQueryParams.FieldSlug, fieldSlug);
    this.contentfulQueryParamsParser.addParam(ContentfulQueryParams.Limit, 1);

    return this;
  }

  private callEntryBySlug(params: any): Observable<any> {
    return this.fromPromise(this.contentfulNativeClient.getEntries(params));
  }

  public searchEntries(contentType: string, ...searchItems: SearchItem[]): ContentfulRequest {
    this.contentfulNativeCall = ContentfulNativeCall.SEARCH_ENTRIES;

    this.contentfulQueryParamsParser.addParam(ContentfulQueryParams.ContentType, contentType);

    for (let searchItem of searchItems) {
      this.contentfulQueryParamsParser.addStringParam(searchItem.param, searchItem.value);
    }

    return this;
  }

  private callSearchEntries(params: any): Observable<any> {
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
  }

  private fromPromise<T>(promise: Promise<T>): Observable<T> {
      return Observable.fromPromise(Promise.resolve(promise));
  }
}
