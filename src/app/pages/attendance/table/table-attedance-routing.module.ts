import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableAttendanceComponent } from './table-attendance.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TableAttendanceComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class TableAttendanceRoutingModule {}
