import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../stores/auth/authentication.reducer';
import { environment } from 'src/environments/environment';

const API_URL = environment.endpoint + 'api/auth/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    authState$: Observable<AuthState>;
    isAuthenticated!: boolean;
    userRoles!: string;
    user: any;

    constructor(
        private http: HttpClient,
        private store: Store<{ authState: AuthState }>,
    ) {
        this.authState$ = store.select('authState');
    }

    login(fiscalCode: string, password: string): Observable<any> {
        return this.http.post(
            API_URL + 'signin',
            { fiscalCode: fiscalCode, password: password },
            httpOptions,
        );
    }

    register(
        fiscalCode: string,
        email: string,
        password: string,
    ): Observable<any> {
        return this.http.post(
            API_URL + 'signup',
            {
                fiscalCode,
                email,
                password,
            },
            httpOptions,
        );
    }

    logout(): Observable<any> {
        return this.http.post(API_URL + 'signout', {}, httpOptions);
    }

    public getRoles(): any {
        this.authState$.subscribe((authS) => {
            this.userRoles = authS?.user?.roles || '';
        });

        return this.userRoles;
    }

    public getUser(): any {
        this.authState$.subscribe((authS) => {
            this.user = authS?.user || '';
        });
        return this.user;
    }

    public getAuthStatus(): boolean {
        this.authState$.subscribe((authS) => {
            this.isAuthenticated = authS.isAuthenticated;
        });

        return this.isAuthenticated;
    }
}
