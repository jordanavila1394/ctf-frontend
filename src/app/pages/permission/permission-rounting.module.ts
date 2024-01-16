import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'table',
                data: { breadcrumb: 'Table' },
                loadChildren: () =>
                    import('./table/table-permission.module').then(
                        (m) => m.TablePermissionModule,
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class PermissionRoutingModule {}
