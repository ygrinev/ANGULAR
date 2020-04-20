import { AbstractControl } from '@angular/forms';

export class CustomValidators {

    static addition(resultCtrl: string, aCtrl: string, bCtrl: string){
        //console.log('a='+aCtrl+', b='+bCtrl+', res='+resultCtrl);
        return (form: AbstractControl) => form.value[aCtrl]+form.value[bCtrl]===parseInt(form.value[resultCtrl]) 
            ? null 
            : {addition: true};
      }
    static subtraction(form: AbstractControl){
        const{a,b,answer} = form.value;
        return a-b===parseInt(answer) ? null : {subtraction: true};
    }
}
