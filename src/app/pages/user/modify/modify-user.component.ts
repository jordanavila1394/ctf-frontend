import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { CompanyService } from 'src/app/services/company.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
    templateUrl: './modify-user.component.html',
    providers: [MessageService, ConfirmationService],
})
export class ModifyUserComponent implements OnInit {
    idUser: string;

    selectedLegalForm: any = null;
    selectedCeo: any = null;

    legalFormItems = [
        {
            name: 'Società a responsabilità limitata',
            id: 'Società a responsabilità limitata',
        },
        {
            name: 'Società per azioni',
            id: 'Società per azioni',
        },
    ];
    ceosItems: any;

    roles: [];
    companies: [];
    selectedRole: any;
    selectedCompany: any;

    modifyForm = this.fb.group({
        id: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        fiscalCode: ['', [Validators.required]],
        email: ['', [Validators.required]],
        cellphone: ['', [Validators.required]],
        roleId: ['', [Validators.required]],
        companyId: ['', [Validators.required]],
        workerNumber: [''],
        position: [''],
        status: [false, [Validators.required]],
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
        private route: ActivatedRoute,
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private userService: UserService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private roleService: RoleService,
    ) {
        this.ngxGpAutocompleteService.setOptions({
            componentRestrictions: { country: ['IT'] },
            types: ['geocode'],
        });
    }

    ngOnInit() {
        this.loadServices();
    }

    loadServices() {
        this.route.queryParams.subscribe((params) => {
            this.idUser = params['id'];
            this.modifyForm.patchValue({
                id: this.idUser,
            });
            this.userService.getUser(this.idUser).subscribe((user) => {
                const companyId = user?.companies[0]?.id
                    ? user?.companies[0]?.id
                    : '';
                const roleId = user?.roles[0]?.id ? user.roles[0].id : '';

                this.modifyForm.patchValue({
                    id: this.idUser,
                    name: user.name,
                    surname: user.surname,
                    fiscalCode: user.fiscalCode,
                    email: user.email,
                    cellphone: user.cellphone,
                    roleId: roleId,
                    companyId: companyId,
                    workerNumber: user.workerNumber,
                    position: user.position,
                    status: user.status,
                });
            });
            this.modifyForm.controls['roleId'].disable({
                onlySelf: true,
            });
            // this.modifyForm.controls['companyId'].disable({ onlySelf: true });
        });

        this.userService.getAllCeos().subscribe((ceos) => {
            this.ceosItems = ceos.map((ceo) => ({
                ...ceo,
                fullName: ceo.name + ' ' + ceo.surname,
            }));
        });
        this.roleService.getAllRoles().subscribe((roles) => {
            this.roles = roles;
        });
        this.companyService.getAllCompanies().subscribe((companies) => {
            this.companies = companies;
        });
    }

    selectAddress(place: any): void {}

    updateUser(): void {
        this.userService
            .patchUser(
                parseInt(this.modifyForm.value.id, 10),
                this.modifyForm.value.name,
                this.modifyForm.value.surname,
                this.modifyForm.value.fiscalCode,
                this.modifyForm.value.email,
                this.modifyForm.value.cellphone,
                this.modifyForm.value.roleId,
                this.modifyForm.value.companyId,
                this.modifyForm.value.workerNumber,
                this.modifyForm.value.position,
                this.modifyForm.value.status,
            )
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Avviso',
                    detail: 'Hai modificato l\'utente con successo',
                });
                this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
            });
    }
    goToTableUser() {
        this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
    }

    //Password
    checkPasswords(group: FormGroup) {
        const newPassword = group.get('newPassword').value;
        const confirmPassword = group.get('confirmPassword').value;

        return newPassword === confirmPassword ? null : { notSame: true };
    }

    savePassword() {
        this.userService
            .saveNewPassword(
                parseInt(this.idUser, 10),
                this.changePasswordForm.value.newPassword,
            )
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Avviso',
                    detail: 'Hai modificato la password con successo',
                });
                this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
            });
    }
}
