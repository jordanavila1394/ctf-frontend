import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { RoleService } from 'src/app/services/role.service';
import { CompanyService } from 'src/app/services/company.service';
import { ClientService } from 'src/app/services/client.service';
import { BranchService } from 'src/app/services/branch.service';
import { getData } from 'country-list';

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

    roles: any[];
    companies: any[];
    clients: any[];
    branches: any[];
    selectedRole: any;
    selectedCompany: any;
    selectedClient: any;
    selectedBranch: any;
    countryItems: { name: string; code: string }[] = [];

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private userService: UserService,
        private companyService: CompanyService,
        private roleService: RoleService,
        private clientService: ClientService,
        private branchService: BranchService,
    ) {
        this.ngxGpAutocompleteService.setOptions({
            componentRestrictions: { country: ['IT'] },
            types: ['geocode'],
        });
    }

    ngOnInit() {
        this.fetchCountries();
        this.loadServices();
    }

    // Validatore personalizzato per evitare stringhe vuote o solo spazi
    noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value.trim().length === 0) {
            return { whitespace: true };
        }
        return null;
    }

    loadServices() {
        this.roleService.getAllRoles().subscribe((roles) => {
            this.roles = roles;
        });
        this.companyService.getAllCompanies().subscribe((companies) => {
            this.companies = companies;
        });
        this.clientService.getAllClients().subscribe((clients) => {
            this.clients = clients;
        });
        this.branchService.getAllBranches().subscribe((branches) => {
            this.branches = branches;
        });
    }

    createForm = this.fb.group({
        password: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: [
            '',
            [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
        ],
        cellphone: [''],
        fiscalCode: ['', [Validators.required]],
        workerNumber: [''],
        clientId: [null],
        branchId: [null],
        position: [''],
        address: [''],
        birthCountry: [''],
        hireDate: [''],
        birthDate: [''],
        iban: [''],
        roleId: ['', [Validators.required]],
        companyId: ['', [Validators.required]],
        status: [true, [Validators.required]],
    });

    selectAddress(place: any): void { }

    forceLower(strInput) {
        strInput.value = strInput.value.toLowerCase();
    }

    fetchCountries() {
        const allCountries = new getData();
        const priorityCountries = ['Italy', 'Peru', 'Ecuador', 'El Salvador'];

        // Add priority countries first
        priorityCountries.forEach((country) => {
            const foundCountry = allCountries.find((c) => c.name === country);
            if (foundCountry) {
                this.countryItems.push({
                    name: foundCountry.name,
                    code: foundCountry.code,
                });
            }
        });

        // Add remaining countries
        allCountries.forEach((country) => {
            if (!priorityCountries.includes(country.name)) {
                this.countryItems.push({
                    name: country.name,
                    code: country.code,
                });
            }
        });
    }

    onSubmit(): void {
        this.userService
            .createUser(
                this.createForm.value.fiscalCode,
                this.createForm.value.password,
                this.createForm.value.name,
                this.createForm.value.surname,
                this.createForm.value.email,
                this.createForm.value.cellphone,
                this.createForm.value.roleId,
                this.createForm.value.companyId,
                this.createForm.value.workerNumber,
                this.createForm.value.clientId,
                this.createForm.value.branchId,
                this.createForm.value.position,
                this.createForm.value.address,
                this.createForm.value.iban,
                this.createForm.value.birthCountry,
                this.createForm.value.birthDate,
                this.createForm.value.hireDate,
                this.createForm.value.status,
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_TABLE_USER]),
            );
    }
}
