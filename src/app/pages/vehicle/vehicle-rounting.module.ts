import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'table',
                data: { breadcrumb: 'Table' },
                loadChildren: () =>
                    import('./table/table-vehicle.module').then(
                        (m) => m.TableVehicleModule
                    ),
            },
            {
                path: 'create',
                data: { breadcrumb: 'Create' },
                loadChildren: () =>
                    import('./create/create-vehicle.module').then(
                        (m) => m.CreateVehicleModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class VehicleRoutingModule {}
