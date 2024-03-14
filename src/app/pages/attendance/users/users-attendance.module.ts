import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { GalleriaModule } from 'primeng/galleria';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

import { UsersAttendanceRoutingModule } from './users-attedance-routing.module';
import { UsersAttendanceComponent } from './users-attendance.component';
import { TranslateModule } from '@ngx-translate/core';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
    imports: [
        CommonModule,
        UsersAttendanceRoutingModule,
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
        GalleriaModule,
        MultiSelectModule,
        DropdownModule,
        DynamicDialogModule,
        ProgressBarModule,
        InputTextareaModule,
        MenuModule,
        FormsModule,
        SplitButtonModule,
        TranslateModule,
        ReactiveFormsModule,
        ToastModule,
    ],
    declarations: [UsersAttendanceComponent],
})
export class UsersAttendanceModule {}
