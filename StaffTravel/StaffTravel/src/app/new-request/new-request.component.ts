import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Request } from '../models/request';
import { Passenger } from '../models/passenger';
import { Flight } from '../models/flight';
import { Hotel } from '../models/hotel';
import { Ancillary } from '../models/ancillary';
import { HttpClientService } from '../services/http-client/http-client.service';
import { Observable } from 'rxjs/Observable';
import { BasicInfo } from '../models/basic-info';
import { Note } from '../models/note';
import { TypeOfPassEnum, AncillaryProductEnum, NoteSectionEnum, NoteTypeEnum, TransferTypeEnum } from '../models/enums';

import * as moment from 'moment';
import { Subscription } from "rxjs/Subscription";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { ResourcesService } from '../services/resources/resources.service';

import { MessageComponent } from '../components/common/modals';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-new-request',
    templateUrl: './new-request.component.html',
    styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit, AfterViewInit {
    basicInfo: BasicInfo;
    request: Request;

    passengerNote: Note;
    flightNote: Note;
    hotelNote: Note;
    ancillaryNote: Note;

    ancillaryProductsArray: Array<{}>;
    typeOfPassArray: Array<{}>;
    insuranceTypeArray: Array<{}>;
    transferTypeArray: Array<{}>;

    availableGateways?: string[];
    hotelDestinations?: string[];
    hotelDestinationsID?: Map<string, string>;

    gatewaysListReady: boolean;
    destinationsListReady: boolean;
    hotelDestinationsListReady: boolean;
    hotelsListReady: boolean;
    flightEditMode: boolean;
    hotelEditMode: boolean;
    flightsDisabled: boolean;

    dateMask: (string | RegExp)[] = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    maxValueMask: (string | RegExp)[] = [/\d/, /\d/];
    //flights endpoints
    gatewaysAPI: string = 'api/Resource/GetGatewayforBrandAsync?language={0}&brand=SWG';
    destinationsAPI: string = 'api/Resource/GetDestCode?language={0}&brand=SWG&gateway={1}&searchType=RE';
    //hotels endpoints
    svHotelDestinationsAPI: string = 'api/Resource/GetDestCode?language={0}&brand=SWG&gateway={1}';
    svHotelsAPI: string = 'api/Resource/GetSVHotelList?language={0}&brand=SWG&gateway=YYZ&destination={1}';

    subscription: Subscription;
    r: any = {};
    errorQueue: Array<string>;

    constructor(public dialog: MatDialog, private httpClient: HttpClientService, private router: Router, private authenticationService: AuthenticationService, private resourcesService: ResourcesService) {
        this.subscription = this.authenticationService.getUserInfo().subscribe(userInfo => { this.basicInfo = userInfo.basicInfo; });

        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.typeOfPassArray = resourcesService.getTypeOfPasses();
            this.initTypeOfPasses();
            this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }

    ngAfterViewInit() {
        this.flightEditMode = false;
        this.hotelEditMode = false;
    }

    ngOnInit() {
        this.initLists();
        this.errorQueue = new Array<string>();

        //load the request from the session in case the user wants to edit the request or accidentally closed the browser
        if (sessionStorage.getItem('currentRequest')) {
            this.flightEditMode = true;
            this.hotelEditMode = true;
            this.hotelsListReady = true; //available in the session
            this.destinationsListReady = true; //available in the session

            this.request = JSON.parse(sessionStorage.getItem('currentRequest'));

            this.initNotes();
            this.setNotes();
        }
        else {
            this.flightEditMode = false;
            this.hotelEditMode = false;
            this.request = new Request();
            this.request.employeeNumber = this.resourcesService.getCookie('empNumber');
            this.initNotes();
            this.request.passengers[0].firstName = this.basicInfo.firstname;
            this.request.passengers[0].lastName = this.basicInfo.lastname;
        }        
    }

    initLists() {
        this.hotelDestinations = new Array<string>();
        this.hotelDestinationsID = new Map<string, string>();
        this.availableGateways = new Array<string>();

        //load the list of available gateways
        this.httpClient.get(this.gatewaysAPI.replace('{0}', 'en'))
            .toPromise()
            .then(res => {
                let tempObjArr: any;
                tempObjArr = JSON.parse(res.json());
                tempObjArr.forEach(o => this.availableGateways.push(o.name + ' ' + '(' + o.code + ')'));
                this.availableGateways.sort();
                this.gatewaysListReady = true;
            });


        //load the list of available hotel destinations
        this.httpClient.get(this.svHotelDestinationsAPI.replace('{0}', 'en').replace('{1}', 'YYZ'))
            .toPromise()
            .then(res => {
                let tempObjArr: any;
                tempObjArr = JSON.parse(res.json());

                //foreach group
                tempObjArr.forEach(g => {
                    //foreach destination in group
                    g.destination.forEach(d => {
                        if (d.destName) {
                            this.hotelDestinations.push(d.destName);
                            this.hotelDestinationsID.set(d.destName, d.destCode);
                        }

                    }); //end foreach destination in group

                }); //end foreach group

                this.hotelDestinations.sort();
                this.hotelDestinationsListReady = true;
            }); // end response
    }

    initNotes() {
        this.passengerNote = new Note(this.request.employeeNumber, NoteSectionEnum.Passengers, NoteTypeEnum.Employee);
        this.flightNote = new Note(this.request.employeeNumber, NoteSectionEnum.Flights, NoteTypeEnum.Employee);
        this.hotelNote = new Note(this.request.employeeNumber, NoteSectionEnum.Hotels, NoteTypeEnum.Employee);
        this.ancillaryNote = new Note(this.request.employeeNumber, NoteSectionEnum.Ancillaries, NoteTypeEnum.Employee);
    }

    initTypeOfPasses() {
        let ycpAvailable: number = 0;
        let bcpAvailable: number = 0;

        ycpAvailable = this.basicInfo.HowManyPassesYouHave - this.basicInfo.YearlyUsed - this.basicInfo.YealyPending;
        bcpAvailable = this.basicInfo.BonusEarned - this.basicInfo.BonusUsed - this.basicInfo.BonusPending;

        if (ycpAvailable <= 0) {
            for (let i = 0; i < this.typeOfPassArray.length; i++) {
                let a: any = this.typeOfPassArray[i];
                if (a.value == TypeOfPassEnum.YCP)
                    this.typeOfPassArray.splice(i, 1);
            }
        }

        if (bcpAvailable <= 0) {
            for (let i = 0; i < this.typeOfPassArray.length; i++) {
                let a: any = this.typeOfPassArray[i];
                if (a.value == TypeOfPassEnum.BCP)
                    this.typeOfPassArray.splice(i, 1);
            }
        }
    }

    setNotes() {
        this.request.notes.forEach(n => {
            if (n.text && n.sectionId == NoteSectionEnum.Passengers) {
                this.addNote('passengerNote');
                this.passengerNote = n;
            }

            if (n.text && n.sectionId == NoteSectionEnum.Flights) {
                this.addNote('flightNote');
                this.flightNote = n;
            }

            if (n.text && n.sectionId == NoteSectionEnum.Hotels) {
                this.addNote('hotelNote');
                this.hotelNote = n;
            }

            if (n.text && n.sectionId == NoteSectionEnum.Ancillaries) {
                this.addNote('ancillaryNote');
                this.ancillaryNote = n;
            }

        });
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

    addPassenger() {
        this.request.passengers.push(new Passenger(this.request.passengers.length + 1));
    }

    deletePassenger(passengerIndex: number) {
        this.request.passengers.splice(passengerIndex, 1);
        this.rebuildPassengerNumbers();
    }

    addFlight() {
        this.request.flights.push(new Flight);
    }

    deleteFlight(flightIndex: number) {
        this.request.flights.splice(flightIndex, 1);
    }

    addHotel() {
        this.request.hotels.push(new Hotel);
    }

    deleteHotel(hotelIndex: number) {
        this.request.hotels.splice(hotelIndex, 1);
    }

    addAncillary() {
        this.request.ancillaries.push(new Ancillary);
    }

    deleteAncillary(ancillaryIndex: number) {
        this.request.ancillaries.splice(ancillaryIndex, 1);
    }

    rebuildPassengerNumbers() {
        for (let i: number = 0; i < this.request.passengers.length; i++) {
            this.request.passengers[i].passengerNumber = i + 1;
        }
    }

    productChange(product: AncillaryProductEnum, ancillaryIndex: number) {
        if (product.toString() == '') {
            //nothing selected, reset the object
            this.request.ancillaries[ancillaryIndex] = new Ancillary();
        }
        else {
            switch (Number(product)) {
                case AncillaryProductEnum.Excursion:
                    //
                    break;
                case AncillaryProductEnum.Transfer:
                    //
                    break;
                case AncillaryProductEnum.Insurance:
                    //
                    break;
                default:
                //

            }
        }
    }

    typeOfPassChanged(i: number) {
        if (!this.validateTypeOfPass()){
            this.modalMessages('Error', this.r.errorHeader, this.errorQueue);
            this.errorQueue = new Array<string>();
            // this.request.passengers[i].typeOfPass = null; //setting the value to null didn't work commenting for now
        }
            
    }

    validateTypeOfPass(): boolean {
        let isValid = true;
        let ycpAvailable = this.basicInfo.HowManyPassesYouHave - this.basicInfo.YearlyUsed - this.basicInfo.YealyPending;
        let ycpSelected: number = 0;
        let bcpAvailable = this.basicInfo.BonusEarned - this.basicInfo.BonusUsed - this.basicInfo.BonusPending;
        let bcpSelected: number = 0;
        let lmcpSelected: number = 0;
        let wpSelected: number = 0;

        //iterate over the dropdown elements and count how many passes are selected
        this.request.passengers.forEach(p => {
            if (p.typeOfPass == TypeOfPassEnum.YCP)
                ycpSelected++;
            if (p.typeOfPass == TypeOfPassEnum.BCP)
                bcpSelected++;
            if (p.typeOfPass == TypeOfPassEnum.LMCP)
                lmcpSelected++;
            if (p.typeOfPass == TypeOfPassEnum.NONE)
                wpSelected++;
        });

        //alert the user if the number exceeds allowed or a mix of passes was used
        if (ycpSelected > ycpAvailable || bcpSelected > bcpAvailable) {
            this.errorQueue.push(this.r.ERR_PassBalance);
            isValid = false;
        }
        else if (ycpSelected + bcpSelected > 0 && lmcpSelected > 0) {
            this.errorQueue.push(this.r.ERR_PassCombination);
            isValid = false;
        }
        else if (ycpSelected + bcpSelected > 0 && wpSelected > 0) {
            this.errorQueue.push(this.r.ERR_PassCombination);
            isValid = false;
        }
        else if (lmcpSelected > 0 && wpSelected > 0) {
            this.errorQueue.push(this.r.ERR_PassCombination);
            isValid = false;
        }

        //if without pass selected, disable add flights
        if (wpSelected > 0) {
            this.request.flights = new Array<Flight>();
            this.flightsDisabled = true;
        }
        else {
            this.flightsDisabled = false;
        }

        return isValid;
    }

    clearRequest() {
        //remove any saved data in the session
        sessionStorage.removeItem('currentRequest');
        //re-initialize the page for fresh start
        this.ngOnInit();
    }

    goToReview() {
        if (this.validateForm()) {
            if (this.passengerNote.text)
                this.request.notes.push(this.passengerNote);

            if (this.flightNote.text)
                this.request.notes.push(this.flightNote);

            if (this.hotelNote.text)
                this.request.notes.push(this.hotelNote);

            if (this.ancillaryNote.text)
                this.request.notes.push(this.ancillaryNote);

            //save the object in session storage and go to review page
            sessionStorage.setItem('currentRequest', JSON.stringify(this.request));

            this.router.navigate(['/review-request']);
        }
        else {
            this.errorQueue.splice(0,null, this.r.ERR_InvalidRequest);

            this.modalMessages('Error', this.r.errorHeader, this.errorQueue);
            this.errorQueue = new Array<string>();
        }
    }

    //custom validation
    validateForm(): boolean {
        let isValid: boolean = true;
        let isContactInfoValid: boolean = false;
        //allow 2 hotels per destination only
        if ((this.request.hotels.length > this.request.flights.length * 2 && this.request.flights.length != 0) || (this.request.hotels.length > 6 && this.request.flights.length == 0)) {
            isValid = false;
            this.errorQueue.push(this.r.ERR_HotelsCount);
        }

        //loop through the request and validate
        this.request.passengers.forEach(p => {
            //at least one passenger must have email and phone number
            if (p.email && p.phoneNumber)
                isContactInfoValid = true;


            //validate date fields
            if (p.DOB && !this.validateDate(p.DOB, false, true))
                isValid = false;
        });

        this.request.flights.forEach(f => {
            //validate date fields
            if (!this.validateDate(f.departDate, true, false) || !this.validateDate(f.returnDate, true, false))
                isValid = false;

        });

        this.request.hotels.forEach(h => {
            //validate date fields
            if (!this.validateDate(h.checkInDate, true, false))
                isValid = false;

        });

        this.request.ancillaries.forEach(a => {
            //validate date fields
            if (a.ancillaryProductType == AncillaryProductEnum.Excursion) {
                if (!this.validateDate(a.excursionDate, true, false))
                    isValid = false;
            }

        });

        if (this.request.flights.length == 0 && this.request.hotels.length == 0 && this.request.ancillaries.length == 0) {
            isValid = false;
            this.errorQueue.push(this.r.ERR_ZeroProducts);
        }

        if (!isContactInfoValid) {
            isValid = false;
            this.errorQueue.push(this.r.ERR_ContactInfoMissing);
        }

        if(!this.validateTypeOfPass())
            isValid = false;

        return isValid;
    }

    validateDate(valueEntered, futureDate: boolean = false, pastDate: boolean = false, throwError: boolean = false): boolean {
        let dateValid: boolean = true;
        let tempMoment = moment(valueEntered, 'MM/DD/YYYY', true);
        if (tempMoment.isValid()) {

            let now = moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0});
            let diff: number = tempMoment.diff(now, 'days');
            if (futureDate && diff < 0) {
                this.errorQueue.push(this.r.ERR_InvalidDateInFuture);
                dateValid = false;
            }

            if (pastDate && diff >= 0) {
                this.errorQueue.push(this.r.ERR_InvalidDateInPast);
                dateValid = false;
            }
        }
        else {
            this.errorQueue.push(this.r.ERR_InvalidDateFormat);
            dateValid = false;
        }

        if(this.errorQueue.length > 0 && throwError){
            this.modalMessages('Error', this.r.errorHeader, this.errorQueue);
            this.errorQueue = new Array<string>();
        }


        return dateValid;
    }

    gatewayChanged(selectedValue: any, i: number) {
        let gateway: string;
        let tempObjArr: any;
        //disable destinations until the new list is ready
        this.destinationsListReady = false;

        //when editing request, the gateway change event will be fired as it will be reloaded from the session to be edited. Don't reset the departure value and set edit request = false to avoid this behaviour triggered again when the user actually edits the hotel destination.
        if (!this.flightEditMode)
            this.request.flights[i].departTo = '';

        //airport code
        gateway = selectedValue.substr(selectedValue.length - 4, 3);

        this.httpClient.get(this.destinationsAPI.replace('{0}', 'en').replace('{1}', gateway))
            .toPromise()
            .then(res => {
                this.request.flights[i].availableDestinations = new Array<string>();
                tempObjArr = JSON.parse(res.json());

                tempObjArr.forEach(d => {
                    if (d.destinationName)
                        this.request.flights[i].availableDestinations.push(d.destinationName);
                });

                this.request.flights[i].availableDestinations.sort();
                this.destinationsListReady = true;
            }); //end response
    }

    hotelDestinationChanged(selectedValue: any, i: number) {
        //when editing request, the hotel destination change event will be fired as it will be reloaded from the session to be edited. Don't reset the available resorts and set edit request = false to avoid this behaviour triggered again when the user actually edits the hotel destination.
        if (!this.hotelEditMode) {
            this.request.hotels[i].name = '';

            //destination codes are comma separated, replace with underscore
            let destcode = this.hotelDestinationsID.get(selectedValue).replace(/,/g, '_');
            let tempObjArr: any;
            //disable the hotels list until it is ready and reset value
            this.hotelsListReady = false;

            //initiate the call to hotellist
            this.request.hotels[i].availableResorts = new Array<string>();
            this.httpClient.get(this.svHotelsAPI.replace('{0}', 'en').replace('{1}', destcode))
                .toPromise()
                .then(res => {
                    tempObjArr = JSON.parse(res.json());
                    tempObjArr[0].hotels.forEach(h => {
                        let idx: number = h.indexOf('--xx--');
                        let hotelName: string = h.substring(0, idx);
                        let hotelId: string = h.substring(idx + 6);

                        if (hotelName && hotelId.split('_').length == 1)
                            this.request.hotels[i].availableResorts.push(hotelName);
                    });
                    this.request.hotels[i].availableResorts.sort();
                    this.hotelsListReady = true;
                });
        }
    }

    departToChanged(selectedValue: any, i: number) {
        this.request.flights[i].returnFrom = this.request.flights[i].departTo;
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

    modalMessages(type: string, heading: string, messages: Array<string>): void {
        let unique: Array<string> = Array.from(new Set(messages));
        let message: string = '';

        unique.forEach((m,i) => {
            if(i != 0)
                message += '• ';
            message += m + '\n';
        });
        
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
