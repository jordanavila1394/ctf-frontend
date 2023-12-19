import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';

@Component({
    templateUrl: './modify-company.component.html',
    providers: [MessageService, ConfirmationService],
})
export class ModifyCompanyComponent implements OnInit {
    idCompany: string;

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

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private userService: UserService,
        private companyService: CompanyService
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
            this.idCompany = params['id'];
            this.modifyForm.patchValue({
                id: this.idCompany,
            });
            this.companyService
                .getCompany(this.idCompany)
                .subscribe((company) => {
                    this.modifyForm.patchValue({
                        id: this.idCompany,
                        name: company.name,
                        vat: company.vat,
                        reaNumber: company.reaNumber,
                        legalForm: company.legalForm,
                        registeredOffice: company.registeredOffice,
                        headOffice: company.headOffice,
                        phone: company.phone,
                        email: company.email,
                        pec: company.pec,
                        ceoId: company.ceoId,
                        website: company.website,
                        description: company.description,
                        status: company.status,
                    });
                });
            this.userService
                .getAllCeosByCompany(this.idCompany)
                .subscribe((ceos) => {
                    this.ceosItems = ceos.map((ceo) => ({
                        ...ceo,
                        fullName: ceo.name + ' ' + ceo.surname,
                    }));
                });
        });
    }

    modifyForm = this.fb.group({
        id: ['', [Validators.required]],
        name: ['', [Validators.required]],
        vat: ['', [Validators.required]],
        reaNumber: ['', [Validators.required]],
        legalForm: ['', [Validators.required]],
        registeredOffice: ['', [Validators.required]],
        headOffice: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required]],
        pec: ['', [Validators.required]],
        status: [false, [Validators.required]],
        ceoId: [''],
        website: [''],
        description: [''],
    });
    selectAddress(place: any): void {
    }

    onSubmit(): void {
        this.companyService
            .patchCompany(
                this.modifyForm.value.id,
                this.modifyForm.value.name,
                this.modifyForm.value.vat,
                this.modifyForm.value.reaNumber,
                this.modifyForm.value.legalForm,
                this.modifyForm.value.registeredOffice,
                this.modifyForm.value.headOffice,
                this.modifyForm.value.phone,
                this.modifyForm.value.email,
                this.modifyForm.value.pec,
                this.modifyForm.value.website,
                this.modifyForm.value.description,
                parseInt(this.modifyForm.value.ceoId, 10),
                this.modifyForm.value.status
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_TABLE_COMPANY])
            );
    }
    goToTableCompany() {
        this.router.navigate([ROUTES.ROUTE_TABLE_COMPANY]);
    }
}
