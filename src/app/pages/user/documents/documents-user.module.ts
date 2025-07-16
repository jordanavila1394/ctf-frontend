//Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//PrimeNG
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelMenuModule } from 'primeng/panelmenu';

//AutoComplete Google
import { DefaultAutocompleteModule } from '../../../shared/components/default-autocomplete/default-autocomplete.module';

// Components
import { DocumentsUserComponent } from './documents-user.component';
import { DocumentsUserRoutingModule } from './documents-user-routing.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        ConfirmDialogModule,
        DefaultAutocompleteModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        FileUploadModule,
        InputTextModule,
        InputTextareaModule,
        InputSwitchModule,
        DocumentsUserRoutingModule,
        MultiSelectModule,
        ProgressBarModule,
        RatingModule,
        PanelMenuModule,
        CalendarModule,
        PanelModule,
        ReactiveFormsModule,
        RippleModule,
        SliderModule,
        TableModule,
        ToastModule,
        TranslateModule,
        ToggleButtonModule,
    ],
    declarations: [DocumentsUserComponent],
})
export class DocumentsUserModule {}
