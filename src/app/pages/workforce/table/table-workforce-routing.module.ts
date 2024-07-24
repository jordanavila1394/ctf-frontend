import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableWorkforceComponent } from './table-workforce.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TableWorkforceComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class TableWorkforceRoutingModule {}
