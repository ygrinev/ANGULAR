import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { StatusEnum } from '../../../models/enums';
import { ResourcesService } from '../../../services/resources/resources.service';

@Component({
  selector: 'status-toggle',
  templateUrl: './status-toggle.component.html',
  styleUrls: ['./status-toggle.component.scss'],
  inputs: ['id', 'type', 'linkedStatus', 'readOnly']
})
export class StatusToggleComponent implements OnInit, OnChanges {
    public id;
    public type;
    public linkedStatus;
    public readOnly;

    statusEnum: StatusEnum;
    approvalStatus: StatusEnum;

    @Input() status: StatusEnum;
    @Output() statusChange = new EventEmitter<StatusEnum>();

    r: any = {};

    constructor(private resourcesService : ResourcesService) {
        resourcesService.getResources().subscribe(res => this.r = res);
     }

    ngOnInit() {
        this.approvalStatus = this.status;        
    }

    updateRequest() {
        this.statusChange.emit(this.approvalStatus);
    }

    ngOnChanges(){
        this.approvalStatus = this.status;
    }
    
}
