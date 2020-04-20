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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var request_1 = require("../models/request");
var enums_1 = require("../models/enums");
var note_1 = require("../models/note");
var http_client_service_1 = require("../services/http-client/http-client.service");
var authentication_service_1 = require("../services/authentication/authentication.service");
require("rxjs/add/operator/toPromise");
var resources_service_1 = require("../services/resources/resources.service");
var modals_1 = require("../components/common/modals");
var dialog_1 = require("@angular/material/dialog");
var PayloadReviewComponent = /** @class */ (function () {
    function PayloadReviewComponent(dialog, httpClient, route, router, authenticationService, resourcesService) {
        var _this = this;
        this.dialog = dialog;
        this.httpClient = httpClient;
        this.route = route;
        this.router = router;
        this.authenticationService = authenticationService;
        this.resourcesService = resourcesService;
        this.reviewType = 'payload';
        this.payloadListAPI = 'api/Request/GetFlightsByRequestId?id={0}';
        this.updateFlightsAPI = 'api/Request/UpdateFlights';
        this.addNoteAPI = 'api/Request/AddNote';
        this.statusEnum = enums_1.StatusEnum;
        this.statusArray = [];
        this.r = {};
        this.subscription = this.authenticationService.getUserInfo().subscribe(function (userInfo) { _this.userInfo = userInfo; });
        resourcesService.getResources().subscribe(function (res) { return _this.r = res; });
    }
    PayloadReviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.empNumber = this.resourcesService.getCookie('empNumber');
        this.changesDisabled = false;
        this.route.params.subscribe(function (params) {
            window.scrollTo(0, 0);
            _this.request = new request_1.Request();
            _this.initNotes();
            _this.requestId = _this.route.snapshot.params['requestId'];
            if (!_this.requestId) {
                _this.modalMessage('Error', _this.r.errorHeader, _this.r.ERR_InvalidRequestId);
                _this.router.navigate(['/home']);
                return;
            }
            else {
                _this.init(params['requestId']);
            }
        });
    };
    PayloadReviewComponent.prototype.init = function (id) {
        var _this = this;
        this.httpClient.get(this.payloadListAPI.replace('{0}', id))
            .toPromise()
            .then(function (res) {
            if (res.json()) {
                _this.request = res.json();
                _this.setNotes();
                _this.setNumOfPass();
                _this.setLastUpdatedBy();
                if (_this.request.status == _this.statusEnum.Denied)
                    _this.changesDisabled = true;
            }
        })
            .catch(function (e) {
            console.log('error ' + e);
        });
    };
    PayloadReviewComponent.prototype.initNotes = function () {
        this.payloadFlightNote = new note_1.Note(this.empNumber, enums_1.NoteSectionEnum.Flights, enums_1.NoteTypeEnum.Payload);
        this.employeeFlightNote = new note_1.Note('', enums_1.NoteSectionEnum.Flights, enums_1.NoteTypeEnum.Employee);
    };
    PayloadReviewComponent.prototype.setNotes = function () {
        var _this = this;
        this.request.notes.forEach(function (n) {
            if (n.text && n.sectionId == enums_1.NoteSectionEnum.Flights && n.typeId == enums_1.NoteTypeEnum.Employee) {
                _this.employeeFlightNote = n;
            }
            if (n.text && n.sectionId == enums_1.NoteSectionEnum.Flights && n.typeId == enums_1.NoteTypeEnum.Payload) {
                _this.addNote('flightNote');
                _this.payloadFlightNote = n;
            }
        });
    };
    PayloadReviewComponent.prototype.setNumOfPass = function () {
        var ycpUsed = 0;
        var bcpUsed = 0;
        var lmcpUsed = 0;
        var ipUsed = 0;
        var numOfPassTemplate = '{0} ({1})';
        this.numOfPass = '';
        this.request.passengers.forEach(function (p) {
            if (p.typeOfPass == enums_1.TypeOfPassEnum.YCP)
                ycpUsed++;
            if (p.typeOfPass == enums_1.TypeOfPassEnum.BCP)
                bcpUsed++;
            if (p.typeOfPass == enums_1.TypeOfPassEnum.LMCP)
                lmcpUsed++;
            if (p.typeOfPass == enums_1.TypeOfPassEnum.IP)
                ipUsed++;
        });
        if (ycpUsed > 0)
            this.numOfPass = numOfPassTemplate.replace('{0}', this.r['typeOfPassAbbrev' + enums_1.TypeOfPassEnum.YCP]).replace('{1}', ycpUsed.toString()) + ' ';
        if (bcpUsed > 0)
            this.numOfPass += numOfPassTemplate.replace('{0}', this.r['typeOfPassAbbrev' + enums_1.TypeOfPassEnum.BCP]).replace('{1}', bcpUsed.toString()) + ' ';
        if (lmcpUsed > 0)
            this.numOfPass += numOfPassTemplate.replace('{0}', this.r['typeOfPassAbbrev' + enums_1.TypeOfPassEnum.LMCP]).replace('{1}', lmcpUsed.toString());
        if (ipUsed > 0)
            this.numOfPass += numOfPassTemplate.replace('{0}', this.r['typeOfPassAbbrev' + enums_1.TypeOfPassEnum.IP]).replace('{1}', ipUsed.toString());
    };
    PayloadReviewComponent.prototype.setLastUpdatedBy = function () {
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
    PayloadReviewComponent.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //save flights
                    return [4 /*yield*/, this.httpClient.post(this.updateFlightsAPI, this.request.flights)
                            .toPromise()
                            .then(function (res) {
                            _this.modalMessage('Success', _this.r.success, _this.r.flightUpdated);
                        })
                            .catch(function (e) {
                            _this.modalMessage('Error', _this.r.errorHeader, 'error ' + e);
                        })];
                    case 1:
                        //save flights
                        _a.sent();
                        if (!this.payloadFlightNote.text) return [3 /*break*/, 3];
                        //safety net
                        this.payloadFlightNote.requestId = Number(this.requestId);
                        return [4 /*yield*/, this.httpClient.post(this.addNoteAPI, this.payloadFlightNote)
                                .toPromise()
                                .then()
                                .catch(function (e) {
                                _this.modalMessage('Error', _this.r.errorHeader, 'error ' + e);
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.init(this.requestId); //force refresh
                        return [2 /*return*/];
                }
            });
        });
    };
    PayloadReviewComponent.prototype.addNote = function (ancillaryProductId) {
        var ancillaryProduct = document.querySelector('#' + ancillaryProductId);
        var addNoteButton = ancillaryProduct.querySelector('.add-note');
        var ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');
        addNoteButton.classList.add('hidden');
        ancillaryNote.classList.remove('hidden');
    };
    PayloadReviewComponent.prototype.deleteNote = function (ancillaryProductId, noteModel) {
        var ancillaryProduct = document.querySelector('#' + ancillaryProductId);
        var addNoteButton = ancillaryProduct.querySelector('.add-note');
        var ancillaryNote = ancillaryProduct.querySelector('.ancillary-note');
        // Clear out note message
        noteModel.text = '';
        addNoteButton.classList.remove('hidden');
        ancillaryNote.classList.add('hidden');
    };
    PayloadReviewComponent.prototype.modalMessage = function (type, heading, message) {
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
    PayloadReviewComponent = __decorate([
        core_1.Component({
            selector: 'app-payload-review',
            templateUrl: './payload-review.component.html',
            styleUrls: ['./payload-review.component.scss']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, http_client_service_1.HttpClientService, router_1.ActivatedRoute, router_1.Router, authentication_service_1.AuthenticationService, resources_service_1.ResourcesService])
    ], PayloadReviewComponent);
    return PayloadReviewComponent;
}());
exports.PayloadReviewComponent = PayloadReviewComponent;
//# sourceMappingURL=payload-review.component.js.map