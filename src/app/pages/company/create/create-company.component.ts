import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { BlobOptions } from 'buffer';

@Component({
    templateUrl: './create-company.component.html',
    providers: [MessageService, ConfirmationService],
})
export class CreateCompanyComponent implements OnInit {
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
    checkedStatus: boolean = true;

    constructor(
        public fb: FormBuilder,
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
        this.userService.getAllCeos().subscribe((ceos) => {
            this.ceosItems = ceos.map((ceo) => ({
                ...ceo,
                fullName: ceo.name + ' ' + ceo.surname,
            }));
        });
    }

    createForm = this.fb.group({
        name: ['', [Validators.required]],
        vat: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
        reaNumber: ['', [Validators.required]],
        legalForm: ['', [Validators.required]],
        registeredOffice: ['', [Validators.required]],
        registeredOfficeLat: [''],
        registeredOfficeLong: [''],
        registeredOfficePlaceId: [''],
        registeredOfficeUrl: [''],
        headOffice: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: [
            '',
            [
                Validators.required,
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
            ],
        ],
        pec: [
            '',
            [
                Validators.required,
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
            ],
        ],
        status: [true, [Validators.required]],
        website: [''],
        description: [''],
    });

    selectAddress(place: any): void {
    }

    onSubmit(): void {
        this.companyService
            .createCompany(
                this.createForm.value.name,
                this.createForm.value.vat,
                this.createForm.value.reaNumber,
                this.createForm.value.legalForm,
                this.createForm.value.registeredOffice,
                this.createForm.value.headOffice,
                this.createForm.value.phone,
                this.createForm.value.email,
                this.createForm.value.pec,
                this.createForm.value.website,
                this.createForm.value.description,
                this.createForm.value.status
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_TABLE_COMPANY])
            );
    }
}
