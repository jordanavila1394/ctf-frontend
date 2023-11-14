import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'table',
                data: { breadcrumb: 'Table' },
                loadChildren: () =>
                    import('./table/table-user.module').then(
                        (m) => m.TableUserModule
                    ),
            },
            {
                path: 'create',
                data: { breadcrumb: 'Create' },
                loadChildren: () =>
                    import('./create/create-user.module').then(
                        (m) => m.CreateUserModule
                    ),
            },
            {
                path: 'modify',
                data: { breadcrumb: 'Modify' },
                loadChildren: () =>
                    import('./modify/modify-user.module').then(
                        (m) => m.ModifyUserModule
                    ),
            },
            {
                path: 'detail',
                data: { breadcrumb: 'Detail' },
                loadChildren: () =>
                    import('./detail/detail-user.module').then(
                        (m) => m.DetailUserModule
                    ),
            },

            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class UserRoutingModule {}
