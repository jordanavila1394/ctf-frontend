import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersAttendanceComponent } from './users-attendance.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: UsersAttendanceComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class UsersAttendanceRoutingModule {}
