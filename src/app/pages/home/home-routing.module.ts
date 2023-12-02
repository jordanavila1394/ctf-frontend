import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'landing',
                data: { breadcrumb: 'Landing' },
                loadChildren: () =>
                    import('./landing/landing-home.module').then(
                        (m) => m.LandingHomeModule,
                    ),
            },
            {
                path: 'attendance',
                data: { breadcrumb: 'Attendance' },
                loadChildren: () =>
                    import('./attendance/attendance-home.module').then(
                        (m) => m.AttendanceHomeModule,
                    ),
            },
            {
                path: 'my-attendances',
                data: { breadcrumb: 'My Attendances' },
                loadChildren: () =>
                    import('./my-attendances/my-attendances-home.module').then(
                        (m) => m.MyAttendancesHomeModule,
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
