import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileHomeComponent } from './profile-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ProfileHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ProfileHomeRoutingModule {}
