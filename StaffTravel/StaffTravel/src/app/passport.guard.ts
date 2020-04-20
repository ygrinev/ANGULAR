import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ResourcesService } from './services/resources/resources.service';

@Injectable()
export class PassportGuard implements CanActivate {
    constructor(private http: Http, private router: Router, private authenticationService: AuthenticationService, private resourcesService: ResourcesService) { }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let respOK = 'ERR-REG-001';
        if (this.resourcesService.getCookie('hasPassport') == '') {
            let cookieExpiryDate = parseInt(this.resourcesService.getCookie('cookieExpiryDate'));
            let res = false;
            return this.authenticationService.getPassportStatus(this.resourcesService.getCookie('empNumber'))
                .then(rsp => {
                    this.resourcesService.setCookie('hasPassport', rsp, cookieExpiryDate);
                    res = rsp == respOK;
                    if (!res) {
                        this.router.navigate(['/save-passport']);
                    }
                    return res;
                })
                .catch(err => {
                    this.resourcesService.setCookie('hasPassport', err.json().Message, cookieExpiryDate);
                    this.router.navigate(['/save-passport']);
                    return false;
                });
        }
        else {
            if (this.resourcesService.getCookie('hasPassport') == respOK) {
                return true;
            }
            this.router.navigate(['/save-passport']);
            return false;
        }
    }
}
