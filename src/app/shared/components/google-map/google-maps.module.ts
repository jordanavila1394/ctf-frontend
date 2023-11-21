import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { GoogleMapsDemoComponent } from './google-maps.component';

@NgModule({
    declarations: [GoogleMapsDemoComponent],
    imports: [
        CommonModule,
        GoogleMapsModule,
        HttpClientModule,
        HttpClientJsonpModule,
    ],
    exports: [GoogleMapsDemoComponent],
})
export class GoogleMapsDemoModule {}
