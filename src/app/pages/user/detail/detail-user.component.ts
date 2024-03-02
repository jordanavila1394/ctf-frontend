import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { BlobOptions } from 'buffer';
import { CompanyService } from 'src/app/services/company.service';
import { RoleService } from 'src/app/services/role.service';
import { DocxService } from 'src/app/services/docx.service';

@Component({
    templateUrl: './detail-user.component.html',
    providers: [MessageService, ConfirmationService],
})
export class DetailUserComponent implements OnInit {
    idUser: string;

    roles: [];
    companies: [];
    selectedRole: any;
    selectedCompany: any;

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
        id: [''],
        name: [''],
        surname: [''],
        fiscalCode: [''],
        email: [''],
        roleId: [''],
        companyId: [''],
        workerNumber: [''],
        position: [''],
        address: [''],
        iban: [''],
        status: [''],
    });
    currentUser: any;

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private userService: UserService,
        private companyService: CompanyService,
        private docxService: DocxService,
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
            this.detailForm.patchValue({
                id: this.idUser,
            });
            this.userService.getUser(this.idUser).subscribe((user) => {
                this.currentUser = user;
                this.detailForm.patchValue({
                    id: this.idUser,
                    name: user.name,
                    surname: user.surname,
                    fiscalCode: user.fiscalCode,
                    email: user.email,
                    roleId: user.roles[0].id,
                    companyId: user.companies[0].id,
                    workerNumber: user.workerNumber,
                    position: user.position,
                    address: user.address,
                    iban: user.iban,
                    status: user.status,
                });
            });

            this.roleService.getAllRoles().subscribe((roles) => {
                this.roles = roles;
            });
            this.companyService.getAllCompanies().subscribe((companies) => {
                this.companies = companies;
            });

            this.detailForm.controls['id'].disable({
                onlySelf: true,
            });

            this.detailForm.controls['name'].disable({ onlySelf: true });
            this.detailForm.controls['surname'].disable({ onlySelf: true });
            this.detailForm.controls['email'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['fiscalCode'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['roleId'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['companyId'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['workerNumber'].disable({
                onlySelf: true,
            });
            this.detailForm.controls['address'].disable({
                onlySelf: true,
            });

            this.detailForm.controls['iban'].disable({
                onlySelf: true,
            });

            this.detailForm.controls['position'].disable({
                onlySelf: true,
            });

            this.detailForm.controls['status'].disable({
                onlySelf: true,
            });
        });

        // this.userService.getAllCeos().subscribe((ceos) => {
        //     this.ceosItems = ceos.map((ceo) => ({
        //         ...ceo,
        //         fullName: ceo.name + ' ' + ceo.surname,
        //     }));
        // });
    }

    selectAddress(place: any): void {}

    generateUserDocx() {
        let values: { [key: string]: string } = {
            Società: this.currentUser?.companies[0]?.name,
            Nome: this.currentUser.name,
            Cognome: this.currentUser.surname,
            Cittadinanza: '',
            'Codice Fiscale': this.currentUser.fiscalCode,
            Indirizzo: this.currentUser.address + '',
            IBAN: this.currentUser.iban + '',
            'Contratto a tempo determinato': '',
            'Contratto a tempo': '',
            Mansione: '',
            Livello: '',
            'Tipologia contratto': '',
            'Orari di lavoro': '',
            Committente: '',
            Note: '',
        };

        this.docxService.createDocx(
            values,
            'SCHEDA_ASSUNZIONE' + this.detailForm.value.surname,
        );
    }
}
