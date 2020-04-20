import {AncillaryProductEnum, TransferTypeEnum, InsuranceTypeEnum, StatusEnum} from './enums';

export class Ancillary {
    constructor() {
        this.status = StatusEnum.Pending;
        this.approvalStatus = StatusEnum.Pending;
        this.quantity = 1;
    }

    ancillaryProductType: AncillaryProductEnum;
    destination: string;

    //excursions
    excursionDate?: Date;
    excursionName?: string;

    //transfers
    transferType?: TransferTypeEnum;

    //insurance
    insuranceType?: InsuranceTypeEnum;

    passengerName?: string;
    quantity: number;
    price: number;
    status: StatusEnum;
    approvalStatus: StatusEnum;
    id: number;
    requestId: number;
}
