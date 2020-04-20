import faker from 'faker';
import { IMappable } from './Map';

export class User implements IMappable {
    name: string;
    location: {
        lat : number;
        lng: number;
    }

    constructor() {
        this.name = faker.name.firstName();
        this.location = {
            lat: parseFloat(faker.address.latitude()),
            lng: parseFloat(faker.address.longitude())
        };
    }

    markerContent(): string {
        return `I am a User ${this.name}`;
    }
}