import { createAction } from '@ngrx/store';
import { props } from '@ngrx/store';
import { Company } from 'src/app/models/company';

export const setCompany = createAction(
    '[Select company Component] Change Company and Step List',
    props<{ currentCompany: any }>(),
);
