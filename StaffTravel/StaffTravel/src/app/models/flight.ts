import { StatusEnum } from './enums';

export class Flight {
    constructor() {
        this.status = StatusEnum.Pending;
        this.approvalStatus = StatusEnum.Pending;
    }
    departDate: Date;
    departFrom: string;
    departTo: string;
    departFlight: string;
    returnDate: Date;
    returnFrom: string;
    returnTo: string;
    returnFlight: string;
    availableDestinations?: string[];
    price: number;
    status: StatusEnum;
    approvalStatus: StatusEnum;
    requestId: number;
    id: number;
    lastUpdatedBy?: string;
}