import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Request } from '../models/request';
import { HttpClientService } from '../services/http-client/http-client.service';
import { AncillaryProductEnum, TypeOfPassEnum, TransferTypeEnum } from '../models/enums';
import { Note } from '../models/note';
import { NoteSectionEnum, NoteTypeEnum } from '../models/enums';
import { Flight } from '../models/flight';
import { Hotel } from '../models/hotel';
import { Ancillary } from '../models/ancillary';
import { ResourcesService } from '../services/resources/resources.service';

import { MessageComponent } from '../components/common/modals';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-review-request',
    templateUrl: './review-request.component.html',
    styleUrls: ['./review-request.component.scss']
})
export class ReviewRequestComponent implements OnInit {
    request: Request;
    passengerNote: Note = new Note('', NoteSectionEnum.Passengers, NoteTypeEnum.Employee);
    flightNote: Note = new Note('', NoteSectionEnum.Passengers, NoteTypeEnum.Employee);
    hotelNote: Note = new Note('', NoteSectionEnum.Passengers, NoteTypeEnum.Employee);
    ancillaryNote: Note = new Note('', NoteSectionEnum.Passengers, NoteTypeEnum.Employee);
    ancillaryProductEnum = AncillaryProductEnum;
    transferTypeEnum = TransferTypeEnum;
    typeOfPassArray: Array<{}> = new Array<{}>();
    ancillaryProductsArray: Array<{}> = new Array<{}>();
    transferTypeArray: Array<{}> = new Array<{}>();
    submitBtnReady: boolean;
    createNewRequestAPI: string = 'api/Request/CreateNewRequest';
    basicInfoAPI: string = 'api/passesInfo/getbasicinfobyemployeenumber?empNumber={0}';
    r: any = {};

    constructor(public dialog: MatDialog, private router: Router, private httpClient: HttpClientService, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.typeOfPassArray = resourcesService.getTypeOfPasses();
            this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            this.transferTypeArray = resourcesService.getTransferTypes();
        });
     }

    ngOnInit() {
        this.request = new Request();

        if (sessionStorage.getItem('currentRequest')) {
            this.request = JSON.parse(sessionStorage.getItem('currentRequest'));

            this.request.notes.forEach(n => {
                if (n.sectionId == NoteSectionEnum.Passengers)
                    this.passengerNote = n;
                if (n.sectionId == NoteSectionEnum.Flights)
                    this.flightNote = n;
                if (n.sectionId == NoteSectionEnum.Hotels)
                    this.hotelNote = n;
                if (n.sectionId == NoteSectionEnum.Ancillaries)
                    this.ancillaryNote = n;
            });

            this.submitBtnReady = true;
        }
        else {
            this.modalMessage('Error', this.r.errorHeader, this.r.ERR_RequestNotFound);
            this.router.navigate(['/new-request']);
        }
    }
    
    editRequest() {
        //return to new-request to edit this request
        this.router.navigate(['/new-request']);
    }

    submitRequest() {
        this.submitBtnReady = false;
        //http post the request
        this.httpClient.post(this.createNewRequestAPI, this.request)
            .toPromise()
            .then(res => {
                this.modalMessage('Success', this.r.success, this.r.requestAddedSuccessfully);
                
                //remove the request from the session
                sessionStorage.removeItem('currentRequest');

                this.httpClient.get(this.basicInfoAPI.replace('{0}', this.request.employeeNumber))
                    .toPromise()
                    .then(res => {
                        this.resourcesService.setCookie('basicInfo', res.json(), 14);
                        //redirect to my-requests page
                        this.router.navigate(['/my-requests']);
                    });
            })
            .catch(err => {
                this.modalMessage('Error', this.r.errorHeader, this.r.ERR_RequestFailed + ' ' + err.json().Message);
                this.submitBtnReady = true;
            });

    }

    modalMessage(type: string, heading: string, message: string): void {
        let dialogRef = this.dialog.open(MessageComponent, {
            width: '650px',
            data: {
                type: type.toLowerCase(),
                heading: heading,
                message: message
            },
            backdropClass: 'modal-backdrop-light',
            panelClass: 'modal--message-' + type.toLowerCase()
        });
    }
}
