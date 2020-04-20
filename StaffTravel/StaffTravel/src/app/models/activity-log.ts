import { ActivityLogUpdateTypeEnum, ActivityLogSectionTypeEnum, ActivityLogUserTypeEnum, StatusEnum } from './enums';

export class ActivityLog {
    id: number;
    updateType: ActivityLogUpdateTypeEnum;
    updatedOn: Date;
    empNumber: string;
    empName:string;
    sectionType: ActivityLogSectionTypeEnum;
    userType: ActivityLogUserTypeEnum;
    statusChange: StatusEnum;
    text: string;
    foreignId: number;
    requestId: number;
}
