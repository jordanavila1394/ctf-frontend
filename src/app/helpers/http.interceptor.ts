import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import {
    catchError,
    finalize,
    mergeMap,
    retry,
    retryWhen,
    tap,
} from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { AuthState } from '../stores/auth/authentication.reducer';
import { logout } from '../stores/auth/authentication.actions';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    authState$: Observable<AuthState>;

    constructor(
        private loadingService: LoaderService,
        private messageService: MessageService,
        private store: Store<{ authState: AuthState }>
    ) {
        this.authState$ = store.select('authState');
    }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(
                (event) => {
                    if (event instanceof HttpResponse) {
                        if (event.status == 201)
                            this.messageService.add({
                                severity: 'success',
                                summary: 'OK',
                                detail: event?.body?.message,
                                life: 3000,
                            });
                    }
                },
                (error) => {
                    if (error.status == 400)
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Errore',
                            detail: error?.error?.message,
                            life: 3000,
                        });
                    if (error.status == 401) this.store.dispatch(logout());

                    if (error.status == 409)
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Attenzione',
                            detail: error?.error?.message,
                            life: 3000,
                        });
                }
            )
        );
    }
}
