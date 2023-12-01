import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AttendanceHomeComponent } from './attendance-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AttendanceHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AttendanceHomeRoutingModule {}
