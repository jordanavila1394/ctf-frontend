import { LoginRequest, RegisterRequest } from './../../models/global.request';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import {
    login,
    loginRedirect,
    logout,
    logoutConfirmation,
    logoutConfirmationDismiss,
    loginSuccess,
    loginFailure,
    idleTimeout,
    register,
    registerSuccess,
    registerFailure,
} from './authentication.actions';

import { AuthService } from '../../services/auth.service';

import { ROUTES } from '../../utils/constants';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthEffects {
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            map((action) => action.request),
            exhaustMap((auth: LoginRequest) =>
                this.authService.login(auth.username, auth.password).pipe(
                    map((user) => loginSuccess({ user })),
                    catchError((error) => of(loginFailure({ error }))),
                ),
            ),
        ),
    );

    loginSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loginSuccess),
                tap(() => this.router.navigate([ROUTES.ROUTE_HOME])),
            ),
        { dispatch: false },
    );
    loginFailure$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loginFailure),
                tap((res) =>
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: res?.error?.error?.message,
                    }),
                ),
            ),
        { dispatch: false },
    );

    removeLocalStorage$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(logout),
                tap(() => localStorage.removeItem('state')),
            ),
        { dispatch: false },
    );

    loginRedirect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loginRedirect, logout),
                tap(() => {
                    this.router.navigate([ROUTES.ROUTE_LOGIN]);
                }),
            ),
        { dispatch: false },
    );

    logoutConfirmation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutConfirmation),
            map((result) => (result ? logout() : logoutConfirmationDismiss())),
        ),
    );

    logoutIdleUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(idleTimeout),
            map(() => logout()),
        ),
    );

    //Register effects
    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(register),
            map((action) => action.request),
            exhaustMap((auth: RegisterRequest) =>
                this.authService
                    .register(auth.username, auth.email, auth.password)
                    .pipe(
                        map((user) => registerSuccess({ user })),
                        catchError((error) => of(registerFailure({ error }))),
                    ),
            ),
        ),
    );

    registerSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(registerSuccess),
                tap(() =>
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Created User',
                    }),
                ),
            ),
        { dispatch: false },
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router,
        public messageService: MessageService,
    ) {}
}
