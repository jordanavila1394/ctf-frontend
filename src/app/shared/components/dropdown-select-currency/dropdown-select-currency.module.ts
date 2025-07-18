import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownSelectCurrencyComponent } from './dropdown-select-currency.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [DropdownSelectCurrencyComponent],
    imports: [CommonModule, DropdownModule, FormsModule],
    exports: [DropdownSelectCurrencyComponent],
})
export class DropdownSelectCurrencyModule { }
