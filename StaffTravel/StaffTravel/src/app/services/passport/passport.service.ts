import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Passport } from '../../models/passport';
import { Http, Headers } from '@angular/http';
import { ResourcesService } from '../resources/resources.service';

@Injectable()
export class PassportService {

    constructor(private http: Http, private router: Router, private resourcesService: ResourcesService) { }
    public savePassport(passportModel: Passport) : Promise<boolean> {
        //alert('Saving passport is under construction...');
        let body = {
            EmpNumber: passportModel.empNumber,
            FirstNamePassport: passportModel.firstNamePassport,
            MidNamePassport: passportModel.midNamePassport,
            LastNamePassport: passportModel.lastNamePassport
        };
        return this.http.post('/api/Account/SavePassport', body)
            .toPromise()
            .then(rsp => {
                // set cookie hasPassport
                this.resourcesService.setCookie('hasPassport', rsp.json().Message, 14);
                return true;
            })
            .catch(err => {
                // set cookie hasPassport
                this.resourcesService.setCookie('hasPassport', err.json().Message, 14);
                return true;
            });

    }
}
