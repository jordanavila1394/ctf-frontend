import { AuthenticationReducer } from './auth/authentication.reducer';

import { MetaReducer } from '@ngrx/store';
import { HydrationMetaReducer } from './hydratation/hydratation.reducer';
import { DropdownSelectCompanyReducer } from './dropdown-select-company/dropdown-select-company.reducer';

export const reducers = {
    authState: AuthenticationReducer,
    companyState: DropdownSelectCompanyReducer,
};
export const metaReducers: MetaReducer[] = [HydrationMetaReducer];
