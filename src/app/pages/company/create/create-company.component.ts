import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';

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
            id: 1,
        },
    ];
    ceosItems: any;

    constructor(
        public fb: FormBuilder,
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
        this.userService.getAllCeos().subscribe((ceos) => {
            this.ceosItems = ceos.map((ceo) => ({
                ...ceo,
                full_name: ceo.name + ' ' + ceo.surname,
            }));
        });
    }

    createForm = this.fb.group({
        name: ['', [Validators.required]],
        vat: ['', [Validators.required]],
        rea_number: ['', [Validators.required]],
        legal_form: ['', [Validators.required]],
        registered_office: ['', [Validators.required]],
        head_office: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required]],
        pec: ['', [Validators.required]],
        userId: ['', [Validators.required]],
        website: [''],
        description: [''],
    });
    selectAddress(place: any): void {
        console.log(place);
    }

    onSubmit(): void {
        this.companyService
            .createCompany(
                this.createForm.value.name,
                this.createForm.value.vat,
                this.createForm.value.rea_number,
                this.createForm.value.legal_form,
                this.createForm.value?.registered_office,
                this.createForm.value?.head_office,
                this.createForm.value.phone,
                this.createForm.value.email,
                this.createForm.value.pec,
                this.createForm.value.website,
                this.createForm.value.description,
                parseInt(this.createForm.value.userId, 10),
                1
            )
            .subscribe(
                (res) => console.log('HTTP response', res),
                (err) => console.log('HTTP Error', err),
                () => console.log('HTTP request completed.')
            );
    }
}
