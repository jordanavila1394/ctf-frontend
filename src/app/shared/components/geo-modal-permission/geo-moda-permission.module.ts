import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoModalPermissionComponent } from './geo-modal-permission.component';

@NgModule({
    declarations: [GeoModalPermissionComponent],

    imports: [
        CommonModule,
    ],
    exports: [GeoModalPermissionComponent],

})
export class GeoModalPermissionModule { }
