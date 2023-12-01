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

import { AttendanceHomeComponent } from './attendance-home.component';
import { AttendanceHomeRoutingModule } from './attendance-home-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { GoogleMapsDemoModule } from 'src/app/shared/components/google-map/google-maps.module';

@NgModule({
    imports: [
        CommonModule,
        AttendanceHomeRoutingModule,
        GoogleMapsDemoModule,
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
    ],
    declarations: [AttendanceHomeComponent],
})
export class AttendanceHomeModule {}
