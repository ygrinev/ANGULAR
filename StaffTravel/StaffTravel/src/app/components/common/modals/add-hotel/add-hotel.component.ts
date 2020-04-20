import { Component, Inject } from '@angular/core';
import { TypeOfPassEnum } from '../../../../models/enums';
import * as moment from 'moment';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { ResourcesService } from '../../../../services/resources/resources.service';
import { HttpClientService } from '../../../../services/http-client/http-client.service';
import { Hotel } from '../../../../models/hotel';

@Component({
    selector: 'app-add-hotel',
    templateUrl: './add-hotel.component.html',
    styleUrls: ['./add-hotel.component.scss']
})
export class AddHotelComponent {
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
    maxValueMask: (string | RegExp)[] = [/\d/, /\d/];
    svHotelDestinationsAPI: string = 'api/Resource/GetDestCode?language={0}&brand=SWG&gateway={1}';
    svHotelsAPI: string = 'api/Resource/GetSVHotelList?language={0}&brand=SWG&gateway=YYZ&destination={1}';

    r: any = {};

    hotelDestinations?: Array<string>;
    hotelDestinationsID?: Map<string, string>;
    filteredDestinations?: Array<string>;

    availableResorts?: Array<string>;
    filteredHotels?: Array<string>;

    hotelDestinationsListReady: boolean = false;
    hotelsListReady: boolean = false;
    dateError: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<AddHotelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Hotel,
        private resourcesService: ResourcesService,
        private httpClient: HttpClientService
    ) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
        });

        this.initLists();
    }

    initLists() {
        this.hotelDestinations = new Array<string>();
        this.hotelDestinationsID = new Map<string, string>();

        this.httpClient
            .get(
                this.svHotelDestinationsAPI.replace('{0}', 'en').replace('{1}', 'YYZ')
            )
            .toPromise()
            .then(res => {
                let tempObjArr: any;
                tempObjArr = JSON.parse(res.json());

                //foreach group
                tempObjArr.forEach(g => {
                    //foreach destination in group
                    g.destination.forEach(d => {
                        if (d.destName) {
                            this.hotelDestinations.push(d.destName);
                            this.hotelDestinationsID.set(d.destName, d.destCode);
                        }
                    }); //end foreach destination in group
                }); //end foreach group
                this.hotelDestinations.sort();
                this.filteredDestinations = this.hotelDestinations;

                this.hotelDestinationsListReady = true;
            }); // end response
    }

    hotelDestinationChanged(selectedValue: any) {
        //destination codes are comma separated, replace with underscore
        let destcode = this.hotelDestinationsID
            .get(selectedValue.option.value)
            .replace(/,/g, '_');
        let tempObjArr: any;
        //disable the hotels list until it is ready and reset value
        this.hotelsListReady = false;
        this.availableResorts = [];

        //initiate the call to hotellist
        this.httpClient
            .get(this.svHotelsAPI.replace('{0}', 'en').replace('{1}', destcode))
            .toPromise()
            .then(res => {
                tempObjArr = JSON.parse(res.json());
                tempObjArr[0].hotels.forEach(h => {
                    let idx: number = h.indexOf('--xx--');
                    let hotelName: string = h.substring(0, idx);
                    let hotelId: string = h.substring(idx + 6);

                    if (hotelName && hotelId.split('_').length == 1)
                        this.availableResorts.push(hotelName);
                });
                this.availableResorts.sort();
                this.hotelsListReady = true;

                this.filteredHotels = this.availableResorts;
            });
    }

    validateDate(valueEntered): boolean {
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
        if (this.validateDate(this.data.checkInDate))
            this.dialogRef.close(this.data);
        else this.dateError = true;
    }

    filterDestinations(valueEntered: any) {
        //disable the hotels list until it is ready and reset value
        this.hotelsListReady = false;
        this.data.name = '';

        return this.hotelDestinations.filter(
            destination =>
                destination.toLowerCase().indexOf(valueEntered.toLowerCase()) === 0
        );
    }

    filterHotels(valueEntered: any) {
        return this.availableResorts.filter(
            hotel => hotel.toLowerCase().indexOf(valueEntered.toLowerCase()) === 0
        );
    }
}
