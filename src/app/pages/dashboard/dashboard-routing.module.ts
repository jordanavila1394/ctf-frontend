import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../services/auth.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthGuard],
            },
        ]),
    ],
    exports: [RouterModule],
    providers: [AuthGuard],
})
export class DashboardsRoutingModule {}
