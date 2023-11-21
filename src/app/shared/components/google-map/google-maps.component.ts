import { Component, Input } from '@angular/core';
import { Place } from 'src/app/models/place';

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
})
export class GoogleMapsDemoComponent {
    public markers: any[];
    public zoom: number;
    @Input() places: Place[];
    center: { lat: number; lng: number };

    constructor() {
        this.markers = [];
        this.zoom = 9.5;
    }

    ngOnInit() {
        for (let place of this.places) {
            this.center = {
                lat: parseFloat(place?.latitude),
                lng: parseFloat(place?.longitude),
            };
            this.markers.push({
                position: {
                    lat: parseFloat(place?.latitude),
                    lng: parseFloat(place?.longitude),
                },
                label: {
                    color: 'black',
                    text: place?.name,
                },
            });

            // address: 'marzabotto 28, corsico';
            // companyId: 11;
            // createdAt: '2023-11-17T12:55:03.000Z';
            // description: 'zona di test';
            // googlePlaceId: '';
            // id: 1;
            // latitude: '44.501247';
            // longitude: '11.311482';
            // name: 'via Marzabotto, 28';
            // updatedAt: null;
            // url: '';

            // "zona di test"
        }
    }
}
