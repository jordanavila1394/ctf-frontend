import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { TableClientComponent } from './table/table-client.component';
import { CreateClientComponent } from './create/create-client.component';
import { ModifyClientComponent } from './modify/modify-client.component';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        TableClientComponent,
        CreateClientComponent,
        ModifyClientComponent,
    ],
    imports: [
        CommonModule,
        ClientRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        ConfirmDialogModule,
        MenuModule,
        SelectButtonModule,
        TagModule,
        TranslateModule,
    ],
})
export class ClientModule {}
