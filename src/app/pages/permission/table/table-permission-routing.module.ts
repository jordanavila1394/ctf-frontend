import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablePermissionComponent } from './table-permission.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TablePermissionComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class TablePermissionRoutingModule {}
