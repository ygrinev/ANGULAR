import { Component, OnInit } from '@angular/core';
import { RequestList } from '../models/requestlist';
import { HttpClientService } from '../services/http-client/http-client.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';
import { ResourcesService } from '../services/resources/resources.service';
import { StatusEnum } from '../models/enums';

@Component({
    selector: 'app-all-flightonly-requests',
    templateUrl: './all-flightonly-requests.component.html',
    styleUrls: ['./all-flightonly-requests.component.scss']
})
export class AllFlightonlyRequestsComponent implements OnInit {
    source: LocalDataSource;
    columns: object;
    tableSettings: object;
    tableType: string;
    statuses: Array<number>;
    statusFilter: StatusEnum = StatusEnum.Pending;
    getPayloadListAPI: string = 'api/request/GetPayloadList/';

    r: any = {};

    searchFilter = (query: string) => {
        return [
            {
                field: 'RequestDate',
                search: query
            },
            {
                field: 'DepartFrom',
                search: query
            },
            {
                field: 'DeaprtTo',
                search: query
            },
            {
                field: 'NumberOfPass',
                search: query
            },
            {
                field: 'Status',
                search: query
            },
            {
                field: 'LastUpdatedBy',
                search: query
            }
        ]
    }

    constructor(private httpClient: HttpClientService, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.initTable();

            this.statuses = new Array<number>();
            this.statuses = resourcesService.getStatusesArray();
        });
    }

    ngOnInit() {
        this.initTable();
    }

    initTable() {
        this.tableType = 'search';

        // Data source for ng2-smart-table
        this.requestlistViewArray()
            .then(res => {
                this.source = new LocalDataSource(res);
            });

        // Columns settings for ng2-smart-table
        this.columns = {
            RequestDate: {
                title: this.r.dateSubmitted,
                type: 'html',
                valuePrepareFunction: (id, row) => {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            DepartOn: {
                title: this.r.departDate,
                type: 'html',
                valuePrepareFunction: (id, row) => {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            DepartFrom: {
                title: this.r.departFrom,
            },
            DeaprtTo: {
                title: this.r.departTo,
            },
            NumberOfPass: {
                title: this.r.numOfPass,
                type: 'html',
                valuePrepareFunction: (cell: any, row: any) => {
                    if (cell != null) {
                        // let parsedDate = cell.replace(/,/g, '<br/>');
                        // return parsedDate.toLocaleString();
                        return this.parseTypeOfPasses(cell);
                    }

                }
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
            },
            LastUpdatedBy: {
                title: this.r.lastUpdatedBy
            }
        }

        this.tableSettings = {
            columns: this.columns,
            filters: this.searchFilter,
            route: '/payload-review/'
        }
    }

    requestlistViewArray(): Promise<any[]> {
        let url = this.getPayloadListAPI;
        if(!isNaN(this.statusFilter))
            url = this.getPayloadListAPI + this.statusFilter;

        return this.httpClient.get(url)
            .toPromise()
            .then(res => res.json() as any[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // test
        return Promise.reject(error.statusMessage || error);
    }

    statusFilterChanged(){
        this.initTable();
    }

    parseTypeOfPasses(rawPassesData: string){
        let passes: Array<string> = new Array<string>();
        passes = rawPassesData.split(',');
        for(let i = 0; i < passes.length; i++){
            passes[i] = this.r['typeOfPassAbbrev' + passes[i]];
        }

        let parsedPasses: string = '';

        for(let i = 0; i < passes.length; i++){
            parsedPasses += passes[i] + '<br>';
        }

        return parsedPasses;
    }
}
