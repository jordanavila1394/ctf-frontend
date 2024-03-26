import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableDeadlinesComponent } from './table-deadlines.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TableDeadlinesComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class TableDeadlinesRoutingModule {}
