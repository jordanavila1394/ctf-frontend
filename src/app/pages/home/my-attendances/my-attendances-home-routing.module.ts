import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyAttendancesHomeComponent } from './my-attendances-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MyAttendancesHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MyAttendancesHomeRoutingModule {}
