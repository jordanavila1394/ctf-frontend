import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GuideHomeComponent } from './guide-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: GuideHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class GuideHomeRoutingModule {}
