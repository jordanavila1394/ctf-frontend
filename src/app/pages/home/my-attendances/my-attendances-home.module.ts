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

import { MyAttendancesHomeComponent } from './my-attendances-home.component';
import { DropdownModule } from 'primeng/dropdown';
import { GoogleMapsDemoModule } from 'src/app/shared/components/google-map/google-maps.module';
import { MyAttendancesHomeRoutingModule } from './my-attendances-home-routing.module';

import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    imports: [
        CommonModule,
        GoogleMapsDemoModule,
        MyAttendancesHomeRoutingModule,
        FormsModule,
        ChartModule,
        MenuModule,
        DropdownModule,
        ReactiveFormsModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        TranslateModule,
        CalendarModule,
        ChipsModule,
        DropdownModule,
        InputMaskModule,
        InputNumberModule,
        CascadeSelectModule,
        MultiSelectModule,
        InputTextareaModule,
        InputTextModule,
    ],
    declarations: [MyAttendancesHomeComponent],
})
export class MyAttendancesHomeModule {}
