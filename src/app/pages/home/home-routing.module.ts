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
                path: 'medical',
                data: { breadcrumb: 'Medical' },
                loadChildren: () =>
                    import('./medical/medical-home.module').then(
                        (m) => m.MedicalHomeModule,
                    ),
            },
            {
                path: 'guide',
                data: { breadcrumb: 'Guide' },
                loadChildren: () =>
                    import('./guide/guide-home.module').then(
                        (m) => m.GuideHomeModule,
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
            {
                path: 'profile',
                data: { breadcrumb: 'Profile' },
                loadChildren: () =>
                    import('./profile/profile-home.module').then(
                        (m) => m.ProfileHomeModule,
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
