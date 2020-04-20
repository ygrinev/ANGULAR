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
var router_1 = require("@angular/router");
var request_1 = require("../models/request");
var passenger_1 = require("../models/passenger");
var flight_1 = require("../models/flight");
var hotel_1 = require("../models/hotel");
var ancillary_1 = require("../models/ancillary");
var http_client_service_1 = require("../services/http-client/http-client.service");
var note_1 = require("../models/note");
var enums_1 = require("../models/enums");
var moment = require("moment");
var authentication_service_1 = require("../services/authentication/authentication.service");
var resources_service_1 = require("../services/resources/resources.service");
var modals_1 = require("../components/common/modals");
var dialog_1 = require("@angular/material/dialog");
var NewRequestComponent = /** @class */ (function () {
    function NewRequestComponent(dialog, httpClient, router, authenticationService, resourcesService) {
        var _this = this;
        this.dialog = dialog;
        this.httpClient = httpClient;
        this.router = router;
        this.authenticationService = authenticationService;
        this.resourcesService = resourcesService;
        this.dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        this.maxValueMask = [/\d/, /\d/];
        //flights endpoints
        this.gatewaysAPI = 'api/Resource/GetGatewayforBrandAsync?language={0}&brand=SWG';
        this.destinationsAPI = 'api/Resource/GetDestCode?language={0}&brand=SWG&gateway={1}&searchType=RE';
        //hotels endpoints
        this.svHotelDestinationsAPI = 'api/Resource/GetDestCode?language={0}&brand=SWG&gateway={1}';
        this.svHotelsAPI = 'api/Resource/GetSVHotelList?language={0}&brand=SWG&gateway=YYZ&destination={1}';
        this.r = {};
        this.subscription = this.authenticationService.getUserInfo().subscribe(function (userInfo) { _this.basicInfo = userInfo.basicInfo; });
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.typeOfPassArray = resourcesService.getTypeOfPasses();
            _this.initTypeOfPasses();
            _this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            _this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }
    NewRequestComponent.prototype.ngAfterViewInit = function () {
        this.flightEditMode = false;
        this.hotelEditMode = false;
    };
    NewRequestComponent.prototype.ngOnInit = function () {
        this.initLists();
        this.errorQueue = new Array();
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
            this.request = new request_1.Request();
            this.request.employeeNumber = this.resourcesService.getCookie('empNumber');
            this.initNotes();
            this.request.passengers[0].firstName = this.basicInfo.firstname;
            this.request.passengers[0].lastName = this.basicInfo.lastname;
        }
    };
    NewRequestComponent.prototype.initLists = function () {
        var _this = this;
        this.hotelDestinations = new Array();
        this.hotelDestinationsID = new Map();
        this.availableGateways = new Array();
        //load the list of available gateways
        this.httpClient.get(this.gatewaysAPI.replace('{0}', 'en'))
            .toPromise()
            .then(function (res) {
            var tempObjArr;
            tempObjArr = JSON.parse(res.json());
            tempObjArr.forEach(function (o) { return _this.availableGateways.push(o.name + ' ' + '(' + o.code + ')'); });
            _this.availableGateways.sort();
            _this.gatewaysListReady = true;
        });
        //load the list of available hotel destinations
        this.httpClient.get(this.svHotelDestinationsAPI.replace('{0}', 'en').replace('{1}', 'YYZ'))
            .toPromise()
            .then(function (res) {
            var tempObjArr;
            tempObjArr = JSON.parse(res.json());
            //foreach group
            tempObjArr.forEach(function (g) {
                //foreach destination in group
                g.destination.forEach(function (d) {
                    if (d.destName) {
                        _this.hotelDestinations.push(d.destName);
                        _this.hotelDestinationsID.set(d.destName, d.destCode);
                    }
                }); //end foreach destination in group
            }); //end foreach group
            _this.hotelDestinations.sort();
            _this.hotelDestinationsListReady = true;
        }); // end response
    };
    NewRequestComponent.prototype.initNotes = function () {
        this.passengerNote = new note_1.Note(this.request.employeeNumber, enums_1.NoteSectionEnum.Passengers, enums_1.NoteTypeEnum.Employee);
        this.flightNote = new note_1.Note(this.request.employeeNumber, enums_1.NoteSectionEnum.Flights, enums_1.NoteTypeEnum.Employee);
        this.hotelNote = new note_1.Note(this.request.employeeNumber, enums_1.NoteSectionEnum.Hotels, enums_1.NoteTypeEnum.Employee);
        this.ancillaryNote = new note_1.Note(this.request.employeeNumber, enums_1.NoteSectionEnum.Ancillaries, enums_1.NoteTypeEnum.Employee);
    };
    NewRequestComponent.prototype.initTypeOfPasses = function () {
        var ycpAvailable = 0;
        var bcpAvailable = 0;
        ycpAvailable = this.basicInfo.HowManyPassesYouHave - this.basicInfo.YearlyUsed - this.basicInfo.YealyPending;
        bcpAvailable = this.basicInfo.BonusEarned - this.basicInfo.BonusUsed - this.basicInfo.BonusPending;
        if (ycpAvailable <= 0) {
            for (var i = 0; i < this.typeOfPassArray.length; i++) {
                var a = this.typeOfPassArray[i];
                if (a.value == enums_1.TypeOfPassEnum.YCP)
                    this.typeOfPassArray.splice(i, 1);
            }
        }
        if (bcpAvailable <= 0) {
            for (var i = 0; i < this.typeOfPassArray.length; i++) {
                var a = this.typeOfPassArray[i];
                if (a.value == enums_1.TypeOfPassEnum.BCP)
                    this.typeOfPassArray.splice(i, 1);
            }
        }
    };
    NewRequestComponent.prototype.setNotes = function () {
        var _this = this;
        this.request.notes.forEach(function (n) {
            if (n.text && n.sectionId == enums_1.NoteSectionEnum.Passengers) {
                _this.addNote('passengerNote');
                _this.passengerNote = n;
            }
            if (n.text && n.sectionId == enums_1.NoteSectionEnum.Flights) {
                _this.addNote('flightNote');
                _this.flightNote = n;
            }
            if (n.text && n.sectionId == enums_1.NoteSectionEnum.Hotels) {
                _this.addNote('hotelNote');
                _this.hotelNote = n;
            }
            if (n.text && n.sectionId == enums_1.NoteSectionEnum.Ancillaries) {
                _this.addNote('ancillaryNote');
                _this.ancillaryNote = n;
            }
        });
    };
    NewRequestComponent.prototype.addNote = function (ancillaryProductId) {
        var ancillaryProduct = document.querySelector('#' + ancillaryProductId);
        var addNoteButton = ancillaryProduct.querySelector('.add-note');
        var ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');
        addNoteButton.classList.add('hidden');
        ancillaryNote.classList.remove('hidden');
    };
    NewRequestComponent.prototype.deleteNote = function (ancillaryProductId, noteModel) {
        var ancillaryProduct = document.querySelector('#' + ancillaryProductId);
        var addNoteButton = ancillaryProduct.querySelector('.add-note');
        var ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');
        // Clear out note message
        noteModel.text = '';
        addNoteButton.classList.remove('hidden');
        ancillaryNote.classList.add('hidden');
    };
    NewRequestComponent.prototype.addPassenger = function () {
        this.request.passengers.push(new passenger_1.Passenger(this.request.passengers.length + 1));
    };
    NewRequestComponent.prototype.deletePassenger = function (passengerIndex) {
        this.request.passengers.splice(passengerIndex, 1);
        this.rebuildPassengerNumbers();
    };
    NewRequestComponent.prototype.addFlight = function () {
        this.request.flights.push(new flight_1.Flight);
    };
    NewRequestComponent.prototype.deleteFlight = function (flightIndex) {
        this.request.flights.splice(flightIndex, 1);
    };
    NewRequestComponent.prototype.addHotel = function () {
        this.request.hotels.push(new hotel_1.Hotel);
    };
    NewRequestComponent.prototype.deleteHotel = function (hotelIndex) {
        this.request.hotels.splice(hotelIndex, 1);
    };
    NewRequestComponent.prototype.addAncillary = function () {
        this.request.ancillaries.push(new ancillary_1.Ancillary);
    };
    NewRequestComponent.prototype.deleteAncillary = function (ancillaryIndex) {
        this.request.ancillaries.splice(ancillaryIndex, 1);
    };
    NewRequestComponent.prototype.rebuildPassengerNumbers = function () {
        for (var i = 0; i < this.request.passengers.length; i++) {
            this.request.passengers[i].passengerNumber = i + 1;
        }
    };
    NewRequestComponent.prototype.productChange = function (product, ancillaryIndex) {
        if (product.toString() == '') {
            //nothing selected, reset the object
            this.request.ancillaries[ancillaryIndex] = new ancillary_1.Ancillary();
        }
        else {
            switch (Number(product)) {
                case enums_1.AncillaryProductEnum.Excursion:
                    //
                    break;
                case enums_1.AncillaryProductEnum.Transfer:
                    //
                    break;
                case enums_1.AncillaryProductEnum.Insurance:
                    //
                    break;
                default:
                //
            }
        }
    };
    NewRequestComponent.prototype.typeOfPassChanged = function (i) {
        if (!this.validateTypeOfPass()) {
            this.modalMessages('Error', this.r.errorHeader, this.errorQueue);
            this.errorQueue = new Array();
            // this.request.passengers[i].typeOfPass = null; //setting the value to null didn't work commenting for now
        }
    };
    NewRequestComponent.prototype.validateTypeOfPass = function () {
        var isValid = true;
        var ycpAvailable = this.basicInfo.HowManyPassesYouHave - this.basicInfo.YearlyUsed - this.basicInfo.YealyPending;
        var ycpSelected = 0;
        var bcpAvailable = this.basicInfo.BonusEarned - this.basicInfo.BonusUsed - this.basicInfo.BonusPending;
        var bcpSelected = 0;
        var lmcpSelected = 0;
        var wpSelected = 0;
        //iterate over the dropdown elements and count how many passes are selected
        this.request.passengers.forEach(function (p) {
            if (p.typeOfPass == enums_1.TypeOfPassEnum.YCP)
                ycpSelected++;
            if (p.typeOfPass == enums_1.TypeOfPassEnum.BCP)
                bcpSelected++;
            if (p.typeOfPass == enums_1.TypeOfPassEnum.LMCP)
                lmcpSelected++;
            if (p.typeOfPass == enums_1.TypeOfPassEnum.NONE)
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
            this.request.flights = new Array();
            this.flightsDisabled = true;
        }
        else {
            this.flightsDisabled = false;
        }
        return isValid;
    };
    NewRequestComponent.prototype.clearRequest = function () {
        //remove any saved data in the session
        sessionStorage.removeItem('currentRequest');
        //re-initialize the page for fresh start
        this.ngOnInit();
    };
    NewRequestComponent.prototype.goToReview = function () {
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
            this.errorQueue.splice(0, null, this.r.ERR_InvalidRequest);
            this.modalMessages('Error', this.r.errorHeader, this.errorQueue);
            this.errorQueue = new Array();
        }
    };
    //custom validation
    NewRequestComponent.prototype.validateForm = function () {
        var _this = this;
        var isValid = true;
        var isContactInfoValid = false;
        //allow 2 hotels per destination only
        if ((this.request.hotels.length > this.request.flights.length * 2 && this.request.flights.length != 0) || (this.request.hotels.length > 6 && this.request.flights.length == 0)) {
            isValid = false;
            this.errorQueue.push(this.r.ERR_HotelsCount);
        }
        //loop through the request and validate
        this.request.passengers.forEach(function (p) {
            //at least one passenger must have email and phone number
            if (p.email && p.phoneNumber)
                isContactInfoValid = true;
            //validate date fields
            if (p.DOB && !_this.validateDate(p.DOB, false, true))
                isValid = false;
        });
        this.request.flights.forEach(function (f) {
            //validate date fields
            if (!_this.validateDate(f.departDate, true, false) || !_this.validateDate(f.returnDate, true, false))
                isValid = false;
        });
        this.request.hotels.forEach(function (h) {
            //validate date fields
            if (!_this.validateDate(h.checkInDate, true, false))
                isValid = false;
        });
        this.request.ancillaries.forEach(function (a) {
            //validate date fields
            if (a.ancillaryProductType == enums_1.AncillaryProductEnum.Excursion) {
                if (!_this.validateDate(a.excursionDate, true, false))
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
        if (!this.validateTypeOfPass())
            isValid = false;
        return isValid;
    };
    NewRequestComponent.prototype.validateDate = function (valueEntered, futureDate, pastDate, throwError) {
        if (futureDate === void 0) { futureDate = false; }
        if (pastDate === void 0) { pastDate = false; }
        if (throwError === void 0) { throwError = false; }
        var dateValid = true;
        var tempMoment = moment(valueEntered, 'MM/DD/YYYY', true);
        if (tempMoment.isValid()) {
            var now = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });
            var diff = tempMoment.diff(now, 'days');
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
        if (this.errorQueue.length > 0 && throwError) {
            this.modalMessages('Error', this.r.errorHeader, this.errorQueue);
            this.errorQueue = new Array();
        }
        return dateValid;
    };
    NewRequestComponent.prototype.gatewayChanged = function (selectedValue, i) {
        var _this = this;
        var gateway;
        var tempObjArr;
        //disable destinations until the new list is ready
        this.destinationsListReady = false;
        //when editing request, the gateway change event will be fired as it will be reloaded from the session to be edited. Don't reset the departure value and set edit request = false to avoid this behaviour triggered again when the user actually edits the hotel destination.
        if (!this.flightEditMode)
            this.request.flights[i].departTo = '';
        //airport code
        gateway = selectedValue.substr(selectedValue.length - 4, 3);
        this.httpClient.get(this.destinationsAPI.replace('{0}', 'en').replace('{1}', gateway))
            .toPromise()
            .then(function (res) {
            _this.request.flights[i].availableDestinations = new Array();
            tempObjArr = JSON.parse(res.json());
            tempObjArr.forEach(function (d) {
                if (d.destinationName)
                    _this.request.flights[i].availableDestinations.push(d.destinationName);
            });
            _this.request.flights[i].availableDestinations.sort();
            _this.destinationsListReady = true;
        }); //end response
    };
    NewRequestComponent.prototype.hotelDestinationChanged = function (selectedValue, i) {
        var _this = this;
        //when editing request, the hotel destination change event will be fired as it will be reloaded from the session to be edited. Don't reset the available resorts and set edit request = false to avoid this behaviour triggered again when the user actually edits the hotel destination.
        if (!this.hotelEditMode) {
            this.request.hotels[i].name = '';
            //destination codes are comma separated, replace with underscore
            var destcode = this.hotelDestinationsID.get(selectedValue).replace(/,/g, '_');
            var tempObjArr_1;
            //disable the hotels list until it is ready and reset value
            this.hotelsListReady = false;
            //initiate the call to hotellist
            this.request.hotels[i].availableResorts = new Array();
            this.httpClient.get(this.svHotelsAPI.replace('{0}', 'en').replace('{1}', destcode))
                .toPromise()
                .then(function (res) {
                tempObjArr_1 = JSON.parse(res.json());
                tempObjArr_1[0].hotels.forEach(function (h) {
                    var idx = h.indexOf('--xx--');
                    var hotelName = h.substring(0, idx);
                    var hotelId = h.substring(idx + 6);
                    if (hotelName && hotelId.split('_').length == 1)
                        _this.request.hotels[i].availableResorts.push(hotelName);
                });
                _this.request.hotels[i].availableResorts.sort();
                _this.hotelsListReady = true;
            });
        }
    };
    NewRequestComponent.prototype.departToChanged = function (selectedValue, i) {
        this.request.flights[i].returnFrom = this.request.flights[i].departTo;
    };
    NewRequestComponent.prototype.modalMessage = function (type, heading, message) {
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
    NewRequestComponent.prototype.modalMessages = function (type, heading, messages) {
        var unique = Array.from(new Set(messages));
        var message = '';
        unique.forEach(function (m, i) {
            if (i != 0)
                message += '• ';
            message += m + '\n';
        });
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
    NewRequestComponent = __decorate([
        core_1.Component({
            selector: 'app-new-request',
            templateUrl: './new-request.component.html',
            styleUrls: ['./new-request.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, http_client_service_1.HttpClientService, router_1.Router, authentication_service_1.AuthenticationService, resources_service_1.ResourcesService])
    ], NewRequestComponent);
    return NewRequestComponent;
}());
exports.NewRequestComponent = NewRequestComponent;
//# sourceMappingURL=new-request.component.js.map