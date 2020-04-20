export interface ContentfulSys {
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  locale?: string;
  revision: number;
  space?: any;
}

export interface ContentfulIterableResponse<T> {
  sys: Object;
  total: number;
  skip: number;
  limit: number;
  items: Array<T>;
  includes: any;
}

export interface ContentfulField {
  name: string;
  id: string;
  type: string;
  required: boolean;
  localized: boolean;
}

export interface ContentfulContentType {
  fields: Array<ContentfulField>;
  name: string;
  displayField: string;
  description: string;
  sys: ContentfulSys;
}

export interface ContentfulAsset {
  title: string;
  file: {
    contentType: string,
    fileName: string,
    url: string,
    details: {
      size: number
    }
  };
}

export interface ContentfulCommon<T> {
  fields: T;
  sys: ContentfulSys;
}
