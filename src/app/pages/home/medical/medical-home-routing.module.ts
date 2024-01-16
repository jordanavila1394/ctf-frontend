import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { MedicalHomeModule } from './medical-home.module';
import { ListMedicalHomeModule } from './list/list-medical-home.module';
import { DetailMedicalHomeModule } from './detail/detail-medical-home.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: ':id',
                loadChildren: () => DetailMedicalHomeModule,
            },
            {
                path: '',
                loadChildren: () => ListMedicalHomeModule,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MedicalHomeRoutingModule {}
