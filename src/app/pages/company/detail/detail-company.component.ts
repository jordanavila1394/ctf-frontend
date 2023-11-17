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
    templateUrl: './detail-company.component.html',
    providers: [MessageService, ConfirmationService],
})
export class DetailCompanyComponent implements OnInit {
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
    checkedStatus: boolean = true;

    detailForm = this.fb.group({
        id: ['', { disabled: true }],
        name: ['', { disabled: true }],
        vat: [''],
        reaNumber: [''],
        legalForm: [''],
        registeredOffice: [''],
        headOffice: [''],
        phone: [''],
        email: [''],
        pec: [''],
        status: [''],
        ceoId: [''],
        website: [''],
        description: [''],
    });

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
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
            this.detailForm.patchValue({
                id: this.idCompany,
            });
            this.companyService
                .getCompany(this.idCompany)
                .subscribe((company) => {
                    this.detailForm.patchValue({
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
            this.detailForm.controls['id'].disable({
                onlySelf: true,
            });

            this.detailForm.controls['name'].disable({ onlySelf: true });
            this.detailForm.controls['vat'].disable({ onlySelf: true });
            this.detailForm.controls['reaNumber'].disable({ onlySelf: true });
            this.detailForm.controls['legalForm'].disable({ onlySelf: true });
            this.detailForm.controls['registeredOffice'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['headOffice'].disable({ onlySelf: true });
            this.detailForm.controls['phone'].disable({ onlySelf: true });
            this.detailForm.controls['email'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['pec'].disable({ onlySelf: true });
            this.detailForm.controls['ceoId'].disable({ onlySelf: true });
            this.detailForm.controls['website'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['description'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['status'].disable({
                onlySelf: true,
            });
        });

        this.userService.getAllCeos().subscribe((ceos) => {
            this.ceosItems = ceos.map((ceo) => ({
                ...ceo,
                fullName: ceo.name + ' ' + ceo.surname,
            }));
        });
    }

    selectAddress(place: any): void {}
}
