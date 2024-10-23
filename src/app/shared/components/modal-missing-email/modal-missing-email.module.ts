import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalMissingEmailComponent } from './modal-missing-email.component';

@NgModule({
    declarations: [ModalMissingEmailComponent],

    imports: [
        CommonModule,
    ],
    exports: [ModalMissingEmailComponent],

})
export class ModalMissingEmailModule { }
