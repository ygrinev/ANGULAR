"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AncillaryProductEnum;
(function (AncillaryProductEnum) {
    AncillaryProductEnum[AncillaryProductEnum["Excursion"] = 0] = "Excursion";
    AncillaryProductEnum[AncillaryProductEnum["Transfer"] = 1] = "Transfer";
    AncillaryProductEnum[AncillaryProductEnum["Insurance"] = 2] = "Insurance";
    AncillaryProductEnum[AncillaryProductEnum["CarRental"] = 3] = "CarRental";
})(AncillaryProductEnum = exports.AncillaryProductEnum || (exports.AncillaryProductEnum = {}));
var TransferTypeEnum;
(function (TransferTypeEnum) {
    TransferTypeEnum[TransferTypeEnum["Shared"] = 0] = "Shared";
    TransferTypeEnum[TransferTypeEnum["Private"] = 1] = "Private";
})(TransferTypeEnum = exports.TransferTypeEnum || (exports.TransferTypeEnum = {}));
var InsuranceTypeEnum;
(function (InsuranceTypeEnum) {
    InsuranceTypeEnum[InsuranceTypeEnum["InsuranceType1"] = 0] = "InsuranceType1";
    InsuranceTypeEnum[InsuranceTypeEnum["InsuranceType2"] = 1] = "InsuranceType2";
})(InsuranceTypeEnum = exports.InsuranceTypeEnum || (exports.InsuranceTypeEnum = {}));
var StatusEnum;
(function (StatusEnum) {
    StatusEnum[StatusEnum["Pending"] = 0] = "Pending";
    StatusEnum[StatusEnum["Approved"] = 1] = "Approved";
    StatusEnum[StatusEnum["Denied"] = 2] = "Denied";
})(StatusEnum = exports.StatusEnum || (exports.StatusEnum = {}));
var TypeOfPassEnum;
(function (TypeOfPassEnum) {
    TypeOfPassEnum[TypeOfPassEnum["YCP"] = 0] = "YCP";
    TypeOfPassEnum[TypeOfPassEnum["BCP"] = 1] = "BCP";
    TypeOfPassEnum[TypeOfPassEnum["LMCP"] = 2] = "LMCP";
    TypeOfPassEnum[TypeOfPassEnum["NONE"] = 3] = "NONE";
    TypeOfPassEnum[TypeOfPassEnum["IP"] = 4] = "IP";
})(TypeOfPassEnum = exports.TypeOfPassEnum || (exports.TypeOfPassEnum = {}));
var NoteSectionEnum;
(function (NoteSectionEnum) {
    NoteSectionEnum[NoteSectionEnum["Passengers"] = 0] = "Passengers";
    NoteSectionEnum[NoteSectionEnum["Flights"] = 1] = "Flights";
    NoteSectionEnum[NoteSectionEnum["Hotels"] = 2] = "Hotels";
    NoteSectionEnum[NoteSectionEnum["Ancillaries"] = 3] = "Ancillaries";
    NoteSectionEnum[NoteSectionEnum["Booking"] = 4] = "Booking";
    NoteSectionEnum[NoteSectionEnum["Reject"] = 5] = "Reject";
})(NoteSectionEnum = exports.NoteSectionEnum || (exports.NoteSectionEnum = {}));
var NoteTypeEnum;
(function (NoteTypeEnum) {
    NoteTypeEnum[NoteTypeEnum["Employee"] = 0] = "Employee";
    NoteTypeEnum[NoteTypeEnum["Admin"] = 1] = "Admin";
    NoteTypeEnum[NoteTypeEnum["Payload"] = 2] = "Payload";
})(NoteTypeEnum = exports.NoteTypeEnum || (exports.NoteTypeEnum = {}));
var ActivityLogUpdateTypeEnum;
(function (ActivityLogUpdateTypeEnum) {
    ActivityLogUpdateTypeEnum[ActivityLogUpdateTypeEnum["Status"] = 0] = "Status";
    ActivityLogUpdateTypeEnum[ActivityLogUpdateTypeEnum["Data"] = 1] = "Data";
    ActivityLogUpdateTypeEnum[ActivityLogUpdateTypeEnum["Price"] = 2] = "Price";
})(ActivityLogUpdateTypeEnum = exports.ActivityLogUpdateTypeEnum || (exports.ActivityLogUpdateTypeEnum = {}));
var ActivityLogSectionTypeEnum;
(function (ActivityLogSectionTypeEnum) {
    ActivityLogSectionTypeEnum[ActivityLogSectionTypeEnum["Passengers"] = 0] = "Passengers";
    ActivityLogSectionTypeEnum[ActivityLogSectionTypeEnum["Flights"] = 1] = "Flights";
    ActivityLogSectionTypeEnum[ActivityLogSectionTypeEnum["Hotels"] = 2] = "Hotels";
    ActivityLogSectionTypeEnum[ActivityLogSectionTypeEnum["Ancillaries"] = 3] = "Ancillaries";
    ActivityLogSectionTypeEnum[ActivityLogSectionTypeEnum["Booking"] = 4] = "Booking";
    ActivityLogSectionTypeEnum[ActivityLogSectionTypeEnum["Reject"] = 5] = "Reject";
})(ActivityLogSectionTypeEnum = exports.ActivityLogSectionTypeEnum || (exports.ActivityLogSectionTypeEnum = {}));
var ActivityLogUserTypeEnum;
(function (ActivityLogUserTypeEnum) {
    ActivityLogUserTypeEnum[ActivityLogUserTypeEnum["Employee"] = 0] = "Employee";
    ActivityLogUserTypeEnum[ActivityLogUserTypeEnum["Admin"] = 1] = "Admin";
    ActivityLogUserTypeEnum[ActivityLogUserTypeEnum["Payload"] = 2] = "Payload";
})(ActivityLogUserTypeEnum = exports.ActivityLogUserTypeEnum || (exports.ActivityLogUserTypeEnum = {}));
//# sourceMappingURL=enums.js.map