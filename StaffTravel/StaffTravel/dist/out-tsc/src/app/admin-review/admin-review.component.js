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
var enums_1 = require("../models/enums");
var note_1 = require("../models/note");
var http_client_service_1 = require("../services/http-client/http-client.service");
var resources_service_1 = require("../services/resources/resources.service");
var modals_1 = require("../components/common/modals");
var dialog_1 = require("@angular/material/dialog");
var confirmation_component_1 = require("../components/common/modals/confirmation/confirmation.component");
var AdminReviewComponent = /** @class */ (function () {
    function AdminReviewComponent(dialog, httpClient, route, router, resourcesService) {
        var _this = this;
        this.dialog = dialog;
        this.httpClient = httpClient;
        this.route = route;
        this.router = router;
        this.resourcesService = resourcesService;
        this.reviewType = 'admin';
        this.statusEnum = enums_1.StatusEnum;
        this.ancillaryProductEnum = enums_1.AncillaryProductEnum;
        this.transferTypeEnum = enums_1.TransferTypeEnum;
        this.statusArray = [];
        this.typeOfPassArray = new Array();
        this.ancillaryProductsArray = new Array();
        this.transferTypeArray = new Array();
        this.requestAPI = 'api/Request/GetRequestDetails?id={0}';
        this.rejectRequestAPI = 'api/Request/RejectRequest?id={0}';
        this.bookingMade = false;
        this.rejectMade = false;
        this.updateRequestAPI = 'api/Request/UpdateRequest';
        this.r = {};
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.typeOfPassArray = resourcesService.getTypeOfPasses();
            _this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            _this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }
    AdminReviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        var empNumber = this.resourcesService.getCookie('empNumber');
        this.route.params.subscribe(function (params) {
            window.scrollTo(0, 0);
            _this.request = new request_1.Request();
            _this.statusArray = Object.keys(_this.statusEnum).filter(function (i) { return !isNaN(Number(i)); });
            _this.employeePassengerNote = new note_1.Note('', enums_1.NoteSectionEnum.Passengers, enums_1.NoteTypeEnum.Employee);
            _this.employeeFlightNote = new note_1.Note('', enums_1.NoteSectionEnum.Flights, enums_1.NoteTypeEnum.Employee);
            _this.employeeHotelNote = new note_1.Note('', enums_1.NoteSectionEnum.Hotels, enums_1.NoteTypeEnum.Employee);
            _this.employeeAncillaryNote = new note_1.Note('', enums_1.NoteSectionEnum.Ancillaries, enums_1.NoteTypeEnum.Employee);
            _this.adminPassengerNote = new note_1.Note(empNumber, enums_1.NoteSectionEnum.Passengers, enums_1.NoteTypeEnum.Admin);
            _this.adminFlightNote = new note_1.Note(empNumber, enums_1.NoteSectionEnum.Flights, enums_1.NoteTypeEnum.Admin);
            _this.adminHotelNote = new note_1.Note(empNumber, enums_1.NoteSectionEnum.Hotels, enums_1.NoteTypeEnum.Admin);
            _this.adminAncillaryNote = new note_1.Note(empNumber, enums_1.NoteSectionEnum.Ancillaries, enums_1.NoteTypeEnum.Admin);
            _this.adminBookingNote = new note_1.Note(empNumber, enums_1.NoteSectionEnum.Booking, enums_1.NoteTypeEnum.Admin);
            _this.payloadFlightNote = new note_1.Note('', enums_1.NoteSectionEnum.Flights, enums_1.NoteTypeEnum.Payload);
            _this.requestId = _this.route.snapshot.params['requestId'];
            if (!_this.requestId) {
                _this.modalMessage('Error', _this.r.errorHeader, _this.r.ERR_InvalidRequestId);
                _this.router.navigate(['/home']);
                return;
            }
            // Hide all admin notes by default
            _this.initNote('passengerNote');
            _this.initNote('flightNote');
            _this.initNote('hotelNote');
            _this.initNote('ancillaryNote');
            _this.initRequest();
        });
    };
    AdminReviewComponent.prototype.initRequest = function () {
        var _this = this;
        this.httpClient.get(this.requestAPI.replace('{0}', this.requestId))
            .toPromise()
            .then(function (res) {
            _this.request = JSON.parse(res.text());
            if (_this.request.bookingNumber != null)
                _this.bookingMade = true;
            else
                _this.bookingMade = false;
            if (_this.request.status == enums_1.StatusEnum.Denied)
                _this.rejectMade = true;
            else
                _this.rejectMade = false;
            _this.request.notes.forEach(function (n) {
                //employee notes
                if (n.sectionId == enums_1.NoteSectionEnum.Passengers && n.typeId == enums_1.NoteTypeEnum.Employee)
                    _this.employeePassengerNote = n;
                if (n.sectionId == enums_1.NoteSectionEnum.Flights && n.typeId == enums_1.NoteTypeEnum.Employee)
                    _this.employeeFlightNote = n;
                if (n.sectionId == enums_1.NoteSectionEnum.Hotels && n.typeId == enums_1.NoteTypeEnum.Employee)
                    _this.employeeHotelNote = n;
                if (n.sectionId == enums_1.NoteSectionEnum.Ancillaries && n.typeId == enums_1.NoteTypeEnum.Employee)
                    _this.employeeAncillaryNote = n;
                //admin notes
                if (n.sectionId == enums_1.NoteSectionEnum.Passengers && n.typeId == enums_1.NoteTypeEnum.Admin) {
                    _this.adminPassengerNote = n;
                    _this.addNote('passengerNote');
                }
                if (n.sectionId == enums_1.NoteSectionEnum.Flights && n.typeId == enums_1.NoteTypeEnum.Admin) {
                    _this.adminFlightNote = n;
                    _this.addNote('flightNote');
                }
                if (n.sectionId == enums_1.NoteSectionEnum.Hotels && n.typeId == enums_1.NoteTypeEnum.Admin) {
                    _this.adminHotelNote = n;
                    _this.addNote('hotelNote');
                }
                if (n.sectionId == enums_1.NoteSectionEnum.Ancillaries && n.typeId == enums_1.NoteTypeEnum.Admin) {
                    _this.adminAncillaryNote = n;
                    _this.addNote('ancillaryNote');
                }
                if (n.sectionId == enums_1.NoteSectionEnum.Booking && n.typeId == enums_1.NoteTypeEnum.Admin)
                    _this.adminBookingNote = n;
                //payload notes    
                if (n.sectionId == enums_1.NoteSectionEnum.Flights && n.typeId == enums_1.NoteTypeEnum.Payload)
                    _this.payloadFlightNote = n;
            });
            _this.setLastUpdatedBy();
        })
            .catch(function (e) {
            console.log('error ' + e);
            _this.router.navigate(['/home']);
            return;
        });
    };
    AdminReviewComponent.prototype.setLastUpdatedBy = function () {
        var _this = this;
        this.request.flights.forEach(function (f) {
            for (var i = 0; i < _this.request.activityLogs.length; i++) {
                if (f.id == _this.request.activityLogs[i].foreignId) {
                    f.lastUpdatedBy = _this.request.activityLogs[i].empName;
                    break;
                }
            }
        });
    };
    // Init note by hiding it by default (used for route changes which requests that had notes openned from last request)
    AdminReviewComponent.prototype.initNote = function (ancillaryProductId) {
        var ancillaryProduct = document.querySelector('#' + ancillaryProductId);
        var addNoteButton = ancillaryProduct.querySelector('.add-note');
        var ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');
        addNoteButton.classList.remove('hidden');
        ancillaryNote.classList.add('hidden');
    };
    AdminReviewComponent.prototype.addNote = function (ancillaryProductId) {
        var ancillaryProduct = document.querySelector('#' + ancillaryProductId);
        var addNoteButton = ancillaryProduct.querySelector('.add-note');
        var ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');
        addNoteButton.classList.add('hidden');
        ancillaryNote.classList.remove('hidden');
    };
    AdminReviewComponent.prototype.deleteNote = function (ancillaryProductId, noteModel) {
        var ancillaryProduct = document.querySelector('#' + ancillaryProductId);
        var addNoteButton = ancillaryProduct.querySelector('.add-note');
        var ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');
        // Clear out note message
        noteModel.text = '';
        addNoteButton.classList.remove('hidden');
        ancillaryNote.classList.add('hidden');
    };
    AdminReviewComponent.prototype.updateRequest = function () {
        var _this = this;
        this.setNotes();
        this.httpClient.post(this.updateRequestAPI, this.request)
            .toPromise()
            .then(function (res) {
            _this.modalMessage('Success', _this.r.success, _this.r.bookingUpdated);
            _this.bookingMade = true;
            _this.ngOnInit(); //force refresh
        })
            .catch(function (e) {
            _this.modalMessage('Error', _this.r.errorHeader, 'Error ' + e);
        });
    };
    AdminReviewComponent.prototype.confirmRejectRequest = function () {
        this.modalConfirmation('Confirm', this.r.confirm, this.r.confirmCancelRequest, this.r.no, this.r.yes);
    };
    AdminReviewComponent.prototype.rejectRequest = function () {
        var _this = this;
        this.httpClient.get(this.rejectRequestAPI.replace('{0}', this.requestId))
            .toPromise()
            .then(function (res) {
            _this.modalMessage('Success', _this.r.success, _this.r.requestRejected);
            //update the status on the page
            _this.initRequest();
        })
            .catch(function (e) {
            _this.modalMessage('Error', _this.r.errorHeader, 'Error ' + e);
        });
    };
    AdminReviewComponent.prototype.setNotes = function () {
        //clear the array to make sure the added notes are the only ones affected with the update
        this.request.notes = new Array();
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
    };
    AdminReviewComponent.prototype.modalMessage = function (type, heading, message) {
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
    AdminReviewComponent.prototype.modalConfirmation = function (type, heading, message, cancel, confirm) {
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
    AdminReviewComponent = __decorate([
        core_1.Component({
            selector: 'app-admin-review',
            templateUrl: './admin-review.component.html',
            styleUrls: ['./admin-review.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, http_client_service_1.HttpClientService, router_1.ActivatedRoute, router_1.Router, resources_service_1.ResourcesService])
    ], AdminReviewComponent);
    return AdminReviewComponent;
}());
exports.AdminReviewComponent = AdminReviewComponent;
//# sourceMappingURL=admin-review.component.js.map