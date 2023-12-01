import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingHomeComponent } from './landing-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: LandingHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class LandingHomeRoutingModule {}
