export enum ContentfulQueryParams {
  ContentType,
  Include,
  Limit,
  Order,
  FieldSlug
}

export class ContentfulQueryParamsParser {
  private queryParams: any = {};

  public constructor() {
    this.queryParams = {};
  }

  public addStringParam(paramKey: string, paramValue: string): void {
    this.queryParams[paramKey] = String(paramValue);
  }

  public addParam(queryParamType: ContentfulQueryParams, paramValue: any): void {
    let paramType: string = "";

    switch (queryParamType) {
      case ContentfulQueryParams.ContentType: paramType = "content_type";
            break;
      case ContentfulQueryParams.Include: paramType = "include";
            break;
      case ContentfulQueryParams.Limit: paramType = "limit";
            break;
      case ContentfulQueryParams.Order: paramType = "order";
            break;
      case ContentfulQueryParams.FieldSlug: paramType = "fields.slug";
            break;
      default: return;
    }

    this.queryParams[paramType] = String(paramValue);
  }

  public getParamsObject(): any {
    return this.queryParams;
  }
}
