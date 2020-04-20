import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { IEmail } from '../iemail';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent implements OnInit {

  emailForm: FormGroup;
  @Input() email: IEmail;
  @Output() emailSubmit = new EventEmitter();

  constructor(private emailService: EmailService) { }

  ngOnInit(): void {
    const {subject,from,to,text} = this.email;
    this.emailForm = new FormGroup({
      to: new FormControl(to,[
        Validators.required,
        Validators.email
      ]),
      from: new FormControl({value: from, disabled: true}),
      subject: new FormControl(subject,[Validators.required]),
      text:  new FormControl(text,[Validators.required])
    })
  }

  onSubmit() {
    this.emailSubmit.emit(this.emailForm.value);
  }

}
