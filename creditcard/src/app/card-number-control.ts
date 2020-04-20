import { FormControl } from '@angular/forms';
export class CardNumberControl extends FormControl{
    setValue(value: string, options: any){
        if(value == null || !value.match(/^(\d{4}[-]){0,3}\d{0,4}$/g)){
            super.setValue(this.value);
            return;
        }
        //console.log(value + ', old: ' + this.value + ' ' + this.value.lastIndexOf('-') + this.value.length);

        super.setValue(value + ((value.length && this.value.lastIndexOf('-') != this.value.length-1 && value.length < 19 && value.match(/^(\d{4}[-]){0,3}\d{4}$/g)) ? '-' : ''), {...options, emitModelToViewChange:true});
    }

}
