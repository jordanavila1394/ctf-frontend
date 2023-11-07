import { RegisterRequest } from 'src/app/models/global.request';
import { LoginRequest } from './../../models/global.request';
import { createAction } from '@ngrx/store';
import { props } from '@ngrx/store';

//Login
export const logout = createAction('[Auth] Logout');
export const logoutConfirmation = createAction('[Auth] Logout Confirmation');
export const logoutConfirmationDismiss = createAction(
    '[Auth] Logout Confirmation Dismiss'
);

export const loginSuccess = createAction(
    '[Auth/API] Login Success',
    props<{ user: any }>()
);

export const loginFailure = createAction(
    '[Auth/API] Login Failure',
    props<{ error: any }>()
);

export const loginRedirect = createAction('[Auth/API] Login Redirect');

export const login = createAction(
    '[Login Page] Login',
    props<{ request: LoginRequest }>()
);

//Register

export const register = createAction(
    '[Register Page] Register',
    props<{ request: RegisterRequest }>()
);

export const registerSuccess = createAction(
    '[Auth/API] Register Success',
    props<{ user: any }>()
);

export const registerFailure = createAction(
    '[Auth/API] Register Failure',
    props<{ error: any }>()
);

export const idleTimeout = createAction('[User] Idle Timeout');
