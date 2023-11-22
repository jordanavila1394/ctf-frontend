import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { RoleService } from 'src/app/services/role.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
    templateUrl: './create-user.component.html',
    providers: [MessageService, ConfirmationService],
})
export class CreateUserComponent implements OnInit {
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

    checkedStatus: boolean = true;

    roles: [];
    companies: [];
    selectedRole: any;
    selectedCompany: any;

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private userService: UserService,
        private companyService: CompanyService,
        private roleService: RoleService
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
        this.roleService.getAllRoles().subscribe((roles) => {
            this.roles = roles;
        });
        this.companyService.getAllCompanies().subscribe((companies) => {
            this.companies = companies;
        });
    }

    createForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: [
            '',
            [
                Validators.required,
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
            ],
        ],
        roleId: ['', [Validators.required]],
        companyId: ['', [Validators.required]],
        status: [true, [Validators.required]],
    });

    selectAddress(place: any): void {
        console.log(place);
    }

    forceLower(strInput) {
        strInput.value = strInput.value.toLowerCase();
    }

    onSubmit(): void {
        this.userService
            .createUser(
                this.createForm.value.username,
                this.createForm.value.password,
                this.createForm.value.name,
                this.createForm.value.surname,
                this.createForm.value.email,
                this.createForm.value.roleId,
                this.createForm.value.companyId,
                this.createForm.value.status
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_TABLE_USER])
            );
    }
}