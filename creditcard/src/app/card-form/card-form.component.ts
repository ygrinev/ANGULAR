import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateFormControl } from '../date-form-control';
import { CardNumberControl } from '../card-number-control';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css']
})
export class CardFormComponent implements OnInit {

  cardForm = new FormGroup({
    name: new FormControl('', 
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^\S.*\S$/)
    ]
    ),
    cardNumber: new CardNumberControl('',
      [
        Validators.required,
        Validators.minLength(19),
        Validators.maxLength(19)
      ]
    ), 
    expiration: new DateFormControl('',
    [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/([2-9][0-9])$/)
    ]), 
    securityCode: new FormControl('',
    [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3)
    ]
  )
  });
  constructor() { 
    console.log(this.cardForm.get('name'));
  }

  ngOnInit() {
  }

  onSubmit(){
    console.log("Form submitted");
  }

  onReset(){
    this.cardForm.reset();
  }

}
