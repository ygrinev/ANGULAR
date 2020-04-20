import { Component, OnInit } from '@angular/core';
import { RequestList } from '../models/requestlist';
import { StatusEnum } from '../models/enums';
import { HttpClientService } from '../services/http-client/http-client.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';
import { ResourcesService } from '../services/resources/resources.service';

@Component({
    selector: 'my-requests',
    templateUrl: './my-requests.component.html',
    styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent implements OnInit {
    statusEnum = StatusEnum;
    source: LocalDataSource;
    columns: object;
    tableType: string;
    tableSettings: object;

    searchFilter = (query: string) => {
        return [
            {
                field: 'RequestDate',
                search: query
            },
            {
                field: 'FirstName',
                search: query
            },
            {
                field: 'LastName',
                search: query
            },
            {
                field: 'Status',
                search: query
            },
            {
                field: 'TypeOfPasses',
                search: query
            },
            {
                field: 'NumberOfPasses',
                search: query
            }
        ]
    }
    
    r: any = {};

    constructor(private httpClient: HttpClientService, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.initTable();
        });
    }

    ngOnInit() {
        this.initTable();
    }

    initTable() {
        this.tableType = 'viewByYear';

        // Data source for ng2-smart-table
        this.requestlistViewArray()
            .then(res => {
                this.source = new LocalDataSource(res);
            });

        // Columns settings for ng2-smart-table
        this.columns = {
            RequestDate: {
                title: this.r.initiated,
                type: 'html',
                valuePrepareFunction: (id, row) => {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            TypeOfPasses: {
                title: this.r.typeOfPasses,
                type: 'html',
                valuePrepareFunction: (cell: any, row: any) => {
                    if (cell != null) {
                        let parsedDate = cell.replace(/,/g, '<br/>');
                        return parsedDate.toLocaleString();
                    }
                },
            },
            NumberOfPasses: {
                title: this.r.passesCount,
                type: 'html',
                valuePrepareFunction: (cell: any, row: any) => {
                    if (cell != null) {
                        let parsedDate = cell.replace(/,/g, '<br/>');
                        return parsedDate.toLocaleString();
                    }
                },
            },
            Status: {
                title: this.r.status,
                type: 'html',
                valuePrepareFunction: (id) => {
                    if (id === StatusEnum.Pending) {
                        return `<i class="fa fa-bookmark" aria-hidden="true"></i> ${this.r['status' + id]}`;
                    } else {
                        return this.r['status' + id];
                    }
                }
            }
        }

        this.tableSettings = {
            columns: this.columns,
            filters: this.searchFilter,
            route: '/request-progress/'
        }
    }

    requestlistViewArray(): Promise<any[]> {
        const url = 'api/Request/GetRequestsList';

        return this.httpClient.get(url)
            .toPromise()
            .then(res => res.json() as any[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // test
        return Promise.reject(error.statusMessage || error);
    }
}
