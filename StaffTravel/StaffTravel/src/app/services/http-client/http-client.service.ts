import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { ResourcesService } from '../resources/resources.service';

@Injectable()
export class HttpClientService {
    constructor(private http: Http, private router: Router, private resourcesService:ResourcesService) { }

    createAuthHeader(headers: Headers) {
        let token: string = this.resourcesService.getCookie('accessToken');

        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
        else {
            alert('Your session has expired.');
            this.router.navigate(['/login-register']);
            return;
        }
    }

    get(url: string, includeAuthHeader = true) {
        let headers = new Headers();
        if (includeAuthHeader) {
            this.createAuthHeader(headers);
        }

        return this.http.get(url, { headers: headers });
    }

    post(url: string, data: any, includeAuthHeader = true) {
        let headers = new Headers();
        if (includeAuthHeader) {
            this.createAuthHeader(headers);
        }

        return this.http.post(url, data, { headers: headers });
    }
}
