import { Component, Inject } from '@angular/core';
import { TypeOfPassEnum } from '../../../../models/enums';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResourcesService } from '../../../../services/resources/resources.service';

@Component({
  selector: 'modal-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditComponent {
    dateValid: boolean = true;
    dateInvalidMessage: string;
    r: any = {};
    typeOfPassEnum = TypeOfPassEnum;
    dateMask: (string | RegExp)[] = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

    constructor(public dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
        });
    }


    validateDate(valueEntered, futureDate: boolean = false, pastDate: boolean = false): boolean {
        this.dateValid = true;

        let tempMoment = moment(valueEntered, 'MM/DD/YYYY', true);
        if (tempMoment.isValid()) {

            let now = moment();
            let diff: number = tempMoment.diff(now, 'days');
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
    }


}
