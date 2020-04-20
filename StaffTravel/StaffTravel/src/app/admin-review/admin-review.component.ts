import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Request } from '../models/request';
import { StatusEnum, NoteSectionEnum, NoteTypeEnum, AncillaryProductEnum, TypeOfPassEnum, TransferTypeEnum } from '../models/enums';
import { Note } from '../models/note';
import { HttpClientService } from '../services/http-client/http-client.service';
import { ResourcesService } from '../services/resources/resources.service';

import { MessageComponent } from '../components/common/modals';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/common/modals/confirmation/confirmation.component';

@Component({
    selector: 'app-admin-review',
    templateUrl: './admin-review.component.html',
    styleUrls: ['./admin-review.component.scss']
})
export class AdminReviewComponent implements OnInit {
    reviewType: string = 'admin';
    request: Request;
    requestId: string;
    statusEnum = StatusEnum;
    ancillaryProductEnum = AncillaryProductEnum;
    transferTypeEnum = TransferTypeEnum;
    statusArray = [];
    typeOfPassArray: Array<{}> = new Array<{}>();
    ancillaryProductsArray: Array<{}> = new Array<{}>();
    transferTypeArray: Array<{}> = new Array<{}>();
    requestAPI: string = 'api/Request/GetRequestDetails?id={0}';
    rejectRequestAPI: string = 'api/Request/RejectRequest?id={0}';
    bookingMade: boolean = false;
    rejectMade: boolean = false;

    employeePassengerNote: Note;
    employeeFlightNote: Note;
    employeeHotelNote: Note;
    employeeAncillaryNote: Note;

    adminPassengerNote: Note;
    adminFlightNote: Note;
    adminHotelNote: Note
    adminAncillaryNote: Note;
    adminBookingNote: Note;
    payloadFlightNote: Note;

    updateRequestAPI: string = 'api/Request/UpdateRequest';

    r: any = {};

    constructor(public dialog: MatDialog, private httpClient: HttpClientService, private route: ActivatedRoute, private router: Router, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.typeOfPassArray = resourcesService.getTypeOfPasses();
            this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }

    ngOnInit() {
        let empNumber: string = this.resourcesService.getCookie('empNumber');

        this.route.params.subscribe(params => {
            window.scrollTo(0, 0);
            this.request = new Request();

            this.statusArray = Object.keys(this.statusEnum).filter(i => !isNaN(Number(i)));

            this.employeePassengerNote = new Note('', NoteSectionEnum.Passengers, NoteTypeEnum.Employee);
            this.employeeFlightNote = new Note('', NoteSectionEnum.Flights, NoteTypeEnum.Employee);
            this.employeeHotelNote = new Note('', NoteSectionEnum.Hotels, NoteTypeEnum.Employee);
            this.employeeAncillaryNote = new Note('', NoteSectionEnum.Ancillaries, NoteTypeEnum.Employee);

            this.adminPassengerNote = new Note(empNumber, NoteSectionEnum.Passengers, NoteTypeEnum.Admin);
            this.adminFlightNote = new Note(empNumber, NoteSectionEnum.Flights, NoteTypeEnum.Admin);
            this.adminHotelNote = new Note(empNumber, NoteSectionEnum.Hotels, NoteTypeEnum.Admin);
            this.adminAncillaryNote = new Note(empNumber, NoteSectionEnum.Ancillaries, NoteTypeEnum.Admin);
            this.adminBookingNote = new Note(empNumber, NoteSectionEnum.Booking, NoteTypeEnum.Admin);

            this.payloadFlightNote = new Note('', NoteSectionEnum.Flights, NoteTypeEnum.Payload);

            this.requestId = this.route.snapshot.params['requestId'];

            if (!this.requestId) {
                this.modalMessage('Error', this.r.errorHeader, this.r.ERR_InvalidRequestId);
                this.router.navigate(['/home']);
                return;
            }

            // Hide all admin notes by default
            this.initNote('passengerNote');
            this.initNote('flightNote');
            this.initNote('hotelNote');
            this.initNote('ancillaryNote');

            this.initRequest();
        });

    }

    initRequest() {
        this.httpClient.get(this.requestAPI.replace('{0}', this.requestId))
            .toPromise()
            .then(res => {
                this.request = JSON.parse(res.text()) as Request;
                if (this.request.bookingNumber != null)
                    this.bookingMade = true;
                else
                    this.bookingMade = false;


                if (this.request.status == StatusEnum.Denied)
                    this.rejectMade = true;
                else
                    this.rejectMade = false;


                this.request.notes.forEach(n => {
                    //employee notes
                    if (n.sectionId == NoteSectionEnum.Passengers && n.typeId == NoteTypeEnum.Employee)
                        this.employeePassengerNote = n;
                    if (n.sectionId == NoteSectionEnum.Flights && n.typeId == NoteTypeEnum.Employee)
                        this.employeeFlightNote = n;
                    if (n.sectionId == NoteSectionEnum.Hotels && n.typeId == NoteTypeEnum.Employee)
                        this.employeeHotelNote = n;
                    if (n.sectionId == NoteSectionEnum.Ancillaries && n.typeId == NoteTypeEnum.Employee)
                        this.employeeAncillaryNote = n;

                    //admin notes
                    if (n.sectionId == NoteSectionEnum.Passengers && n.typeId == NoteTypeEnum.Admin) {
                        this.adminPassengerNote = n;
                        this.addNote('passengerNote');
                    }

                    if (n.sectionId == NoteSectionEnum.Flights && n.typeId == NoteTypeEnum.Admin) {
                        this.adminFlightNote = n;
                        this.addNote('flightNote');
                    }

                    if (n.sectionId == NoteSectionEnum.Hotels && n.typeId == NoteTypeEnum.Admin) {
                        this.adminHotelNote = n;
                        this.addNote('hotelNote');
                    }

                    if (n.sectionId == NoteSectionEnum.Ancillaries && n.typeId == NoteTypeEnum.Admin) {
                        this.adminAncillaryNote = n;
                        this.addNote('ancillaryNote');
                    }

                    if (n.sectionId == NoteSectionEnum.Booking && n.typeId == NoteTypeEnum.Admin)
                        this.adminBookingNote = n;

                    //payload notes    
                    if (n.sectionId == NoteSectionEnum.Flights && n.typeId == NoteTypeEnum.Payload)
                        this.payloadFlightNote = n;
                });

                this.setLastUpdatedBy();

            })
            .catch(e => {
                console.log('error ' + e);
                this.router.navigate(['/home']);
                return;
            });
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

    // Init note by hiding it by default (used for route changes which requests that had notes openned from last request)
    initNote(ancillaryProductId: string) {
        let ancillaryProduct = document.querySelector('#' + ancillaryProductId);

        let addNoteButton = ancillaryProduct.querySelector('.add-note');
        let ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');

        addNoteButton.classList.remove('hidden');
        ancillaryNote.classList.add('hidden');
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

    updateRequest() {
        this.setNotes();
        this.httpClient.post(this.updateRequestAPI, this.request)
            .toPromise()
            .then(res => {
                this.modalMessage('Success', this.r.success, this.r.bookingUpdated);
                this.bookingMade = true;
                this.ngOnInit(); //force refresh
            })
            .catch(e => {
                this.modalMessage('Error', this.r.errorHeader, 'Error ' + e);
            });
    }

    confirmRejectRequest() {
        this.modalConfirmation('Confirm', this.r.confirm, this.r.confirmCancelRequest, this.r.no, this.r.yes);
    }

    rejectRequest() {
        this.httpClient.get(this.rejectRequestAPI.replace('{0}', this.requestId))
            .toPromise()
            .then(res => {
                this.modalMessage('Success', this.r.success, this.r.requestRejected);

                //update the status on the page
                this.initRequest();
            })
            .catch(e => {
                this.modalMessage('Error', this.r.errorHeader, 'Error ' + e);
            });

    }

    setNotes() {
        //clear the array to make sure the added notes are the only ones affected with the update
        this.request.notes = new Array<Note>();
        if (this.adminPassengerNote.text) {
            this.adminPassengerNote.requestId = Number(this.requestId);
            this.request.notes.push(this.adminPassengerNote);
        }

        if (this.adminFlightNote.text) {
            this.adminFlightNote.requestId = Number(this.requestId);
            this.request.notes.push(this.adminFlightNote);
        }

        if (this.adminHotelNote.text) {
            this.adminHotelNote.requestId = Number(this.requestId);
            this.request.notes.push(this.adminHotelNote);
        }

        if (this.adminAncillaryNote.text) {
            this.adminAncillaryNote.requestId = Number(this.requestId);
            this.request.notes.push(this.adminAncillaryNote);
        }

        if (this.adminBookingNote.text) {
            this.adminBookingNote.requestId = Number(this.requestId);
            this.request.notes.push(this.adminBookingNote);
        }
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

    modalConfirmation(type: string, heading: string, message: string, cancel: string, confirm: string): void {
        let dialogRef = this.dialog.open(ConfirmationComponent, {
            width: '650px',
            data: {
                type: type.toLowerCase(),
                heading: heading,
                message: message,
                cancel: cancel,
                confirm: confirm
            },
            backdropClass: 'modal-backdrop-light',
            panelClass: 'modal--message-' + type.toLowerCase()
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result == true)
                this.rejectRequest();
        });
    }
}
