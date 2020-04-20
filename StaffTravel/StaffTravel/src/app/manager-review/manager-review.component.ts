import { Component, OnInit, Output } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientService } from "../services/http-client/http-client.service";
import { Request } from '../models/request';
import { Passenger } from '../models/passenger';
import { TypeOfPassEnum, AncillaryProductEnum, NoteSectionEnum, NoteTypeEnum, StatusEnum, TransferTypeEnum } from '../models/enums';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { ResourcesService } from '../services/resources/resources.service';


@Component({
    selector: 'app-manager-review',
    templateUrl: './manager-review.component.html',
    styleUrls: ['./manager-review.component.scss']
})
export class ManagerReviewComponent implements OnInit {

    @Output()
    selectedEmployee: number;

    reviewType: string = 'manager';
    requestId: number;
    statusEnum = StatusEnum;
    ancillaryProductEnum = AncillaryProductEnum;
    transferTypeEnum = TransferTypeEnum;
    statusArray = [];
    typeOfPassArray: Array<{}> = new Array<{}>();
    ancillaryProductsArray: Array<{}> = new Array<{}>();
    transferTypeArray: Array<{}> = new Array<{}>();
    notePaxEmp: string = "";
    notePaxAdmin: string = "";
    noteFlightEmp: string = "";
    noteFlightAdmin: string = "";
    noteHotelEmp: string = "";
    noteHotelAdmin: string = "";
    noteAncEmp: string = "";
    noteAncAdmin: string = "";

    employeeStatus = StatusEnum;
    request: Request;

    r: any = {};

    constructor(private httpClient: HttpClientService, private router: Router, private route: ActivatedRoute, private resourcesService : ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.typeOfPassArray = resourcesService.getTypeOfPasses();
            this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            window.scrollTo(0, 0);
            this.request = new Request();
            this.requestId = this.route.snapshot.params['requestId'];

            if (!this.requestId) {
                this.router.navigate(['/home']);
            }

            this.httpClient.get('api/request/GetManagerReviewRequest?Id=' + params['requestId'])
                .toPromise()
                .then(res => {
                    this.request = JSON.parse(res.text()) as Request;
                })
                .catch(e => {
                    console.log('error ' + e);
                    this.router.navigate(['/home']);
                    return;
                });

        });

    }    

}
