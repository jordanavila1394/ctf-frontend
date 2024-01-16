import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListMedicalHomeComponent } from './list-medical-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ListMedicalHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ListMedicalHomeRoutingModule {}
