import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { IEmail } from './iemail';
import { EmailService } from './email.service';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailResolverService implements Resolve<IEmail> {

  constructor(
    private emailServive: EmailService,
    private router: Router
  ) { }
  resolve(
    route: ActivatedRouteSnapshot
  ) {
    const {id} = route.params;
    return this.emailServive.getEmail(id).pipe(
      catchError(() => {
        this.router.navigateByUrl('/inbox/not-found');
        return EMPTY;
      })
    );
  }
}
