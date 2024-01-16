import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailMedicalHomeComponent } from './detail-medical-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DetailMedicalHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DetailMedicalHomeRoutingModule {}
