import { Passenger } from './passenger';
import { Hotel } from './hotel';
import { Flight } from './flight';
import { Ancillary } from './ancillary';
import { Note } from './note';
import { StatusEnum } from './enums';
import { ActivityLog } from './activity-log';

export class Request {
    constructor() {
        this.passengers = new Array<Passenger>(new Passenger);
        this.flights = new Array<Flight>();
        this.hotels = new Array<Hotel>();
        this.ancillaries = new Array<Ancillary>();
        this.notes = new Array<Note>();
        this.status = StatusEnum.Pending;
        this.requestDate = new Date();
    }
    id: number;
    employeeNumber: string;
    passengers: Passenger[];
    flights: Flight[];
    hotels: Hotel[];
    ancillaries: Ancillary[];
    notes: Note[];
    activityLogs: ActivityLog[];
    status: StatusEnum;
    requestDate: Date;
    reviewer:string;
    bookingNumber:number;
}