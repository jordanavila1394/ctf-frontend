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
            }

        ]),
    ],
    exports: [RouterModule],
})
export class DocumentRoutingModule {}
