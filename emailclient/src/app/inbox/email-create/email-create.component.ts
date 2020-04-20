import { Component, OnInit } from '@angular/core';
import { IEmail } from '../iemail';
import { AuthService } from 'src/app/auth/auth.service';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-email-create',
  templateUrl: './email-create.component.html',
  styleUrls: ['./email-create.component.css']
})
export class EmailCreateComponent implements OnInit {
  email: IEmail;
  showModal = false;
  constructor(
    private authService: AuthService,
    private emailService: EmailService
  ) { 
    this.email = {
      id:'',
      to:'',
      from:`${this.authService.username}@angular-mail.com`,
      text:'',
      subject:'',
      html:''
    }
  }

  ngOnInit(): void {}

  onSubmit(email: IEmail) {
    // console.log(email);
    // this.showModal = false;
    this.emailService.sendEmail(email).subscribe(() => {
      this.showModal = false;
    });
  }

}
