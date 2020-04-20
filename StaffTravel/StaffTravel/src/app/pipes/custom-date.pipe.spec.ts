import { CustomDatePipe } from './custom-date.pipe';
import * as moment from 'moment';
import { DatePipe } from '@angular/common'

describe('Testing date format transformation via CustomDatePipe vs Angulars native date pipe.', () => {
    fit('create an instance', () => {
        const pipe = new CustomDatePipe();
        expect(pipe).toBeTruthy();
    });

    let dateInputFormat1_jsFormat = 'MM/dd/yyyy';
    let dateInputFormat1_momentFormat = 'MM/DD/YYYY';
    let dateOutputFormat1_jsFormat = 'dd MMM yyyy';
    let dateOutputFormat1_momentFormat = 'DD MMM YYYY';

    const numberOfDaysToTest = 20000;
    for (let i: number = 0; i < numberOfDaysToTest; i++) {
        let moment_future = moment().add(i, 'days');
        let dateInput = moment_future.format(dateInputFormat1_momentFormat);

        fit('Transform date via custom date pipe ' + dateInput + ' to ' + dateOutputFormat1_jsFormat, () => {
            const custom_pipe = new CustomDatePipe();
            expect(custom_pipe.transform(dateInput, dateOutputFormat1_jsFormat + ',' + dateInputFormat1_momentFormat)).toEqual(moment_future.format(dateOutputFormat1_momentFormat));
        });

        fit('Transform date via angular date pipe ' + dateInput + ' to ' + dateOutputFormat1_jsFormat, () => {
            const ng_pipe = new DatePipe(navigator.language);
            expect(ng_pipe.transform(dateInput, dateOutputFormat1_jsFormat)).toEqual(moment_future.format(dateOutputFormat1_momentFormat));
        });
        
    }

    for (let i: number = 0; i < numberOfDaysToTest; i++) {
        let m = moment().subtract(i, 'days');
        let dateInput = m.format(dateInputFormat1_momentFormat);

        fit('Transform date via custom date pipe ' + dateInput + ' to ' + dateOutputFormat1_jsFormat, () => {
            const custom_pipe = new CustomDatePipe();
            expect(custom_pipe.transform(dateInput, dateOutputFormat1_jsFormat + ',' + dateInputFormat1_momentFormat)).toEqual(m.format(dateOutputFormat1_momentFormat));
        });

        fit('Transform date via angular date pipe ' + dateInput + ' to ' + dateOutputFormat1_jsFormat, () => {
            const ng_pipe = new DatePipe(navigator.language);
            expect(ng_pipe.transform(dateInput, dateOutputFormat1_jsFormat)).toEqual(m.format(dateOutputFormat1_momentFormat));
        });
    }

});
