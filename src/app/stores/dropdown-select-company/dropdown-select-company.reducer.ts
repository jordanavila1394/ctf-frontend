import { createReducer, on } from '@ngrx/store';
import { setCompany } from './dropdown-select-company.actions';
import { Company } from 'src/app/models/company';

export const initialState: CompanyState = {
    currentCompany: { id: 0, name: 'All' },
};
export interface CompanyState {
    currentCompany: any;
}

export const DropdownSelectCompanyReducer = createReducer(
    initialState,

    on(setCompany, (state, { currentCompany }) => ({
        ...state,
        currentCompany,
    })),
);
