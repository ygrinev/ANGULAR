import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Password } from '../models/password';
import { ResourcesService } from '../services/resources/resources.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    passwordModel: Password;
    private userId: string;
    private resetToken: string;
    public errorMessage: string;
    public isValid: boolean;
    public isPasswordValid: boolean = true;
    public isPasswordMatch: boolean = true;
    public resetPasswordBtnReady: boolean;

    public r: any = {};

    constructor(private http: Http, private router: Router, private activatedRoute: ActivatedRoute, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => this.r = res);
     }

    ngOnInit(): void {
        this.passwordModel = new Password();
        this.resetPasswordBtnReady = true;

        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.userId = params['uid'];
            this.resetToken = params['token'];

            if(this.userId && this.resetPassword){
                this.errorMessage = '';
                this.isValid = true;
            }
            else {
                //log an error
                //
                alert('Invalid URL');
                //redirect to login page
                this.router.navigate(['/login-register']);
                return;
            }

          });
    }

    resetPassword() {
        if (!this.validateForm()) {
            this.isValid = false;
            this.resetPasswordBtnReady = true;
            return false;
        }

        this.resetPasswordBtnReady = false;

        let body = {
            NewPassword: this.passwordModel.password,
            ConfirmPassword: this.passwordModel.confirmPassword,
            ResetToken: this.resetToken,
            UserId: this.userId
        };

        this.http.post('/api/Account/ResetPassword', body)
        .toPromise()
        .then(() => {
            alert('Password was successfully reset please login using the new password');
            this.router.navigate(['/login-register']);
        })
        .catch(err => {
            alert('Password reset failed');
            console.log('error ' + err);
            this.resetPasswordBtnReady = true;
        });
    }

    validateForm(): boolean {
        let passwordRegEx = new RegExp(/(?=^.{6,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/);

        if (!passwordRegEx.test(this.passwordModel.password)) {
            this.resetPasswordBtnReady = false;
            this.isPasswordValid = false;
            return false;
        }
        else{
            this.isPasswordValid = true;
        }


        if (this.passwordModel.password !== this.passwordModel.confirmPassword) {
            this.resetPasswordBtnReady = false;
            this.isPasswordMatch = false;
            return false;
        }
        else{
            this.isPasswordMatch = true;
        }

        return true;
    }

}
