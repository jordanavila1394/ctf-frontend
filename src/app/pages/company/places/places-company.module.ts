import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlacesCompanyComponent } from './places-company.component';
import { PlacesCompanyRoutingModule } from './places-company-routing.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { DefaultAutocompleteModule } from 'src/app/shared/components/default-autocomplete/default-autocomplete.module';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MenuModule } from 'primeng/menu';
import { GoogleMapsDemoModule } from 'src/app/shared/components/google-map/google-maps.module';

@NgModule({
    imports: [
        CommonModule,
        PlacesCompanyRoutingModule,
        DefaultAutocompleteModule,
        GoogleMapsDemoModule,
        DialogModule,
        ConfirmDialogModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        CalendarModule,
        ConfirmPopupModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        MenuModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
    ],
    declarations: [PlacesCompanyComponent],
})
export class PlacesCompanyModule {}
