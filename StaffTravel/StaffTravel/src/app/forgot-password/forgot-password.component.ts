import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { ResourcesService } from '../services/resources/resources.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    public errorMessage: string;
    public isValid: boolean;
    public empNumber: string;
    public isResetSuccessful: boolean;
    public forgotPasswordBtnReady: boolean;
    public r: any;

    constructor(private http: Http, private router: Router, resourcesService: ResourcesService) {
        this.r = {};
        resourcesService.getResources().subscribe(res => this.r = res);
    }

    ngOnInit() {
        this.errorMessage = '';
        this.isValid = true;
        this.isResetSuccessful = false;
        this.forgotPasswordBtnReady = true;
    }

    forgotPassword() {
        this.forgotPasswordBtnReady = false;
        let body = { EmpNumber: this.empNumber };

        this.http.post('/api/Account/ForgotPassword', body)
            .toPromise()
            .then(response => {
                this.isValid = true;
                this.errorMessage = '';
                this.isResetSuccessful = true;
                this.forgotPasswordBtnReady = true;
            })
            .catch(err => {
                this.isValid = false;
                this.errorMessage = this.getErrorMessage(err.json().Message);
                this.forgotPasswordBtnReady = true;
            });
    }

    getErrorMessage(errorMessage: string): string {
        switch (errorMessage) {
            case "ERR-RES-001":
                return this.r.ERR_RES_001;
            case "ERR-RES-002":
                return this.r.ERR_RES_002;
            case "ERR-RES-003":
                return this.r.ERR_RES_003;
            default:
                return this.r.unknownError;
        }
    }
}
