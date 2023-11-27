import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateVehicleComponent } from './create-vehicle.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CreateVehicleComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class CreateVehicleRoutingModule {}
