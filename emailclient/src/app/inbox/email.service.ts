import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmail } from './iemail';

interface IEmailListItem{
  id: string;
  subject: string;
  to: string;
  from: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  rootUrl = 'https://api.angular-email.com/';

  constructor(
    private http: HttpClient
  ) { }

  getEmails() {
    return this.http.get<IEmailListItem[]>(`${this.rootUrl}emails`);
  }

  getEmail(id: string) {
    return this.http.get<IEmail>(`${this.rootUrl}emails/${id}`);
  }
  
  sendEmail(email: IEmail) {
    return this.http.post(`${this.rootUrl}emails`, email);
  }
}
