import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailCompanyComponent } from './detail-company.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DetailCompanyComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DetailCompanyRoutingModule {}
