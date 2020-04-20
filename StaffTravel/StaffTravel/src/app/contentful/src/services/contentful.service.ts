import { Injectable } from '@angular/core';
import { ContentfulRequest } from '../contentful-request';
import { ContentfulConfig } from '../contentful-config';
import { Inject } from '@angular/core';
import '../../custom/custom.src.js';
import { Subject } from 'rxjs/Subject';
declare var customsrcObject: any;
/**
 *
 */
@Injectable()
export class ContentfulService {
    private contentfulConfig: ContentfulConfig;
    private _shareddata: Array<Map> = new Array<Map>();
    private _shareddataSubject = new Subject<Array<Map>>();
    private ContentfulConfig = {
        accessToken: "72b58763fef0e06bac21c7a04e77ee7e5d22571381333f906926dbe589b074fd",
        spaceId: "h82kzjd39wa1",
        host: "preview.contentful.com"
    }

    public constructor() {
        this.contentfulConfig = new ContentfulConfig(this.ContentfulConfig.spaceId, this.ContentfulConfig.accessToken, this.ContentfulConfig.host);
    }

    public create(): ContentfulRequest {
        return new ContentfulRequest(this.contentfulConfig);
    }

    public getServiceConfig(): ContentfulConfig {
        return this.contentfulConfig;
    }

    public isServiceConfigured(): boolean {
        return this.contentfulConfig !== undefined ? true : false;
    }

    private syncJSCall() {

        if (this._shareddata && this._shareddata["searchRendered"] && this._shareddata["searchRendered"] === true && this._shareddata["slidesRendered"] && this._shareddata["slidesRendered"] === true && !this._shareddata["bothRendered"]) {
            customsrcObject.init();
            this.setSharedData("bothRendered", true);

        }

    }

    public setSharedData(key: string, value: any): void {
        this._shareddata[key] = value;
        this._shareddataSubject.next(this._shareddata);
        this.syncJSCall();

    }
}


interface Map {
    [key: string]: any;
}