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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var enums_1 = require("../../../../models/enums");
var moment = require("moment");
var dialog_1 = require("@angular/material/dialog");
var resources_service_1 = require("../../../../services/resources/resources.service");
var EditComponent = /** @class */ (function () {
    function EditComponent(dialogRef, data, resourcesService) {
        var _this = this;
        this.dialogRef = dialogRef;
        this.data = data;
        this.resourcesService = resourcesService;
        this.dateValid = true;
        this.r = {};
        this.typeOfPassEnum = enums_1.TypeOfPassEnum;
        this.dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
        });
    }
    EditComponent.prototype.validateDate = function (valueEntered, futureDate, pastDate) {
        if (futureDate === void 0) { futureDate = false; }
        if (pastDate === void 0) { pastDate = false; }
        this.dateValid = true;
        var tempMoment = moment(valueEntered, 'MM/DD/YYYY', true);
        if (tempMoment.isValid()) {
            var now = moment();
            var diff = tempMoment.diff(now, 'days');
            if (futureDate && diff <= 0) {
                this.dateInvalidMessage = this.r.ERR_InvalidDateInFuture;
                this.dateValid = false;
            }
            if (pastDate && diff >= 0) {
                this.dateInvalidMessage = this.r.ERR_InvalidDateInPast;
                this.dateValid = false;
            }
        }
        else {
            this.dateInvalidMessage = this.r.ERR_InvalidDateFormat;
            this.dateValid = false;
        }
        return this.dateValid;
    };
    EditComponent = __decorate([
        core_1.Component({
            selector: 'modal-edit',
            templateUrl: './edit.component.html',
            styleUrls: ['./edit.component.scss']
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef, Object, resources_service_1.ResourcesService])
    ], EditComponent);
    return EditComponent;
}());
exports.EditComponent = EditComponent;
//# sourceMappingURL=edit.component.js.map