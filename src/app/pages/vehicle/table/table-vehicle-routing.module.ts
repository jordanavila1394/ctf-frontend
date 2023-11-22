import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableVehicleComponent } from './table-vehicle.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TableVehicleComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class TableVehicleRoutingModule {}
