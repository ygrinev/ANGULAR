import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Passport } from '../models/passport';
import { ResourcesService } from '../services/resources/resources.service';
import { PassportService } from '../services/passport/passport.service';
import { BasicInfo } from '../models/basic-info';

@Component({
  selector: 'app-save-passport',
  templateUrl: './save-passport.component.html',
  styleUrls: ['./save-passport.component.scss']
})
export class SavePassportComponent implements OnInit {
    passportModel: Passport;
    errorMessage: string;
    basicInfo: BasicInfo;
    public isValid: boolean = true;
    public isEmpNumValid: boolean = true;
    public isHRAdmin: boolean = false;
    public saveBtnReady: boolean = true;
    public chkBtnReady: boolean = true;
    public isSaveSuccessful: boolean = true;
    public isValidationSuccessful: boolean = true;
    public loadingBtn1: boolean = false;
    public loadingBtn2: boolean = false;
    public hasPassport: boolean;
    public r: any = {};

    constructor(private http: Http, private router: Router, private activatedRoute: ActivatedRoute, private resourcesService: ResourcesService, private passportService: PassportService) {
        resourcesService.getResources().subscribe(res => this.r = res);
        this.passportModel = new Passport();
    }

    ngOnInit() {
        this.hasPassport = this.resourcesService.getCookie('hasPassport') == 'ERR-REG-001';
        this.passportModel.empNumber = this.resourcesService.getCookie('empNumber');
        if (this.resourcesService.getCookie('roles')) {
            let roles = this.resourcesService.getCookie('roles');
            if (roles.includes("6")) {
                this.isHRAdmin = true;
            }
        }
        this.getPassport();
        if (this.isHRAdmin) {
            this.basicInfo = <BasicInfo>JSON.parse(this.resourcesService.getCookie('basicInfo'));
            this.passportModel.name = this.basicInfo.firstname + ' ' + this.basicInfo.lastname;
        }
    }
    savePassport() {
        if (this.chkBtnReady && this.isValidationSuccessful) {
            this.errorMessage = '';
            this.saveBtnReady = false;
            this.loadingBtn1 = true;
            let body = {
                EmpNumber: this.passportModel.empNumber,
                FirstNamePassport: this.passportModel.firstNamePassport,
                MidNamePassport: this.passportModel.midNamePassport,
                LastNamePassport: this.passportModel.lastNamePassport
            };
            return this.http.post('/api/Account/SavePassport', body)
                .toPromise()
                .then(rsp => {
                    // set cookie hasPassport
                    this.resourcesService.setCookie('hasPassport', rsp.json(), 14);
                    this.loadingBtn1 = false;
                    this.saveBtnReady = true;
                    this.isSaveSuccessful = true;
                    this.errorMessage = this.r.successSavePassport;
                    if (!this.isHRAdmin) {
                        this.router.navigate(['/home']);
                    }
                })
                .catch(err => {
                    // set cookie hasPassport
                    this.isValid = false;
                    this.loadingBtn1 = false;
                    this.saveBtnReady = true;
                    this.isSaveSuccessful = false;
                    this.errorMessage = this.resourcesService.getErrorMessage(err.json().Message);

                    this.resourcesService.setCookie('hasPassport', err.json().Message, 14);
                });
        }
    }
    getPassport() {  // only accessible by HRAdmin
        this.errorMessage = '';
        this.chkBtnReady = false;
        this.isValidationSuccessful = false;
        this.loadingBtn2 = true;
        this.chkBtnReady = false;
        this.http.get('/api/Account/GetPassport?empNumber=' + this.passportModel.empNumber)
            .toPromise()
            .then(rsp => {
                this.passportModel = rsp.json() as Passport;
                if (!this.passportModel.firstNamePassport) {
                    this.errorMessage = this.resourcesService.getErrorMessage('ERR-REG-007');
                }
                ///alert('Full Name = ' + this.passportModel.name + ', firstName = ' + this.passportModel.firstNamePassport + ', lastName = ' + this.passportModel.lastNamePassport);
                this.isValidationSuccessful = true;
                this.isEmpNumValid = true;
            })
            .catch(err => {
                this.passportModel.firstNamePassport = "";
                this.passportModel.midNamePassport = "";
                this.passportModel.lastNamePassport = "";
                this.errorMessage = this.resourcesService.getErrorMessage(err.json().Message);
                this.isEmpNumValid = false;
                this.isValidationSuccessful = false;
                this.isValid = false;
            });
            this.loadingBtn2 = false;
            this.chkBtnReady = true;
    }
    invalidatePassport() {
        this.errorMessage = '';
        this.isEmpNumValid = false;
        this.passportModel.name = '';
        this.isValidationSuccessful = false;
        this.isSaveSuccessful = false;
    }
}
