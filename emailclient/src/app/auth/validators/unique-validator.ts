import { Injectable } from '@angular/core';
import { AsyncValidator, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class UniqueValidator implements AsyncValidator {
    constructor(private authService: AuthService){}
    validate = (control: FormControl): Observable<ValidationErrors> => {
        const {value} = control;
        //console.log(this.http);
        return this.authService.usernameAvailable(value)
            .pipe(
                map(() => null),
                catchError((err) => {
                    //console.log(err);
                    if(err.error.username) {
                        return  of({notUnique: true});
                    }
                    else {
                        return  of({requestFailed: true});
                    }
                })
            );
    }
    // registerOnValidatorChange?(fn: () => void): void {
    //     throw new Error("Method not implemented.");
    // }
}
