import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Register } from '../models/register';
import { Login } from '../models/login';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { ResourcesService } from '../services/resources/resources.service';

@Component({
    selector: 'login-register',
    templateUrl: './login-register.component.html',
    styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit, OnDestroy {
    loginModel: Login;
    registerModel: Register;
    subscription: Subscription;
    userInfo: any;

    public errorMessage: string;
    public isValid: boolean;
    public isPasswordValid: boolean;
    public isPasswordMatch: boolean;
    public isRegisteredSuccessfully: boolean;
    public hasPassport: boolean;
    public rememberMe: boolean;
    public showPassword: Object;
    public loginBtnReady: boolean;
    public registerBtnReady: boolean;
    public loadingBtn: boolean;
    public r: any;

    constructor(private http: Http, private router: Router, private authenticationService: AuthenticationService, private resourcesService: ResourcesService) {
        this.authenticationService.clearUserInfo();
        this.subscription = this.authenticationService.getUserInfo().subscribe(userInfo => { this.userInfo = userInfo; });
        this.showPassword = {};
        this.r = {};
        resourcesService.getResources().subscribe(res => this.r = res);
    }

    ngOnInit() {
        //clean-up any saved values in the session
        sessionStorage.clear();
        localStorage.clear();
        this.resourcesService.deleteAllCookies();
        //initialize
        this.errorMessage = '';
        this.isValid = true;
        this.isPasswordValid = true;
        this.isPasswordMatch = true;
        this.isRegisteredSuccessfully = false;
        this.loginModel = new Login();
        this.registerModel = new Register();
        this.loginBtnReady = true;
        this.registerBtnReady = true;
        this.loadingBtn = false;
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    public toggleTab(event: any) {
        event.stopPropagation();
        event.preventDefault();
        let tabs = document.querySelectorAll('.tab-group > .tab');
        let selectedTabID = event.target.getAttribute('aria-controls');
        let selectedTab = document.getElementById(selectedTabID);

        Array.from(tabs).forEach(function (tab) {
            tab.classList.remove('active');
        });

        selectedTab.classList.add('active');
        this.errorMessage = '';
        this.isValid = true;

        return false;
    }

    /**
     * Toggle Password Fields type between text / password to show / hide password
     */
    public togglePassword(event: any) {
        event.stopPropagation();
        event.preventDefault();
        let passwordField = event.target.parentNode.parentNode.querySelectorAll('input')[0];
        let passwordFieldID = passwordField.id;

        // Create "false" state within the object on first click of togglePassword
        if (! this.showPassword.hasOwnProperty(passwordFieldID)){
            this.showPassword[passwordFieldID] = false;
        }

        // Toggle state of showPassword object
        this.showPassword[passwordFieldID] = !this.showPassword[passwordFieldID];
        if (this.showPassword[passwordFieldID]){
            passwordField.setAttribute('type','text');
        }
        else {
            passwordField.setAttribute('type','password');
        }

    }

    login() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        let body = "grant_type=" + "password" + "&username=" + this.loginModel.empNumber + "&password=" + this.loginModel.password;

        this.loginBtnReady = false;
        this.loadingBtn = true;

        this.http.post('/Token', body, { headers: headers })
        .toPromise()
        .then(response => {
            this.isValid = true;
            this.errorMessage = '';
            let cookieExpiryDate: number = this.loginModel.rememberMe ? 14 : 1;
            let empNumber = response.json().userName;

            this.resourcesService.setCookie('cookieExpiryDate', cookieExpiryDate.toString(), cookieExpiryDate);
            this.resourcesService.setCookie('accessToken', response.json().access_token, cookieExpiryDate);
            this.resourcesService.setCookie('basicInfo', response.json().basicInfo, cookieExpiryDate);
            this.resourcesService.setCookie('roles', response.json().roles, cookieExpiryDate);
            this.resourcesService.setCookie('empNumber', empNumber, cookieExpiryDate);
            this.authenticationService.updateUserInfo();
            this.authenticationService.getPassportStatus(empNumber)
                .then(rsp => {
                    this.resourcesService.setCookie('hasPassport', rsp, cookieExpiryDate);
                    this.loginBtnReady = true;
                    this.loadingBtn = false;
                    this.router.navigate([rsp == 'ERR-REG-001' ? '/home' : '/save-passport']);
                })
                .catch(err => {
                    this.resourcesService.setCookie('hasPassport', err.json().Message, cookieExpiryDate);
                    this.loginBtnReady = true;
                    this.loadingBtn = false;
                    this.router.navigate([err.json().Message == 'ERR-REG-001' ? '/home' : '/save-passport']);
                });

            //TODO: navigate to the referrer page
        })
        .catch(err => {
            this.isValid = false;
            this.errorMessage = this.getErrorMessage(err.json().error);
                    this.loginBtnReady = true;
                    this.loadingBtn = false;
        });
    }

    register() {
        if (!this.validateForm()) {
            return false;
        }

        let body = {
            EmpNumber: this.registerModel.empNumber,
            LastName: this.registerModel.lastName,
            Password: this.registerModel.password,
            ConfirmPassword: this.registerModel.confirmPassword,
            FirstNamePassport: this.registerModel.firstNamePassport,
            MidNamePassport: this.registerModel.midNamePassport,
            LastNamePassport: this.registerModel.lastNamePassport
        };

        this.registerBtnReady = false;
        this.loadingBtn = true;

        this.http.post('/api/Account/Register', body)
            .toPromise()
            .then(response => {
            //after succesfully registering, login the user
                this.isValid = true;
                this.errorMessage = '';
                this.isRegisteredSuccessfully = true;
                this.loginModel.empNumber = this.registerModel.empNumber;
                this.loginModel.password = this.registerModel.password;
                this.registerBtnReady = true;
                this.login();
            })
            .catch(err => {
                this.isValid = false;
                this.errorMessage = this.getErrorMessage(err.json().Message);
                this.registerBtnReady = true;
                this.loadingBtn = false;
            });
    }

    validateForm(): boolean {
        let passwordRegEx = new RegExp(/(?=^.{6,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/);

        if (!passwordRegEx.test(this.registerModel.password)) {
            this.isPasswordValid = false;
            return false;
        }
        else {
            this.isPasswordValid = true;
        }

        if (this.registerModel.password !== this.registerModel.confirmPassword) {
            this.isPasswordMatch = false;
            return false;
        }
        else {
            this.isPasswordMatch = true;
        }

        return true;
    }
    getErrorMessage(errCode: string): string { return this.resourcesService.getErrorMessage(errCode); }
}
