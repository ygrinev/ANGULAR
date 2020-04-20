import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../../../services/http-client/http-client.service';
import { ResourcesService } from '../../../services/resources/resources.service';
import { StatusEnum } from '../../../models/enums';

@Component({
    selector: 'requests-nav',
    templateUrl: './requests-nav.component.html',
    styleUrls: ['./requests-nav.component.scss']
})
export class RequestsNavComponent implements OnInit {
    @Input()
    type: string;
    @Input()
    requestId: number;

    getRequestsAPI: string;
    listRouteUrl: string;
    reviewUrl: string;
    nextPendingId: number;
    previousId: number
    noRequestsLeft: boolean;
    isFirstRequest: boolean;
    currentPendingRequest: number;
    totalPendingRequests: number;

    r: any = {};

    constructor(private httpClient: HttpClientService, private route: ActivatedRoute, private router: Router, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => this.r = res);
        this.noRequestsLeft = false;
        this.isFirstRequest = false;
    }

    ngOnInit() {
        switch (this.type) {
            case 'manager':
                this.getRequestsAPI = 'api/request/GetTeamList/';
                this.listRouteUrl = '/team-requests';
                this.reviewUrl = '/manager-review/';
                break;
            case 'admin':
                this.getRequestsAPI = 'api/request/GetAdminList/';
                this.listRouteUrl = '/all-requests';
                this.reviewUrl = '/admin-review/';
                break;
            case 'payload':
                this.getRequestsAPI = 'api/request/GetPayloadListFNav';
                this.listRouteUrl = '/all-flightonly-requests';
                this.reviewUrl = '/payload-review/';
                break;
            default:
                this.getRequestsAPI = 'api/Request/GetRequestsList';
                this.listRouteUrl = '/my-requests';
                this.reviewUrl = '/request-progress/';
        }


        this.route.params.subscribe(params => {
            this.httpClient.get(this.getRequestsAPI)
                .toPromise()
                .then(res => {
                    return res.json().filter(list => list.Status === StatusEnum.Pending);;
                })
                .then(list => {
                    this.totalPendingRequests = list.length;
                    this.currentPendingRequest = list.findIndex(this.getRequestIndex, params['requestId']);
                    let nextRequestIndex = this.currentPendingRequest + 1;
                    let previousRequestIndex = this.currentPendingRequest - 1;

                    // If no more "next" pending tasks -> Go back to first pending
                    if (list[nextRequestIndex] === undefined) {
                        this.noRequestsLeft = true;
                        this.nextPendingId = null;
                    } else {
                        this.noRequestsLeft = false;
                        this.nextPendingId = list[nextRequestIndex].RequestId;
                    }

                    // If no more "next" pending tasks -> Go back to first pending
                    if (list[previousRequestIndex] === undefined) {
                        this.isFirstRequest = true;
                        this.previousId = null;
                    } else {
                        this.isFirstRequest = false;
                        this.previousId = list[previousRequestIndex].RequestId;
                    }

                });

        });

    }

    getRequestIndex(list) {
        return list.RequestId == this;
    }

    goToRequestList() {
        this.router.navigate([this.listRouteUrl]);
    }

    goToNextRequest() {
        if (this.nextPendingId === null) {
            // Fallback if not disabled correctly
            this.goToRequestList();
        } else {
            this.router.navigate([this.reviewUrl, this.nextPendingId]);
        }
    }

    goToPreviousRequest() {
        if (this.previousId === null) {
            // Fallback if not disabled correctly
            this.goToRequestList();
        } else {
            this.router.navigate([this.reviewUrl, this.previousId]);
        }
    }

}
