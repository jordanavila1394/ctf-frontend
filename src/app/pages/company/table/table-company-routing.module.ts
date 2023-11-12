import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableCompanyComponent } from './table-company.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TableCompanyComponent,
            },
        ]),
    ],
    exports: [RouterModule],
    
})
export class TableCompanyRoutingModule {}
