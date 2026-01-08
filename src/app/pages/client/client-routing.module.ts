import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableClientComponent } from './table/table-client.component';
import { CreateClientComponent } from './create/create-client.component';
import { ModifyClientComponent } from './modify/modify-client.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'table', component: TableClientComponent },
            { path: 'create', component: CreateClientComponent },
            { path: 'modify', component: ModifyClientComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ClientRoutingModule {}
