import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { ContentfulCommon, ContentfulContentType } from './src/contentful-types';
import { ContentfulService } from './src/services/contentful.service';
import { Router } from '@angular/router';
import { SearchItem } from './src/contentful-request';
import { ResourcesService } from '../services/resources/resources.service';


@Component({
    selector: 'contentfulentries',
    styleUrls: ['./contentful.component.scss'],
    templateUrl: './contentful.entries.html',
    providers: [ContentfulService]
})
export class ContentfulEntries implements OnInit {
    @ViewChildren('allslides') allslides: QueryList<any>;

    private resourcesData: {};
    public entries: ContentfulCommon<any>[];

    private router: Router;

    private contentfulService: ContentfulService;
    culture:string;

    public constructor(router: Router, contentfulService: ContentfulService, private resourcesService: ResourcesService) {

        this.router = router;
        this.contentfulService = contentfulService;
        this.culture = resourcesService.getCookie('culture');
    }
    canslide(slide: ContentfulCommon<any>) {
        if (slide.fields && slide.fields.urlLink && slide.fields.urlLink.length >0)
            return true;
        else return false;

    } 

    ngAfterViewInit() {
        this.allslides.changes.subscribe(t => {
            this.contentfulService.setSharedData("slidesRendered", true);
        });
               

        
        

        
    }
    public ngOnInit(): any {
        if (this.contentfulService.isServiceConfigured()) {
            const contentType = 'itemDescription'; //this.router.url.split('/').pop();
            var today = new Date().toJSON().slice(0, 10);
            this.contentfulService
                .create()
                .searchEntries(contentType,
                { param: 'fields.promotionCategory[in]', value: 'stafftravel' },
                { param: 'fields.status', value: 'Active' },
                { param: 'fields.startDateTime[lte]', value: today },
                { param: 'fields.toDateTime[gte]', value: today },
                { param: 'include', value: '3' },
                { param: 'limit', value: '5' },
                { param: 'locale', value: this.culture },
                { param: 'order', value: '-fields.genericFlag,fields.priority' }

                )
                //.getEntriesByType(contentType)
                .commit()
                .subscribe((value) => {
                    this.entries = value.items;
                    if (this.entries.length == 0)
                        this.contentfulService.setSharedData("slidesRendered", true);

                });
            //this.resources.getResources().then(res => {
            //        this.resourcesData = res; 
            //        this.contentfulService
            //            .create()
            //            .searchEntries(contentType, 
            //                { param: 'fields.promotionCategory[in]', value: 'friendsandfamily' },
            //                { param: 'fields.status', value: 'Active' },
            //                { param: 'fields.startDateTime[lte]', value: today },
            //                { param: 'fields.toDateTime[gte]', value: today },
            //                { param: 'include', value: '3' },
            //                { param: 'limit', value: '5' },
            //                {param: 'locale', value: this.resourcesData['locale'] },
            //                { param: 'order', value: '-fields.genericFlag,fields.priority' }

            //            )
            //            //.getEntriesByType(contentType)
            //            .commit()
            //            .subscribe((value) => {
            //                this.entries = value.items;
            //                if (this.entries.length == 0)
            //                    this.resources.setSharedData("slidesRendered", true);
                   
            //                });
            //});

        } else {
            this.router.navigateByUrl('');
        }
    }
}