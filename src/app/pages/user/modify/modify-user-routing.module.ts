import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModifyUserComponent } from './modify-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ModifyUserComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ModifyUserRoutingModule {}
