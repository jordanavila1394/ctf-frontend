import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';

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

    ceosItems: any;
    checkedStatus: boolean = true;

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private userService: UserService
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
        username: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: ['', [Validators.required]],
        status: [true, [Validators.required]],
    });

    selectAddress(place: any): void {
        console.log(place);
    }

    onSubmit(): void {
        this.userService
            .createUser(
                this.createForm.value.username,
                this.createForm.value.name,
                this.createForm.value.surname,
                this.createForm.value.email,
                this.createForm.value.status
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_TABLE_USER])
            );
    }
}
