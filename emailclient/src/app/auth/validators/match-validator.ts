import { Validator, ValidationErrors, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'}) 
export class MatchValidator implements Validator{
    validate(formGroup: FormGroup): ValidationErrors {
        const{password, passwordConfirmation} = formGroup.value;
        return password === passwordConfirmation ? null : {noMatch: true};
    }
    // registerOnValidatorChange?(fn: () => void): void {
    //     throw new Error("Method not implemented.");
    // }
}
