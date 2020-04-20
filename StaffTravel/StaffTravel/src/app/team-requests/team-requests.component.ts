import { Component, OnInit } from '@angular/core';
import { RequestList } from '../models/requestlist';
import { HttpClientService } from '../services/http-client/http-client.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';
import { ResourcesService } from '../services/resources/resources.service';
import { StatusEnum } from '../models/enums';


@Component({
    selector: 'team-requests',
    templateUrl: './team-requests.component.html',
    styleUrls: ['./team-requests.component.scss']
})

export class TeamRequestsComponent implements OnInit {
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
                field: 'EmployeeNumber',
                search: query
            },
            {
                field: 'Status',
                search: query
            },
            {
                field: 'Department',
                search: query
            },
            {
                field: 'TypeOfPasses',
                search: query
            }
        ]
    };

    r: any = {};

    constructor(private httpClient: HttpClientService, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.initTable();
        });
    }

    ngOnInit() { this.initTable();}

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
                title: this.r.requestedDate,
                type: 'html',
                valuePrepareFunction: (id, row) => {
                    return moment(id).format("DD MMM YYYY");
                }
            },
            EmployeeNumber: {
                title: this.r.employeeNumber,
                type: 'html',
            },
            FirstName: {
                title: this.r.firstName,
            },
            LastName: {
                title: this.r.lastName,
            },
            Department: {
                title: this.r.department,
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
            route: '/manager-review/'
        }
    }
    requestlistViewArray(): Promise<any[]> {
        const url = 'api/request/GetTeamList';

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
