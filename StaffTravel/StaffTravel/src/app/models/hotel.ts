import { StatusEnum } from './enums';

export class Hotel {
    constructor() {
        this.status = StatusEnum.Pending;
        this.approvalStatus = StatusEnum.Pending;
    }
    checkInDate: Date;
    duration: number;
    destination: string;
    name: string;
    roomType: string; //might need an enum to hold possible values for room types
    availableResorts?: string[];
    price: number;
    status: StatusEnum;
    approvalStatus: StatusEnum;
    id: number;
    requestId: number;
}