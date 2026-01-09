import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchRoutingModule } from './branch-routing.module';
import { TableBranchComponent } from './table/table-branch.component';
import { CreateBranchComponent } from './create/create-branch.component';
import { ModifyBranchComponent } from './modify/modify-branch.component';

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
        TableBranchComponent,
        CreateBranchComponent,
        ModifyBranchComponent,
    ],
    imports: [
        CommonModule,
        BranchRoutingModule,
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
export class BranchModule {}
