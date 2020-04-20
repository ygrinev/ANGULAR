import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEmail } from '../iemail';

@Component({
  selector: 'app-email-show',
  templateUrl: './email-show.component.html',
  styleUrls: ['./email-show.component.css']
})
export class EmailShowComponent implements OnInit {

  email: IEmail;

  constructor(
    private route: ActivatedRoute
  ) { 
    //console.log(this.route.snapshot.data);
    this.route.snapshot.data.email;
    this.route.data.subscribe(({email})=>{this.email = email});
  }

  ngOnInit() {}

}
