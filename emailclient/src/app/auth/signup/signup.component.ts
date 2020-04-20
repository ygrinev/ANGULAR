import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatchValidator } from '../validators/match-validator';
import { UniqueValidator } from '../validators/unique-validator';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  authForm = new FormGroup({
    username: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^\w+$/)
      ]
      ,[this.uniqueValidator.validate]
      ),
    password: new FormControl('',
    [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    passwordConfirmation: new FormControl('',
    [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ])

  },
  {
    validators: [
      this.matchValidator.validate
    ]
  });

  constructor(
    private matchValidator: MatchValidator, 
    private uniqueValidator: UniqueValidator,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  getErrors() {
    const {dirty, touched} = this.authForm.controls.passwordConfirmation;
    return dirty && touched ? this.authForm.errors : null;
  }

  onSubmit() {
    if(this.authForm.invalid) return;
    this.authService.signup(this.authForm.value).subscribe({
      next: (resp) => {
        // redirect to sign-in
        this.router.navigateByUrl('/inbox');
      },
      complete: () => {

      },
      error: (err) => {
        if(!err.status) {
          this.authForm.setErrors({ noConnection: true });
        }
        else{
          this.authForm.setErrors({ unknownError: true });
        }
      }
    });
  }
}
