import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';

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

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
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
        this.route.queryParams.subscribe((params) => {
            this.idUser = params['id'];
            this.modifyForm.patchValue({
                id: this.idUser,
            });
            this.userService.getUser(this.idUser).subscribe((user) => {
                this.modifyForm.patchValue({
                    id: this.idUser,
                    username: user.username,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    status: user.status,
                });
            });
        });

        this.userService.getAllCeos().subscribe((ceos) => {
            this.ceosItems = ceos.map((ceo) => ({
                ...ceo,
                fullName: ceo.name + ' ' + ceo.surname,
            }));
        });
    }

    modifyForm = this.fb.group({
        id: ['', [Validators.required]],
        username: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: ['', [Validators.required]],
        status: [false, [Validators.required]],
    });
    selectAddress(place: any): void {
        console.log(place);
    }

    onSubmit(): void {
        this.userService
            .patchUser(
                this.modifyForm.value.id,
                this.modifyForm.value.username,
                this.modifyForm.value.name,
                this.modifyForm.value.surname,
                this.modifyForm.value.email,
                this.modifyForm.value.status
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_TABLE_USER])
            );
    }
    goToTableUser() {
        this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
    }
}
