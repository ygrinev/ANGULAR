export interface IMappable {
    location:{
        lat: number;
        lng: number;
    };
    markerContent(): string;
}

export class CustomMap {
    private gMap: google.maps.Map;
    constructor(id: string) {
        this.gMap = new google.maps.Map(document.getElementById(id), {
            center: {lat: 0, lng: 0},
            zoom: 1
        });
        
    }

    addMarker(item: IMappable): void {
        const marker = new google.maps.Marker({
            map: this.gMap,
            position: {lat: item.location.lat, lng: item.location.lng}
        });
        marker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow({
                content: item.markerContent()
            });
            infoWindow.open(this.gMap, marker);
        })
    }

    // addUserMarker(user: User): void {
    //     new google.maps.Marker({
    //         map: this.gMap,
    //         position: {lat: user.location.lat, lng: user.location.lng}
    //     })
    // }

    // addCompanyMarker(company: Company): void {
    //     new google.maps.Marker({
    //         map: this.gMap,
    //         position: {lat: company.location.lat, lng: company.location.lng}
    //     })
    // }
}