import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ResourcesService } from '../resources/resources.service';
import { BasicInfo } from '../../models/basic-info';

@Injectable()
export class AuthenticationService {
    private subject = new BehaviorSubject<any>({
        isLoggedIn: false,
        hasPassport: false,
        basicInfo: null,
        roles: null
    });

    constructor(private http: Http, private resourcesService: ResourcesService) { }

    updateUserInfo() {
        let isLoggedIn: boolean = false;
        let basicInfo: string = null;
        let roles: any = null;

        let isManager: boolean = false;
        let isAdmin: boolean = false;
        let isPayload: boolean = false;
        let isHRAdmin: boolean = false;
        let hasPassport: boolean = false;
        if (this.resourcesService.getCookie('accessToken')) {
            isLoggedIn = true;

            if (this.resourcesService.getCookie('basicInfo'))
                basicInfo = this.resourcesService.getCookie('basicInfo');

            if (this.resourcesService.getCookie('roles')) {
                roles = this.resourcesService.getCookie('roles');
                if (roles.includes("2")) {
                    isManager = true;
                }
                if (roles.includes("5")) {
                    isAdmin = true;
                }
                if (roles.includes("4")) {
                    isPayload = true;
                }
                if (roles.includes("6")) {
                    isHRAdmin = true;
                }
            }
        }


        this.subject.next({
            isLoggedIn: isLoggedIn,
            hasPassport: this.resourcesService.getCookie('hasPassport') == 'ERR-REG-001' ? true : false,
            basicInfo: JSON.parse(basicInfo),
            roles: {
                ['isManager']: isManager,
                ['isAdmin']: isAdmin,
                ['isPayload']: isPayload,
                ['isHRAdmin']: isHRAdmin
            }
        });
    }

    clearUserInfo() {
        this.subject.next({
            isLoggedIn: false,
            hasPassport: false,
            basicInfo: null,
            roles: null
        });
    }

    getUserInfo(): Observable<any> {
        return this.subject.asObservable();
    }

    getPassportStatus(empNumber: string) : Promise<string> {
        return this.http.get('/api/Account/GetPassportStatus?empNumber=' + empNumber)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(err => {
                return err.json().Message;
            });
    }
}