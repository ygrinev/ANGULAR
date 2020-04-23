import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { scan, map, toArray } from 'rxjs/operators';
//import { ValueConverter } from '@angular/compiler/src/render3/view/template';

export interface ICommand {
  id: number;
  type: 'success'|'error'|'clear';
  text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  messagesInput: Subject<ICommand> = new Subject<ICommand>();
  messagesOutput: Observable<ICommand[]>;

  constructor() { 
    this.messagesOutput = this.messagesInput.pipe(
      scan((acc: ICommand[], value: ICommand, _index: number) => {
        if(value.type === 'clear') {
          return acc.filter(el => (el.id != value.id));
        } else {
          return [...acc, value];
        }
      }, [])
    );
  }

  getMessages() {
  }

  addSuccess(message: string) {
    const id = this.randomId();
    this.messagesInput.next({
      id,
      text: message,
      type: 'success'
    });
    setTimeout(() => this.clearMessage(id), 5000);
  }

  addError(message: string) {
    const id = this.randomId();
    this.messagesInput.next({
      id,
      text: message,
      type: 'error'
    });
    setTimeout(() => this.clearMessage(id), 5000);
  }

  clearMessage(id: number) {
    this.messagesInput.next({
      id,
      type: 'clear'
    });
  }

  private randomId() {
    return Math.round(Math.random() * 10000);
  }
}
