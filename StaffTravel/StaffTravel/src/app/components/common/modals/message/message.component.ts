import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResourcesService } from '../../../../services/resources/resources.service';

@Component({
    selector: 'modal-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})

export class MessageComponent {
    r: any = {};

    constructor(public dialogRef: MatDialogRef<MessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
        });
    }

}