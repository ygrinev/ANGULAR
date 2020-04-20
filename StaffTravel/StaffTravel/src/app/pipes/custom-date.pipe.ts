import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Moment } from 'moment';

/*
* Overrides the default date pipe in angular by using the same name 'date'
* To maintain the formats already being used across the site which was meant for the angular pipe we transform the format to upper case as this is the format that momentJs uses
* Original Issue: http://yyztfs3:8080/tfs/web/wi.aspx?pcguid=2ef8fee7-ca25-4dd4-8ce1-8f34e45f0864&id=21047
*/

@Pipe({
    name: 'date'
})
export class CustomDatePipe implements PipeTransform {

    transform(value: string, args?: string): string | null {
        if (!value)
            return '';

        let argsArray: string[];
        let outputFormat: string;
        let inputFormat: string;
        let formattedDate: string = null;
        let inputDate: Moment;

        argsArray = args.split(',');

        if (argsArray.length > 0)
            outputFormat = argsArray[0];

        if (args.split(',').length > 1)
            inputFormat = argsArray[1];

        if (inputFormat)
            inputDate = moment(value, inputFormat);
        else
            inputDate = moment(value);

        if (inputDate.isValid()) {
            if (outputFormat)
                formattedDate = inputDate.format(outputFormat.toUpperCase());
            else
                formattedDate = inputDate.format();
        }

        return formattedDate;
    }

}
