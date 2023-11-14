import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateUserComponent } from './create-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CreateUserComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class CreateUserRoutingModule {}
