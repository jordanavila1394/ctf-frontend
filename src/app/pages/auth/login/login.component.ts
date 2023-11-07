import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StorageService } from './../../../services/storage.service';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../stores/auth/authentication.reducer';
import { login } from '../../../stores/auth/authentication.actions';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from 'src/app/models/global.request';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    constructor(
        public fb: FormBuilder,
        public layoutService: LayoutService,
        private messageService: MessageService,
        private store: Store<{ authState: any }>,
        private storageService: StorageService
    ) {
        this.authState$ = store.select('authState');
    }
    signInForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });
    authState$: Observable<AuthState>;
    isLoggedIn = false;
    errorMessage = '';
    roles: string[] = [];
    valCheck: string[] = ['remember'];

    ngOnInit(): void {
        if (this.storageService.isLoggedIn()) {
            this.isLoggedIn = true;
            this.roles = this.storageService.getUser().roles;
        }
    }
    get username() {
        return this.signInForm.get('username');
    }

    get password() {
        return this.signInForm.get('password');
    }

    onSubmitSignIn(): void {
        const username = this.signInForm.value.username || '';
        const password = this.signInForm.value.password || '';

        const signInData = new LoginRequest(username, password);
        this.store.dispatch(login({ request: signInData }));
    }
}
