import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Request } from '../models/request';
import { Flight } from '../models/flight';
import { StatusEnum, NoteSectionEnum, NoteTypeEnum, TypeOfPassEnum } from '../models/enums';
import { Note } from '../models/note';
import { HttpClientService } from '../services/http-client/http-client.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';
import { ResourcesService } from '../services/resources/resources.service';

import { MessageComponent } from '../components/common/modals';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-payload-review',
    templateUrl: './payload-review.component.html',
    styleUrls: ['./payload-review.component.scss']
})
export class PayloadReviewComponent implements OnInit {
    request: Request;
    reviewType: string = 'payload';
    requestId: string;
    numOfPass: string;
    empNumber: string;
    changesDisabled: boolean;

    payloadListAPI: string = 'api/Request/GetFlightsByRequestId?id={0}';
    updateFlightsAPI: string = 'api/Request/UpdateFlights';
    addNoteAPI: string = 'api/Request/AddNote';

    statusEnum = StatusEnum;
    statusArray = [];
    payloadFlightNote: Note;
    employeeFlightNote: Note;
    employeeNumber: string;
    subscription: Subscription;
    userInfo: any;
    public r: any = {};

    constructor(public dialog: MatDialog, private httpClient: HttpClientService, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private resourcesService: ResourcesService) {
        this.subscription = this.authenticationService.getUserInfo().subscribe(userInfo => { this.userInfo = userInfo; });
        resourcesService.getResources().subscribe(res => this.r = res);
    }

    ngOnInit() {
        this.empNumber = this.resourcesService.getCookie('empNumber');
        this.changesDisabled = false;

        this.route.params.subscribe(params => {
            window.scrollTo(0, 0);
            this.request = new Request();
            this.initNotes();
            this.requestId = this.route.snapshot.params['requestId'];

            if (!this.requestId) {
                this.modalMessage('Error', this.r.errorHeader, this.r.ERR_InvalidRequestId);
                this.router.navigate(['/home']);
                return;
            }
            else{
                this.init(params['requestId'])
            }

        });

    }

    init(id){
        this.httpClient.get(this.payloadListAPI.replace('{0}', id))
                .toPromise()
                .then(res => {
                    if (res.json()) {
                        this.request = res.json() as Request;

                        this.setNotes();
                        this.setNumOfPass();
                        this.setLastUpdatedBy();

                        if(this.request.status == this.statusEnum.Denied)
                            this.changesDisabled = true;
                    }
                })
                .catch(e => {
                    console.log('error ' + e);
                });
    }

    initNotes() {
        this.payloadFlightNote = new Note(this.empNumber, NoteSectionEnum.Flights, NoteTypeEnum.Payload);
        this.employeeFlightNote = new Note('', NoteSectionEnum.Flights, NoteTypeEnum.Employee);
    }

    setNotes() {
        this.request.notes.forEach(n => {
            if (n.text && n.sectionId == NoteSectionEnum.Flights && n.typeId == NoteTypeEnum.Employee) {
                this.employeeFlightNote = n;
            }

            if (n.text && n.sectionId == NoteSectionEnum.Flights && n.typeId == NoteTypeEnum.Payload) {
                this.addNote('flightNote');
                this.payloadFlightNote = n;
            }
        });
    }

    setNumOfPass() {
        let ycpUsed: number = 0;
        let bcpUsed: number = 0;
        let lmcpUsed: number = 0;
        let ipUsed: number = 0;
        let numOfPassTemplate: string = '{0} ({1})';
        this.numOfPass = '';

        this.request.passengers.forEach(p => {
            if (p.typeOfPass == TypeOfPassEnum.YCP)
                ycpUsed++
            if (p.typeOfPass == TypeOfPassEnum.BCP)
                bcpUsed++
            if (p.typeOfPass == TypeOfPassEnum.LMCP)
                lmcpUsed++
            if (p.typeOfPass == TypeOfPassEnum.IP)
                ipUsed++
        });

        if (ycpUsed > 0)
            this.numOfPass = numOfPassTemplate.replace('{0}', this.r['typeOfPassAbbrev' + TypeOfPassEnum.YCP]).replace('{1}', ycpUsed.toString()) + ' ';

        if (bcpUsed > 0)
            this.numOfPass += numOfPassTemplate.replace('{0}', this.r['typeOfPassAbbrev' + TypeOfPassEnum.BCP]).replace('{1}', bcpUsed.toString()) + ' ';

        if (lmcpUsed > 0)
            this.numOfPass += numOfPassTemplate.replace('{0}', this.r['typeOfPassAbbrev' + TypeOfPassEnum.LMCP]).replace('{1}', lmcpUsed.toString());

        if (ipUsed > 0)
            this.numOfPass += numOfPassTemplate.replace('{0}', this.r['typeOfPassAbbrev' + TypeOfPassEnum.IP]).replace('{1}', ipUsed.toString());
    }

    setLastUpdatedBy() {
        this.request.flights.forEach(f => {
            for (let i = 0; i < this.request.activityLogs.length; i++) {
                if (f.id == this.request.activityLogs[i].foreignId) {
                    f.lastUpdatedBy = this.request.activityLogs[i].empName;
                    break;
                }
            }
        });
    }

    async save() {
        //save flights
        await this.httpClient.post(this.updateFlightsAPI, this.request.flights)
            .toPromise()
            .then(res => {
                this.modalMessage('Success', this.r.success, this.r.flightUpdated);
            })
            .catch(e => {
                this.modalMessage('Error', this.r.errorHeader, 'error ' + e);
            });

        //save notes
        if (this.payloadFlightNote.text) {
            //safety net
            this.payloadFlightNote.requestId = Number(this.requestId);
            await this.httpClient.post(this.addNoteAPI, this.payloadFlightNote)
                .toPromise()
                .then()
                .catch(e => {
                    this.modalMessage('Error', this.r.errorHeader, 'error ' + e);
                });
        }

        this.init(this.requestId); //force refresh
    }

    addNote(ancillaryProductId: string) {
        let ancillaryProduct = document.querySelector('#' + ancillaryProductId);

        let addNoteButton = ancillaryProduct.querySelector('.add-note');
        let ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');

        addNoteButton.classList.add('hidden');
        ancillaryNote.classList.remove('hidden');
    }

    deleteNote(ancillaryProductId: string, noteModel: Note) {
        let ancillaryProduct = document.querySelector('#' + ancillaryProductId);

        let addNoteButton = ancillaryProduct.querySelector('.add-note');
        let ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');

        // Clear out note message
        noteModel.text = '';

        addNoteButton.classList.remove('hidden');
        ancillaryNote.classList.add('hidden');
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
