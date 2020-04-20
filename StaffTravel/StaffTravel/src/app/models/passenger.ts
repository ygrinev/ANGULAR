import { StatusEnum, TypeOfPassEnum } from './enums';

export class Passenger {
    constructor(passengerNumber: number = 1) {
        this.status = StatusEnum.Pending;
        this.approvalStatus = StatusEnum.Pending;
        this.passengerNumber = passengerNumber;
    }
    firstName: string;
    middleName: string;
    lastName: string;
    DOB: Date;
    typeOfPass?: TypeOfPassEnum;
    phoneNumber: string;
    email: string;
    price: number;
    passengerNumber: number;
    status: StatusEnum;
    approvalStatus: StatusEnum;
    id: number;
    requestId: number;
}