import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  authForm = new FormGroup({
    username: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^\w+$/)
  ]),
    password: new FormControl('',[
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ])
  });
  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit(){
    if(this.authForm.invalid) return;
    this.authService.signin(this.authForm.value)
    .subscribe({
      next: () => {
        this.router.navigateByUrl('/inbox');
      },
      error: (err) => {
        //console.log(err.error.username + ' ' + err.error.password);
        if(err.error.username || err.error.password) {
          this.authForm.setErrors({credentials: true});
        }
        //console.log(err);
      }
    });
  }

  getErrors() {
    const {dirty, touched} = this.authForm.controls.password;
    //console.log(dirty + ' ' + touched);
    return dirty && touched ? this.authForm.errors : null;
  }


}
