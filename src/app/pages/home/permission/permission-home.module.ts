import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';

import { PermissionHomeComponent } from './permission-home.component';
import { PermissionHomeRoutingModule } from './permission-home-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { GoogleMapsDemoModule } from 'src/app/shared/components/google-map/google-maps.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
    imports: [
        CommonModule,
        PermissionHomeRoutingModule,
        GoogleMapsDemoModule,
        ProgressSpinnerModule,
        FormsModule,
        ChartModule,
        FileUploadModule,
        MenuModule,
        DropdownModule,
        CalendarModule,
        InputTextModule,
        InputTextareaModule,
        ReactiveFormsModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        InputNumberModule,
        ButtonModule,
        TranslateModule,
    ],
    declarations: [PermissionHomeComponent],
})
export class PermissionHomeModule {}
