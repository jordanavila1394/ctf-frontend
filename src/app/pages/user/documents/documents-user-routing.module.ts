import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocumentsUserComponent } from './documents-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DocumentsUserComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DocumentsUserRoutingModule {}
