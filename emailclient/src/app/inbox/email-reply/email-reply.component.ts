import { Component, OnInit, Input } from '@angular/core';
import { IEmail } from '../iemail';
import { AuthService } from 'src/app/auth/auth.service';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-email-reply',
  templateUrl: './email-reply.component.html',
  styleUrls: ['./email-reply.component.css']
})
export class EmailReplyComponent {

  showModal = false;
  @Input() email: IEmail;

  constructor(private emailService: EmailService){}

  ngOnChanges(): void {
    if(this.email) {
      this.email = {
        ...this.email,
        from: this.email.to,
        to: this.email.from,
        subject: `${this.email.subject.indexOf('RE:') == 0 ? '' : 'RE: '}${this.email.subject}`,
        text: `\n\n\n\t  ------- ${this.email.from} wrote: --------:\n\t> ${this.email.text.replace(/\n/gi,'\n\t> ')}`
      };
    }
  }

  onSubmit(email: IEmail) {
    // console.log(email);
    // this.showModal = false;
    this.emailService.sendEmail(email).subscribe(() => {
      this.showModal = false;
    });
  }


}
