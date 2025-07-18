import { AuthenticationReducer } from './auth/authentication.reducer';

import { MetaReducer } from '@ngrx/store';
import { HydrationMetaReducer } from './hydratation/hydratation.reducer';
import { DropdownSelectCompanyReducer } from './dropdown-select-company/dropdown-select-company.reducer';
import { DropdownSelectCurrencyReducer } from './dropdown-select-currency/dropdown-select-currency.reducer';

export const reducers = {
    authState: AuthenticationReducer,
    companyState: DropdownSelectCompanyReducer,
    currencyState: DropdownSelectCurrencyReducer,
};
export const metaReducers: MetaReducer[] = [HydrationMetaReducer];
