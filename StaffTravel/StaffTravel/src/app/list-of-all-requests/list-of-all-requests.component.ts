import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RequestList } from '../models/requestlist';
import { HttpClientService } from '../services/http-client/http-client.service';
import 'rxjs/add/operator/toPromise';
import { LocalDataSource } from 'ng2-smart-table';
import { ResourcesService } from '../services/resources/resources.service';

@Component({
    selector: 'list-of-all-requests',
    templateUrl: './list-of-all-requests.component.html',
    styleUrls: ['./list-of-all-requests.component.scss']
})
export class ListOfAllRequestsComponent implements OnInit {
    settings: Object;

    @Input()
    source: LocalDataSource;
    @Input()
    tableSettings;
    @Input()
    tableType: string;  // Accepts 'search, viewAll, viewByYear' - defaults to search

    r: any = {};

    constructor(private httpClient: HttpClientService, private router: Router, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
        });
    }

    ngOnInit() { 
        this.initTable();
    }

    initTable() {
        // Default table type to 'search' if not set
        if (this.tableType === undefined) {
            this.tableType = 'search'
        }

        // Base ng2-smart-table settings
        this.settings = {
            actions: {
                add: false,
                edit: false,
                delete: false
            },
            pager: {
                perPage: 15,
            },
            attr: {
                class: 'table'
            },
            hideSubHeader: true,
            columns: this.tableSettings.columns
        }
    }

    onSearch(query: string = '') {

        if (query != '') {
            this.source.setFilter(this.tableSettings.filters(query), false);
        } else {
            this.source.reset();
        }
    }

    routingto(event) {
        this.router.navigate([this.tableSettings.route + event.data.RequestId + '']);
    }
}
