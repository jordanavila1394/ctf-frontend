import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableUserComponent } from './table-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TableUserComponent,
            },
        ]),
    ],
    exports: [RouterModule],
    
})
export class TableUserRoutingModule {}
