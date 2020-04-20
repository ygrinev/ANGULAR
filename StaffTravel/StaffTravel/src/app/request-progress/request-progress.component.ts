import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../services/http-client/http-client.service';
import { Request } from '../models/request';
import { Passenger } from '../models/passenger';
import {
    TypeOfPassEnum,
    AncillaryProductEnum,
    NoteSectionEnum,
    NoteTypeEnum,
    StatusEnum,
    TransferTypeEnum,
    InsuranceTypeEnum
} from '../models/enums';
import { Observable } from 'rxjs/Observable';
import { BasicInfo } from '../models/basic-info';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { ResourcesService } from '../services/resources/resources.service';

import { EditComponent, MessageComponent } from '../components/common/modals';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/common/modals/confirmation/confirmation.component';
import { AddFlightComponent } from '../components/common/modals/add-flight/add-flight.component';
import { AddHotelComponent } from '../components/common/modals/add-hotel/add-hotel.component';
import { Flight } from '../models/flight';
import { Hotel } from '../models/hotel';

@Component({
    selector: 'app-request-progress',
    templateUrl: './request-progress.component.html',
    styleUrls: ['./request-progress.component.scss']
})
export class RequestProgressComponent implements OnInit {
    passengerList: Passenger[];

    flightStatus: number;
    hotelStatus: number;
    ancillariesStatus: number;
    TotalAmount: string;
    TotalComponent: number = 0;
    TotalChange: number = 0;
    TotalBooking: number = 0;
    BookingNumber: string;
    newFlightsCount: number = 0;
    newHotelsCount: number = 0;

    AmountArray: string[];
    ApproveFlight: boolean = false;
    ApproveHotel: boolean = false;
    ApproveAncillary: boolean = false;
    bookingMade: boolean = false;
    rejectDisabled: boolean = true;
    submitDisabled: boolean = true;
    flightsDisabled: boolean = true;
    hotelsDisabled: boolean = true;

    requestId: number;
    statusEnum = StatusEnum;
    typeOfPassEnum = TypeOfPassEnum;
    ancillaryProductEnum = AncillaryProductEnum;
    insuranceTypeEnum = InsuranceTypeEnum;
    transferTypeEnum = TransferTypeEnum;

    typeOfPassArray: Array<{}> = new Array<{}>();
    ancillaryProductsArray: Array<{}> = new Array<{}>();
    transferTypeArray: Array<{}> = new Array<{}>();

    notePaxEmp: string = '';
    notePaxAdmin: string = '';
    noteFlightEmp: string = '';
    noteFlightAdmin: string = '';
    noteHotelEmp: string = '';
    noteHotelAdmin: string = '';
    noteAncEmp: string = '';
    noteAncAdmin: string = '';
    noteFlightPayload: string = '';

    request: Request;
    subscription: Subscription;
    basicInfo: BasicInfo;
    dateMask: (string | RegExp)[] = [
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        /\d/,
        /\d/
    ];

    rejectRequestAPI: string = 'api/Request/CancelMyRequest?id={0}';

    r: any = {};

    constructor(
        public dialog: MatDialog,
        private httpClient: HttpClientService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private resourcesService: ResourcesService
    ) {
        this.subscription = this.authenticationService
            .getUserInfo()
            .subscribe(userInfo => {
                this.basicInfo = userInfo.basicInfo;
            });

        resourcesService.getResources().subscribe(res => {
            this.r = res;
            this.typeOfPassArray = resourcesService.getTypeOfPasses();
            this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }

    ngOnInit() {
        this.flightStatus = 0;
        this.hotelStatus = 0;
        this.ancillariesStatus = 0;
        this.AmountArray = [''];

        this.TotalBooking = 0;
        this.TotalAmount = '0.00';

        this.request = new Request();

        this.requestId = this.route.snapshot.params['requestId'];

        let empNumber: string = this.resourcesService.getCookie('empNumber');

        if (!this.requestId) {
            this.router.navigate(['/home']);
            return;
        }

        this.httpClient
            .get('api/request/GetProgressDetail?Id=' + this.requestId)
            .toPromise()
            .then(res => {
                this.request = JSON.parse(res.text()) as Request;

                if (this.request.flights.length == 0) {
                    this.flightStatus = -1;
                } else {
                    // status checking - flight
                    this.request.flights.forEach(f => {
                        if (f.approvalStatus == StatusEnum.Approved) {
                            this.flightStatus = 1;
                        } else {
                            f.price = 0;
                        }

                        if (
                            f.status == StatusEnum.Approved &&
                            f.approvalStatus == StatusEnum.Approved
                        ) {
                            this.TotalBooking += f.price;
                        }

                        // if at least one is denied, allow adding flights
                        if (f.approvalStatus === StatusEnum.Denied)
                            this.flightsDisabled = false;
                    });
                    this.TotalComponent += 1;
                }

                if (this.request.hotels.length == 0) {
                    this.hotelStatus = -1;
                } else {
                    // status checking - hotel
                    this.request.hotels.forEach(h => {
                        if (h.approvalStatus == StatusEnum.Approved) {
                            this.hotelStatus = 1;
                        } else {
                            h.price = 0;
                        }
                        if (
                            h.status == StatusEnum.Approved &&
                            h.approvalStatus == StatusEnum.Approved
                        ) {
                            this.TotalBooking += h.price;
                        }

                        // if at least one is denied, allow adding hotels
                        if (h.approvalStatus === StatusEnum.Denied)
                            this.hotelsDisabled = false;
                    });
                    this.TotalComponent += 1;
                }

                if (this.request.ancillaries != null) {
                    if (this.request.ancillaries.length != 0) {
                        if (!this.request.ancillaries[0].destination) {
                            // this.request.ancillaries = null;
                            this.ancillariesStatus = -1;
                        } else {
                            // status checking - ancillary
                            this.request.ancillaries.forEach(x => {
                                if (x.approvalStatus == 1) {
                                    this.ancillariesStatus = 1;
                                } else {
                                    x.price = 0;
                                }
                                if (x.status == 1 && x.approvalStatus == 1) {
                                    this.TotalBooking += x.price;
                                }
                            });
                            this.TotalComponent += 1;
                        }
                    }
                }

                this.request.notes.forEach(x => {
                    if (
                        x.sectionId == NoteSectionEnum.Passengers &&
                        x.typeId == NoteTypeEnum.Employee
                    ) {
                        this.notePaxEmp = x.text;
                    } else if (
                        x.sectionId == NoteSectionEnum.Passengers &&
                        x.typeId == NoteTypeEnum.Admin
                    ) {
                        this.notePaxAdmin = x.text;
                    } else if (
                        x.sectionId == NoteSectionEnum.Flights &&
                        x.typeId == NoteTypeEnum.Employee
                    ) {
                        this.noteFlightEmp = x.text;
                    } else if (
                        x.sectionId == NoteSectionEnum.Flights &&
                        x.typeId == NoteTypeEnum.Admin
                    ) {
                        this.noteFlightAdmin = x.text;
                    } else if (
                        x.sectionId == NoteSectionEnum.Flights &&
                        x.typeId == NoteTypeEnum.Payload
                    ) {
                        this.noteFlightPayload = x.text;
                    } else if (
                        x.sectionId == NoteSectionEnum.Hotels &&
                        x.typeId == NoteTypeEnum.Employee
                    ) {
                        this.noteHotelEmp = x.text;
                    } else if (
                        x.sectionId == NoteSectionEnum.Hotels &&
                        x.typeId == NoteTypeEnum.Admin
                    ) {
                        this.noteHotelAdmin = x.text;
                    } else if (
                        x.sectionId == NoteSectionEnum.Ancillaries &&
                        x.typeId == NoteTypeEnum.Employee
                    ) {
                        this.noteAncEmp = x.text;
                    } else if (
                        x.sectionId == NoteSectionEnum.Ancillaries &&
                        x.typeId == NoteTypeEnum.Admin
                    ) {
                        this.noteAncAdmin = x.text;
                    }
                });

                if (this.request.bookingNumber != null)
                    this.BookingNumber = this.request.bookingNumber.toString();

                // when booking is made
                if (this.BookingNumber != null) {
                    this.bookingMade = true;
                    this.TotalAmount = this.TotalBooking.toFixed(2);
                }

                if (this.request.status != StatusEnum.Denied)
                    this.rejectDisabled = false;
                // console.log(this.request.flights);
            })
            .catch(e => {
                console.log('error ' + e);
                this.router.navigate(['/home']);
                return;
            });

        this.submitDisabled = true;
    }

    isEmptyObject(obj) {
        // console.log(obj);
        return obj && Object.keys(obj).length === 0;
    }

    requestSubmit() {
        console.log(this.checkApproveStatusFromEmployee());
        console.log(this.checkPaxModification());

        if (this.checkApproveStatusFromEmployee() || this.checkPaxModification()) {
            // ok to submit

            // console.log(this.request.flights);
            this.httpClient
                .post('api/request/UpdateApprovalFromEmployee', this.request)
                .toPromise()
                .then(res => {
                    this.modalMessage(
                        'Success',
                        this.r.success,
                        this.r.bookingRequestReceived
                    );
                    this.ngOnInit(); // force refresh
                })
                .catch(e => {
                    console.log('error ' + e);
                    this.modalMessage('Error', this.r.errorHeader, this.r.ERR_TryAgain);
                });
        } else {
            this.modalMessage(
                'Error',
                this.r.errorHeader,
                this.r.ERR_ApprovalRequired
            );
        }
    }

    statusChange(selectedStatus: any, price: number, id: number, filter: string) {
        let plusminus = '';

        let str = filter + '|' + id + '|' + price;

        if (selectedStatus == StatusEnum.Approved) {
            if (this.AmountArray.indexOf(str) == -1) {
                this.AmountArray.push(str);
                this.TotalAmount = (parseFloat(this.TotalAmount) + price).toFixed(2);
            }
        } else {
            if (this.AmountArray.indexOf(str) > -1) {
                this.AmountArray.splice(this.AmountArray.indexOf(str), 1);
                this.TotalAmount = (parseFloat(this.TotalAmount) - price).toFixed(2);
            }
        }

        // update status
        if (filter == 'flight') {
            let approvalAlreadyExist: boolean = false;
            let indexOfChanged: number = 0;
            // make sure none have been approved before
            if (selectedStatus == StatusEnum.Approved) {
                for (let i: number = 0; i < this.request.flights.length; i++) {
                    if (this.request.flights[i].status == StatusEnum.Approved) {
                        approvalAlreadyExist = true;
                        indexOfChanged = i;
                        break;
                    }
                }
            }

            this.request.flights.find(f => f.id == id).status = selectedStatus;

            // reverse the status of any previous approval
            if (approvalAlreadyExist)
                this.request.flights[indexOfChanged].status = StatusEnum.Pending;
        } else if (filter == 'hotel')
            this.request.hotels.find(h => h.id == id).status = selectedStatus;
        else if (filter == 'ancillary')
            this.request.ancillaries.find(a => a.id == id).status = selectedStatus;

        // when ready to submit, the submit button will enable
        this.checkStatusForSubmit(filter);
        this.submitDisabled = false;
    }

    checkStatusForSubmit(fliter: string): boolean {
        let approvalCount: number = 0;

        if (fliter == 'flight') {
            this.ApproveFlight = true;
        }

        if (fliter == 'hotel') {
            this.ApproveHotel = true;
        }

        if (fliter == 'ancillary') {
            this.ApproveAncillary = true;
        }

        return this.checkApproveStatusFromEmployee();
    }

    checkApproveStatusFromEmployee(): boolean {
        if (this.request.flights.length == 0) this.ApproveFlight = true;

        if (this.request.hotels.length == 0) this.ApproveHotel = true;

        if (this.request.ancillaries.length == 0) this.ApproveAncillary = true;

        if (this.ApproveFlight && this.ApproveHotel && this.ApproveAncillary) {
            return true;
        } else {
            return false;
        }
    }

    checkPaxModification(): boolean {
        let returnVal = false;

        // depend on booking number
        // if booking made, employee can't modify
        if (!this.bookingMade) {
            returnVal = true;
            this.submitDisabled = false;
        } else {
            returnVal = false;
            this.submitDisabled = true
        }
        return returnVal;
    }

    confirmRejectRequest() {
        this.modalConfirmation(
            'Confirm',
            this.r.confirm,
            this.r.confirmCancelRequest,
            this.r.no,
            this.r.yes
        );
    }

    rejectRequest() {
        this.httpClient
            .get(this.rejectRequestAPI.replace('{0}', this.requestId.toString()))
            .toPromise()
            .then(res => {
                this.modalMessage('Success', this.r.success, this.r.requestRejected);
                this.rejectDisabled = true;
            })
            .catch(e => {
                this.modalMessage('Error', this.r.errorHeader, 'Error ' + e);
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

    modalEdit(passenger): void {
        let dialogRef = this.dialog.open(EditComponent, {
            width: '650px',
            data: {
                firstName: passenger.firstName,
                middleName: passenger.middleName,
                lastName: passenger.lastName,
                DOB: moment(passenger.DOB).format('MM/DD/YYYY'),
                typeOfPass: passenger.typeOfPass,
                phoneNumber: passenger.phoneNumber,
                email: passenger.email
            },
            backdropClass: 'modal-backdrop-light',
            panelClass: 'modal--edit'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                passenger.firstName = result.firstName;
                passenger.middleName = result.middleName;
                passenger.lastName = result.lastName;
                passenger.DOB = moment(result.DOB, 'MM/DD/YYYY', true).format(
                    'YYYY-MM-DDT00:00:00'
                );
                passenger.phoneNumber = result.phoneNumber;
                passenger.email = result.email;

                this.checkPaxModification();
            }
        });
    }

    addFlight(): void {
        let dialogRef = this.dialog.open(AddFlightComponent, {
            width: '900px',
            data: {},
            backdropClass: 'modal-backdrop-light',
            panelClass: 'modal--edit'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let newFlight = result as Flight;
                newFlight.requestId = this.request.id;
                newFlight.status = StatusEnum.Pending;
                newFlight.approvalStatus = StatusEnum.Pending;
                newFlight.departDate = moment(
                    newFlight.departDate,
                    'MM/DD/YYYY'
                ).toDate();
                newFlight.returnDate = moment(
                    newFlight.returnDate,
                    'MM/DD/YYYY'
                ).toDate();
                this.request.flights.push(newFlight);
                this.newFlightsCount++;
                this.checkPaxModification();
            }
        });
    }

    addHotel(): void {
        let dialogRef = this.dialog.open(AddHotelComponent, {
            width: '900px',
            data: {},
            backdropClass: 'modal-backdrop-light',
            panelClass: 'modal--edit'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                let newHotel = result as Hotel;
                newHotel.requestId = this.request.id;
                newHotel.status = StatusEnum.Pending;
                newHotel.approvalStatus = StatusEnum.Pending;
                newHotel.checkInDate = moment(
                    newHotel.checkInDate,
                    'MM/DD/YYYY'
                ).toDate();
                this.request.hotels.push(newHotel);
                this.newHotelsCount++;
                this.checkPaxModification();
            }
        });
    }

    modalConfirmation(
        type: string,
        heading: string,
        message: string,
        cancel: string,
        confirm: string
    ): void {
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
            if (result && result == true) this.rejectRequest();
        });
    }
}
