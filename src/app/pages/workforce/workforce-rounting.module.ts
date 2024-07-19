import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'table',
                data: { breadcrumb: 'Table' },
                loadChildren: () =>
                    import('./table/table-workforce.module').then(
                        (m) => m.TableWorkforceModule,
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class WorkforceRoutingModule { }
