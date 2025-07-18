import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StorageService } from './../../../services/storage.service';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../stores/auth/authentication.reducer';
import { login, loginWithPin } from '../../../stores/auth/authentication.actions';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from 'src/app/models/global.request';

import { environment } from 'src/environments/environment';

import { AppConfig } from 'src/app/app-config';
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
            .assistance-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            .currentdate-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.5rem;
                font-size: 0.6rem;
            }
        `,
    ],
})
export class LoginComponent {
    //Global variables
    operatorPhoneNumber: any;
    configCompanyName: any;

    constructor(
        public fb: FormBuilder,
        public layoutService: LayoutService,
        private messageService: MessageService,
        private store: Store<{ authState: any }>,
        private storageService: StorageService,
    ) {
        this.authState$ = store.select('authState');
        this.operatorPhoneNumber = environment?.operatorPhoneNumber;
        this.configCompanyName = AppConfig.companyName;

    }
    hidePassword = true;

    signInForm = this.fb.group({
        fiscalCode: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });
    pinForm = this.fb.group({
        pin: ['', [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(5),
            Validators.pattern(/^\d+$/) // solo numeri
        ]]
    });

    authState$: Observable<AuthState>;
    isLoggedIn = false;
    errorMessage = '';
    roles: string[] = [];
    valCheck: string[] = ['remember'];
    currentFiscalCode;
    currentPassword;
    rememberPassword = false;
    currentDate: Date = new Date();
    usePin = false;


    ngOnInit(): void {
        if (this.storageService.isLoggedIn()) {
            this.isLoggedIn = true;
            this.roles = this.storageService.getUser().roles;
        }

        this.currentFiscalCode = localStorage.getItem('fiscalCode');
        this.currentPassword = localStorage.getItem('password');
    }

    get fiscalCode() {
        return this.signInForm.get('fiscalCode');
    }

    get password() {
        return this.signInForm.get('password');
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    openWhatsAppChatOperator() {
        if (this.operatorPhoneNumber) {
            const whatsappLink = `https://wa.me/${this.operatorPhoneNumber}`;
            window.open(whatsappLink, '_blank');
        }
    }

    onSubmitSignIn(): void {
        const fiscalCode = this.signInForm.value.fiscalCode || '';
        const password = this.signInForm.value.password || '';

        localStorage.setItem('fiscalCode', fiscalCode);
        localStorage.setItem('password', password);

        const signInData = new LoginRequest(fiscalCode, password);
        this.store.dispatch(login({ request: signInData }));
    }

    onSubmitPinLogin(): void {
        if (this.pinForm.invalid) {
            this.pinForm.markAllAsTouched(); // mostra gli errori
            return;
        }

        const pinValue = this.pinForm.value.pin;
        // Esegui login con il PIN
        console.log('PIN:', pinValue);

        this.store.dispatch(loginWithPin({ request: { pin: pinValue } }));

        // Qui chiama il tuo servizio o logica di login
    }


    onFiscalCodeChange(value: string) {
        this.currentFiscalCode = value.toUpperCase().replace(/\s/g, ''); // Rimuovi gli spazi vuoti
    }
}
