import faker from 'faker';
import { IMappable } from './Map';

export class Company implements IMappable {
    companyName: string;
    catchPhrase: string;
    location: {
        lat: number;
        lng: number;
    };

    constructor() {
        this.companyName = faker.company.companyName();
        this.catchPhrase = faker.company.catchPhrase();
        this.location = {
            lat: parseFloat(faker.address.latitude()),
            lng: parseFloat(faker.address.longitude())
        };
    }

    markerContent(): string {
        return `<h1>Company: ${this.companyName}</h1>
            <div><h3>Slogan: ${this.catchPhrase}</h3><div>
        `;
    }

}