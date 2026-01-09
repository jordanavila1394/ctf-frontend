import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MigrationComponent } from './migration.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: MigrationComponent }]),
    ],
    exports: [RouterModule],
})
export class MigrationRoutingModule {}
