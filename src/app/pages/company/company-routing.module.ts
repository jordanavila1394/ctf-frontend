import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'table',
                data: { breadcrumb: 'Table' },
                loadChildren: () =>
                    import('./table/table-company.module').then(
                        (m) => m.TableCompanyModule
                    ),
            },
            {
                path: 'places',
                data: { breadcrumb: 'Places' },
                loadChildren: () =>
                    import('./places/places-company.module').then(
                        (m) => m.PlacesCompanyModule
                    ),
            },
            {
                path: 'create',
                data: { breadcrumb: 'Create' },
                loadChildren: () =>
                    import('./create/create-company.module').then(
                        (m) => m.CreateCompanyModule
                    ),
            },
            {
                path: 'modify',
                data: { breadcrumb: 'Modify' },
                loadChildren: () =>
                    import('./modify/modify-company.module').then(
                        (m) => m.ModifyCompanyModule
                    ),
            },
            {
                path: 'detail',
                data: { breadcrumb: 'Detail' },
                loadChildren: () =>
                    import('./detail/detail-company.module').then(
                        (m) => m.DetailCompanyModule
                    ),
            },

        ]),
    ],
    exports: [RouterModule],
})
export class CompanyRoutingModule {}
