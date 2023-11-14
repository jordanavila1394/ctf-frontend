import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModifyCompanyComponent } from './modify-company.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ModifyCompanyComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ModifyCompanyRoutingModule {}
