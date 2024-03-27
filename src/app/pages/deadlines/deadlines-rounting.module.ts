import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'table',
                data: { breadcrumb: 'Table' },
                loadChildren: () =>
                    import('./table/table-deadlines.module').then(
                        (m) => m.TableDeadlinesModule,
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DeadlinesRoutingModule {}
