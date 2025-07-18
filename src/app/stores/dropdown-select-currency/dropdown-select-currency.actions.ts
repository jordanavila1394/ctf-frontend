import { createAction } from '@ngrx/store';
import { props } from '@ngrx/store';
import { Currency } from 'src/app/models/currency';

export const setCurrency = createAction(
    '[Select currency Component] Change currency',
    props<{ currentCurrency: any }>(),
);
