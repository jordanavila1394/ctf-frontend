import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../stores/auth/authentication.reducer';
import { environment } from 'src/environments/environment';

const AUTH_API = environment.endpoint+'api/auth/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    authState$: Observable<AuthState>;
    isAuthenticated!: boolean;
    userRole!: string;

    constructor(
        private http: HttpClient,
        private store: Store<{ authState: AuthState }>
    ) {
        this.authState$ = store.select('authState');
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(
            AUTH_API + 'signin',
            {
                username,
                password,
            },
            httpOptions
        );
    }

    register(
        username: string,
        email: string,
        password: string
    ): Observable<any> {
        return this.http.post(
            AUTH_API + 'signup',
            {
                username,
                email,
                password,
            },
            httpOptions
        );
    }

    logout(): Observable<any> {
        return this.http.post(AUTH_API + 'signout', {}, httpOptions);
    }

    public getRole(): string {
        this.authState$.subscribe((authS) => {
            this.userRole = authS?.user?.role || '';
        });

        return this.userRole;
    }

    public getAuthStatus(): boolean {
        this.authState$.subscribe((authS) => {
            this.isAuthenticated = authS.isAuthenticated;
        });

        return this.isAuthenticated;
    }
}
