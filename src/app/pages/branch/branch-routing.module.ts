import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableBranchComponent } from './table/table-branch.component';
import { CreateBranchComponent } from './create/create-branch.component';
import { ModifyBranchComponent } from './modify/modify-branch.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'table', component: TableBranchComponent },
            { path: 'create', component: CreateBranchComponent },
            { path: 'modify', component: ModifyBranchComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class BranchRoutingModule {}
