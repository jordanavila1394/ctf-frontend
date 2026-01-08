import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MigrationRoutingModule } from './migration-routing.module';
import { MigrationComponent } from './migration.component';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    declarations: [MigrationComponent],
    imports: [
        CommonModule,
        MigrationRoutingModule,
        FormsModule,
        CardModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        MessageModule,
        ChipModule,
        TableModule,
        TagModule,
        DropdownModule,
    ],
})
export class MigrationModule {}
