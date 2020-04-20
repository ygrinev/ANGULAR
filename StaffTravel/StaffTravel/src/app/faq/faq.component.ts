import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/http-client/http-client.service';
import { ResourcesService } from '../services/resources/resources.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
    faqList: object;
    selectedCategory: string;
    loading: boolean = true;
    showError: boolean = false;
    r: any = {};
    lang: string;

    constructor(private httpClient: HttpClientService, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
        });

        this.lang = resourcesService.getCookie('culture').substring(0, 2);
    }

    ngOnInit() {

        const url = 'https://infoserviceuat2.sunwingtravelgroup.com/Contentful';
        let data = {
            'lang': this.lang,
            'spaceid': 'rn5eli9rf9yp',
            'itemtype': 'stafftravelpolicy',
            'docfrom': '0',
            'items': '10',
            'textsearch': ''
        }

        this.httpClient.post(url, data)
            .toPromise()
            .then(res => {
                this.loading = false;
                return res.json();
            })
            .then(res => {
                // Sort by priority order
                return JSON.parse(JSON.stringify(res.stafftravelpolicy)).sort((a, b) => {
                    return a.PriorityOrder - b.PriorityOrder;
                })
            }).then(list => {
                this.faqList = list;

                if (list.length > 0) {
                    this.selectedCategory = list[0].CategoryID;
                } else {
                    this.selectedCategory = null;
                    this.showError = true;
                }
            })
            .catch((err) => {
                this.loading = false;
                this.showError = true;
                this.selectedCategory = null;
                this.handleError(err);
            });
    }

    private handleError(error: any): Promise<any> {
        //console.error('An error occurred', error); // test
        return Promise.reject(error.statusMessage || error);
    }

    openSection(CategoryID:string) {
        this.selectedCategory = CategoryID;
    }

}
