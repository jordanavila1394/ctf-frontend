import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpiredDocumentComponent } from './expired-document.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ExpiredDocumentComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ExpiredDocumentRoutingModule { }
