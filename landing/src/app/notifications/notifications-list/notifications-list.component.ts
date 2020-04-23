import { Component, OnInit } from '@angular/core';
import { NotificationsService, ICommand } from '../notifications.service';
import {toArray } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit {

  messages$: Observable<ICommand[]>;

  constructor(private ntfService: NotificationsService) { 
    this.messages$ = this.ntfService.messagesOutput;
    // setInterval(() => {
    //   this.ntfService.addError('It is NOT WORKING :( :( :(');
    //   ntfService.addSuccess('It is WORKING!!');
    // }, 2000)

  }

  ngOnInit(): void {
  }

  clearMessage(id: number) {
    this.ntfService.clearMessage(id);
  }

}
