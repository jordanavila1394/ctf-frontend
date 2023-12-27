import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocumentsHomeComponent } from './documents-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DocumentsHomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DocumentsHomeRoutingModule {}
