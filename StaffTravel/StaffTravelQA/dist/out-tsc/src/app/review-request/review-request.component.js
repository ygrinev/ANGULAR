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
var http_client_service_1 = require("../services/http-client/http-client.service");
var enums_1 = require("../models/enums");
var note_1 = require("../models/note");
var enums_2 = require("../models/enums");
var resources_service_1 = require("../services/resources/resources.service");
var modals_1 = require("../components/common/modals");
var dialog_1 = require("@angular/material/dialog");
var ReviewRequestComponent = /** @class */ (function () {
    function ReviewRequestComponent(dialog, router, httpClient, resourcesService) {
        var _this = this;
        this.dialog = dialog;
        this.router = router;
        this.httpClient = httpClient;
        this.resourcesService = resourcesService;
        this.passengerNote = new note_1.Note('', enums_2.NoteSectionEnum.Passengers, enums_2.NoteTypeEnum.Employee);
        this.flightNote = new note_1.Note('', enums_2.NoteSectionEnum.Passengers, enums_2.NoteTypeEnum.Employee);
        this.hotelNote = new note_1.Note('', enums_2.NoteSectionEnum.Passengers, enums_2.NoteTypeEnum.Employee);
        this.ancillaryNote = new note_1.Note('', enums_2.NoteSectionEnum.Passengers, enums_2.NoteTypeEnum.Employee);
        this.ancillaryProductEnum = enums_1.AncillaryProductEnum;
        this.transferTypeEnum = enums_1.TransferTypeEnum;
        this.typeOfPassArray = new Array();
        this.ancillaryProductsArray = new Array();
        this.transferTypeArray = new Array();
        this.createNewRequestAPI = 'api/Request/CreateNewRequest';
        this.basicInfoAPI = 'api/passesInfo/getbasicinfobyemployeenumber?empNumber={0}';
        this.r = {};
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.typeOfPassArray = resourcesService.getTypeOfPasses();
            _this.ancillaryProductsArray = resourcesService.getAncillaryProducts();
            _this.transferTypeArray = resourcesService.getTransferTypes();
        });
    }
    ReviewRequestComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.request = new request_1.Request();
        if (sessionStorage.getItem('currentRequest')) {
            this.request = JSON.parse(sessionStorage.getItem('currentRequest'));
            this.request.notes.forEach(function (n) {
                if (n.sectionId == enums_2.NoteSectionEnum.Passengers)
                    _this.passengerNote = n;
                if (n.sectionId == enums_2.NoteSectionEnum.Flights)
                    _this.flightNote = n;
                if (n.sectionId == enums_2.NoteSectionEnum.Hotels)
                    _this.hotelNote = n;
                if (n.sectionId == enums_2.NoteSectionEnum.Ancillaries)
                    _this.ancillaryNote = n;
            });
            this.submitBtnReady = true;
        }
        else {
            this.modalMessage('Error', this.r.errorHeader, this.r.ERR_RequestNotFound);
            this.router.navigate(['/new-request']);
        }
    };
    ReviewRequestComponent.prototype.editRequest = function () {
        //return to new-request to edit this request
        this.router.navigate(['/new-request']);
    };
    ReviewRequestComponent.prototype.submitRequest = function () {
        var _this = this;
        this.submitBtnReady = false;
        //http post the request
        this.httpClient.post(this.createNewRequestAPI, this.request)
            .toPromise()
            .then(function (res) {
            _this.modalMessage('Success', _this.r.success, _this.r.requestAddedSuccessfully);
            //remove the request from the session
            sessionStorage.removeItem('currentRequest');
            _this.httpClient.get(_this.basicInfoAPI.replace('{0}', _this.request.employeeNumber))
                .toPromise()
                .then(function (res) {
                _this.resourcesService.setCookie('basicInfo', res.json(), 14);
                //redirect to my-requests page
                _this.router.navigate(['/my-requests']);
            });
        })
            .catch(function (err) {
            _this.modalMessage('Error', _this.r.errorHeader, _this.r.ERR_RequestFailed + ' ' + err.json().Message);
            _this.submitBtnReady = true;
        });
    };
    ReviewRequestComponent.prototype.modalMessage = function (type, heading, message) {
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
    ReviewRequestComponent = __decorate([
        core_1.Component({
            selector: 'app-review-request',
            templateUrl: './review-request.component.html',
            styleUrls: ['./review-request.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, router_1.Router, http_client_service_1.HttpClientService, resources_service_1.ResourcesService])
    ], ReviewRequestComponent);
    return ReviewRequestComponent;
}());
exports.ReviewRequestComponent = ReviewRequestComponent;
//# sourceMappingURL=review-request.component.js.map