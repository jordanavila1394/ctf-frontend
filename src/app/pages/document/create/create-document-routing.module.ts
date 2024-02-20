import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateDocumentComponent } from './create-document.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CreateDocumentComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class CreateDocumentRoutingModule {}
