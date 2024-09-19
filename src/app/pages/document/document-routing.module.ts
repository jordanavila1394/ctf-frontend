import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            
            {
                path: 'create',
                data: { breadcrumb: 'Create' },
                loadChildren: () =>
                    import('./create/create-document.module').then(
                        (m) => m.CreateDocumentModule
                    ),
            },
            {
                path: 'expired',
                data: { breadcrumb: 'Expire' },
                loadChildren: () =>
                    import('./expired/expired-document.module').then(
                        (m) => m.ExpiredDocumentModule
                    ),
            }

        ]),
    ],
    exports: [RouterModule],
})
export class DocumentRoutingModule {}
