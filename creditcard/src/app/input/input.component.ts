import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { $ } from 'protractor';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() control: FormControl;
  @Input() label: string;
  constructor() { }

  ngOnInit() {
  }

  hasErrors(){
    const {dirty, touched, errors} = this.control;
    return dirty && touched && errors;
  }

  // public setMaskAttr(attr: string, value: string)
  // {
  //   if(this.label.includes('Number'))
  //     $('input').attr('mask','0000-0000-0000-0000');
  // }
}
