import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionHomeComponent } from './permission-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PermissionHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class PermissionHomeRoutingModule {}
