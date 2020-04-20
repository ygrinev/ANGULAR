import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpInterceptor
implements HttpInterceptor {
    constructor(){}
    intercept(
        req: HttpRequest<any>, 
        next: HttpHandler
    ) : Observable<HttpEvent<any>>
    {
        const modifiedReq = req.clone({
            withCredentials: true
        });
        //console.log(modifiedReq);
        return next.handle(modifiedReq);
    }

}
