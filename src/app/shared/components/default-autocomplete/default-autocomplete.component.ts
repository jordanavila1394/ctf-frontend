import { Component, Input, ViewChild } from '@angular/core';
import {
    NgxGpAutocompleteDirective,
    NgxGpAutocompleteOptions,
} from '@angular-magic/ngx-gp-autocomplete';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-default-autocomplete',
    templateUrl: './default-autocomplete.component.html',
    styleUrls: ['./default-autocomplete.component.scss'],
})
export class DefaultAutocompleteComponent {
    @Input() defaultAutocompleteForm: FormGroup;
    @Input() controlName: string;
    @ViewChild('ngxPlaces') placesRef: NgxGpAutocompleteDirective;
    options: NgxGpAutocompleteOptions = {
        componentRestrictions: { country: ['IT'] },
        types: ['geocode'],
    };
    output: string;
    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.defaultAutocompleteForm.addControl(
            this.controlName,
            new FormControl('', Validators.required)
        );
    }
    public handleAddressChange(place: google.maps.places.PlaceResult) {
        // Do some stuff
        this.defaultAutocompleteForm.controls[this.controlName].setValue(
            place.formatted_address
        );
        this.defaultAutocompleteForm.controls[
            this.controlName + 'Lat'
        ].setValue(place.geometry.location.lat());
        this.defaultAutocompleteForm.controls[
            this.controlName + 'Long'
        ].setValue(place.geometry.location.lng());
        this.defaultAutocompleteForm.controls[
            this.controlName + 'PlaceId'
        ].setValue(place.place_id);
        this.defaultAutocompleteForm.controls[
            this.controlName + 'Url'
        ].setValue(place.url);
    }
}
