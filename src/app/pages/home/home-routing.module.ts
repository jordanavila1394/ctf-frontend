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
            {
                path: 'permission',
                data: { breadcrumb: 'Permission' },
                loadChildren: () =>
                    import('./permission/permission-home.module').then(
                        (m) => m.PermissionHomeModule,
                    ),
            },
            {
                path: 'documents',
                data: { breadcrumb: 'Documents' },
                loadChildren: () =>
                    import('./documents/documents-home.module').then(
                        (m) => m.DocumentsHomeModule,
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
