import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setCurrency } from 'src/app/stores/dropdown-select-currency/dropdown-select-currency.actions';
import { CurrencyState } from 'src/app/stores/dropdown-select-currency/dropdown-select-currency.reducer';

@Component({
  selector: 'app-dropdown-select-currency',
  templateUrl: './dropdown-select-currency.component.html',
})
export class DropdownSelectCurrencyComponent implements OnInit {
  selectedCurrency: any;
  currencies = [
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'British Pound (GBP)', value: 'GBP' },
    { label: 'Japanese Yen (JPY)', value: 'JPY' },
    { label: 'Swiss Franc (CHF)', value: 'CHF' },
    { label: 'Canadian Dollar (CAD)', value: 'CAD' },
    { label: 'Australian Dollar (AUD)', value: 'AUD' }
  ];

  constructor(private store: Store<{ currencyState: CurrencyState }>) { }

  ngOnInit(): void {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const parsed = JSON.parse(savedCurrency);
      this.selectedCurrency = this.currencies.find(c => c.value === parsed.value);
      this.store.dispatch(setCurrency({ currentCurrency: this.selectedCurrency }));
    } else {
      this.selectedCurrency = this.currencies[0]; // Default to Euro
      localStorage.setItem('selectedCurrency', JSON.stringify(this.selectedCurrency));
      this.store.dispatch(setCurrency({ currentCurrency: this.selectedCurrency }));
    }
  }

  onChangeCurrency(event: any): void {
    this.selectedCurrency = event.value;
    localStorage.setItem('selectedCurrency', JSON.stringify(this.selectedCurrency));
    this.store.dispatch(setCurrency({ currentCurrency: this.selectedCurrency }));
  }
}
