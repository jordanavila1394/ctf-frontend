import { createReducer, on } from '@ngrx/store';
import { setCurrency} from './dropdown-select-currency.actions';
import { Currency  } from 'src/app/models/currency';

export const initialState: CurrencyState = {
    currentCurrency: { label: 'Euro (EUR)', value: 'EUR' },
};
export interface CurrencyState {
    currentCurrency: any;
}

export const DropdownSelectCurrencyReducer = createReducer(
    initialState,

    on(setCurrency, (state, { currentCurrency }) => ({
        ...state,
        currentCurrency,
    })),
);
