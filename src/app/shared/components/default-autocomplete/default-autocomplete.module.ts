import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { DefaultAutocompleteComponent } from './default-autocomplete.component';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';

@NgModule({
    declarations: [DefaultAutocompleteComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatCardModule,
        NgxGpAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [DefaultAutocompleteComponent],
})
export class DefaultAutocompleteModule {}
