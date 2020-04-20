import { FormControl } from '@angular/forms';

export class DateFormControl extends FormControl{
    setValue(value: string, options: any){
        if(!value || !value.match(/^([0-1]|0[1-9]|1[0-2]|0[1-9]\/|1[0-2]\/|0[1-9]\/[2-9][0-9]?|1[0-2]\/[2-9][0-9]?)$/gi)){
            super.setValue(this.value);
            return;
        }
        console.log(value + ', old: ' + this.value);
        super.setValue(value+(value.length == 2 ? '/' : ''), {...options, emitModelToViewChange:true});
    }
}
