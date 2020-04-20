import { Component, Inject } from '@angular/core';
import { TypeOfPassEnum } from '../../../../models/enums';
import * as moment from 'moment';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { ResourcesService } from '../../../../services/resources/resources.service';
import { HttpClientService } from '../../../../services/http-client/http-client.service';
import { Flight } from '../../../../models/flight';

@Component({
    selector: 'app-add-flight',
    templateUrl: './add-flight.component.html',
    styleUrls: ['./add-flight.component.scss']
})
export class AddFlightComponent {
    dateValid: boolean = true;
    dateInvalidMessage: string;
    r: any = {};
    typeOfPassEnum = TypeOfPassEnum;
    dateMask: (string | RegExp)[] = [
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        /\d/,
        /\d/
    ];

    gatewaysAPI: string = 'api/Resource/GetGatewayforBrandAsync?language={0}&brand=SWG';
    destinationsAPI: string = 'api/Resource/GetDestCode?language={0}&brand=SWG&gateway={1}&searchType=RE';

    availableGateways?: Array<string>;
    filteredAvailableGateways?: Array<string>;
    filteredAvailableReturnGateways?: Array<string>;

    availableDestinations?: Array<string>;
    filteredAvailableDestinations?: Array<string>;
    filteredAvailableReturnDestinations?: Array<string>;

    gatewaysListReady: boolean = false;
    destinationsListReady: boolean = false;
    dateError: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<AddFlightComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Flight,
        private resourcesService: ResourcesService,
        private httpClient: HttpClientService
    ) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
        });

        this.initLists();
    }

    initLists() {
        this.availableGateways = new Array<string>();

        //load the list of available gateways
        this.httpClient
            .get(this.gatewaysAPI.replace('{0}', 'en'))
            .toPromise()
            .then(res => {
                let tempObjArr: any;
                tempObjArr = JSON.parse(res.json());
                tempObjArr.forEach(o =>
                    this.availableGateways.push(o.name + ' ' + '(' + o.code + ')')
                );

                this.availableGateways.sort();
                this.filteredAvailableGateways = this.availableGateways;
                this.filteredAvailableReturnGateways = this.availableGateways;

                this.gatewaysListReady = true;
            });
    }

    gatewayChanged(selectedValue: any) {
        let gateway: string;
        let tempObjArr: any;
        //disable destinations until the new list is ready
        this.destinationsListReady = false;
        this.availableDestinations = [];

        //reset destination lists
        this.data.departTo = '';
        this.data.returnFrom = '';
        this.filteredAvailableDestinations = [];
        this.filteredAvailableReturnDestinations = [];

        //airport code
        gateway = selectedValue.option.value.substr(
            selectedValue.option.value.length - 4,
            3
        );

        this.httpClient
            .get(this.destinationsAPI.replace('{0}', 'en').replace('{1}', gateway))
            .toPromise()
            .then(res => {
                this.availableDestinations = new Array<string>();
                tempObjArr = JSON.parse(res.json());

                tempObjArr.forEach(d => {
                    if (d.destinationName)
                        this.availableDestinations.push(d.destinationName);
                });

                this.availableDestinations.sort();
                this.destinationsListReady = true;

                this.filteredAvailableDestinations = this.availableDestinations;
                this.filteredAvailableReturnDestinations = this.availableDestinations;
            }); //end response
    }

    validateDate(valueEntered): boolean {
        let dateValid: boolean = true;
        let tempMoment = moment(valueEntered, 'MM/DD/YYYY', true);
        if (tempMoment.isValid()) {
            let now = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });
            let diff: number = tempMoment.diff(now, 'days');
            if (diff < 0) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    update() {
        if (
            this.validateDate(this.data.departDate) &&
            this.validateDate(this.data.returnDate)
        )
            this.dialogRef.close(this.data);
        else this.dateError = true;
    }

    filterAvailableGateways(valueEntered: any, returnField: boolean = false) {
        if (!returnField) {
            //disable the hotels list until it is ready and reset value
            this.destinationsListReady = false;

            this.data.departFrom = '';
        }

        return this.availableGateways.filter(
            gateway => gateway.toLowerCase().indexOf(valueEntered.toLowerCase()) === 0
        );
    }

    filterAvailableDestinations(valueEntered: any) {
        return this.availableDestinations.filter(
            destination =>
                destination.toLowerCase().indexOf(valueEntered.toLowerCase()) === 0
        );
    }
}
