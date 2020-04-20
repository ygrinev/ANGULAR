import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StatusEnum } from '../models/enums';
import { HttpClientService } from '../services/http-client/http-client.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';
import { ResourcesService } from '../services/resources/resources.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    statusEnum = StatusEnum;
    source: LocalDataSource;
    columns: object;
    tableSettings: object;
    tableType: string;

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
    };

    r: any = {};

    constructor(private httpClient: HttpClientService, private resourcesService: ResourcesService, private router: Router) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.initTable();
        });
    }

    initTable() {
        this.tableType = 'viewAll';

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
                    let status = this.statusEnum[id];
                    if (status === 'Pending') {
                        return `<i class="fa fa-bookmark" aria-hidden="true"></i> ${status}`;
                    } else {
                        return status;
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

    ngOnInit() {
        this.initTable();
        //this.router.navigate(['/save-passport']);
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
