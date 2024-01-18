//Angular
import { Component, OnInit } from '@angular/core';

//Services
import { LayoutService } from 'src/app/layout/service/app.layout.service';

//Store
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { AuthState } from 'src/app/stores/auth/authentication.reducer';

//Libraies
import * as moment from 'moment';

//Utils
import Formatter from 'src/app/utils/formatters';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { PermissionService } from 'src/app/services/permission.service';
import { MessageService } from 'primeng/api';
import { EmailService } from 'src/app/services/email.service';
import { environment } from 'src/environments/environment';

@Component({
    templateUrl: './profile-home.component.html',
    styleUrls: ['./profile-home.component.scss'],
})
export class ProfileHomeComponent implements OnInit {
    //Store
    subscription: Subscription;
    authState$: Observable<AuthState>;
    currentUser: any;

    profileForm = this.fb.group({
        fiscalCode: [''],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: [''],
        cellphone: [''],
    });

    changePasswordForm = this.fb.group(
        {
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: [
                '',
                [Validators.required, Validators.minLength(6)],
            ],
        },
        { validator: this.checkPasswords },
    );

    constructor(
        public fb: FormBuilder,
        public layoutService: LayoutService,
        private permissionService: PermissionService,
        private messageService: MessageService,
        private userService: UserService,
        private emailService: EmailService,
        private router: Router,
        private store: Store<{ authState: AuthState }>,
    ) {
        //Init
        this.authState$ = store.select('authState');
    }

    ngOnInit(): void {
        this.authState$.subscribe((authS) => {
            this.currentUser = authS?.user || '';
            this.loadServices(this.currentUser);
        });
        const layourServiceSubscription =
            this.layoutService.configUpdate$.subscribe(() => {
                this.loadServices(this.currentUser);
            });
        if (this.subscription) {
            this.subscription.add(layourServiceSubscription);
        }
    }
    loadServices(currentUser) {
        const userServiceSubscription = this.userService
            .getUser(currentUser.id)
            .subscribe((data) => {
                this.currentUser = data;

                this.profileForm.patchValue({
                    name: this.currentUser.name,
                    surname: this.currentUser.surname,
                    email: this.currentUser.email,
                    cellphone: this.currentUser.cellphone,
                    fiscalCode: this.currentUser.fiscalCode,
                });
                this.profileForm.controls['fiscalCode'].disable({
                    onlySelf: true,
                });
            });

        if (userServiceSubscription && this.subscription)
            this.subscription.add(userServiceSubscription);
    }
    saveProfile() {
        this.userService
            .saveProfileUser(
                parseInt(this.currentUser.id, 10),
                this.profileForm.value.name,
                this.profileForm.value.surname,
                this.profileForm.value.fiscalCode,
                this.profileForm.value.email,
                this.profileForm.value.cellphone,
            )
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Avviso',
                    detail: 'Hai modificato il profilo con successo',
                });
                this.router.navigate([ROUTES.ROUTE_LANDING_HOME]);
            });
    }
    checkPasswords(group: FormGroup) {
        const newPassword = group.get('newPassword').value;
        const confirmPassword = group.get('confirmPassword').value;

        return newPassword === confirmPassword ? null : { notSame: true };
    }

    savePassword() {
        this.userService
            .saveNewPassword(
                parseInt(this.currentUser.id, 10),
                this.changePasswordForm.value.newPassword,
            )
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Avviso',
                    detail: 'Hai modificato la password con successo',
                });
                this.router.navigate([ROUTES.ROUTE_LANDING_HOME]);
            });
    }
}
