"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/toPromise");
var router_1 = require("@angular/router");
var http_client_service_1 = require("../services/http-client/http-client.service");
var request_1 = require("../models/request");
var enums_1 = require("../models/enums");
var moment = require("moment");
var authentication_service_1 = require("../services/authentication/authentication.service");
var resources_service_1 = require("../services/resources/resources.service");
var modals_1 = require("../components/common/modals");
var dialog_1 = require("@angular/material/dialog");
var confirmation_component_1 = require("../components/common/modals/confirmation/confirmation.component");
var add_flight_component_1 = require("../components/common/modals/add-flight/add-flight.component");
var add_hotel_component_1 = require("../components/common/modals/add-hotel/add-hotel.component");
var RequestProgressComponent = /** @class */ (function () {
    function RequestProgressComponent(dialog, httpClient, router, authenticationService, route, resourcesService) {
        var _this = this;
        this.dialog = dialog;
        this.httpClient = httpClient;
        this.router = router;
        this.authenticationService = authenticationService;
        this.route = route;
        this.resourcesService = resourcesService;
        this.TotalComponent = 0;
        this.TotalChange = 0;
        this.TotalBooking = 0;
        this.newFlightsCount = 0;
        this.newHotelsCount = 0;
        this.ApproveFlight = false;
        this.ApproveHotel = false;
        this.ApproveAncillary = false;
        this.bookingMade = false;
        this.rejectDisabled = true;
        this.submitDisabled = true;
        this.flightsDisabled = true;
        this.hotelsDisabled = true;
        this.statusEnum = enums_1.StatusEnum;
        this.typeOfPassEnum = enums_1.TypeOfPassEnum;
        this.ancillaryProductEnum = enums_1.AncillaryProductEnum;
        this.insuranceTypeEnum = enums_1.InsuranceTypeEnum;
        this.transferTypeEnum = enums_1.TransferTypeEnum;
        this.typeOfPassArray = new Array();
        this.ancillaryProductsArray = new Array();
        this.transferTypeArray = new Array();
        this.notePaxEmp = '';
        this.notePaxAdmin = '';
        this.noteFlightEmp = '';
        this.noteFlightAdmin = '';
        this.noteHotelEmp = '';
        this.noteHotelAdmin = '';
        this.noteAncEmp = '';
        this.noteAncAdmin = '';
        this.noteFlightPayload = '';
        this.dateMask = [
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
        this.rejectRequestAPI = 'api/Request/CancelMyRequest?id={0}';
        this.r = {};
        this.subscription = this.authenticationService
            .getUserInfo()
            .subscribe(function (userInfo) {
            _this.basicInfo = userInfo.basicInfo;
        });
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.typeOfPassArray = resourcesService.getTypeOfPasses();
            _this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            _this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }
    RequestProgressComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.flightStatus = 0;
        this.hotelStatus = 0;
        this.ancillariesStatus = 0;
        this.AmountArray = [''];
        this.TotalBooking = 0;
        this.TotalAmount = '0.00';
        this.request = new request_1.Request();
        this.requestId = this.route.snapshot.params['requestId'];
        var empNumber = this.resourcesService.getCookie('empNumber');
        if (!this.requestId) {
            this.router.navigate(['/home']);
            return;
        }
        this.httpClient
            .get('api/request/GetProgressDetail?Id=' + this.requestId)
            .toPromise()
            .then(function (res) {
            _this.request = JSON.parse(res.text());
            if (_this.request.flights.length == 0) {
                _this.flightStatus = -1;
            }
            else {
                // status checking - flight
                _this.request.flights.forEach(function (f) {
                    if (f.approvalStatus == enums_1.StatusEnum.Approved) {
                        _this.flightStatus = 1;
                    }
                    else {
                        f.price = 0;
                    }
                    if (f.status == enums_1.StatusEnum.Approved &&
                        f.approvalStatus == enums_1.StatusEnum.Approved) {
                        _this.TotalBooking += f.price;
                    }
                    // if at least one is denied, allow adding flights
                    if (f.approvalStatus === enums_1.StatusEnum.Denied)
                        _this.flightsDisabled = false;
                });
                _this.TotalComponent += 1;
            }
            if (_this.request.hotels.length == 0) {
                _this.hotelStatus = -1;
            }
            else {
                // status checking - hotel
                _this.request.hotels.forEach(function (h) {
                    if (h.approvalStatus == enums_1.StatusEnum.Approved) {
                        _this.hotelStatus = 1;
                    }
                    else {
                        h.price = 0;
                    }
                    if (h.status == enums_1.StatusEnum.Approved &&
                        h.approvalStatus == enums_1.StatusEnum.Approved) {
                        _this.TotalBooking += h.price;
                    }
                    // if at least one is denied, allow adding hotels
                    if (h.approvalStatus === enums_1.StatusEnum.Denied)
                        _this.hotelsDisabled = false;
                });
                _this.TotalComponent += 1;
            }
            if (_this.request.ancillaries != null) {
                if (_this.request.ancillaries.length != 0) {
                    if (!_this.request.ancillaries[0].destination) {
                        // this.request.ancillaries = null;
                        _this.ancillariesStatus = -1;
                    }
                    else {
                        // status checking - ancillary
                        _this.request.ancillaries.forEach(function (x) {
                            if (x.approvalStatus == 1) {
                                _this.ancillariesStatus = 1;
                            }
                            else {
                                x.price = 0;
                            }
                            if (x.status == 1 && x.approvalStatus == 1) {
                                _this.TotalBooking += x.price;
                            }
                        });
                        _this.TotalComponent += 1;
                    }
                }
            }
            _this.request.notes.forEach(function (x) {
                if (x.sectionId == enums_1.NoteSectionEnum.Passengers &&
                    x.typeId == enums_1.NoteTypeEnum.Employee) {
                    _this.notePaxEmp = x.text;
                }
                else if (x.sectionId == enums_1.NoteSectionEnum.Passengers &&
                    x.typeId == enums_1.NoteTypeEnum.Admin) {
                    _this.notePaxAdmin = x.text;
                }
                else if (x.sectionId == enums_1.NoteSectionEnum.Flights &&
                    x.typeId == enums_1.NoteTypeEnum.Employee) {
                    _this.noteFlightEmp = x.text;
                }
                else if (x.sectionId == enums_1.NoteSectionEnum.Flights &&
                    x.typeId == enums_1.NoteTypeEnum.Admin) {
                    _this.noteFlightAdmin = x.text;
                }
                else if (x.sectionId == enums_1.NoteSectionEnum.Flights &&
                    x.typeId == enums_1.NoteTypeEnum.Payload) {
                    _this.noteFlightPayload = x.text;
                }
                else if (x.sectionId == enums_1.NoteSectionEnum.Hotels &&
                    x.typeId == enums_1.NoteTypeEnum.Employee) {
                    _this.noteHotelEmp = x.text;
                }
                else if (x.sectionId == enums_1.NoteSectionEnum.Hotels &&
                    x.typeId == enums_1.NoteTypeEnum.Admin) {
                    _this.noteHotelAdmin = x.text;
                }
                else if (x.sectionId == enums_1.NoteSectionEnum.Ancillaries &&
                    x.typeId == enums_1.NoteTypeEnum.Employee) {
                    _this.noteAncEmp = x.text;
                }
                else if (x.sectionId == enums_1.NoteSectionEnum.Ancillaries &&
                    x.typeId == enums_1.NoteTypeEnum.Admin) {
                    _this.noteAncAdmin = x.text;
                }
            });
            if (_this.request.bookingNumber != null)
                _this.BookingNumber = _this.request.bookingNumber.toString();
            // when booking is made
            if (_this.BookingNumber != null) {
                _this.bookingMade = true;
                _this.TotalAmount = _this.TotalBooking.toFixed(2);
            }
            if (_this.request.status != enums_1.StatusEnum.Denied)
                _this.rejectDisabled = false;
            // console.log(this.request.flights);
        })
            .catch(function (e) {
            console.log('error ' + e);
            _this.router.navigate(['/home']);
            return;
        });
        this.submitDisabled = true;
    };
    RequestProgressComponent.prototype.isEmptyObject = function (obj) {
        // console.log(obj);
        return obj && Object.keys(obj).length === 0;
    };
    RequestProgressComponent.prototype.requestSubmit = function () {
        var _this = this;
        console.log(this.checkApproveStatusFromEmployee());
        console.log(this.checkPaxModification());
        if (this.checkApproveStatusFromEmployee() || this.checkPaxModification()) {
            // ok to submit
            // console.log(this.request.flights);
            this.httpClient
                .post('api/request/UpdateApprovalFromEmployee', this.request)
                .toPromise()
                .then(function (res) {
                _this.modalMessage('Success', _this.r.success, _this.r.bookingRequestReceived);
                _this.ngOnInit(); // force refresh
            })
                .catch(function (e) {
                console.log('error ' + e);
                _this.modalMessage('Error', _this.r.errorHeader, _this.r.ERR_TryAgain);
            });
        }
        else {
            this.modalMessage('Error', this.r.errorHeader, this.r.ERR_ApprovalRequired);
        }
    };
    RequestProgressComponent.prototype.statusChange = function (selectedStatus, price, id, filter) {
        var plusminus = '';
        var str = filter + '|' + id + '|' + price;
        if (selectedStatus == enums_1.StatusEnum.Approved) {
            if (this.AmountArray.indexOf(str) == -1) {
                this.AmountArray.push(str);
                this.TotalAmount = (parseFloat(this.TotalAmount) + price).toFixed(2);
            }
        }
        else {
            if (this.AmountArray.indexOf(str) > -1) {
                this.AmountArray.splice(this.AmountArray.indexOf(str), 1);
                this.TotalAmount = (parseFloat(this.TotalAmount) - price).toFixed(2);
            }
        }
        // update status
        if (filter == 'flight') {
            var approvalAlreadyExist = false;
            var indexOfChanged = 0;
            // make sure none have been approved before
            if (selectedStatus == enums_1.StatusEnum.Approved) {
                for (var i = 0; i < this.request.flights.length; i++) {
                    if (this.request.flights[i].status == enums_1.StatusEnum.Approved) {
                        approvalAlreadyExist = true;
                        indexOfChanged = i;
                        break;
                    }
                }
            }
            this.request.flights.find(function (f) { return f.id == id; }).status = selectedStatus;
            // reverse the status of any previous approval
            if (approvalAlreadyExist)
                this.request.flights[indexOfChanged].status = enums_1.StatusEnum.Pending;
        }
        else if (filter == 'hotel')
            this.request.hotels.find(function (h) { return h.id == id; }).status = selectedStatus;
        else if (filter == 'ancillary')
            this.request.ancillaries.find(function (a) { return a.id == id; }).status = selectedStatus;
        // when ready to submit, the submit button will enable
        this.checkStatusForSubmit(filter);
        this.submitDisabled = false;
    };
    RequestProgressComponent.prototype.checkStatusForSubmit = function (fliter) {
        var approvalCount = 0;
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
    };
    RequestProgressComponent.prototype.checkApproveStatusFromEmployee = function () {
        if (this.request.flights.length == 0)
            this.ApproveFlight = true;
        if (this.request.hotels.length == 0)
            this.ApproveHotel = true;
        if (this.request.ancillaries.length == 0)
            this.ApproveAncillary = true;
        if (this.ApproveFlight && this.ApproveHotel && this.ApproveAncillary) {
            return true;
        }
        else {
            return false;
        }
    };
    RequestProgressComponent.prototype.checkPaxModification = function () {
        var returnVal = false;
        // depend on booking number
        // if booking made, employee can't modify
        if (!this.bookingMade) {
            returnVal = true;
            this.submitDisabled = false;
        }
        else {
            returnVal = false;
            this.submitDisabled = true;
        }
        return returnVal;
    };
    RequestProgressComponent.prototype.confirmRejectRequest = function () {
        this.modalConfirmation('Confirm', this.r.confirm, this.r.confirmCancelRequest, this.r.no, this.r.yes);
    };
    RequestProgressComponent.prototype.rejectRequest = function () {
        var _this = this;
        this.httpClient
            .get(this.rejectRequestAPI.replace('{0}', this.requestId.toString()))
            .toPromise()
            .then(function (res) {
            _this.modalMessage('Success', _this.r.success, _this.r.requestRejected);
            _this.rejectDisabled = true;
        })
            .catch(function (e) {
            _this.modalMessage('Error', _this.r.errorHeader, 'Error ' + e);
        });
    };
    RequestProgressComponent.prototype.modalMessage = function (type, heading, message) {
        var dialogRef = this.dialog.open(modals_1.MessageComponent, {
            width: '650px',
            data: {
                type: type.toLowerCase(),
                heading: heading,
                message: message
            },
            backdropClass: 'modal-backdrop-light',
            panelClass: 'modal--message-' + type.toLowerCase()
        });
    };
    RequestProgressComponent.prototype.modalEdit = function (passenger) {
        var _this = this;
        var dialogRef = this.dialog.open(modals_1.EditComponent, {
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
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                passenger.firstName = result.firstName;
                passenger.middleName = result.middleName;
                passenger.lastName = result.lastName;
                passenger.DOB = moment(result.DOB, 'MM/DD/YYYY', true).format('YYYY-MM-DDT00:00:00');
                passenger.phoneNumber = result.phoneNumber;
                passenger.email = result.email;
                _this.checkPaxModification();
            }
        });
    };
    RequestProgressComponent.prototype.addFlight = function () {
        var _this = this;
        var dialogRef = this.dialog.open(add_flight_component_1.AddFlightComponent, {
            width: '900px',
            data: {},
            backdropClass: 'modal-backdrop-light',
            panelClass: 'modal--edit'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var newFlight = result;
                newFlight.requestId = _this.request.id;
                newFlight.status = enums_1.StatusEnum.Pending;
                newFlight.approvalStatus = enums_1.StatusEnum.Pending;
                newFlight.departDate = moment(newFlight.departDate, 'MM/DD/YYYY').toDate();
                newFlight.returnDate = moment(newFlight.returnDate, 'MM/DD/YYYY').toDate();
                _this.request.flights.push(newFlight);
                _this.newFlightsCount++;
                _this.checkPaxModification();
            }
        });
    };
    RequestProgressComponent.prototype.addHotel = function () {
        var _this = this;
        var dialogRef = this.dialog.open(add_hotel_component_1.AddHotelComponent, {
            width: '900px',
            data: {},
            backdropClass: 'modal-backdrop-light',
            panelClass: 'modal--edit'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result !== undefined) {
                var newHotel = result;
                newHotel.requestId = _this.request.id;
                newHotel.status = enums_1.StatusEnum.Pending;
                newHotel.approvalStatus = enums_1.StatusEnum.Pending;
                newHotel.checkInDate = moment(newHotel.checkInDate, 'MM/DD/YYYY').toDate();
                _this.request.hotels.push(newHotel);
                _this.newHotelsCount++;
                _this.checkPaxModification();
            }
        });
    };
    RequestProgressComponent.prototype.modalConfirmation = function (type, heading, message, cancel, confirm) {
        var _this = this;
        var dialogRef = this.dialog.open(confirmation_component_1.ConfirmationComponent, {
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
        dialogRef.afterClosed().subscribe(function (result) {
            if (result && result == true)
                _this.rejectRequest();
        });
    };
    RequestProgressComponent = __decorate([
        core_1.Component({
            selector: 'app-request-progress',
            templateUrl: './request-progress.component.html',
            styleUrls: ['./request-progress.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog,
            http_client_service_1.HttpClientService,
            router_1.Router,
            authentication_service_1.AuthenticationService,
            router_1.ActivatedRoute,
            resources_service_1.ResourcesService])
    ], RequestProgressComponent);
    return RequestProgressComponent;
}());
exports.RequestProgressComponent = RequestProgressComponent;
//# sourceMappingURL=request-progress.component.js.map