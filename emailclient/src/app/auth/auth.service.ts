import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

//******************* INTERFACES *******************/
interface IUsernameUniqueResponse {
  available: boolean;
}
interface ISignupResponse {
  username: string;
}
interface ISignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}
interface ISigninCredendials {
  username: string;
  password: string;
}
interface ISignedinResponse {
  authenticated: boolean;
  username: string;
}

//******************* CLASS *******************/
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  rootUrl = 'https://api.angular-email.com/auth/';
  signedIn$ = new BehaviorSubject(null);
  username = '';

  constructor(private http: HttpClient) { }

  usernameAvailable(username: string){
    console.log(username, `${this.rootUrl}username`);
    return this.http.post<IUsernameUniqueResponse>(`${this.rootUrl}username`
    , {username});
  }

  signup(credentials: ISignupCredentials) {
    return this.http.post<ISignupResponse>(`${this.rootUrl}signup`,
    credentials).pipe(
      tap(({username}) => {
        this.username = username;
        this.signedIn$.next(true);
      })
    );
  }

  checkAuth(){
    return this.http.get<ISignedinResponse>(`${this.rootUrl}signedin`)
    .pipe(
      tap(
        ({authenticated, username}) => {
          this.username = username;
          console.log(`auth: ${authenticated}`);
          this.signedIn$.next(authenticated);
        }
      )
    );
  }

  signout() {
    return this.http.post(`${this.rootUrl}signout`, {})
    .pipe(
      tap(() => {
        console.log('sign-out success');
        this.signedIn$.next(false);
        }
      )
    )
  }

  signin(credentials: ISigninCredendials) {
    return this.http.post<ISigninCredendials>(`${this.rootUrl}signin`, credentials)
    .pipe(
      tap(({username}) => {
        this.username = username;
        console.log('sign-in success');
        this.signedIn$.next(true);
      })
    );
  }
}
