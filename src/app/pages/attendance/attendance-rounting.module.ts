import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'table',
                data: { breadcrumb: 'Table' },
                loadChildren: () =>
                    import('./table/table-attendance.module').then(
                        (m) => m.TableAttendanceModule,
                    ),
            },
            {
                path: 'users',
                data: { breadcrumb: 'Users' },
                loadChildren: () =>
                    import('./users/users-attendance.module').then(
                        (m) => m.UsersAttendanceModule,
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AttendanceRoutingModule {}
