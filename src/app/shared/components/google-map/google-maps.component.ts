import { Component, Input, OnInit } from '@angular/core';
import { Place } from 'src/app/models/place';

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
})
export class GoogleMapsDemoComponent implements OnInit {
    public markers: any[];
    public zoom: number;
    @Input() places: Place[];
    @Input() customZoom: number;

    center: { lat: number; lng: number };

    constructor() {
        this.markers = [];
    }

    ngOnInit() {
        this.zoom = this.customZoom ? this.customZoom : 9.5;
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
        }
    }
}
