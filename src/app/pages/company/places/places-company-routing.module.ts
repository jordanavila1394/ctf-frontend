import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlacesCompanyComponent } from './places-company.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PlacesCompanyComponent,
            },
        ]),
    ],
    exports: [RouterModule],
    
})
export class PlacesCompanyRoutingModule {}
